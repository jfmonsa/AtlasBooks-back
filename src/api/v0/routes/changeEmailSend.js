import { Router } from "express";
import { change_email_send } from "../controllers/changeEmailSend.js";
import { authMiddleware } from "../middleware/session.js";
const router = Router();

router.post("/", authMiddleware, change_email_send); //http://localhost:3000/api/changeEmailSend

export default router;
