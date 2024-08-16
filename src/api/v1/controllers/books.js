import { CustomError } from "../../middlewares/errorMiddleware.js";
import { BookService } from "../services/books.js";

class BooksController {
  static async getById(req, res) {
    const idBook = req.params.id;

    const bookDetails = await BookService.getById(idBook);

    if (!bookDetails) throw new CustomError("Book not found", 404);
    res.json(bookDetails);
  }

  static async create(req, res) {
    //use express validator as middleware
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

    res.status(201).json({
      status: "success",
      data: { message: "Book created successfully" },
    });
  }

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

    res.status(200).json(["Rating sent successfully"]);
  }

  static async update(req, res) {}

  static async delete(req, res) {}
}

// TODO:
// evaluar si es correcto hacer un middleware para formatear la respuesta
// basado en:
// 1. https://github.com/omniti-labs/jsend
// 2. https://quilltez.com/blog/maintaining-standard-rest-api-response-format-expressjs
