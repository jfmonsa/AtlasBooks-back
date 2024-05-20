import { pool } from "../db.js";
import bycript from "bcryptjs";
import { deleteAccount } from "./deleteAccount.controller.js";

export const confirmPass = async (req, res) => {
  try {
    const { confirmPassword } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (!confirmPassword) {
      throw new Error("All fields are required");
    }

    const validPassword = await bycript.compare(
      confirmPassword,
      user.rows[0].passwordu
    );

    if (validPassword) {
      deleteAccount(req, res);
    }

    if (!validPassword) {
      return res.status(400).json("Incorrect password");
    }
  } catch (error) {
    return res.status(400).send({
      message: error.message,
      data: error,
    });
  }
};
