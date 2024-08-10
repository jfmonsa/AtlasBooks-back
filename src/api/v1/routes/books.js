import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler.js";
import { uploadMiddleware } from "../middlewares/multer.js";
import { authRequired } from "../middlewares/authRequired.js";
// controllers
import { createBook } from "../controllers/books/createBook.js";
import { getBook } from "../controllers/books/getBook.js";
import { downloadBookFile } from "../controllers/books/downloadBook.js";
const router = Router();

router.get("/:id", asyncHandler(getBook)); // http://localhost:3000/api/v1/books/:id

router.post(
  "/",
  authRequired,
  uploadMiddleware.fields([
    { name: "cover", maxCount: 1 },
    { name: "bookFiles", maxCount: 10 },
  ]),
  asyncHandler(createBook)
); // http://localhost:3000/api/v1/books/

router.post("/:fileName", /*authMiddleware,*/ asyncHandler(downloadBookFile)); // http://localhost:3000/api/v1/books/:fileName

/*
router.post("/", authMiddleware, rateBook); //  http://localhost:3000/api/rateBook
router.get("/:idbook", authMiddleware, getRate); //  http://localhost:3000/api/reports
*/

export default router;
