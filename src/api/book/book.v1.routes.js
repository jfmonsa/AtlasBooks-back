import { Router } from "express";
import uploadMiddleware from "../../config/multer.js";
import container from "../../config/di-container.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
//import { authRequired } from "../middlewares/authRequired.js";
// dtos
import rateBookDTO from "./dto/rate-book.v1.dto.js";
import createBookDTO from "./dto/create-book.v1.dto.js";

const router = Router({ mergeParams: true });
const bookController = container.resolve("bookController");

router.get(
  "/:id",
  apiVersionMiddleware(1),
  asyncErrorHandler(bookController.getById)
);
/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags:
 *       - Books
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
 *                   type: number
 *                 description: The subcategory IDs of the book.
 *                 example: [1, 2, 3]
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
  //authRequired,
  uploadMiddleware.fields([
    { name: "cover", maxCount: 1 },
    { name: "bookFiles", maxCount: 10 },
  ]),
  apiVersionMiddleware(1),
  validateDTO(createBookDTO),
  asyncErrorHandler(bookController.create)
);

// /api/v1/books/:fileName
router.post(
  "/:fileName",
  //authRequired,
  apiVersionMiddleware(1),
  asyncErrorHandler(bookController.download)
);

router.get(
  "/:idBook",
  //authRequired,
  apiVersionMiddleware(1),
  bookController.getRateOfBookByUserId
);

router.post(
  "/",
  //authRequired,
  apiVersionMiddleware(1),
  validateDTO(rateBookDTO),
  bookController.rate
);

export default router;
