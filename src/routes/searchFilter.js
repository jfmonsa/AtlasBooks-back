import { Router } from "express";
import { search_filter } from "../controllers/searchFilter.js";
const router = Router();

router.get('/', search_filter); 

export default router;