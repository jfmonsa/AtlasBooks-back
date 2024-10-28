import { AppError, ValidationError } from "../../helpers/exeptions.js";
import { HTTP_CODES } from "../../helpers/httpCodes.js";

export class BookController {
  #bookService;

  constructor({ bookService }) {
    this.#bookService = bookService;

    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.download = this.download.bind(this);
    this.rate = this.rate.bind(this);
    this.getRateOfBookByUserId = this.getRateOfBookByUserId.bind(this);
  }

  async getById(req, res) {
    const idBook = req.params.id;

    const bookDetails = await this.#bookService.getBookWithDetails(idBook);

    if (!bookDetails) {
      throw new AppError("Book not found", HTTP_CODES.NOT_FOUND);
    }

    res.formatResponse(bookDetails);
  }

  async create(req, res) {
    const { authors, languages, subcategoryIds } = req.body;
    const { cover: coverBookFile, bookFiles } = req.files;

    if (!bookFiles) {
      throw new ValidationError(
        "There should be at least one book file, pdf or epub"
      );
    }

    const bookData = req.body;

    await this.#bookService.create({
      ...bookData,
      authors: Array.isArray(authors) ? authors : JSON.parse(authors),
      languages: Array.isArray(languages) ? languages : JSON.parse(languages),
      subcategoryIds: Array.isArray(subcategoryIds)
        ? subcategoryIds
        : JSON.parse(subcategoryIds),
      coverBookFile,
      bookFiles,
    });

    res.formatResponse(null, "Book created successfully", HTTP_CODES.CREATED);
  }

  async update(_req, _res) {
    throw new Error("Method not implemented.");
  }

  async delete(_req, _res) {
    throw new Error("Method not implemented.");
  }

  async download(req, res) {
    const { bookId, fileName } = req.body;
    const { id: userId } = req.user;

    const fileCloudUrl = await this.#bookService.downloadBook(
      userId,
      bookId,
      fileName
    );

    // fronted will trigger the download
    res.formatResponse({ fileCloudUrl });
  }

  async rate(req, res) {
    const { idBook, rate } = req.body;
    const { id: userId } = req.user;

    await this.#bookService.rate(userId, idBook, rate);
    res.formatResponse(null, "Book rated successfully", HTTP_CODES.CREATED);
  }

  async getRateOfBookByUserId(req, res) {
    const idBook = req.params.idBook;
    const { id: userId } = req.user;

    const rateValue = await this.#bookService.getRateOfBookByUserId(
      userId,
      idBook
    );
    res.formatResponse({ rate: rateValue });
  }
}
