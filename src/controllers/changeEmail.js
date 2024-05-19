import bycript from "bcryptjs";
import { pool } from "../db.js";
//Coautor Juan David Cataño
export const change_email = async (req, res) => {
  try {
    const { id } = req.user;

    const { currentEmail, newEmail } = req.body;

    if (!currentEmail || !newEmail) {
      throw new Error("All fields are required");
    }

    if (currentEmail === newEmail) {
      throw new Error("New email must be different from the current password");
    }

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (user.rows.length === 0) {
      return res.status(400).json("CurrentEmail is incorrect");
    }

    await pool.query("UPDATE users SET email = $1 WHERE id = $2", [
      newEmail,
      id,
    ]);
    res.status(200).send({
      message: "Email changed successfully",
    });
  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err,
    });
  }
};
