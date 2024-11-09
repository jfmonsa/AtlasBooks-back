import { Router } from "express";
import container from "../../config/di-container.js";
//middlewares
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
import authRole from "../../middlewares/authRole.js";
import { ROLES } from "../../helpers/roles.js";
//dto
import searchBooksV1Dto from "./dto/search-books.v1.dto.js";
import searchListsV1Dto from "./dto/search-lists.v1.dto.js";
import searchUsersV1Dto from "./dto/search-users.v1.dto.js";

const router = Router({ mergeParams: true });
const searchFiltersController = container.resolve("searchFiltersController");
const authRequired = container.resolve("authRequired");

/**
 * @swagger
 * /api/v1/search-filters/books:
 *   get:
 *     summary: Search books with filters
 *     tags:
 *       - Search Filters
 *     description: Retrieve a list of books based on search filters.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: The search query.
 *         example: "Gatsby"
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: The language of the books.
 *         example: "spanish"
 *       - in: query
 *         name: yearFrom
 *         schema:
 *           type: integer
 *         description: The starting year for the book release date.
 *         example: 1900
 *       - in: query
 *         name: yearTo
 *         schema:
 *           type: integer
 *         description: The ending year for the book release date.
 *         example: 2000
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: The category ID of the books.
 *         example: "wpyx"
 *       - in: query
 *         name: subCategoryId
 *         schema:
 *           type: string
 *         description: The subcategory ID of the books.
 *         example: "wpyx"
 *     responses:
 *       200:
 *         description: A list of books matching the search filters
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
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                         example: "El gran Gatsby"
 *                       yearReleased:
 *                         type: integer
 *                         description: The year the book was released.
 *                         example: 1924
 *                       coverImgPath:
 *                         type: string
 *                         description: The URL of the book's cover image.
 *                         example: "https://res.cloudinary.com/dlja4vnrd/image/upload/v1730155551/bookCoverPics/rwkun4nziimuc1kraggp.jpg"
 *                       id:
 *                         type: string
 *                         description: The ID of the book.
 *                         example: "bweA"
 *                       publisher:
 *                         type: string
 *                         nullable: true
 *                         description: The publisher of the book.
 *                         example: null
 *                       author:
 *                         type: string
 *                         description: The author of the book.
 *                         example: "Fitzgerald"
 *                       language:
 *                         type: string
 *                         description: The language of the book.
 *                         example: "spanish"
 *                       rating:
 *                         type: integer
 *                         description: The rating of the book.
 *                         example: 0
 *       400:
 *         description: Bad Request. The request could not be understood or was missing required parameters.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/books",
  apiVersionMiddleware(1),
  validateDTO(searchBooksV1Dto),
  errorHandler(searchFiltersController.searchBooks)
);

/**
 * @swagger
 * /api/v1/search-filters/users:
 *   get:
 *     summary: Search users
 *     tags:
 *       - Search Filters
 *     description: Retrieve a list of users based on search filters. Requires authentication and admin role.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query.
 *         example: "test"
 *     responses:
 *       200:
 *         description: A list of users matching the search filters
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
 *                         description: The ID of the user.
 *                         example: "qkcE"
 *                       fullName:
 *                         type: string
 *                         description: The full name of the user.
 *                         example: "test1"
 *                       nickname:
 *                         type: string
 *                         description: The nickname of the user.
 *                         example: "test1"
 *                       email:
 *                         type: string
 *                         description: The email of the user.
 *                         example: "test1@test.com"
 *                       country:
 *                         type: string
 *                         description: The country of the user.
 *                         example: "CO"
 *                       registerDate:
 *                         type: string
 *                         format: date-time
 *                         description: The registration date of the user.
 *                         example: "2024-10-31T05:00:00.000Z"
 *                       password:
 *                         type: string
 *                         description: The hashed password of the user.
 *                         example: "$2a$10$3AgBrHX4CPmKar/tT4qx4O9Jgf4NU054kDFpa2hdyfVLNtvILFwPW"
 *                       profileImgPath:
 *                         type: string
 *                         description: The URL of the user's profile image.
 *                         example: "https://res.cloudinary.com/dlja4vnrd/image/upload/v1730346383/default_f2wovz.png"
 *                       isActive:
 *                         type: boolean
 *                         description: Whether the user is active.
 *                         example: true
 *                       role:
 *                         type: string
 *                         description: The role of the user.
 *                         example: "ADMIN"
 *       400:
 *         description: Bad Request. The request could not be understood or was missing required parameters.
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       403:
 *         description: Forbidden. The user does not have the required role.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/users",
  apiVersionMiddleware(1),
  authRequired,
  authRole(ROLES.ADMIN),
  validateDTO(searchUsersV1Dto),
  errorHandler(searchFiltersController.searchUsers)
);

/**
 * @swagger
 * /api/v1/search-filters/public-lists:
 *   get:
 *     summary: Search public book lists
 *     tags:
 *       - Search Filters
 *     description: Retrieve a list of public book lists based on the list name.
 *     parameters:
 *       - in: query
 *         name: listName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the book list to search for.
 *         example: "h"
 *     responses:
 *       200:
 *         description: A list of public book lists matching the search query
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
 *                         example: "kDlN"
 *                       title:
 *                         type: string
 *                         description: The title of the book list.
 *                         example: "History"
 *                       description:
 *                         type: string
 *                         description: A brief description of the book list.
 *                         example: "Interesting historical books"
 *                       dateCreatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the book list was created.
 *                         example: "2024-11-01T05:00:00.000Z"
 *                       idUser:
 *                         type: string
 *                         description: The ID of the user who created the book list.
 *                         example: "qkcE"
 *                       isPublic:
 *                         type: boolean
 *                         description: Whether the book list is public.
 *                         example: true
 *       400:
 *         description: Bad Request. The request could not be understood or was missing required parameters.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/public-lists",
  apiVersionMiddleware(1),
  validateDTO(searchListsV1Dto),
  errorHandler(searchFiltersController.searchPublicLists)
);

export default router;
