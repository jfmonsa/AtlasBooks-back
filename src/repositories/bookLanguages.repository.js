import BaseRepository from "./base.repository.js";

export default class BookLanguagesRepository extends BaseRepository {
  constructor() {
    super("BOOK_LANG");
  }

  async getBookLanguages(idBook) {
    const languages = await super.findWhere({ idBook });
    const languagesList = languages.map(langRow => langRow.language);
    return languagesList;
  }

  async insertBookLanguages(bookId, languages, client) {
    const query = `
      INSERT INTO BOOK_LANG (id_book, language)
      VALUES ${languages.map((_, index) => `($1, $${index + 2})`).join(", ")}
    `;
    await super.executeQuery(query, [bookId, ...languages], client);
  }
}
