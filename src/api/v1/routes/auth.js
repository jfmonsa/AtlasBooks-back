import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler.js";
// import controllers
import { login } from "../controllers/login.js";
import { logout } from "../controllers/logout.js";
import { register } from "../controllers/register.js";

const router = Router();

router.post("/login", asyncHandler(login)); // http://localhost:3000/api/v1/auth/login
router.post("/logout", asyncHandler(logout)); // http://localhost:3000/api/v1/auth/logout
router.post("/register", asyncHandler(register)); //  http://localhost:3000/api/v1/auth/register

export default router;
