import BaseRepository from "./base.repository.js";

export default class BookAuthorsRepository extends BaseRepository {
  constructor() {
    super("BOOK_AUTHORS");
  }

  // book creation
  async insertBookAuthors(bookId, authors, client) {
    const query = `
          INSERT INTO BOOK_AUTHORS (id_book, author)
          VALUES ${authors.map((_, index) => `($1, $${index + 2})`).join(", ")}
        `;
    await super.executeQuery(query, [bookId, ...authors], client);
  }

  async getBookAuthors(idBook) {
    const authors = await super.findWhere({ idBook });
    const authorsStringLists = authors.map(authorRow => authorRow.author);
    return authorsStringLists;
  }
}
