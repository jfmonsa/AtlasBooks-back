import { Router } from "express";
import { change_email } from "../controllers/changeEmail.js";
import { authMiddleware } from "../middleware/session.js";
const router = Router();

router.post("/", authMiddleware, change_email); //http://localhost:3000/api/changeEmail

export default router;
