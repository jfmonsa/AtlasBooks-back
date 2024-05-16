import { Router } from "express";
import { login } from "../controllers/atlas.controller.js";
const router = Router();

router.post("/login", login);

export default router;
