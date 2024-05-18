import { Router } from "express";
import { register } from "../controllers/register.controller.js";

const router = Router();

router.post("/", register); //  http://localhost:3000/api/register


export default router;
