import { pool } from "../../../../db.js";
import { CustomError } from "../../middlewares/errorMiddleware.js";
import { getComments } from "../comments.js";
import { getRelatedBooks } from "./getRelatedBooks.js";

/**
 * Get a single book information by its id from the data base
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
export const getBook = async (req, res) => {
  const idBook = req.params.id;

  const bookData = await valIfBookExists(idBook);

  const bookAuthors = await getBoookAuthors(idBook);
  const bookLangs = await getBookLangs(idBook);
  const bookFiles = await getBookFiles(idBook);
  const bookFilesType = await getBookFilesType(bookFiles);
  const bookRate = await getBookRate(idBook);
  const { subcategories, subcategoriesIds, category, categoryId } =
    await getBookSubcategories(idBook);

  const relatedBooks = await getRelatedBooks(
    idBook,
    subcategoriesIds,
    categoryId
  );

  const comments = await getComments(req);

  res.status(201).send({
    //bookData
    idBook: bookData.id,
    isbn: bookData.isbn,
    title: bookData.title,
    description: bookData.descriptionb,
    year: bookData.yearreleased,
    vol: bookData.vol ? bookData.vol : "N/A",
    n_pages: bookData.npages,
    publisher: bookData.publisher,
    cover_path: bookData.pathbookcover,
    //bookData
    book_rate: bookRate,
    //Multi valued
    book_authors: bookAuthors,
    book_lang: bookLangs,
    book_files: bookFiles,
    book_files_type: bookFilesType,
    book_category: category,
    book_subcategories: subcategories,
    related_books: relatedBooks,
    comments: comments,
  });
};

/**
 * Validate if a book exists in the database, if not throws a CustomError else returns the query result
 * @param {number} idBook - The id of the book
 * @throws {CustomError} - Throws a CustomError if the book is not found
 * @returns {Object} - The query result
 */
const valIfBookExists = async idBook => {
  const query_book = await pool.query(
    `
      SELECT * 
      FROM BOOK 
      WHERE id = $1`,
    [idBook]
  );
  if (query_book.rows.length === 0) {
    throw new CustomError("Book not found", 404);
  }
  return query_book.rows[0];
};

/**
 * Get the authors of a book
 * @param {number} idBook - The id of the book
 * @returns {string[]} - An array of author names
 */
const getBoookAuthors = async idBook => {
  const query_book_authors = await pool.query(
    "SELECT author FROM BOOK_AUTHORS WHERE idBook = $1",
    [idBook]
  );
  return query_book_authors.rows.map(authorObj => authorObj.author);
};

/**
 * Get the languages of a book
 * @param {number} idBook - The id of the book
 * @returns {string[]} - An array of language names
 */
const getBookLangs = async idBook => {
  const query_book_lang = await pool.query(
    "SELECT languageb FROM BOOK_LANG WHERE idBook = $1",
    [idBook]
  );
  return query_book_lang.rows.map(langObj => langObj.languageb);
};

/**
 * Get the files of a book
 * @param {number} idBook - The id of the book
 * @returns {string[]} - An array of file paths
 */
const getBookFiles = async idBook => {
  const query_book_files = await pool.query(
    "SELECT pathf FROM BOOK_FILES WHERE idBook = $1",
    [idBook]
  );
  return query_book_files.rows.length > 0
    ? query_book_files.rows[0].pathf.split(",").map(file => file.trim())
    : [];
};

/**
 * Get the file types of a book
 * @param {string[]} bookFiles - An array of file paths
 * @returns {string[]} - An array of file types
 */
const getBookFilesType = bookFiles => {
  return [
    ...new Set(bookFiles.map(file => file.split(".").pop().toUpperCase())),
  ];
};

/**
 * Get the average rate of a book
 * @param {number} idBook - The id of the book
 * @returns {number} - The average rate of the book
 */
const getBookRate = async idBook => {
  const query_rate = await pool.query(
    `
      SELECT ROUND(AVG(ratevalue),1) as rate_avg 
      FROM BOOK_RATE 
      WHERE idbook = $1`,
    [idBook]
  );
  return query_rate.rows[0].rate_avg ? query_rate.rows[0].rate_avg : 0;
};

/**
 * Get the subcategories and category of a book
 * @param {number} idBook - The id of the book
 * @returns {Object} - An object containing subcategories, subcategoriesIds, category, and categoryId
 */
const getBookSubcategories = async idBook => {
  const query_subcategories = await pool.query(
    `SELECT idcategoryFather, sub.subcategoryname 
      FROM BOOK_IN_SUBCATEGORY insub INNER JOIN SUBCATEGORY sub 
        ON insub.idsubcategory = sub.id  
      WHERE idbook = $1`,
    [idBook]
  );
  if (query_subcategories.rows.length > 0) {
    const query_categoryname = await pool.query(
      `SELECT distinct id, categoryname 
        FROM CATEGORY 
        WHERE id = $1`,
      [query_subcategories?.rows[0]?.idcategoryfather]
    );
    return {
      subcategories: query_subcategories.rows.map(
        subObj => subObj.subcategoryname
      ),
      subcategoriesIds: query_subcategories.rows.map(subObj => subObj.id),
      category:
        query_categoryname.rows.length > 0
          ? query_categoryname.rows[0].categoryname
          : null,
      categoryId:
        query_categoryname.rows.length > 0
          ? query_categoryname.rows[0].id
          : null,
    };
  } else {
    return {
      subcategories: null,
      subcategoriesIds: null,
      category: null,
      categoryId: null,
    };
  }
};
