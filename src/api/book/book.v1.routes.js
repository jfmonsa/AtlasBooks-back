import { Router } from "express";
import apicache from "apicache";
import uploadMiddleware from "../../config/multer.js";
import container from "../../config/di-container.js";
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";

// dtos
import rateBookDTO from "./dto/rate-book.v1.dto.js";
import getRateV1DTO from "./dto/get-rate.v1.dto.js";
import createBookDTO from "./dto/create-book.v1.dto.js";
import downloadBookDTO from "./dto/download-book.v1.dto.js";
import getBookDataV1DTO from "./dto/get-book-data.v1.dto.js";

const router = Router({ mergeParams: true });
const cache = apicache.middleware;
const bookController = container.resolve("bookController");
const authRequired = container.resolve("authRequired");

/**
 * @swagger
 * /api/v1/book/rate:
 *   get:
 *     summary: Get the rate of a book by book ID and user ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: idBook
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book to retrieve the rate for.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the user to retrieve the rate for. If not provided, the rate will be 0.
 *     responses:
 *       200:
 *         description: Book rate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the operation was successful.
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response.
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     rate:
 *                       type: integer
 *                       description: The rate of the book.
 *                       example: 5
 *                       default: 0
 *       400:
 *         description: Invalid ID supplied.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error.
 */
router.get(
  "/rate",
  apiVersionMiddleware(1),
  validateDTO(getRateV1DTO),
  cache('5 minutes'),
  errorHandler(bookController.getRateOfBookByUserId)
);

/**
 * @swagger
 * /api/v1/book/rate:
 *   post:
 *     summary: Rate a book
 *     tags:
 *       - Books
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idBook:
 *                 type: integer
 *                 description: The ID of the book to rate.
 *                 example: wpyx
 *               rate:
 *                 type: integer
 *                 description: The rating of the book.
 *                 example: 5
 *     responses:
 *       201:
 *         description: Book rated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the operation was successful.
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response.
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Book rated successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   description: The data returned by the operation.
 *                   example: null
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Server error.
 */
router.post(
  "/rate",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(rateBookDTO),
  errorHandler(bookController.rate)
);

/**
 * @swagger
 * /api/v1/book/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book to retrieve.
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the operation was successful.
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response.
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The book ID.
 *                       example: wldf
 *                     isbn:
 *                       type: string
 *                       description: The ISBN of the book.
 *                       example: "9780123456789"
 *                     title:
 *                       type: string
 *                       description: The title of the book.
 *                       example: "test1"
 *                     description:
 *                       type: string
 *                       description: The description of the book.
 *                       example: "Undjlfj"
 *                     yearReleased:
 *                       type: integer
 *                       description: The year the book was released.
 *                       example: 2000
 *                     volume:
 *                       type: integer
 *                       nullable: true
 *                       description: The volume of the book.
 *                       example: null
 *                     numberOfPages:
 *                       type: integer
 *                       nullable: true
 *                       description: The number of pages in the book.
 *                       example: null
 *                     publisher:
 *                       type: string
 *                       nullable: true
 *                       description: The publisher of the book.
 *                       example: null
 *                     coverImgPath:
 *                       type: string
 *                       description: The URL of the book's cover image.
 *                       example: "https://res.cloudinary.com/dmsfqvzjq/image/upload/v1730067150/bookCoverPics/ew0hcli1bg989qgpxbb4.jpg"
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: The authors of the book.
 *                       example: ["Pepito", "Pepe"]
 *                     languages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: The languages the book is available in.
 *                       example: ["Spanish", "English"]
 *                     files:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: The file names of the book.
 *                       example: ["MobyDick.pdf"]
 *                     fileExtensions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: The file extensions of the book files.
 *                       example: ["PDF"]
 *                     rate:
 *                       type: integer
 *                       description: The rating of the book.
 *                       example: 0
 *                     subcategories:
 *                       type: object
 *                       properties:
 *                         subcategories:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: The subcategories of the book.
 *                           example: ["Architecture", "Business of Art"]
 *                         subcategoriesIds:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: The IDs of the subcategories.
 *                           example: [wpyx, gaxc]
 *                         categoryId:
 *                           type: string
 *                           description: The ID of the category.
 *                           example: hvvc
 *                     relatedBooks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           authors:
 *                             type: string
 *                             description: The authors of the related book.
 *                             example: "Won-Pyung Sohn"
 *                           title:
 *                             type: string
 *                             description: The title of the related book.
 *                             example: "Almendra"
 *                           bookId:
 *                             type: string
 *                             description: The ID of the related book.
 *                             example: "zUbm"
 *                           pathBookCover:
 *                             type: string
 *                             description: The URL of the cover image of the related book.
 *                             example: "https://res.cloudinary.com/dmsfqvzjq/image/upload/v1730067150/bookCoverPics/ew0hcli1bg989qgpxbb4.jpg"
 *                       description: The related books.
 *                       example: [
 *                         {
 *                           "authors": "Won-Pyung Sohn",
 *                           "title": "Almendra",
 *                           "bookId": "zUbm"
 *                         }
 *                       ]
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: The comments on the book.
 *                       example: []
 *       400:
 *         description: Invalid ID supplied.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error.
 */
