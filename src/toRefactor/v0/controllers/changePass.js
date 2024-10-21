import bycript from "bcryptjs";
import { pool } from "../db.js";

export const change_password = async (req, res) => {
  try {
    const { id } = req.user;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (currentPassword === newPassword) {
      throw new Error(
        "New password must be different from the current password"
      );
    }

    const user = await pool.query(`
      SELECT * 
      FROM users 
      WHERE id = $1`, [id]);

    if (user.rows.length === 0) {
      return res.status(400).json("CurrentPassword is incorrect");
    }

    const passwordHash = await bycript.hash(newPassword, 10);

    await pool.query(`
      UPDATE users 
      SET passwordu = $1 
      WHERE id = $2`, [
      passwordHash,
      id,
    ]);
    res.status(200).send({
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err,
    });
  }
};
