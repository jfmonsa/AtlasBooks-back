import { pool } from "../db.js";

export const searchFilterUsers = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res
        .status(400)
        .json({ error: true, message: "Search query is required" });
    }

    // Construye la consulta SQL dinámicamente usando parámetros
    const baseQuery = `
    SELECT
      id, nameu, nickname, email, country, statusu, isadmin
    FROM users
    WHERE
      CAST(id AS TEXT) LIKE $1
      OR nameu ILIKE $1
      OR nickname ILIKE $1
      OR email ILIKE $1
    `;

    // Usa el parámetro con comodines para la búsqueda
    const searchParam = `%${search}%`;

    const result = await pool.query(baseQuery, [searchParam]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: true, message: "No users found" });
    }

    const databook = result.rows.map(row => ({
      id: row.id,
      nameu: row.nameu,
      nickname: row.nickname,
      email: row.email,
      country: row.country,
      statusu: row.statusu,
      isadmin: row.isadmin,
    }));

    res
      .status(200)
      .json({ error: false, message: "Users found", data: databook });
  } catch (err) {
    console.error("Error en la búsqueda de usuarios", err.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
