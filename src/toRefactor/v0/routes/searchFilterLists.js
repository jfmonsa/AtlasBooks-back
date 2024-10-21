import { Router } from "express";
import { search_filter_lists } from "../controllers/searchFilterLists.js";

const router = Router();

router.get("/", search_filter_lists);

export default router;
