import { Router } from "express";
import asyncHandler from "../../../../utils/asyncHandler.js";
import { AuthController } from "./auth.controller.js";

const router = Router();

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
 *       200:
 *         description: Successfully registered the user.
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
 *         name:
 *           type: string
 *           description: Name of the user.
 *           example: test2
 *         email:
 *           type: string
 *           description: User's email address.
 *           format: email
 *           example: test2@mail.com
 *         password:
 *           type: string
 *           description: Password for the user account.
 *           format: password
 *           example: TesteandoEstoxd32+
 *         nickName:
 *           type: string
 *           description: Nickname of the user.
 *           example: test2
 *         country:
 *           type: string
 *           description: Country of the user.
 *           example: PA
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the operation was successful.
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID.
 *                   example: 13
 *                 nameu:
 *                   type: string
 *                   description: The name of the user.
 *                   example: test2
 *                 nickname:
 *                   type: string
 *                   description: The nickname of the user.
 *                   example: test2
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: test2@mail.com
 *                 country:
 *                   type: string
 *                   description: The country of the user.
 *                   example: PA
 *                 registerdate:
 *                   type: string
 *                   format: date-time
 *                   description: The registration date of the user.
 *                   example: 2024-09-30T05:00:00.000Z
 *                 pathprofilepic:
 *                   type: string
 *                   description: The path to the user's profile picture.
 *                   example: ../storage/usersProfilePic/default.webp
 *                 statusu:
 *                   type: boolean
 *                   description: The status of the user.
 *                   example: true
 *                 isadmin:
 *                   type: boolean
 *                   description: Whether the user is an admin.
 *                   example: false
 *         message:
 *           type: string
 *           description: A success message.
 *           example: "User created successfully"
 */
router.post("/register", asyncHandler(AuthController.register)); //  /api/v1/auth/register
// router.post("/login", asyncHandler(AuthController.login)); // /api/v1/auth/login
// router.post("/logout", asyncHandler(AuthController.logout)); // /api/v1/auth/logout
// router.post("/verifyToken", asyncHandler(AuthController.verifyToken)); //  /api/v1/auth/verifyToken
// router.post("/verifyTokenEmail", asyncHandler(AuthController.verifyTokenEmail)); //  /api/v1/auth/verifyTokenEmail

export default router;
