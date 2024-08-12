import { withTransaction } from "../../../../utils/withTransaction.js";
import cloudinary from "../../../../config/cloudinary.js";
import { CustomError } from "../../middlewares/errorMiddleware.js";

const CLOUDINARY_FOLDERS = {
  COVER: "bookCoverPics",
  FILES: "books",
};

const DEFAULT_COVER =
  "https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg";

// NOTE: Look at this beatiful declarative code,
// use declarative in every controller

/**
 * Create a book in the db
 * @param {*} req
 * @param {*} res
 */
export const createBook = async (req, res) => {
  validateBookData(req.body);

  const bookData = extractBookData(req.body);
  const coverUrl = await uploadCoverImage(req.files.cover);
  console.log(coverUrl);

  await withTransaction(async client => {
    const bookId = await insertBookRecord(client, { ...bookData, coverUrl });
    await uploadAndInsertBookFiles(client, bookId, req.files.bookFiles);
    await insertBookAuthors(client, bookId, bookData.authors);
    await insertBookLanguages(client, bookId, bookData.languages);
    await insertBookSubcategories(client, bookId, bookData.subcategoryIds);
  });

  res.status(201).send({ message: "Book created successfully" });
};

// Declarative aux functions
/**
 * Validates the book data object to ensure all required fields are present.
 * @param {Object} data - The book data object.
 * @throws {CustomError} If any required field is missing.
 */
const validateBookData = data => {
  const requiredFields = [
    "isbn",
    "title",
    "yearReleased",
    "authors",
    "languages",
  ];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new CustomError(`Missing required field: ${field}`, 400);
    }
  }
  // Additional specific validations can be added here
};

/**
 * Extracts the necessary book data from the request body.
 * @param {Object} body - The request body.
 * @returns {Object} The extracted book data.
 */
const extractBookData = body => {
  const {
    isbn,
    title,
    descriptionB,
    yearReleased,
    vol,
    nPages,
    publisher,
    authors,
    languages,
    subcategoryIds,
  } = body;

  return {
    isbn,
    title,
    descriptionB,
    yearReleased,
    vol,
    nPages,
    publisher,
    authors: Array.isArray(authors) ? authors : JSON.parse(authors),
    languages: Array.isArray(languages) ? languages : JSON.parse(languages),
    subcategoryIds: Array.isArray(subcategoryIds)
      ? subcategoryIds
      : JSON.parse(subcategoryIds),
  };
};

/**
 * Uploads the cover image to the cloud storage.
 * @param {Array} coverFile - The cover image file.
 * @returns {Promise<string>} The URL of the uploaded cover image.
 * @throws {CustomError} If the cover upload fails.
 */
const uploadCoverImage = async coverFile => {
  if (!coverFile || coverFile.length === 0) {
    try {
      const result = await cloudinary.api.resource(DEFAULT_COVER);
      return result.secure_url;
    } catch (error) {
      console.error("Error fetching default cover:", error);
      throw new CustomError("Failed to fetch default cover image", 500);
    }
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
};
/**
 * Inserts a new book record into the database.
 * @param {Object} client - The database client.
 * @param {Object} bookData - The book data to be inserted.
 * @returns {Promise<number>} The ID of the inserted book record.
 */
const insertBookRecord = async (client, bookData) => {
  const {
    isbn,
    title,
    descriptionB,
    yearReleased,
    vol,
    nPages,
    publisher,
    coverUrl,
  } = bookData;

  const query = `
    INSERT INTO BOOK (isbn, title, descriptionB, yearReleased, vol, nPages, publisher, pathBookCover)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `;
  const values = [
    isbn,
    title,
    descriptionB,
    yearReleased,
    vol,
    nPages,
    publisher,
    coverUrl,
  ];

  const result = await client.query(query, values);
  return result.rows[0].id;
};

/**
 * Uploads and inserts the book files into the database.
 * @param {Object} client - The database client.
 * @param {number} bookId - The ID of the book.
 * @param {Array} files - The book files to be uploaded and inserted.
 * @returns {Promise<void>}
 * @throws {CustomError} If there are no book files or if the upload fails.
 */
const uploadAndInsertBookFiles = async (client, bookId, files) => {
  if (!files || files.length === 0) {
    throw new CustomError("There should be at least one book file", 400);
  }

  const uploadPromises = files.map(async file => {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: CLOUDINARY_FOLDERS.FILES,
            resource_type: "auto", // Esto permite subir PDFs
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

      await client.query(
        "INSERT INTO BOOK_FILES (idBook, pathF) VALUES ($1, $2)",
        [bookId, uploadResult.secure_url]
      );

      return uploadResult;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new CustomError(
        `Failed to upload or insert book file: ${error.message}`,
        500
      );
    }
  });

  try {
    await Promise.all(uploadPromises);
  } catch (error) {
    throw new CustomError(`Error processing book files: ${error.message}`, 500);
  }
};

/**
 * Inserts the book authors into the database.
 * @param {Object} client - The database client.
 * @param {number} bookId - The ID of the book.
 * @param {Array} authors - The authors of the book.
 * @returns {Promise<void>}
 * @throws {CustomError} If there are no authors.
 */
const insertBookAuthors = async (client, bookId, authors) => {
  if (!authors || authors.length === 0) {
    throw new CustomError("There should be at least one author", 400);
  }

  const query = `
    INSERT INTO BOOK_AUTHORS (idBook, author)
    VALUES ${authors.map((_, index) => `($1, $${index + 2})`).join(", ")}
  `;
  await client.query(query, [bookId, ...authors]);
};

/**
 * Inserts the book languages into the database.
 * @param {Object} client - The database client.
 * @param {number} bookId - The ID of the book.
 * @param {Array} languages - The languages of the book.
 * @returns {Promise<void>}
 * @throws {CustomError} If there are no languages.
 */
const insertBookLanguages = async (client, bookId, languages) => {
  if (!languages || languages.length === 0) {
    throw new CustomError("There should be at least one language", 400);
  }

  const query = `
    INSERT INTO BOOK_LANG (idBook, languageB)
    VALUES ${languages.map((_, index) => `($1, $${index + 2})`).join(", ")}
  `;
  await client.query(query, [bookId, ...languages]);
};

/**
 * Inserts the book subcategories into the database.
 * @param {Object} client - The database client.
 * @param {number} bookId - The ID of the book.
 * @param {Array} subcategoryIds - The IDs of the subcategories.
 * @returns {Promise<void>}
 */
const insertBookSubcategories = async (client, bookId, subcategoryIds) => {
  if (subcategoryIds && subcategoryIds.length > 0) {
    const query = `
      INSERT INTO BOOK_IN_SUBCATEGORY (idBook, idSubcategory)
      VALUES ${subcategoryIds.map((_, index) => `($1, $${index + 2})`).join(", ")}
    `;
    await client.query(query, [bookId, ...subcategoryIds]);
  }
};
