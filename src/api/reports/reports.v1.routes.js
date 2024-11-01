import { Router } from "express";
import container from "../../config/di-container.js";
//middlewares
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
import authRole from "../../middlewares/authRole.js";
import { ROLES } from "../../helpers/roles.js";
//dto
import createReportV1Dto from "./dto/create-report.v1.dto.js";

const router = Router({ mergeParams: true });
const reportsController = container.resolve("reportsController");
const authRequired = container.resolve("authRequired");

/**
 * @swagger
 * /api/v1/reports:
 *   post:
 *     summary: Create a report
 *     tags:
 *       - Reports
 *     description: Create a report for a book. Requires authentication.
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
 *                 type: string
 *                 description: The ID of the book being reported.
 *                 example: "bweA"
 *               motivation:
 *                 type: string
 *                 description: The reason for reporting the book.
 *                 example: "Lorem Ipsum"
 *     responses:
 *       201:
 *         description: Report created successfully
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
 *                   example: "Report created successfully"
 *                 data:
 *                   type: object
 *                   description: The data returned by the operation.
 *                   example: {}
 *       409:
 *         description: Conflict. The user has already reported this book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the operation was successful.
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   description: The status code of the response.
 *                   example: 409
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "You have already reported this book"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user does not have the required role.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.post(
  "/",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(createReportV1Dto),
  errorHandler(reportsController.createReport)
);

/**
 * @swagger
 * /api/v1/reports/all:
 *   get:
 *     summary: Get all reports
 *     tags:
 *       - Reports
 *     description: Retrieve all reports. Requires authentication and admin role.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of all reports
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
 *                         description: The ID of the report.
 *                         example: "1"
 *                       idBook:
 *                         type: string
 *                         description: The ID of the book being reported.
 *                         example: "bweA"
 *                       motivation:
 *                         type: string
 *                         description: The reason for reporting the book.
 *                         example: "Lorem Ipsum"
 *                       dateReported:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the report was created.
 *                         example: "2024-11-01T05:00:00.000Z"
 *                       reportedBy:
 *                         type: string
 *                         description: The ID of the user who reported the book.
 *                         example: "qkcE"
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user does not have the required role.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/all",
  apiVersionMiddleware(1),
  authRequired,
  authRole(ROLES.ADMIN),
  errorHandler(reportsController.getAllReports)
);

export default router;
