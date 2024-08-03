import { Router } from "express";
//import {  } from "../controllers/recoveryAccount.controller.js";
import { createNewPass } from "../controllers/createNewPass.js";

const router = Router();

router.post("/", createNewPass); //  http://localhost:3000/api/veryfyEmail

export default router;