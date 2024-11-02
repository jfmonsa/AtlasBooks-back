import { Router } from "express";
import container from "../../config/di-container.js";
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
import subcategoriesOfCategoryV1DTO from "./dto/subcategories-of-category.v1.dto.js";

const router = Router({ mergeParams: true });
const categoriesController = container.resolve("bookCategoriesController");

/**
 * @swagger
 * /api/v1/book-categories:
 *   get:
 *     summary: Get all book categories
 *     tags:
 *       - Book Categories
 *     description: Retrieve a list of all book categories.
 *     responses:
 *       200:
 *         description: A list of all book categories
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
 *                         type: integer
 *                         description: The ID of the category.
 *                         example: wpyx
 *                       name:
 *                         type: string
 *                         description: The name of the category.
 *                         example: "Arts"
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/",
  apiVersionMiddleware(1),
  errorHandler(categoriesController.getAllCategories)
);

/**
 * @swagger
 * /api/v1/book-categories/groupped:
 *   get:
 *     summary: Get grouped categories and subcategories
 *     tags:
 *       - Book Categories
 *     description: Retrieve a list of categories with their subcategories grouped.
 *     responses:
 *       200:
 *         description: A list of categories with their subcategories grouped
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
 *                       category:
 *                         type: string
 *                         description: The name of the category.
 *                         example: "Arts"
 *                       subcategories:
 *                         type: array
 *                         items:
 *                           type: string
 *                           description: The name of the subcategory.
 *                           example: "Architecture"
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/groupped",
  apiVersionMiddleware(1),
  errorHandler(categoriesController.getCategoriesAndSubcategoriesGrouped)
);

/**
 * @swagger
 * /api/v1/book-categories/subcategories/{categoryId}:
 *   get:
 *     summary: Get subcategories of a specific category
 *     tags:
 *       - Book Categories
 *     description: Retrieve a list of subcategories for a specific category.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category.
 *         example: wpyx
 *     responses:
 *       200:
 *         description: A list of subcategories for the specified category
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
 *                         description: The ID of the subcategory.
 *                         example: "G4su"
 *                       subcategoryName:
 *                         type: string
 *                         description: The name of the subcategory.
 *                         example: "Ancient & Medieval Philosophy"
 *       404:
 *         description: Not found. The specified category was not found.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.get(
  "/subcategories/:categoryId",
  validateDTO(subcategoriesOfCategoryV1DTO),
  apiVersionMiddleware(1),
  errorHandler(categoriesController.getSubCategoriesOfCategory)
);

export default router;
