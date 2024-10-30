import BaseRepository from "./base.repository.js";

export default class FeedRecommendedRepository extends BaseRepository {
  // doesn't have constructor because it doesn't
  // belong to a particular class in the db

  /**
   * Query a specified number of books with the most downloads, excluding certain book IDs.
   *
   * @param {number} numberOfBooks - The number of books to retrieve.
   * @param {number[]} excludeBooksIds - An array of book IDs to exclude from the results.
   * @returns {Promise<Array>} A promise that resolves to an array of books with the most downloads.
   */
  async getMostDownloadedBooks(numberOfBooks, excludeBooksIds) {
    //WHERE b.pathbookcover <> 'default.jpg'
    // TODO: get default constant from config
    const books = await super.executeQuery(
      `
      SELECT
        B.id, B.title, array_agg(ba.author) AS authors, B.cover_img_path, COUNT(D.id_book) as downloads
      FROM book B
      JOIN book_download D ON B.id = D.id_book
      JOIN BOOK_AUTHORS ba ON B.id = ba.id_book
      WHERE B.id <> ALL ($2::int[])
      GROUP BY B.id
      ORDER BY downloads DESC
      LIMIT $1
      `,
      [numberOfBooks, excludeBooksIds]
    );

    return books;
  }

  async getMostCommentedBooks(numberOfBooks, excludeBooksIds) {
    const books = await super.executeQuery(
      `
      SELECT
        B.id, B.title, array_agg(ba.author) AS authors, B.cover_img_path, COUNT(C.id_book) as comments
      FROM book B
      JOIN BOOK_AUTHORS ba ON B.id = ba.id_book
      JOIN BOOK_COMMENT C ON B.id = C.id_book
      WHERE B.id <> ALL ($2::int[])
      GROUP BY B.id
      ORDER BY comments DESC
      LIMIT $1
      `,
      [numberOfBooks, excludeBooksIds]
    );

    return books;
  }

  async getTopRatedBooks(numberOfBooks, excludeBooksIds) {
    const books = await super.executeQuery(
      `
      SELECT
        B.id, B.title, array_agg(ba.author) AS authors, B.cover_img_path, AVG(R.rate_value) as rating
      FROM book B
      JOIN BOOK_RATE R ON B.id = R.id_book
      JOIN BOOK_AUTHORS ba ON B.id = ba.id_book
      WHERE B.id <> ALL ($2::int[])
      GROUP BY B.id
      ORDER BY rating DESC
      LIMIT $1
      `,
      [numberOfBooks, excludeBooksIds]
    );

    return books;
  }

  async getMostRecentBooks(numberOfBooks, excludeBooksIds) {
    const books = await super.executeQuery(
      `
      SELECT
        B.id, B.title, array_agg(ba.author) AS authors, B.cover_img_path
      FROM book B
      JOIN BOOK_AUTHORS ba ON B.id = ba.id_book
      WHERE B.id <> ALL ($2::int[])
      GROUP BY B.id
      ORDER BY B.id DESC
      LIMIT $1
      `,
      [numberOfBooks, excludeBooksIds]
    );

    return books;
  }

  async getRandomlyBooks(numberOfBooks, excludeBooksIds) {
    const books = await super.executeQuery(
      `
      SELECT
        B.id, B.title, array_agg(ba.author) AS authors, B.cover_img_path
      FROM book B
      JOIN BOOK_AUTHORS ba ON B.id = ba.id_book
      WHERE B.id <> ALL ($2::int[])
      GROUP BY B.id
      ORDER BY RANDOM()
      LIMIT $1
      `,
      [numberOfBooks, excludeBooksIds]
    );

    return books;
  }
}
