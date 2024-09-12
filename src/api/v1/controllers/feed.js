import { pool } from "../../../db.js";
import shuffleArray from "../../../utils/shuffleArray.js";

export class UserFeedController {
  static async getFeedRecomendedForUser(_req, res) {}
}

/**
 * Get 50 books with coverPath in the following priority order:
 * 1. Query to get 10 books with the most downloads on the page
 * 2. Get the category of (2 or more) of the previous 10 books and based on that, fetch another 10 books
 * 3. Add two of the most recent books
 * 4. Get the rest of the books randomly
 * 5. Shuffle the entire array before returning it
 *
 * @param {Object} _req - The request object (not used in this function)
 * @param {Object} res - The response object
 * @returns {Promise<void>} A promise that resolves when the recommended feed is sent
 */

export const getFeedRecomended = async (_req, res) => {
  //TODO: 1. In the future, recommend books based on the user (their download history)

  // 1. Get 10 most downloaded books
  let booksFeed = await get10MostDownloadedBooks();
  // 2. Get 10 more books from the same category as the mostDownloadedBooks 10 books
  booksFeed = booksFeed.concat(
    await get10SameCategoryAsGivenBooksDistinctFromGiven(booksFeed)
  );
  // 3. Add two of the most recent books
  booksFeed = booksFeed.concat(
    await get2MostRecentBooksDistinctFromGiven(booksFeed)
  );
  // 4. Get the rest of the books randomly
  booksFeed = booksFeed.concat(
    await getRandomBooksDistinctFromGiven(booksFeed, 50 - booksFeed.length)
  );

  //format data
  booksFeed = formatData(booksFeed);

  //Shuffle the entire array before returning it
  booksFeed = await shuffleArray(booksFeed);
  res.status(201).send({
    recommended_feed: booksFeed,
  });
};

/**
 * Query 10 books with the most downloads
 * @returns {Promise<Array>} Array of books with the most downloads
 */
const get10MostDownloadedBooks = async () => {
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
const get10SameCategoryAsGivenBooksDistinctFromGiven = async givenBooks => {
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
const getCategoriesFromBookIds = async bookIds => {
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
const getDistinctBooksbyCategoriesIds = async (categoryIds, distinctFrom) => {
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
const get2MostRecentBooksDistinctFromGiven = async givenBooks => {
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

/**
 * Format book data
 * @param {Array} books - Array of books
 * @returns {Array} Formatted array of books
 */
const formatData = books => {
  return books.map(book => ({
    authors: book.authors.join(", "),
    title: book.title,
    pathBookCover: book.pathbookcover,
    bookId: book.id,
  }));
};
