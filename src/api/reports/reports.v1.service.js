import { ConflictError } from "../../helpers/exeptions.js";

export default class ReportsV1Service {
  #bookReportsRepository;

  constructor({ bookReportsRepository }) {
    this.#bookReportsRepository = bookReportsRepository;
  }

  async createReport(idUser, idBook, motivation) {
    const reportAlreadyExists =
      await this.#bookReportsRepository.verifyIfUserAlreadyReported(
        idUser,
        idBook
      );

    if (reportAlreadyExists) {
      throw new ConflictError("You have already reported this book");
    }

    await this.#bookReportsRepository.createReport(idUser, idBook, motivation);
  }

  async getAllReports() {
    return await this.#bookReportsRepository.getAllReports();
  }
}
