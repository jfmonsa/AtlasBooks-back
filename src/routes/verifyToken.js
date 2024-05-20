import { Router } from "express";
import { verify } from "../controllers/verifyToken.js";

const router = Router();

router.get("/", verify); // http://localhost:3000/api/verifyToken

export default router;
