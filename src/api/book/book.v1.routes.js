import { Router } from "express";
import container from "../../config/di-container.js";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler.js";
import apiVersionMiddleware from "../../middlewares/apiVersionMiddleware.js";
// not required now
//import { authRequired } from "../middlewares/authRequired.js";
// controllers

const router = Router({ mergeParams: true });
const bookController = container.resolve("bookController");

// /api/v1/books/:id
router.get(
  "/:id",
  apiVersionMiddleware(1),
  asyncErrorHandler(bookController.getById)
);

// /api/v1/books/
router.post(
  "/",
  //authRequired,
  /*uploadMiddleware.fields([
    { name: "cover", maxCount: 1 },
    { name: "bookFiles", maxCount: 10 },
  ]),*/
  asyncErrorHandler(bookController.create)
);

// /api/v1/books/:fileName
router.post(
  "/:fileName",
  //authRequired,
  asyncErrorHandler(bookController.download)
);

// TODO: revisar esto
//router.post("/", authRequired, rateBook); //  /api/rateBook
// TODO: revisar esto
//router.get("/:idbook", authRequired, getRate); //  /api/

export default router;
