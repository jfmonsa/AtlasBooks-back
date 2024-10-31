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

export default router;
