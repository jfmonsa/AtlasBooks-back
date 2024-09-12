import { pool } from "../../../db.js";

export const getRate = async (userId, bookId) => {
  const rated = await pool.query(
    "SELECT * FROM book_rate WHERE iduser = $1 AND idbook = $2",
    [userId, bookId]
  );

  return rated.rows.length > 0 ? rated.rows[0].ratevalue : null;
};

//Update the rate
export const updateRate = async (userId, bookId, rate) => {
  await pool.query(
    `UPDATE book_rate SET ratevalue = $1 WHERE iduser = $2 AND idbook = $3`,
    [rate, userId, bookId]
  );
};

//Insert the rate
export const insertRate = async (userId, bookId, rate) => {
  await pool.query(
    `INSERT INTO book_rate (iduser, idbook, ratevalue) VALUES ($1, $2, $3)`,
    [userId, bookId, rate]
  );
};
