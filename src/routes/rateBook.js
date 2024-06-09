import { Router } from "express";
import { rateBook } from "../controllers/rateBook.js";
import { authMiddleware } from "../middleware/session.js";

const router = Router();

router.post("/", authMiddleware ,rateBook); //  http://localhost:3000/api/reports


export default router;