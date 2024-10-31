import { pool } from "../db.js";

export const change_email_received = async (req, res) => {
  const { id, newEmail } = req.body;

  await pool.query("UPDATE users SET email = $1 WHERE id = $2", [newEmail, id]);
  res.status(200).send({
    message: "Email changed successfully",
  });
};
