import BaseRepository from "./base.repository.js";

export default class BookCommentsRepository extends BaseRepository {
  constructor() {
    super("book_comment");
  }

  async getBookComments(idBook) {
    const comments = await super.executeQuery(
      `
      SELECT
        U.nickname, U.profile_img_path, C.id, C.id_user, C.id_book, C.date_commented, C.text_comment
      FROM users U
      JOIN book_comment C ON U.id = C.id_user
      WHERE id_book = $1
      ORDER BY C.date_commented desc
      `,
      [idBook]
    );

    return comments.rows.lenght > 0 ? comments.rows : [];
  }

  async createComment(idUser, idBook, text) {
    const newComment = await super.executeQuery(
      `INSERT INTO book_comment (id_user, id_book, date_commented, text_commented) VALUES ($1, $2, $3, $4) RETURNING *`,
      [idUser, idBook, "NOW()", text]
    );

    return newComment.rows[0].idcoment;
  }

  async updateComment(id, text) {
    const updatedComment = await super.executeQuery(
      `UPDATE book_comment SET text_commented = $1, date_commented = $2 WHERE id = $3 RETURNING *`,
      [text, "NOW()", id]
    );

    return updatedComment.rows[0];
  }

  async deleteComment(id) {
    await super.executeQuery(`DELETE FROM book_comment WHERE id = $1`, [id]);
  }
}
