import { AppError } from "../../helpers/exeptions.js";
import { HTTP_CODES } from "../../helpers/httpCodes.js";

export class BookController {
  #bookService;

  constructor({ bookService }) {
    this.#bookService = bookService;

    this.getById = this.getById.bind(this);
    // this.create = this.create.bind(this);
    // this.update = this.update.bind(this);
    // this.delete = this.delete.bind(this);
    // this.download = this.download.bind(this);
    // this.rate = this.rate.bind(this);
    // this.getRateOfBookByUserId = this.getRateOfBookByUserId.bind(this);
  }

  async getById(req, res) {
    const idBook = req.params.id;

    if (!Number.isInteger(idBook))
      throw new AppError("Invalid id", HTTP_CODES.BAD_REQUEST);

    const bookDetails = await this.#bookService.getBookWithDetails(idBook);

    if (!bookDetails) {
      throw new AppError("Book not found", HTTP_CODES.NOT_FOUND);
    }

    res.formatResponse(bookDetails);
  }

  static async create(req, res) {
    // TODO: use express validator as middleware
    // isbn, title, yearReleased, authors, languages
    const bookData = req.body;
    await BookService.createBook({
      ...bookData,
      authors: Array.isArray(authors) ? authors : JSON.parse(authors),
      languages: Array.isArray(languages) ? languages : JSON.parse(languages),
      subcategoryIds: Array.isArray(subcategoryIds)
        ? subcategoryIds
        : JSON.parse(subcategoryIds),
    });

    res.status(201).success({
      message: "Book created successfully",
    });
  }

  static async update(req, res) {}

  static async delete(req, res) {}

  static async download(req, res) {
    const { fileName } = req.params;
    const { userId, bookId } = req.body;

    const fileInfo = await BookService.getFileInfo(fileName, bookId);
    // stream file to client
    /**
     * const streamFileToClient = async (res, fileInfo) => {
        const { data } = await axios.get(fileInfo.pathF, { responseType: "stream" });
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileInfo.originalFileName}"`
        );
        await pipeline(data, res);
     */

    // Envía el archivo al cliente
    // res.status(201).download(filePath);
  }

  async rate(req, res) {
    const { idbook, rate } = req.body;
    const { id } = req.user;

    await this.#bookService.rate(id, idbook, rate);

    res.formatResponse({ message: "Rating sent successfully" });
  }

  static async getRateOfBookByUserId(req, res) {
    const idbook = req.params.idbook; // id of book
    const { id: userId } = req.user; // id of user

    const rateValue = await this.#bookService.getRateOfBookByUserId(
      userId,
      idbook
    );
    res.formatResponse({ rate: rateValue });
  }
}
