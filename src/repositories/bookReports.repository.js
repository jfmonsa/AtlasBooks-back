import BaseRepository from "./base.repository.js";

export default class BookReportsRepository extends BaseRepository {
  constructor() {
    super("book_report");
  }

  async verifyIfUserAlreadyReported(idUser, idBook) {
    const report = await this.findWhere({
      idUser,
      idBook,
      isReportSolved: false,
    });

    return report;
  }

  async createReport(idUser, idBook, motivation) {
    await this.create({
      idUser,
      idBook,
      dateReported: "NOW()",
      motivation,
      isReportSolved: false,
    });
  }

  async getAllReports() {
    return await super.findWhere({ isReportSolved: false });
  }
}
