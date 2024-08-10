import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler.js";
// import controllers
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { register } from "../controllers/auth/register.js";
import { verify } from "../controllers/auth/verifyToken.js";

const router = Router();

router.post("/login", asyncHandler(login)); // http://localhost:3000/api/v1/auth/login
router.post("/logout", asyncHandler(logout)); // http://localhost:3000/api/v1/auth/logout
router.post("/register", asyncHandler(register)); //  http://localhost:3000/api/v1/auth/register
router.post("/verifyToken", asyncHandler(verify)); //  http://localhost:3000/api/v1/auth/verifyToken

export default router;
