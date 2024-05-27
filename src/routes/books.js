import { Router } from "express";
import { createBook } from "../controllers/books.js";
import { getBook } from "../controllers/getBook.js";
const router = Router();
import multer from "multer";
import { storage } from "../../multer_config.js";

const uploadMiddleware = multer({
  storage,
});

router.get("/:id", getBook);
router.post(
  "/",
  uploadMiddleware.fields([
    { name: "cover", maxCount: 1 },
    { name: "bookFiles", maxCount: 10 },
  ]),
  createBook
);

export default router;
