import { Router } from "express";
import { searchFilterUsers } from "../controllers/searchFilterUsers.js";
import { authMiddleware } from "../middleware/session.js";

const router = Router();

router.get("/", authMiddleware, searchFilterUsers);

export default router;
