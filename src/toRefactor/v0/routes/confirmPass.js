import { Router } from "express";
import { authMiddleware } from "../middleware/session.js";
import { confirmPass } from "../controllers/confirmPass.js";

const router = Router();

router.post("/", authMiddleware, confirmPass); //http://localhost:3000/api/confirmPass

export default router;
