import { pool } from "../../../db.js";

/**
 * Retrieves file information from the database.
 * @param {number} fileId - The file ID.
 * @param {number} bookId - The book ID.
 * @returns {Promise<Object>} - The file information.
 */
export const getFileInfo = async (fileId, bookId) => {
  const result = await pool.query(
    "SELECT pathF, originalFileName FROM BOOK_FILES WHERE id = $1 AND idBook = $2",
    [fileId, bookId]
  );
  if (result.rows.length === 0) {
    throw new Error("File not found in database");
  }
  return result.rows[0];
};

/**
 * Verifies if a file exists in Cloudinary.
 * @param {string} cloudinaryUrl - The Cloudinary URL of the file.
 * @returns {Promise<void>}
 */
export const verifyFileExistsInCloudinary = async cloudinaryUrl => {
  try {
    const publicId = cloudinaryUrl.split("/").slice(-1)[0].split(".")[0];
    await cloudinary.api.resource(publicId);
  } catch (error) {
    throw new Error("File not found on Cloudinary");
  }
};

/**
 * Registers a book download in the database.
 * @param {number} userId - The user ID.
 * @param {number} bookId - The book ID.
 * @returns {Promise<void>}
 */
export const registerDownload = async (userId, bookId) => {
  await pool.query(
    `INSERT INTO BOOK_DOWNLOAD (idUser, idBook, dateDownload) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (idUser, idBook) 
       DO UPDATE SET dateDownload = EXCLUDED.dateDownload`,
    [userId, bookId]
  );
};
