import BaseRepository from "./base.repository.js";

export default class BookRepository extends BaseRepository {
  async getById(id) {
    return await super.findById(id);
  }

  async getBookAuthors(idBook) {
    const authors = await this.pool.query(
      `SELECT author FROM BOOK_AUTHORS WHERE idBook = $1`,
      [idBook]
    );
    return authors.rows.map(authorObj => authorObj.author);
  }

  async getBookLanguages(idBook) {}

  async getBookFileNames(idBook) {}

  async getAVGBookRate(idBook) {}

  async getBookSubcategories(idBook) {}

  async getBookComments(idBook) {}

  async getBookDetails(idBook) {}
}
