import { Router } from "express";
import container from "../../config/di-container.js";
//middlewares
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
//dto
import createListV1DTO from "./dto/create-list.v1.dto.js";
import getListV1DTO from "./dto/get-list.v1.dto.js";
import addBookV1Dto from "./dto/add-book.v1.dto.js";
import getListsWhereBookIsV1DTO from "./dto/get-lists-where-book-is.v1.dto.js";

const router = Router({ mergeParams: true });
const bookListsController = container.resolve("bookListsController");
const authRequired = container.resolve("authRequired");

/**
 * @swagger
 * /api/v1/book-lists:
 *   post:
 *     summary: Create a new book list
 *     tags:
 *       - Book Lists
 *     description: Create a new book list for the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book list.
 *                 example: "History"
 *               description:
 *                 type: string
 *                 description: A brief description of the book list.
 *                 example: "Interesting historical books"
 *               isPublic:
 *                 type: boolean
 *                 description: Whether the book list is public.
 *                 example: true
 *     responses:
 *       201:
 *         description: List created successfully
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
 *                   example: "List created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     listId:
 *                       type: string
 *                       description: The ID of the created list.
 *                       example: "kDlN"
 *       409:
 *         description: Conflict. A list with the same title already exists for the user.
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user is not active.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.post(
  "/",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(createListV1DTO),
  errorHandler(bookListsController.createBookList)
);

/**
 * @swagger
 * /api/v1/book-lists/my-lists/{bookId}:
 *   get:
 *     summary: Get book lists containing a specific book
 *     tags:
 *       - Book Lists
 *     description: Retrieve all book lists that contain a specific book. Requires authentication.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book.
 *         example: "hqk2"
 *     responses:
 *       200:
 *         description: A list of book lists containing the specified book
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       listid:
 *                         type: string
 *                         description: The ID of the book list.
 *                         example: "GHux"
 *                       listtitle:
 *                         type: string
 *                         description: The title of the book list.
 *                         example: "Me Gusta"
 *                       currentbookin:
 *                         type: boolean
 *                         description: Whether the current book is in the list.
 *                         example: true
 *       400:
 *         description: Bad Request. The request could not be understood or was missing required parameters.
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user is not active.
 *       404:
 *         description: Not found. The requested book does not exist.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/my-lists/:bookId",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(getListsWhereBookIsV1DTO),
  errorHandler(bookListsController.getListsWhereBookIs)
);

/**
 * @swagger
 * /api/v1/book-lists/my-lists:
 *   get:
 *     summary: Get user's book lists
 *     tags:
 *       - Book Lists
 *     description: Retrieve all book lists of the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's book lists
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the book list.
 *                         example: "GHux"
 *                       title:
 *                         type: string
 *                         description: The title of the book list.
 *                         example: "Me Gusta"
 *                       description:
 *                         type: string
 *                         description: A brief description of the book list.
 *                         example: "Aquí se muestran los libros a los que les has dado 'me gusta'."
 *                       isPublic:
 *                         type: boolean
 *                         description: Whether the book list is public.
 *                         example: false
 *                       bookCount:
 *                         type: string
 *                         description: The number of books in the book list.
 *                         example: "0"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user is not active.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/my-lists",
  apiVersionMiddleware(1),
  authRequired,
  errorHandler(bookListsController.getUserLists)
);

/**
 * @swagger
 * /api/v1/book-lists/{id}:
 *   get:
 *     summary: Get a book list by ID
 *     tags:
 *       - Book Lists
 *     description: Retrieve a book list by its ID. Requires authentication.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book list.
 *         example: "kDlN"
 *     responses:
 *       200:
 *         description: A book list
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
 *                       description: The ID of the book list.
 *                       example: "kDlN"
 *                     title:
 *                       type: string
 *                       description: The title of the book list.
 *                       example: "History"
 *                     description:
 *                       type: string
 *                       description: A brief description of the book list.
 *                       example: "Interesting historical books"
 *                     dateCreatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the book list was created.
 *                       example: "2024-11-01T05:00:00.000Z"
 *                     idUser:
 *                       type: string
 *                       description: The ID of the user who created the book list.
 *                       example: "qkcE"
 *                     isPublic:
 *                       type: boolean
 *                       description: Whether the book list is public.
 *                       example: true
 *                     books:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The ID of the book.
 *                             example: "hqk2"
 *                           title:
 *                             type: string
 *                             description: The title of the book.
 *                             example: "Don Quijote de la Mancha"
 *                           coverImgPath:
 *                             type: string
 *                             description: The URL of the book's cover image.
 *                             example: "https://res.cloudinary.com/dlja4vnrd/image/upload/v1723489266/bookCoverPics/di2bbfam1c7ncljxnfw8.jpg"
 *                           authors:
 *                             type: string
 *                             description: The authors of the book.
 *                             example: "Miguel de Cervantes Saavedra"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user is not active or the list is not public and does not belong to the user.
 *       404:
 *         description: Not found. The requested book list does not exist.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/:id",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(getListV1DTO),
  errorHandler(bookListsController.getListById)
);

/**
 * @swagger
 * /api/v1/book-lists/add-book:
 *   put:
 *     summary: Add a book to a book list
 *     tags:
 *       - Book Lists
 *     description: Add a book to a book list by its ID. Requires authentication.
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
 *                 description: The ID of the book to remove.
 *                 example: "hqk2"
 *               listId:
 *                 type: string
 *                 description: The ID of the book list.
 *                 example: "GHux"
 *     responses:
 *       201:
 *         description: Book added to list successfully
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
 *                   example: "Book added to list successfully"
 *                 data:
 *                   type: object
 *                   description: The data returned by the operation.
 *                   example: {}
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The list does not belong to the user or the user is not active.
 *       404:
 *         description: Not found. The requested book list does not exist.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.put(
  "/add-book",
  authRequired,
  validateDTO(addBookV1Dto),
  errorHandler(bookListsController.addBookToList)
);

/**
 * @swagger
 * /api/v1/book-lists/remove-book:
 *   delete:
 *     summary: Remove a book from a book list
 *     tags:
 *       - Book Lists
 *     description: Remove a book from a book list. Requires authentication.
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
 *                 description: The ID of the book to remove.
 *                 example: "hqk2"
 *               listId:
 *                 type: string
 *                 description: The ID of the book list.
 *                 example: "GHux"
 *     responses:
 *       200:
 *         description: Book removed from list successfully
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
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: "Book removed from list successfully"
 *                 data:
 *                   type: object
 *                   description: The data returned by the operation.
 *                   example: {}
 *       400:
 *         description: Bad Request. The request could not be understood or was missing required parameters.
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The list does not belong to the user.
 *       404:
 *         description: Not found. The requested book or book list does not exist.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.delete(
  "/remove-book",
  authRequired,
  validateDTO(addBookV1Dto),
  errorHandler(bookListsController.removeBookFromList)
);

export default router;
