import BaseRepository from "./base.repository.js";

export default class BookRateRepository extends BaseRepository {
  constructor() {
    super("book_rate");
  }

  async getAVGBookRate(idBook) {
    const queryRate = await this.executeQuery(
      `SELECT ROUND(AVG(ratevalue),1) as rate_avg FROM BOOK_RATE WHERE id_book = $1`,
      [idBook]
    );
    return queryRate.rows > 0 ? queryRate.rows[0].rate_avg : 0;
  }

  async getBookRateByUser(idBook, idUser) {
    const queryRate = await this.findWhere({
      idBook,
      idUser,
    });
    return queryRate.rows > 0 ? queryRate.rows[0].rateValue : 0;
  }

  async upsertRate(idBook, idUser, rate) {
    const { rows } = await super.executeQuery(
      `INSERT INTO book_rate (id_user, id_book, rate_value) VALUES ($1, $2, $3)
        ON CONFLICT (id_user, id_book) DO UPDATE SET rate_value = $3`,
      [idUser, idBook, rate]
    );
    return rows[0];
  }
}
