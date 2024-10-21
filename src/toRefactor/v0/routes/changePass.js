import { Router } from "express";
import { change_password } from "../controllers/changePass.js";
import { authMiddleware } from "../middleware/session.js";
const router = Router();

router.post("/", authMiddleware, change_password); //http://localhost:3000/api/changePass

export default router;
