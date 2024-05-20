import { Router } from "express";
import { authMiddleware } from "../middleware/session.js";
import {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.js";

const router = Router();

router.get("/:bookId", authMiddleware, getComments); // GET http://localhost:3000/api/comments/{bookId}
router.get("/:id", authMiddleware, getComment); // Creo que mas adelante esta ruta va a desaparecer
router.post("/", authMiddleware, createComment); // POST http://localhost:3000/api/comments/
router.put("/:id", authMiddleware, updateComment); // PUT http://localhost:3000/api/comments/{commentId}
router.delete("/:id", authMiddleware, deleteComment); // DELETE http://localhost:3000/api/comments/{commentid}

export default router;
