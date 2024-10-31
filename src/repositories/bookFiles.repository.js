import BaseRepository from "./base.repository.js";
import cloudinary, {
  DEFAULT_BOOK_COVER,
  CLOUDINARY_FOLDERS,
} from "../config/cloudinary.js";
import { getFileExtension } from "../helpers/fileExtension.js";

export default class BookFilesRepository extends BaseRepository {
  constructor() {
    super("BOOK_FILES");
  }
  // For Uploading
  async uploadCoverImage(coverFile) {
    if (!coverFile || coverFile.length === 0) {
      const result = await cloudinary.api.resource(DEFAULT_BOOK_COVER);
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

      await super.create(
        {
          idBook: bookId,
          filePath: uploadResult.secure_url,
          originalName: file.originalname,
        },
        client
      );

      return uploadResult;
    });

    await Promise.all(uploadPromises);
  }

  // For Downloading
  async getFileCloudUrl(fileName, bookId) {
    const result = await super.findWhere({
      originalName: fileName,
      idBook: bookId,
    });

    return result ? result[0].filePath : null;
  }

  async verifyFileExistsInCloudinary(cloudinaryUrl) {
    const publicId = cloudinaryUrl
      .split("/")
      .slice(-2) // get last two elements (folder/file)
      .join("/") // join last two elements (folder/file)
      .split(".")[0]; // remove file extention

    await cloudinary.api.resource(publicId);
  }

  async registerBookUpload(userId, bookId, client) {
    await super.executeQuery(
      `INSERT INTO BOOK_UPLOAD (id_user, id_book, date_uploaded) 
       VALUES ($1, $2, NOW());`,
      [userId, bookId],
      client
    );
  }

  async registerDownload(userId, bookId) {
    await super.executeQuery(
      `INSERT INTO BOOK_DOWNLOAD (id_user, id_book, date_downloaded) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (id_user, id_book) 
       DO UPDATE SET date_downloaded = EXCLUDED.date_downloaded`,
      [userId, bookId]
    );
  }

  async getBookFileNames(idBook) {
    const result = await super.executeQuery(
      `SELECT original_name FROM BOOK_FILES WHERE id_book = $1`,
      [idBook]
    );

    return result.length > 0
      ? result[0].originalName.split(",").map(file => file.trim())
      : [];
  }

  async getBookFileTypes(bookFiles) {
    return [
      ...new Set(bookFiles.map(file => getFileExtension(file).toUpperCase())),
    ];
  }
}
