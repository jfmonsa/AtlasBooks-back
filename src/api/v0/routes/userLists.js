import { Router } from "express";
import { userLists} from "../controllers/userLists.js";

const router = Router();

router.get('/', userLists); 

export default router;