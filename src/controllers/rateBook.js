import { pool } from "../db.js";

export const rateBook = async (req, res) => {
  try {
    const { idbook, rate } = req.body;
    const { id } = req.user;

    //Validate if the user has already rated the book
    const rated = await pool.query(
      "SELECT * FROM book_rate WHERE iduser = $1 AND idbook = $2",
      [id, idbook]
    );

    //If the user has already rated the book
    if (rated.rows.length > 0) {
      //Update the rate
      await pool.query(
        "UPDATE book_rate SET ratevalue = $1 WHERE iduser = $2 AND idbook = $3",
        [rate, id, idbook]
      );
    } else {
      //Insert the rate
      await pool.query(
        "INSERT INTO book_rate (iduser, idbook, ratevalue) VALUES ($1, $2, $3)",
        [id, idbook, rate]
      );
    }
    //Return the response
    res.status(200).json(["Rating sent successfully"]);
  } catch (error) {
    console.error("Error getting rate:", error.message);
    res.status(400).json(["Error getting rate"]);
  }
};

export const getRate = async (req, res) => {
  try {
    const  idbook  = req.params.idbook;
    const { id } = req.user;
    
    //Get the rate
    const rate = await pool.query(
      "SELECT ratevalue FROM book_rate WHERE iduser = $1 AND idbook = $2",
      [id, idbook]
    )

    //Return the response
    res.status(200).json(rate.rows);
  } catch (error) {
    console.error("Error getting rate:", error, req.params.idbook);
    //res.status(400).json(["Error getting rate"]);
  }
};