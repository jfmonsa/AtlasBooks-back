import { Router } from "express";
import { deleteAccount } from "../controllers/deleteAccount.controller.js";
import { authMiddleware } from "../middleware/session.js";
const router = Router();

router.post("/", authMiddleware, deleteAccount); //http://localhost:3000/api/deleteAccount

export default router;
