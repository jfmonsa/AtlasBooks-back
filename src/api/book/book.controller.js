import { CustomError } from "../middlewares/errorMiddleware.js";
import { BookService } from "./books.service.js";

export class BooksController {
  static async getById(req, res) {
    const idBook = req.params.id;

    const bookDetails = await BookService.getBookWithDetails(idBook);

    if (!bookDetails) throw new CustomError("Book not found", 404);
    res.status(200).success(bookDetails);
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

  static async rate(req, res) {
    const { idbook, rate } = req.body;
    const { id } = req.user;

    await BookService.rateBook(id, idbook, rate);

    res.status(200).success({ message: "Rating sent successfully" });
  }

  static async getRateOfBookByUserId(req, res) {
    const idbook = req.params.idbook; // id of book
    const { id: userId } = req.user; // id of user

    const rateValue = await BookService.getRateOfBookByUserId(userId, idbook);
    res.status(200).success({ rateValue });
  }
}
