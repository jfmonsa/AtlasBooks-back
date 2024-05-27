import { Router } from "express";
import { verifyEmail } from "../controllers/verifyToken.js";

const router = Router();

router.post("/", verifyEmail); // http://localhost:3000/api/verifyTokenEmail

export default router;
