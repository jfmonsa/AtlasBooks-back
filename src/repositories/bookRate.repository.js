import BaseRepository from "./base.repository.js";

export default class BookRateRepository extends BaseRepository {
  constructor() {
    super("book_rate");
  }

  async getAVGBookRate(idBook) {
    const queryRate = await this.executeQuery(
      `SELECT ROUND(AVG(rate_value),1) as rate_avg FROM BOOK_RATE WHERE id_book = $1`,
      [idBook]
    );
    return queryRate.lenght > 0 ? queryRate[0].rate_avg : 0;
  }

  async getBookRateByUser(idBook, userNickname) {
    const result = await super.executeQuery(
      "SELECT rate_value FROM book_rate WHERE id_book = $1 AND id_user = (SELECT id FROM users WHERE nickname = $2)",
      [idBook, userNickname]
    );
    // const result = await this.findWhere({
    //   nickname: userNickname,
    //   idBook,
    // });
    return result ? result[0].rateValue : 0;
  }

  async upsertRate(idBook, idUser, rate) {
    const result = await super.executeQuery(
      `INSERT INTO book_rate (id_user, id_book, rate_value) VALUES ($1, $2, $3)
        ON CONFLICT (id_user, id_book) DO UPDATE SET rate_value = $3
        RETURNING *
        `,
      [idUser, idBook, rate]
    );
    return result[0];
  }
}
