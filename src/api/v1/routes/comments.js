import { Router } from "express";
import { authRequired } from "../middlewares/authRequired.js";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.js";

const router = Router();

router.get("/:id", getComments); // GET http://localhost:3000/api/comments/
router.post("/", authRequired, createComment); // POST http://localhost:3000/api/comments/
router.put("/:id", authRequired, updateComment); // PUT http://localhost:3000/api/comments/{commentId}
router.delete("/:id", authRequired, deleteComment); // DELETE http://localhost:3000/api/comments/{commentid}

export default router;
