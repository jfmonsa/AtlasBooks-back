import { Router } from "express";
import { searchFilter } from "../controllers/searchFilter.js";
const router = Router();

router.get('/', searchFilter); 

export default router;