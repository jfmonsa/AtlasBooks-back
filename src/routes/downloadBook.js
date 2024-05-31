import { Router } from "express";
import { authMiddleware } from "../middleware/session.js";
import { downloadBookFile } from "../controllers/downloadBook.js";

const router = Router();

router.get("/download/:fileName", authMiddleware, downloadBookFile);

export default router;
