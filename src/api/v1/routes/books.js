import { Router } from "express";
import asyncHandler from "../../../utils/asyncHandler.js";
//import { uploadMiddleware } from "../middlewares/multer.js";
// not required now
import { authRequired } from "../middlewares/authRequired.js";
// controllers
import { BooksController } from "../controllers/books.js";
const router = Router();

// /api/v1/books/:id
router.get("/:id", asyncHandler(BooksController.getById));

// /api/v1/books/
router.post(
  "/",
  authRequired,
  /*uploadMiddleware.fields([
    { name: "cover", maxCount: 1 },
    { name: "bookFiles", maxCount: 10 },
  ]),*/
  asyncHandler(BooksController.create)
);

// /api/v1/books/:fileName
router.post("/:fileName", authRequired, asyncHandler(BooksController.download));

router.post("/", authRequired, rateBook); //  /api/rateBook
router.get("/:idbook", authRequired, getRate); //  /api/

export default router;
