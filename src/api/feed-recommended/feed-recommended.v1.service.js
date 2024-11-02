import shuffleArray from "../../helpers/shuffleArray.js";

export default class FeedRecommenedService {
  #bookRecommenedRepository;

  constructor({ feedRecommendedRepository }) {
    this.#bookRecommenedRepository = feedRecommendedRepository;
  }

  // TODO: recomend book based on user criteria
  // TODO: implement pagination
  // Old Feed Recommended algo:
  // 1. Get 10 most downloaded books
  // 2. Get 10 more books from the same category as the mostDownloadedBooks 10 books
  // 3. Add two of the most recent books
  // 4. Get the rest of the books randomly
  // 5. Shuffle the entire array before returning it

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

    await this.#bookRecommenedRepository.getMostDownloadedBooks(
      10,
      feed.map(book => book.id)
    );

    feed = feed.concat(
      await this.#bookRecommenedRepository.getMostCommentedBooks(
        10,
        feed.map(book => book.id)
      )
    );

    feed = feed.concat(
      await this.#bookRecommenedRepository.getTopRatedBooks(
        10,
        feed.map(book => book.id)
      )
    );

    feed = feed.concat(
      await this.#bookRecommenedRepository.getMostRecentBooks(
        10,
        feed.map(book => book.id)
      )
    );

    feed = feed.concat(
      await this.#bookRecommenedRepository.getRandomlyBooks(
        50 - feed.length,
        feed.map(book => book.id)
      )
    );

    console.log(feed);

    // format data
    feed = feed.map(book => ({
      authors: book.authors.join(", "),
      title: book.title,
      pathBookCover: book.coverImgPath,
      bookId: book.id,
    }));

    return shuffleArray(feed);
  }
}
