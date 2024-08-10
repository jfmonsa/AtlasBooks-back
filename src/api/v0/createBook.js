import { pool } from "../../../../db.js";
import cloudinary from "../../../../config/cloudinary.js";
import { CustomError } from "../../middlewares/errorMiddleware.js";

const CLOUDINARY_FOLDERS = {
  COVER: "bookCoverPics",
  FILES: "books",
};

const DEFAULT_COVER = "default.jpg";

// Look at this beatiful declarative code,
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

  await withTransaction(async client => {
    const bookId = await insertBookRecord(client, { ...bookData, coverUrl });
    await uploadAndInsertBookFiles(client, bookId, req.files.bookFiles);
    await insertBookAuthors(client, bookId, bookData.authors);
    await insertBookLanguages(client, bookId, bookData.languages);
    await insertBookSubcategories(client, bookId, bookData.subcategoryIds);
  });

  sendSuccessResponse(res);
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
  if (!coverFile) return DEFAULT_COVER;

  try {
    const result = await cloudinary.uploader.upload(coverFile[0].path, {
      folder: CLOUDINARY_FOLDERS.COVER,
    });
    return result.secure_url;
  } catch (error) {
    throw new CustomError("Failed to upload cover", 500);
  }
};

/**
 * Executes the provided operation within a database transaction.
 * @param {Function} operation - The operation to be executed within the transaction.
 * @returns {Promise<void>}
 * @throws {Error} If the operation or transaction fails.
 */
const withTransaction = async operation => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await operation(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
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
    const resultUpload = await cloudinary.uploader.upload(file.path, {
      folder: CLOUDINARY_FOLDERS.FILES,
    });
    if (resultUpload.error) {
      throw new CustomError("Failed to upload book file", 500);
    }
    await client.query(
      "INSERT INTO BOOK_FILES (idBook, pathF) VALUES ($1, $2)",
      [bookId, resultUpload.secure_url]
    );
  });

  await Promise.all(uploadPromises);
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

/**
 * Sends a success response indicating that the book was created successfully.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const sendSuccessResponse = res => {
  res.status(201).send({ message: "Book created successfully" });
};
