import express from "express";
import {
  getCategoriesAndSubCategoriesGroupped,
  getSubCategoriesOfCategory,
  getCategories,
} from "../controllers/categories.js";

const router = express.Router();

router.get("/groupped", getCategoriesAndSubCategoriesGroupped);
router.get("/onlyCategories", getCategories);
router.get("/:idCat", getSubCategoriesOfCategory);

export default router;
