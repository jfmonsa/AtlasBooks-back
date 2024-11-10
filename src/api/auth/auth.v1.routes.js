import { Router } from "express";
import container from "../../config/di-container.js";
// middlewares
import errorHandler from "../../middlewares/errorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
import validateDTO from "../../middlewares/validateDTO.js";
// dto
import registerDTO from "./dto/register.v1.dto.js";
import loginDTO from "./dto/login.v1.dto.js";
import changePasswordV1DTO from "./dto/change-password.v1.dto.js";
import changeEmailV1DTO from "./dto/change-email.v1.dto.js";
import changeEmailConfirmedDTO from "./dto/change-email-confirmed.dto.js";
import forgotPasswordV1DTO from "./dto/forgot-password.v1.dto.js";
import changePasswordConfirmedV1DTO from "./dto/forgot-password-confirmed.v1.dto.js";

const router = Router({ mergeParams: true });
const authController = container.resolve("authController");
const authRequired = container.resolve("authRequired");
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 */
/**
 * @swagger
 * components:
 *   schemas:
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
 *                   example: wpyx
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
 *                   example: https://res.cloudinary.com/dlja4vnrd/image/upload/v1730346383/default_f2wovz.png
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the user.
 *                   example: true
 *                 role:
 *                   type: string
 *                   description: role of the user "ADMIN", "USER_BASIC" or "USER_PREMIUM".
 *                   example: "ADMIN"
 */
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
 */

router.post(
  "/register",
  apiVersionMiddleware(1),
  validateDTO(registerDTO),
  errorHandler(authController.register)
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: User logged in successfully
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
 *     LoginUser:
 *       type: object
 *       properties:
 *         userNicknameOrEmail:
 *           type: string
 *           description: User's nickname or email address.
 *           example: test10
 *         userPassword:
 *           type: string
 *           description: Password for the user account.
 *           format: password
 *           example: TesteandoEstoxd32+
 */
router.post(
  "/login",
  apiVersionMiddleware(1),
  validateDTO(loginDTO),
  errorHandler(authController.login)
);

/**
 * @swagger
 * /api/v1/auth/verifyToken:
 *   post:
 *     summary: Verify a user's token
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: cookie
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The JWT token to verify.
 *     responses:
 *       200:
 *         description: Token verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid token.
 *       500:
 *         description: Server error.
 */
router.post(
  "/verifyToken",
  apiVersionMiddleware(1),
  errorHandler(authController.verifyToken)
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: cookie
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The JWT token.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Server error.
 */
router.post(
  "/logout",
  apiVersionMiddleware(1),
  authRequired,
  errorHandler(authController.logout)
);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     description: Change the password of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the user.
 *                 example: "TesteandoEstoxd32+"
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "TesteandoEstoxd32+"
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: "Password changed successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   description: The data returned by the operation.
 *                   example: null
 *       401:
 *         description: Unauthorized. The current password is incorrect.
 *       404:
 *         description: Not found. The user does not exist.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.post(
  "/change-password",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(changePasswordV1DTO),
  errorHandler(authController.changePassword)
);

/**
 * @swagger
 * /api/v1/auth/change-email:
 *   post:
 *     summary: Change user email
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     description: Change the email of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentEmail:
 *                 type: string
 *                 description: The current email of the user.
 *                 example: "Uriel_Feest76@yahoo.com"
 *               newEmail:
 *                 type: string
 *                 description: The new email for the user.
 *                 example: "nijoj52035@aleitar.com"
 *     responses:
 *       200:
 *         description: Email change request successful
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
 *                   example: "Revise su correo electronico, enviamos un mensaje para confirmar el cambio de correo"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   description: The data returned by the operation.
 *                   example: null
 *       400:
 *         description: Invalid input, object invalid.
 *       401:
 *         description: Unauthorized. The current email is incorrect.
 *       403:
 *         description: Forbidden. The user is not active.
 *       409:
 *         description: Conflict. The new email is already in use.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.post(
  "/change-email",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(changeEmailV1DTO),
  errorHandler(authController.changeEmail)
);

/**
 * @swagger
 * /api/v1/auth/change-email-confirmed:
 *   post:
 *     summary: Confirm email change
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     description: Confirm the email change for the authenticated user using a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token sent to the new email address.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Email change confirmed successfully
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
 *                   example: "Email changed successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   description: The data returned by the operation.
 *                   example: null
 *       400:
 *         description: Invalid input, object invalid.
 *       401:
 *         description: Unauthorized. The token is invalid or expired.
 *       403:
 *         description: Forbidden. The user is not active.
 *       409:
 *         description: Conflict. The new email is already in use.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.post(
  "/change-email-confirmed",
  apiVersionMiddleware(1),
  authRequired,
  validateDTO(changeEmailConfirmedDTO),
  errorHandler(authController.changeEmailConfirmed)
);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password recovery
 *     tags:
 *       - Auth
 *     description: Request a password recovery email to be sent.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user requesting password recovery.
 *                 example: "nijoj52035@aleitar.com"
 *     responses:
 *       200:
 *         description: Recovery email sent successfully
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
 *                   example: "Revise su correo electronico, enviamos un mensaje para cambiar su contraseña"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   description: The data returned by the operation.
 *                   example: null
 *       400:
 *         description: Invalid input, object invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.post(
  "/forgot-password",
  apiVersionMiddleware(1),
  validateDTO(forgotPasswordV1DTO),
  errorHandler(authController.forgotPassword)
);

/**
 * @swagger
 * /api/v1/auth/forgot-password-email-confirmed:
 *   post:
 *     summary: Confirm password change
 *     tags:
 *       - Auth
 *     description: Confirm the password change for the authenticated user using a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "ProbandoEstaCosa32+"
 *               token:
 *                 type: string
 *                 description: The token received in the recovery email.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: "Password changed successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   description: The data returned by the operation.
 *                   example: null
 *       400:
 *         description: Invalid input, object invalid.
 *       401:
 *         description: Unauthorized. The token is invalid or expired.
 *       403:
 *         description: Forbidden. The user is not active.
 *       500:
 *         description: Internal server error. An error occurred on the server.
 */
router.post(
  "/forgot-password-email-confirmed",
  apiVersionMiddleware(1),
  validateDTO(changePasswordConfirmedV1DTO),
  errorHandler(authController.forgotPasswordEmailConfirmed)
);

export default router;
