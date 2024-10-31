import { Router } from "express";
import container from "../../config/di-container.js";
// middlewares
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
// dto
const router = Router({ mergeParams: true });
const userController = container.resolve("userController");
const authRequired = container.resolve("authRequired");

/**
 * @swagger
 * /api/v1/user:
 *   delete:
 *     summary: Delete user account
 *     tags:
 *       - User
 *     description: Delete the account of the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   example: "User deleted successfully"
 *                 data:
 *                   type: object
 *                   description: The data returned by the operation.
 *                   example: {}
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.delete(
  "/",
  apiVersionMiddleware(1),
  authRequired,
  errorHandler(userController.deleteUser)
);

/**
 * @swagger
 * /api/v1/user/download-history:
 *   get:
 *     summary: Get user download history
 *     tags:
 *       - User
 *     description: Retrieve the download history of the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of downloaded books
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
 *                       idUser:
 *                         type: string
 *                         description: The ID of the user.
 *                         example: "GHux"
 *                       dateDownloaded:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the book was downloaded.
 *                         example: "2024-10-31T20:25:30.075Z"
 *                       bookId:
 *                         type: string
 *                         description: The ID of the book.
 *                         example: "79DG"
 *                       isbn:
 *                         type: string
 *                         description: The ISBN of the book.
 *                         example: "9780123456789"
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                         example: "test2"
 *                       description:
 *                         type: string
 *                         description: The description of the book.
 *                         example: "Undjlfj"
 *                       yearReleased:
 *                         type: integer
 *                         description: The year the book was released.
 *                         example: 2000
 *                       volume:
 *                         type: integer
 *                         nullable: true
 *                         description: The volume of the book.
 *                         example: null
 *                       numberOfPages:
 *                         type: integer
 *                         nullable: true
 *                         description: The number of pages in the book.
 *                         example: null
 *                       publisher:
 *                         type: string
 *                         nullable: true
 *                         description: The publisher of the book.
 *                         example: null
 *                       coverImgPath:
 *                         type: string
 *                         description: The URL of the book's cover image.
 *                         example: "https://res.cloudinary.com/dmsfqvzjq/image/upload/v1730346201/bookCoverPics/clvqamwfjecjsg9jhhom.jpg"
 *                       author:
 *                         type: string
 *                         description: The author of the book.
 *                         example: "Pepito"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/download-history",
  apiVersionMiddleware(1),
  authRequired,
  errorHandler(userController.getDownloadHistory)
);

router.put(
  "/change-email",
  apiVersionMiddleware(1),
  authRequired
  //errorHandler(userController.changeEmailSend)
);

router.put(
  "/ban-user",
  apiVersionMiddleware(1),
  authRequired,
  errorHandler(userController.banUser)
);

router.put(
  "/unban-user",
  apiVersionMiddleware(1),
  authRequired,
  errorHandler(userController.unbanUser)
);

export default router;
