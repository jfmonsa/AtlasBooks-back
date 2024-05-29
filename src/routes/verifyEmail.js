import { Router } from "express";
//import {  } from "../controllers/recoveryAccount.controller.js";
import { verifyEmail } from "../controllers/verifyEmail.js";

const router = Router();

router.post("/", verifyEmail); //  http://localhost:3000/api/veryfyEmail

export default router;