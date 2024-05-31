import express from "express";
import {
  getCategoriesAndSubCategoriesGroupped,
  getAllSubcategories,
} from "../controllers/categories.js";

const router = express.Router();

router.get("/groupped", getCategoriesAndSubCategoriesGroupped);
router.get("/", getAllSubcategories);

export default router;
