import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler.js";
import { AuthController } from "../controllers/auth.js";

const router = Router();

router.post("/login", asyncHandler(AuthController.login)); // http://localhost:3000/api/v1/auth/login
router.post("/logout", asyncHandler(AuthController.logout)); // http://localhost:3000/api/v1/auth/logout
router.post("/register", asyncHandler(AuthController.register)); //  http://localhost:3000/api/v1/auth/register
router.post("/verifyToken", asyncHandler(AuthController.verifyToken)); //  http://localhost:3000/api/v1/auth/verifyToken
router.post("/verifyTokenEmail", asyncHandler(AuthController.verifyTokenEmail)); //  http://localhost:3000/api/v1/auth/verifyTokenEmail

export default router;
