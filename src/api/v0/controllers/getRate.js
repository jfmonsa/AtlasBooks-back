import { pool } from "../db.js";

export const getRate = async (req, res) => {
  try {
    const idbook = req.params.idbook;
    const { id } = req.user;

    //Get the rate
    const rate = await pool.query(
      `SELECT ratevalue 
      FROM book_rate 
      WHERE iduser = $1 AND idbook = $2`,
      [id, idbook]
    );

    let response;
    if (rate.rows.length == 0) {
      response = { ratevalue: 0 };
    } else {
      response = rate.rows[0];
    }
    //Return the response
    res.status(200).json(rate.rows);
  } catch (error) {
    console.error("Error getting rate:", error, req.params.idbook);
    //res.status(400).json(["Error getting rate"]);
  }
};
