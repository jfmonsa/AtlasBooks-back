import { Router } from "express";
import container from "../../config/di-container.js";
//middlewares
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";

const router = Router({ mergeParams: true });
const feedRecommendedController = container.resolve(
  "feedRecommendedController"
);

/**
 * @swagger
 * /api/v1/feed-recommended:
 *   get:
 *     summary: Get recommended books for the user
 *     tags:
 *       - Feed Recommended
 *     description: Retrieve a list of recommended books for the user. No authentication required.
 *     responses:
 *       200:
 *         description: A list of recommended books
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
 *                       authors:
 *                         type: string
 *                         description: The authors of the book.
 *                         example: "Taylor Jenkins Reid"
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                         example: "Los siete maridos de Evelyn Hugo"
 *                       bookId:
 *                         type: string
 *                         description: The ID of the book.
 *                         example: hfjt
 *       404:
 *         description: Not found. The requested resource could not be found.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/",
  apiVersionMiddleware(1),
  errorHandler(feedRecommendedController.getFeedRecomendedForUser)
);

export default router;
