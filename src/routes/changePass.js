import { Router } from "express";
import { change_password } from "../controllers/changePass.js";
import { current_user } from "../controllers/currentUser.js";
const router = Router();


router.get("/", current_user);  //http://localhost:3000/api/currentUser
router.post("/", change_password); //http://localhost:3000/api/changePass

export default router;