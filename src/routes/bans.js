import { Router } from "express";
import { banUser } from "../controllers/bans.js";
import { authMiddleware } from "../middleware/session.js";

const router = Router();

router.post("/", authMiddleware, banUser); //http://localhost:3000/api/bans

export default router;
