import shuffleArray from "../../helpers/shuffleArray.js";

export default class FeedRecommenedService {
  #bookRecommenedRepository;

  constructor({ feedRecommendedRepository }) {
    this.#bookRecommenedRepository = feedRecommendedRepository;
  }

  /**
   * Get 50 books with coverPath in the following priority order:
   * 1. Query Top 10 downloaded books
   * 2. Query Top 10 commented books
   * 3. Query Top 10 rated books
   * 4. Query Top 10 books recently added
   * 5. Get the rest of the books randomly
   * 6. Shuffle the entire array before returning it
   * Note: each step fetch distinct books
   * @returns {Promise<Array>} Array of 50 books with basic info
   */
  async getFeedRecomendedForUser() {
    let feed = [];

    const mostDownloadedBooks =
      await this.#bookRecommenedRepository.getMostDownloadedBooks(10);
    feed = feed.concat(mostDownloadedBooks);

    const mostCommentedBooks =
      await this.#bookRecommenedRepository.getMostCommentedBooks(
        10,
        feed.map(book => book.id)
      );
    feed = feed.concat(mostCommentedBooks);

    const topRatedBooks = await this.#bookRecommenedRepository.getTopRatedBooks(
      10,
      feed.map(book => book.id)
    );
    feed = feed.concat(topRatedBooks);

    const recentlyAddedBooks =
      await this.#bookRecommenedRepository.getMostRecentBooks(
        10,
        feed.map(book => book.id)
      );
    feed = feed.concat(recentlyAddedBooks);

    const remainingBooks =
      await this.#bookRecommenedRepository.getRandomlyBooks(
        50 - feed.length,
        feed.map(book => book.id)
      );
    feed = feed.concat(remainingBooks);

    // Shuffle the entire array before returning it
    shuffleArray(feed);

    // Remove duplicate authors
    feed = feed.map(book => {
      book.authors = [...new Set(book.authors)];
      return book;
    });

    return feed;
  }
}
