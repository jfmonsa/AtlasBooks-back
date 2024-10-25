import { Router } from "express";
import container from "../../config/di-container.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js";
import { apiVersionMiddleware } from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
import registerDTO from "./dto/register.v1.dto.js";

const router = Router({ mergeParams: true });
const authController = container.resolve("authController");

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Server error.
 *
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           description: Full name of the user.
 *           example: test9
 *         email:
 *           type: string
 *           description: User's email address.
 *           format: email
 *           example: test9@mail.com
 *         password:
 *           type: string
 *           description: Password for the user account.
 *           format: password
 *           example: TesteandoEstoxd32+
 *         nickname:
 *           type: string
 *           description: Nickname of the user.
 *           example: test9
 *         country:
 *           type: string
 *           description: Country of the user.
 *           example: CO
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the operation was successful.
 *           example: true
 *         statusCode:
 *           type: integer
 *           description: The status code of the response.
 *           example: 201
 *         message:
 *           type: string
 *           description: A success message.
 *           example: "User created successfully"
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID.
 *                   example: 17
 *                 fullName:
 *                   type: string
 *                   description: The full name of the user.
 *                   example: test9
 *                 nickname:
 *                   type: string
 *                   description: The nickname of the user.
 *                   example: test9
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: test9@mail.com
 *                 country:
 *                   type: string
 *                   description: The country of the user.
 *                   example: CO
 *                 registerDate:
 *                   type: string
 *                   format: date-time
 *                   description: The registration date of the user.
 *                   example: 2024-10-25T05:00:00.000Z
 *                 profileImgPath:
 *                   type: string
 *                   description: The path to the user's profile picture.
 *                   example: ../storage/usersProfilePic/default.webp
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the user.
 *                   example: true
 *                 isAdmin:
 *                   type: boolean
 *                   description: Whether the user is an admin.
 *                   example: false
 */
router.post(
  "/register",
  apiVersionMiddleware(1),
  validateDTO(registerDTO),
  asyncErrorHandler(authController.register)
);
// router.post("/login", asyncHandler(AuthController.login)); // /api/v1/auth/login
// router.post("/logout", asyncHandler(AuthController.logout)); // /api/v1/auth/logout
// router.post("/verifyToken", asyncHandler(AuthController.verifyToken)); //  /api/v1/auth/verifyToken
// router.post("/verifyTokenEmail", asyncHandler(AuthController.verifyTokenEmail)); //  /api/v1/auth/verifyTokenEmail

export default router;
