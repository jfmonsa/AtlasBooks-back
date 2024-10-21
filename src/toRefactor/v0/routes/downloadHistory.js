import { Router } from "express";
import { downloadHistory } from "../controllers/downloadHistory.js";


const router = Router();

router.get("/", downloadHistory);

export default router;