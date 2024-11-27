import { NotFoundError, UnauthorizedError } from "../../helpers/exeptions.js";

export default class BookCommentsService {
  #bookCommentsRepository;
  #bookService;

  constructor({ bookCommentsRepository, bookService }) {
    this.#bookCommentsRepository = bookCommentsRepository;
    this.#bookService = bookService;
  }

  async getCommentsOfBook(bookId) {
    await this.#bookService.verifyBookExists(bookId);
    const comments = await this.#bookCommentsRepository.getBookComments(bookId);
    console.log("comments", comments);
    return comments;
  }

  async createCommentOfBook(text, bookId, userId) {
    await this.#bookService.verifyBookExists(bookId);
    const newComment = await this.#bookCommentsRepository.createComment(
      text,
      bookId,
      userId
    );
    return newComment;
  }

  async updateComment(text, commentId, userId) {
    await this.#validateBeforeCommentModification(commentId, userId);

    const newComment = await this.#bookCommentsRepository.updateComment(
      commentId,
      text
    );
    return newComment;
  }

  async deleteComment(commentId, userId) {
    await this.#validateBeforeCommentModification(commentId, userId);
    await this.#bookCommentsRepository.deleteComment(commentId, userId);
  }

  async #validateBeforeCommentModification(commentId, userId) {
    const comment =
      await this.#bookCommentsRepository.getCommentById(commentId);

    if (!comment) {
      throw new NotFoundError("Comment not Exists");
    }

    if (comment.idUser !== userId) {
      throw new UnauthorizedError("You can't modify this comment");
    }
  }
}
