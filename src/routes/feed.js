import { Router } from "express";
import { getFeedRecomended } from "../controllers/feed.js";
const router = Router();

router.get("/", getFeedRecomended);
export default router;
