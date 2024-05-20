import { pool } from "../db.js";

export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.user;

    await pool.query("UPDATE users SET statusu = $1 WHERE id = $2", [
      false,
      id,
    ]);
    res.status(200).send({
      message: "Account deleted successfully",
    });
  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err,
    });
  }
};
