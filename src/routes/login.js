import { Router } from "express";
import { login } from "../controllers/login.controller.js";
const router = Router();

router.post("/", login); // http://localhost:3000/api/login

export default router;
