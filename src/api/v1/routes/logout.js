import { Router } from "express";
import { logout } from "../../v0/controllers/logout.js";
const router = Router();

router.post("/", logout);

export default router;