router.get(
  "/:id",
  apiVersionMiddleware(1),
  validateDTO(getBookDataV1DTO),
  cache('5 minutes'),
  errorHandler(bookController.getById)
);

/**
 * @swagger
 * /api/v1/book:
 *   post:
 *     summary: Create a new book
 *     tags:
 *       - Books
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: The cover image of the book.
 *               bookFiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The files of the book.
 *               title:
 *                 type: string
 *                 description: The title of the book.
 *                 example: "The Great Gatsby"
 *               description:
 *                 type: string
 *                 description: The description of the book.
 *                 example: "A novel written by American author F. Scott Fitzgerald."
 *               isbn:
 *                 type: string
 *                 description: The ISBN of the book.
 *                 example: "978-3-16-148410-0"
 *               publisher:
 *                 type: string
 *                 description: The publisher of the book.
 *                 example: "Scribner"
 *               volume:
 *                 type: number
 *                 description: The volume of the book.
 *                 example: 1
 *               yearReleased:
 *                 type: number
 *                 description: The year the book was released.
 *                 example: 1925
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The authors of the book.
 *                 example: ["F. Scott Fitzgerald"]
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The languages the book is available in.
 *                 example: ["English"]
 *               subcategoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The subcategory IDs of the book.
 *                 example: [wpyx, vdwer, jpaf]
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the operation was successful.
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response.
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Book created successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   description: The data returned by the operation.
 *                   example: null
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Server error.
 */
router.post(
  "/",
  apiVersionMiddleware(1),
  authRequired,
  uploadMiddleware.fields([
    { name: "cover", maxCount: 1 },
    { name: "bookFiles", maxCount: 10 },
  ]),
  validateDTO(createBookDTO),
  errorHandler(bookController.create)
);

/**
 * @swagger
 * /api/v1/book/download:
 *   post:
 *     summary: Download a book
 *     tags:
 *       - Books
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 description: The ID of the book to download.
 *                 example: wpyx
 *               fileName:
 *                 type: string
 *                 description: The name of the file to download.
 *                 example: "6.PreParcial1.pdf"
 *     responses:
 *       200:
 *         description: Book downloaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the operation was successful.
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response.
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileCloudUrl:
 *                       type: string
 *                       description: The URL of the downloaded file.
 *                       example: "https://res.cloudinary.com/dlja4vnrd/image/upload/v1730513614/books/book_k8yjgg.pdf"
 *       400:
 *         description: Invalid input, object invalid.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: File not found or book not exists.
 *       500:
 *         description: Server error.
 */
router.post(
  "/download",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(downloadBookDTO),
  errorHandler(bookController.download)
);

export default router;
