import shuffleArray from "../../../utils/shuffleArray.js";

import {
  get10MostDownloadedBooks,
  get10SameCategoryAsGivenBooksDistinctFromGiven,
  get2MostRecentBooksDistinctFromGiven,
  getRandomBooksDistinctFromGiven,
} from "../repositories/UserFeedRepository.js";

export class UserFeedService {
  /**
   * Get 50 books with coverPath in the following priority order:
   * 1. Query to get 10 books with the most downloads on the page
   * 2. Get the category of (2 or more) of the previous 10 books and based on that, fetch another 10 books
   * 3. Add two of the most recent books
   * 4. Get the rest of the books randomly
   * 5. Shuffle the entire array before returning it
   *
   * @returns {Promise<void>} A promise that resolves when the recommended feed is sent
   */
  static async getFeedRecomended() {
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
    booksFeed = booksFeed.map(book => ({
      authors: book.authors.join(", "),
      title: book.title,
      pathBookCover: book.pathbookcover,
      bookId: book.id,
    }));

    //Shuffle the entire array before returning it
    booksFeed = await shuffleArray(booksFeed);
  }
}
