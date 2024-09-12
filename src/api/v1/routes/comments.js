import { Router } from "express";
import { authRequired } from "../middlewares/authRequired.js";
import { BookCommentsController } from "../controllers/comments.js";
import asyncHandler from "../../../utils/asyncHandler.js";

const router = Router();

router.get("/:id", asyncHandler(BookCommentsController.getCommentsOfBookById));
router.post(
  "/",
  authRequired,
  asyncHandler(BookCommentsController.createCommentOfBook)
);
router.put(
  "/:id",
  authRequired,
  asyncHandler(BookCommentsController.updateComment)
);
router.delete(
  "/:id",
  authRequired,
  asyncHandler(BookCommentsController.deleteComment)
);

export default router;
