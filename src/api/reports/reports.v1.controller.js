import { HTTP_CODES } from "../../helpers/httpCodes.js";

export default class ReportsController {
  #reportsService;

  constructor({ reportsService }) {
    this.#reportsService = reportsService;

    this.createReport = this.createReport.bind(this);
    this.getAllReports = this.getAllReports.bind(this);
  }

  async createReport(req, res) {
    const idUser = req.user.id;
    const { idBook, motivation } = req.body;

    await this.#reportsService.createReport(idUser, idBook, motivation);
    return res.formatResponse(
      {},
      "Report created successfully",
      HTTP_CODES.CREATED
    );
  }

  async getAllReports(req, res) {
    const reports = await this.#reportsService.getAllReports();
    return res.formatResponse(reports);
  }
}
