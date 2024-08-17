import { pool } from "../../../db.js";

export const getBookComments = async bookId => {
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
