import { Router } from "express";
import container from "../../config/di-container.js";
//middlewares
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
//dto
import getCommentsV1DTO from "./dto/get-comments.v1.dto.js";
import createCommentV1DTO from "./dto/create-comment.v1.dto.js";
import updateCommentV1DTO from "./dto/update-comment.v1.dto.js";
import deleteCommentV1DTO from "./dto/delete-comment.v1.dto.js";

const router = Router({ mergeParams: true });
const bookCommentsController = container.resolve("bookCommentsController");
const authRequired = container.resolve("authRequired");

/**
 * @swagger
 * /api/v1/book-comments/{bookId}:
 *   get:
 *     summary: Get comments of a book
 *     tags:
 *       - Book Comments
 *     description: Retrieve a list of comments for a specific book.
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book
 *     responses:
 *       200:
 *         description: A list of comments for the specified book
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the comment
 *                     example: "12345"
 *                   text:
 *                     type: string
 *                     description: The text of the comment
 *                     example: "Great book!"
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who made the comment
 *                     example: "67890"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the comment was created
 *                     example: "2023-01-01T12:00:00Z"
 *       400:
 *         description: Invalid book ID
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:bookId",
  apiVersionMiddleware(1),
  validateDTO(getCommentsV1DTO),
  errorHandler(bookCommentsController.getCommentsOfBook)
);

/**
 * @swagger
 * /api/v1/book-comments:
 *   post:
 *     summary: Create a comment for a book
 *     tags:
 *       - Book Comments
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
 *                 description: The ID of the book to comment on.
 *                 example: wpyx
 *               text:
 *                 type: string
 *                 description: The text of the comment.
 *                 example: "Nice book!"
 *     responses:
 *       201:
 *         description: Comment created successfully
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
 *                   example: "Comment created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the comment.
 *                       example: wpyx
 *                     idUser:
 *                       type: string
 *                       description: The ID of the user who commented.
 *                       example: wezd
 *                     idBook:
 *                       type: string
 *                       description: The ID of the book being commented on.
 *                       example: erwq
 *                     dateCommented:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the comment was made.
 *                       example: "2024-10-29T17:16:48.894Z"
 *                     textCommented:
 *                       type: string
 *                       description: The text of the comment.
 *                       example: "Nice book!"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(createCommentV1DTO),
  errorHandler(bookCommentsController.createCommentOfBook)
);

/**
 * @swagger
 * /api/v1/book-comments:
 *   put:
 *     summary: Update a comment for a book
 *     tags:
 *       - Book Comments
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The updated text of the comment.
 *                 example: "Fixed comment, nice book mate!"
 *               commentId:
 *                 type: string
 *                 description: The ID of the comment to update.
 *                 example: wpyx
 *     responses:
 *       200:
 *         description: Comment updated successfully
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
 *                   example: "Comment updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the comment.
 *                       example: wpyx
 *                     idUser:
 *                       type: string
 *                       description: The ID of the user who commented.
 *                       example: wlgda
 *                     idBook:
 *                       type: string
 *                       description: The ID of the book being commented on.
 *                       example: wqer
 *                     dateCommented:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the comment was made.
 *                       example: "2024-10-30T03:09:55.002Z"
 *                     textCommented:
 *                       type: string
 *                       description: The updated text of the comment.
 *                       example: "Fixed comment, nice book mate!"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment or book not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(updateCommentV1DTO),
  errorHandler(bookCommentsController.updateComment)
);

/**
 * @swagger
 * /api/v1/book-comments/{commentId}:
 *   delete:
 *     summary: Delete a comment for a book
 *     tags:
 *       - Book Comments
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   example: "Comment deleted successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   description: The data returned by the operation.
 *                   example: null
 *       400:
 *         description: Bad request. The request could not be understood or was missing required parameters.
 *       401:
 *         description: Unauthorized. Authentication failed or user does not have permissions for the requested operation.
 *       404:
 *         description: Not found. The requested resource could not be found.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.delete(
  "/:commentId",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(deleteCommentV1DTO),
  errorHandler(bookCommentsController.deleteComment)
);

export default router;
