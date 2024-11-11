import { HTTP_CODES } from "../../helpers/httpCodes.js";

export default class BookCommentsController {
  #bookCommentsService;

  constructor({ bookCommentsService }) {
    this.#bookCommentsService = bookCommentsService;

    this.getCommentsOfBook = this.getCommentsOfBook.bind(this);
    this.createCommentOfBook = this.createCommentOfBook.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async getCommentsOfBook(req, res) {
    const { bookId } = req.params;

    const comments = await this.#bookCommentsService.getCommentsOfBook(bookId);

    res.formatResponse(comments);
  }

  async createCommentOfBook(req, res) {
    const { text, bookId } = req.body;
    const { id: userId } = req.user;

    const newComment = await this.#bookCommentsService.createCommentOfBook(
      text,
      bookId,
      userId
    );

    res.formatResponse(
      newComment,
      "Comment created successfully",
      HTTP_CODES.CREATED
    );
  }

  async updateComment(req, res) {
    const { text, commentId } = req.body;
    const { id: userId } = req.user;

    const newComment = await this.#bookCommentsService.updateComment(
      text,
      commentId,
      userId
    );

    res.formatResponse(newComment, "Comment updated successfully");
  }

  async deleteComment(req, res) {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    await this.#bookCommentsService.deleteComment(commentId, userId);

    res.formatResponse(null, "Comment deleted successfully");
  }
}
