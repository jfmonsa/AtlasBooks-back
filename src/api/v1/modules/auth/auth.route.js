import { Router } from "express";
import asyncHandler from "../../../../utils/asyncHandler.js";
import { AuthController } from "./auth.controller.js";

const router = Router();
router.post("/register", asyncHandler(AuthController.register)); //  /api/v1/auth/register
// router.post("/login", asyncHandler(AuthController.login)); // /api/v1/auth/login
// router.post("/logout", asyncHandler(AuthController.logout)); // /api/v1/auth/logout
// router.post("/verifyToken", asyncHandler(AuthController.verifyToken)); //  /api/v1/auth/verifyToken
// router.post("/verifyTokenEmail", asyncHandler(AuthController.verifyTokenEmail)); //  /api/v1/auth/verifyTokenEmail

export default router;
