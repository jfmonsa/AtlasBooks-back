import { Router } from "express";
import { desBanUser } from "../controllers/bans.js";
import { authMiddleware } from "../middleware/session.js";

const router = Router();

router.post("/", authMiddleware, desBanUser); //http://localhost:3000/api/desBans

export default router;
