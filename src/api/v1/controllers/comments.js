import { pool } from "../../../db.js";
import { BookCommentsService } from "../services/comments.js";

export class BookCommentsController {
  static async getCommentsOfBookById(req, res) {
    const bookId = req.params.id;

    const comments = await BookCommentsService.getCommentsOfBookById(bookId);
    res.status(200).success(comments);
  }

  static async createCommentOfBook(req, res) {
    const { text, bookId } = req.body;
    const { id } = req.user;

    const comment = await BookCommentsService.createCommentOfBook({
      text,
      bookId,
      userId: id,
    });

    res.status(201).success(comment);
  }

  static async updateComment(req, res) {
    // get the id of the comment from the parameters
    const { id } = req.params;
    // updated text of the comment
    const { text } = req.body;

    const comment = await BookCommentsService.updateComment(id, text);

    res.status(200).success(comment);
  }

  static async deleteComment(req, res) {
    //We get the id of the comment from the parameters (id of the comment)
    const { id } = req.params;

    await BookCommentsService.deleteComment(id);
  }
}

export const deleteComment = async (req, res) => {
  try {
    //We delete the comment from the database

    //We return the comment that was deleted
    res.status(200).send(["Comment deleted successfully"]);
  } catch (error) {
    res.status(500).send([error.message]);
  }
};
