import { deleteComment } from "../controllers/comments.js";
import {
  getBookCommentsById,
  createComment,
  getCommentById,
  updateComment,
} from "../repositories/BookCommentsRepository.js";

export class BookCommentsService {
  static async getCommentsOfBookById(bookId) {
    const comments = await getBookCommentsById(bookId);
    return comments;
  }

  static async createCommentOfBook({ text, bookId, userId }) {
    const commentId = await createComment(userId, bookId, text);

    const comment = await getCommentById(commentId);
    return comment;
  }

  static async updateComment(id, text) {
    // 1. verify comment exits
    const comment = await getCommentById(id);
    if (!comment) throw new CustomError("Comment not exits", 404);

    // 2. update comment
    const updatedComment = await updateComment(id, text);

    // 3. get comment info
    const updatedCommentInfo = await getCommentById(id);
    return updatedComment;
  }

  static async deleteComment(id) {
    // 1. verify comment exits
    const comment = await getCommentById(id);
    if (!comment) throw new CustomError("Comment not exits", 404);

    // 2. delete comment
    return deleteComment(id);
  }
}
