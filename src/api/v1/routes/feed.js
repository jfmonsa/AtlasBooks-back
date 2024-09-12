import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler.js";
import { UserFeedController } from "../controllers/feed.js";
const router = Router();

router.get("/", asyncHandler(UserFeedController.getFeedRecomendedForUser));
export default router;
