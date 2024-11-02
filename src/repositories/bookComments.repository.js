import BaseRepository from "./base.repository.js";

export default class BookCommentsRepository extends BaseRepository {
  constructor() {
    super("book_comment");
  }

  async getBookComments(idBook) {
    const comments = await super.executeQuery(
      `
      SELECT
        U.nickname, U.profile_img_path, C.id, C.id_user, C.id_book, C.date_commented, C.text_commented
      FROM users U
      JOIN book_comment C ON U.id = C.id_user
      WHERE id_book = $1
      ORDER BY C.date_commented desc
      `,
      [idBook]
    );

    return comments.lenght > 0 ? comments : [];
  }

  async getCommentById(idComment) {
    return await super.findById(idComment);
  }

  async createComment(text, idBook, idUser) {
    const newComment = await super.create({
      idUser,
      idBook,
      dateCommented: "NOW()",
      textCommented: text,
    });

    return newComment;
  }

  async updateComment(id, text) {
    const updatedComment = await super.update(id, {
      textCommented: text,
      dateCommented: "NOW()",
    });

    return updatedComment;
  }

  async deleteComment(id) {
    await super.executeQuery(`DELETE FROM book_comment WHERE id = $1`, [id]);
  }
}
