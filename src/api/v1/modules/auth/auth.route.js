import { Router } from "express";
import asyncHandler from "../../../../utils/asyncHandler.js";
import { AuthController } from "./auth.controller.js";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - nickName
 *         - country
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         password:
 *           type: string
 *           description: Password of the user, must have 1 uppercase, 1 lowercase, 1 number, 1 special character and at least 8 characters
 *         nickName:
 *           type: string
 *           description: nickname of the user
 *         country:
 *          type: string
 *          description: country of the user in format ISO31661Alpha2 (2 digits) ex CO for Colombia
 *       example:
 *         name: test 1
 *         email: test1@mail.com
 *         password: Justanexample313+
 *         nickName: test1
 *         country: CO
 */
router.post("/register", asyncHandler(AuthController.register)); //  /api/v1/auth/register
// router.post("/login", asyncHandler(AuthController.login)); // /api/v1/auth/login
// router.post("/logout", asyncHandler(AuthController.logout)); // /api/v1/auth/logout
// router.post("/verifyToken", asyncHandler(AuthController.verifyToken)); //  /api/v1/auth/verifyToken
// router.post("/verifyTokenEmail", asyncHandler(AuthController.verifyTokenEmail)); //  /api/v1/auth/verifyTokenEmail

export default router;
