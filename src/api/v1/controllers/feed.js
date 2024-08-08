import { pool } from "../../../db.js";
import shuffleArray from "../../../utils/shuffleArray.js";

/**
 * Return a list of recommended books (objects)
 * @param {*} _req
 * @param {*} res
 */
export const getFeedRecomended = async (_req, res) => {
  // Get 50 books with converPath in the following priority order
  /*
    1. Query to get 10 books with the most downloads on the page
    2. Get the category of (2 or more) of the previous 10 books and based on that, fetch another 10 books
    3. Add two of the most recent books
    4. Get the rest of the books randomly
    5. Shuffle the entire array before returning it
    */
  //TODO: 1. In the future, recommend books based on the user (their download history)
  let results = [];

  // 1. Query to get 10 books with the most downloads on the page
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
  // 2. Get the category of (2 or more, up to a maximum of 10) of the previous 10 books and based on that, fetch another 10 books
  const mostDownloaded = mostDownloadedBooksQuery.rows;
  results = results.concat(mostDownloaded);

  if (mostDownloaded.length > 0) {
    // Get the categories of the most downloaded books
    const mostDownloadedBookIds = results.map(book => book.id);
    const categoriesQuery = await pool.query(
      `SELECT DISTINCT sc.idcategoryfather
        FROM BOOK_IN_SUBCATEGORY bis
        INNER JOIN SUBCATEGORY sc ON bis.idsubcategory = sc.id
        WHERE bis.idbook = ANY($1::int[])`,
      [mostDownloadedBookIds]
    );
    if (categoriesQuery.rows.length > 0) {
      const categoryIds = categoriesQuery.rows.map(row => row.idcategoryfather);

      // Get 10 additional books based on the categories of the most downloaded books
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
        [categoryIds, mostDownloadedBookIds]
      );
      results = results.concat(relatedBooksQuery.rows);
    }
  }
  // 3. Add two of the most recent books
  const recentBooksQuery = await pool.query(
    `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
      FROM BOOK b
      INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
      WHERE b.pathbookcover <> 'default.jpg'
      AND b.id <> ALL ($1::int[])
      GROUP BY b.id
      ORDER BY b.id DESC
      LIMIT 2`,
    [results.map(book => book.id)]
  );
  results = results.concat(recentBooksQuery.rows);

  // Get random books to complete up to 50 books
  const remainingBooksCount = 50 - results.length;
  if (remainingBooksCount > 0) {
    const randomBooksQuery = await pool.query(
      `SELECT b.id, b.title, b.pathbookcover,  array_agg(ba.author) AS authors
        FROM BOOK b
        INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
        WHERE b.pathbookcover <> 'default.jpg'
        AND b.id <> ALL ($1::int[])
        GROUP BY b.id
        ORDER BY RANDOM()
        LIMIT $2`,
      [results.map(book => book.id), remainingBooksCount]
    );
    results = results.concat(randomBooksQuery.rows);

    results = results.map(book => ({
      authors: book.authors.join(", "),
      title: book.title,
      pathBookCover: book.pathbookcover,
      bookId: book.id,
    }));

    results = await shuffleArray(results);
  }
  res.status(201).send({
    recommended_feed: results,
  });
};
