import { pool } from "../../../db.js";

/**
 * Query 10 books with the most downloads
 * @returns {Promise<Array>} Array of books with the most downloads
 */
export const get10MostDownloadedBooks = async () => {
  const mostDownloadedBooksQuery = await pool.query(
    `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors, COUNT(d.idbook) AS downloads
        FROM BOOK b
        INNER JOIN BOOK_DOWNLOAD d ON b.id = d.idbook
        INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
        WHERE b.pathbookcover <> 'default.jpg'
        GROUP BY b.id
        ORDER BY downloads DESC
        LIMIT 10`
  );
  return mostDownloadedBooksQuery.rows;
};

/**
 * Get 10 books with the same category as the given books, but distinct from the given books
 * @param {Array} givenBooks - Array of given books
 * @returns {Promise<Array>} Array of books with the same category as the given books
 */
export const get10SameCategoryAsGivenBooksDistinctFromGiven =
  async givenBooks => {
    if (givenBooks.length === 0) return [];
    const givenBooksIds = givenBooks.map(book => book.id);
    const givenBooksCategories = await getCategoriesFromBookIds(givenBooksIds);
    if (givenBooksCategories.length === 0) return [];

    books = await getDistinctBooksbyCategoriesIds(
      givenBooksCategories,
      givenBooksIds
    );
  };

/**
 * Get categories from book IDs
 * @param {Array} bookIds - Array of book IDs
 * @returns {Promise<Array>} Array of categories
 */
export const getCategoriesFromBookIds = async bookIds => {
  const categoriesQuery = await pool.query(
    `SELECT DISTINCT sc.idcategoryfather
        FROM BOOK_IN_SUBCATEGORY bis
        INNER JOIN SUBCATEGORY sc ON bis.idsubcategory = sc.id
        WHERE bis.idbook = ANY($1::int[])`,
    [bookIds]
  );
  return categoriesQuery.rows;
};

/**
 * Get distinct books by category IDs
 * @param {Array} categoryIds - Array of category IDs
 * @param {Array} distinctFrom - Array of book IDs to exclude
 * @returns {Promise<Array>} Array of distinct books
 */
export const getDistinctBooksbyCategoriesIds = async (
  categoryIds,
  distinctFrom
) => {
  const relatedBooksQuery = await pool.query(
    `SELECT DISTINCT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
          FROM BOOK b
          INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.idbook
          INNER JOIN SUBCATEGORY sc ON bis.idsubcategory = sc.id
          INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
          WHERE sc.idcategoryfather = ANY($1::int[])
          AND b.id <> ALL ($2::int[])
          AND b.pathbookcover <> 'default.jpg'
          GROUP BY b.id
          LIMIT 10`,
    [categoryIds, distinctFrom]
  );
  return relatedBooksQuery.rows;
};

/**
 * Get 2 most recent books, but distinct from the given books
 * @param {Array} givenBooks - Array of given books
 * @returns {Promise<Array>} Array of 2 most recent books
 */
export const get2MostRecentBooksDistinctFromGiven = async givenBooks => {
  const mostRecentBooksQuery = await pool.query(
    `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
        FROM BOOK b
        INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
        WHERE b.pathbookcover <> 'default.jpg'
        AND b.id <> ALL ($1::int[])
        GROUP BY b.id
        ORDER BY b.id DESC
        LIMIT 2`,
    [givenBooks.map(book => book.id)]
  );
  return mostRecentBooksQuery.rows;
};

/**
 * Get the rest of the books randomly
 * @param {Array} givenBooks - Array of given books
 * @param {number} numberLimit - Number of books to fetch
 * @returns {Promise<Array>} Array of random books
 */
const getRandomBooksDistinctFromGiven = async (givenBooks, numberLimit) => {
  const randomBooksQuery = await pool.query(
    `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
        FROM BOOK b
        INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
        WHERE b.pathbookcover <> 'default.jpg'
        AND b.id <> ALL ($1::int[])
        GROUP BY b.id
        ORDER BY RANDOM()
        LIMIT $2`,
    [givenBooks.map(book => book.id), numberLimit]
  );
  return randomBooksQuery.rows;
};
