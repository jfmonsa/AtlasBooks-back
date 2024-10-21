import { pool } from "../db.js";

export const search_filter_lists = async (req, res) => {
  try {
    const { listN } = req.query; // Usa req.query para parámetros de consulta

    let baseQuery = `
            SELECT
                book_list.id,
                book_list.title,
                book_list.descriptionL,
                book_list.dateL,
                book_list.isPublic,
                book_list.idUserCreator
            FROM book_list
        `;

    let conditions = [];
    let params = [];

    if (listN) {
      conditions.push(`(
                book_list.title ILIKE $${conditions.length + 1}
                OR book_list.descriptionL ILIKE $${conditions.length + 1}
            )`);
      params.push(`%${listN}%`);
    }

    if (conditions.length > 0) {
      baseQuery += " WHERE " + conditions.join(" AND ");
    }

    const list = await pool.query(baseQuery, params);

    if (list.rows.length === 0) {
      return res.status(400).json({ error: true, message: "No lists found" });
    }

    const datalist = list.rows.map((row) => ({
      id: row.id,
      title: row.title,
      descriptionL: row.descriptionl,
      dateL: row.datel,
      isPublic: row.ispublic,
      idUserCreator: row.idusercreator,
    }));

    res.status(200).json({ message: "Lists found", data: datalist });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
