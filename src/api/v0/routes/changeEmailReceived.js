import { Router } from "express";
import { change_email_received } from "../controllers/changeEmailReceived.js";
const router = Router();

router.post("/", change_email_received); //http://localhost:3000/api/changeEmailReceived

export default router;
