import { pool } from "../db.js";

export const search_filter_lists = async (req, res) => {
  try {
    const { listN } = req.query; // Usa req.query para parámetros de consulta

    const list = await pool.query(
      "SELECT * FROM BOOK_LIST WHERE title ILIKE $1", // Usa $1 directamente en la consulta
      [`%${listN}%`] // Pasa el valor con los % en el array de valores
    );

    if (list.rows.length === 0) {
      return res.status(400).json({ error: true, message: "No lists found" });
    }

    res
      .status(200)
      .json({ error: false, message: "Lists found", data: list.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
