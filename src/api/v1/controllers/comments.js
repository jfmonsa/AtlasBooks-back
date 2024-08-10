import { pool } from "../../../db.js";

export const getComments = async (req, res) => {
  try {
    //We get the id of the book from the parameters (id of the book)
    const bookId = req.params.id;

    let comments = [];

    //We get all the comments from the database that are related to the book
    const commentsQuery = await pool.query(
      `
        SELECT 
            U.nickname, U.pathprofilepic, C.idcoment, C.iduser, C.idbook, C.datec, C.textc 
        FROM users U JOIN book_comment C ON U.id = C.iduser
        WHERE idbook = $1 
        ORDER BY C.datec desc`,
      [bookId]
    );
    //We return the comments
    comments = comments.concat(commentsQuery.rows);
    return comments.map(comment => ({
      idcoment: comment.idcoment,
      iduser: comment.iduser,
      nickname: comment.nickname,
      idbook: comment.idbook,
      date: comment.datec,
      text: comment.textc,
      pathprofilepic: comment.pathprofilepic,
    }));
  } catch (error) {
    console.error("Error getting related books:", error.message);
    return [];
  }
};
export const createComment = async (req, res) => {
  try {
    //On the body of the request, we expect to receive the text of the comment and the id of the book
    const { text, bookId } = req.body;
    //We get the id of the user from the session
    const { id } = req.user;
    //We get the current date
    const date = new Date();

    let newComment = [];
    //We insert the comment into the database
    const newCommentQuery = await pool.query(
      `
    INSERT INTO book_comment (iduser, idbook, datec, textc) 
    VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, bookId, date, text]
    );
    //We return the comment that was created
    const newCommentQuery2 = await pool.query(
      `
    SELECT
        U.nickname, U.pathprofilepic, C.idcoment, C.iduser, C.idbook, C.datec, C.textc
    FROM users U JOIN book_comment C ON U.id = C.iduser
    WHERE C.idcoment = $1`,
      [newCommentQuery.rows[0].idcoment]
    );

    //const allComments = await getComments(req, res);
    //We return the comment that was created
    newComment = newComment.concat(newCommentQuery2.rows[0]);
    const result = res.send({
      idcoment: newComment[0].idcoment,
      iduser: newComment[0].iduser,
      nickname: newComment[0].nickname,
      idbook: newComment[0].idbook,
      date: newComment[0].datec,
      text: newComment[0].textc,
      pathprofilepic: newComment[0].pathprofilepic,
    });
  } catch (error) {
    res.status(500).send([error.message]);
  }
};

export const updateComment = async (req, res) => {
  try {
    //We get the id of the comment from the parameters (id of the comment)
    const { id } = req.params;
    //We get the text of the comment from the body of the request
    const { text } = req.body;
    //We get the current date
    const newDate = new Date();
    let newComment = [];
    //We search for the comment in the database
    const { rows } = await pool.query(
      "SELECT * FROM book_comment WHERE idcoment = $1",
      [id]
    );
    //If the comment does not exist, we return an error
    if (rows.length === 0) {
      return res.status(404).send(["Comment not found"]);
    }
    //We update the comment in the database
    const updatedRows = await pool.query(
      "UPDATE book_comment SET textc = $1, datec = $2 WHERE idcoment = $3 RETURNING *",
      [text, newDate, id]
    );

    //We return the comment that was updated
    const newCommentQuery2 = await pool.query(
      `
    SELECT
        U.nickname, U.pathprofilepic, C.idcoment, C.iduser, C.idbook, C.datec, C.textc
    FROM users U JOIN book_comment C ON U.id = C.iduser
    WHERE C.idcoment = $1`,
      [id]
    );

    //We return the comment that was created
    newComment = newComment.concat(newCommentQuery2.rows[0]);
    res.send({
      idcoment: newComment[0].idcoment,
      iduser: newComment[0].iduser,
      nickname: newComment[0].nickname,
      idbook: newComment[0].idbook,
      date: newComment[0].datec,
      text: newComment[0].textc,
      pathprofilepic: newComment[0].pathprofilepic,
    });
  } catch (error) {
    res.status(500).send([error.message]);
  }
};
export const deleteComment = async (req, res) => {
  try {
    //We get the id of the comment from the parameters (id of the comment)
    const { id } = req.params;
    //We search for the comment in the database
    const { rows } = await pool.query(
      "SELECT * FROM book_comment WHERE idcoment = $1",
      [id]
    );
    //If the comment does not exist, we return an error
    if (rows.length === 0) {
      return res.status(404).send(["Comment not found"]);
    }
    //We delete the comment from the database
    await pool.query(
      "DELETE FROM book_comment WHERE idcoment = $1 RETURNING *",
      [id]
    );
    //We return the comment that was deleted
    res.status(200).send(["Comment deleted successfully"]);
  } catch (error) {
    res.status(500).send([error.message]);
  }
};
