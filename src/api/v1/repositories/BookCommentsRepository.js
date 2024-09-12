import { pool } from "../../../db.js";

export const getBookCommentsById = async bookId => {
  const query = `
        SELECT 
            U.nickname, U.pathprofilepic, C.idcoment, C.iduser, C.idbook, C.datec, C.textc 
        FROM users U JOIN book_comment C ON U.id = C.iduser
        WHERE idbook = $1 
        ORDER BY C.datec desc`;

  const commentsQuery = await pool.query(query, [bookId]);

  //Format
  return commentsQuery.rows.map(comment => ({
    idcoment: comment.idcoment,
    iduser: comment.iduser,
    nickname: comment.nickname,
    idbook: comment.idbook,
    date: comment.datec,
    text: comment.textc,
    pathprofilepic: comment.pathprofilepic,
  }));
};

export const createComment = async (userId, bookId, text) => {
  const query = `
    INSERT INTO book_comment (iduser, idbook, datec, textc) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await pool.query(query, [userId, bookId, new Date(), text]);
  return result.rows?.[0].idcoment;
};

export const getCommentById = async commentId => {
  const query = `
    SELECT 
        U.nickname, U.pathprofilepic, C.idcoment, C.iduser, C.idbook, C.datec, C.textc 
    FROM users U JOIN book_comment C ON U.id = C.iduser
    WHERE C.idcoment = $1`;

  const commentQuery = await pool.query(query, [commentId]);

  if (commentQuery.rows.length === 0) return null;

  const comment = commentQuery.rows[0];
  return {
    idcoment: comment.idcoment,
    iduser: comment.iduser,
    nickname: comment.nickname,
    idbook: comment.idbook,
    date: comment.datec,
    text: comment.textc,
    pathprofilepic: comment.pathprofilepic,
  };
};

export const updateComment = async (id, text) => {
  const newDate = new Date();
  const updatedRows = await pool.query(
    "UPDATE book_comment SET textc = $1, datec = $2 WHERE idcoment = $3 RETURNING *",
    [text, newDate, id]
  );

  return updatedRows.rows?.[0];
};

export const deleteComment = async id => {
  const query = "DELETE FROM book_comment WHERE idcoment = $1";
  await pool.query(query, [id]);
};
