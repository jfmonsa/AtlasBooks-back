import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler.js";
import { createBook } from "../controllers/books/createBook.js";
import { getBook } from "../controllers/books/getBook.js";
import { uploadMiddleware } from "../middlewares/multer.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

router.get("/:id", asyncHandler(getBook)); // http://localhost:3000/api/v1/books/:id

router.post(
  "/",
  // authRequired,
  uploadMiddleware.fields([
    { name: "cover", maxCount: 1 },
    { name: "bookFiles", maxCount: 10 },
  ]),
  createBook
); // http://localhost:3000/api/v1/books/

export default router;
