import cloudinary from "../config/cloudinary.js";
import BaseRepository from "./base.repository.js";
import { getFileExtension } from "../helpers/fileExtension.js";

const CLOUDINARY_FOLDERS = {
  COVER: "bookCoverPics",
  FILES: "books",
};

const DEFAULT_COVER =
  "https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg";

export default class BookRepository extends BaseRepository {
  constructor() {
    super("book");
  }

  async getById(id) {
    return await super.findById(id);
  }

  async getBookAuthors(idBook) {
    const authors = await super.executeQuery(
      `SELECT author FROM BOOK_AUTHORS WHERE id_book = $1`,
      [idBook]
    );

    const authorsList = authors.map(authorRowObject => authorRowObject.author);
    return authorsList;
  }

  async getBookLanguages(idBook) {
    const langs = await super.executeQuery(
      `SELECT language FROM BOOK_LANG WHERE id_book = $1`,
      [idBook]
    );

    const languagesList = langs.map(langObj => langObj.language);
    return languagesList;
  }

  async getBookFileNames(idBook) {
    const fileNames = await super.executeQuery(
      `SELECT file_path FROM BOOK_FILES WHERE id_book = $1`,
      [idBook]
    );

    return fileNames.length > 0
      ? fileNames[0].filePath.split(",").map(file => file.trim())
      : [];
  }

  async getBookFileTypes(bookFiles) {
    return [
      ...new Set(bookFiles.map(file => getFileExtension(file).toUpperCase())),
    ];
  }

  // for related books
  async getRelatedBooksBySubcategory(idBook, subcategoryIds) {
    if (!subcategoryIds) return [];

    const query = `
      SELECT b.id, b.title, b.cover_img_path, array_agg(ba.author) AS authors 
      FROM BOOK b
      INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.id_book
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.id_book
      WHERE bis.id_subcategory = ANY($1) AND b.id != $2
      GROUP BY b.id
      LIMIT 20
    `;
    return await super.executeQuery(query, [subcategoryIds, idBook]);
  }

  async getRelatedBooksByCategory(idBook, categoryId, limit) {
    if (!categoryId) return [];
    const query = `
      SELECT b.id, b.title, b.cover_img_path, array_agg(ba.author) AS authors
      FROM BOOK b
      INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.id_book
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.id_book
      WHERE bis.id_subcategory IN (
        SELECT id FROM SUBCATEGORY WHERE id_category_father = $1
      ) AND b.id != $2
      GROUP BY b.id
      LIMIT $3
    `;
    return await super.executeQuery(query, [categoryId, idBook, limit]);
  }

  async getRelatedBooksRandomly(idBook, limit) {
    const query = `
      SELECT b.id, b.title, b.cover_img_path, array_agg(ba.author) AS authors
      FROM BOOK b
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.id_book
      WHERE b.id != $1
      GROUP BY b.id
      ORDER BY RANDOM()
      LIMIT $2
    `;
    return await super.executeQuery(query, [idBook, limit]);
  }

  // for book creation
  /*
  {
    isbn,
    title,
    description,
    yearReleased,
    volume,
    numberOfPages,
    publisher,
    coverImgPath,
  }
  */
  async create(bookData, client) {
    return await super.create(bookData, client);
  }

  async insertBookAuthors(bookId, authors, client) {
    const query = `
      INSERT INTO BOOK_AUTHORS (id_book, author)
      VALUES ${authors.map((_, index) => `($1, $${index + 2})`).join(", ")}
    `;
    await super.executeQuery(query, [bookId, ...authors], client);
  }

  async insertBookLanguages(bookId, languages, client) {
    const query = `
      INSERT INTO BOOK_LANG (id_book, language)
      VALUES ${languages.map((_, index) => `($1, $${index + 2})`).join(", ")}
    `;
    await super.executeQuery(query, [bookId, ...languages], client);
  }

  /**
   * Inserts the book subcategories into the database.
   * @param {number} bookId - The ID of the book.
   * @param {Array} subcategoryIds - The IDs of the subcategories.
   */
  async insertBookSubcategories(bookId, subcategoryIds, client) {
    if (subcategoryIds && subcategoryIds.length > 0) {
      const query = `
        INSERT INTO BOOK_IN_SUBCATEGORY (id_book, id_subcategory)
        VALUES ${subcategoryIds.map((_, index) => `($1, $${index + 2})`).join(", ")}
      `;
      await super.executeQuery(query, [bookId, ...subcategoryIds], client);
    }
  }

  async uploadCoverImage(coverFile) {
    if (!coverFile || coverFile.length === 0) {
      const result = await cloudinary.api.resource(DEFAULT_COVER);
      return result.secure_url;
    }

    // Upload the file buffer directly to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDERS.COVER,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      // Write the buffer to the stream
      uploadStream.end(coverFile[0].buffer);
    });
    return uploadResult.secure_url;
  }

  /**
   * Uploads and inserts the book files into the database.
   * @param {number} bookId - The ID of the book.
   * @param {Array} files - The book files to be uploaded and inserted.
   * @param {Object} client - The database client.
   */
  async uploadAndInsertBookFiles(bookId, files, client) {
    const uploadPromises = files.map(async file => {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: CLOUDINARY_FOLDERS.FILES,
            resource_type: "auto", // It allows to upload PDFs
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(file.buffer);
      });

      if (!uploadResult || uploadResult.error) {
        throw new Error(
          `Failed to upload book file: ${uploadResult?.error?.message || "Unknown error"}`
        );
      }

      await super.executeQuery(
        "INSERT INTO BOOK_FILES (id_book, file_path) VALUES ($1, $2)",
        [bookId, uploadResult.secure_url],
        client
      );

      return uploadResult;
    });

    await Promise.all(uploadPromises);
  }

  async createBookWithDetails(bookData) {
    const {
      authors,
      languages,
      subcategoryIds,
      bookFiles,
      coverBookFile,
      ...bookDetails
    } = bookData;

    super.transaction(async client => {
      const coverUrl = await this.uploadCoverImage(coverBookFile);
      const { id: bookId } = await this.create(
        { ...bookDetails, coverImgPath: coverUrl },
        client
      );
      await this.uploadAndInsertBookFiles(bookId, bookFiles, client);
      await this.insertBookAuthors(bookId, authors, client);
      await this.insertBookLanguages(bookId, languages, client);
      await this.insertBookSubcategories(bookId, subcategoryIds, client);
    });
  }
}
