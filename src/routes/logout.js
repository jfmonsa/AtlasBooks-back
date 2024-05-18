import { Router } from "express";
import { logout } from "../controllers/logout";

router.post('/logout', logout);

export default router;