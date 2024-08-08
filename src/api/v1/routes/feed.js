import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler.js";
import { getFeedRecomended } from "../controllers/feed.js";
const router = Router();

router.get("/", asyncHandler(getFeedRecomended));
export default router;
