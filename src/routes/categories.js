import express from "express";
import {
  getCategoriesAndSubCategoriesGroupped,
  getCategoriesAndSubCategoriesUngroupped,
} from "../controllers/categories.js";

const router = express.Router();

router.get("/groupped", getCategoriesAndSubCategoriesGroupped);
router.get("/", getCategoriesAndSubCategoriesUngroupped);

export default router;
