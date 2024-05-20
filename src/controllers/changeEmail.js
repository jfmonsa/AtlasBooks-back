import { pool } from "../db.js";
import { sendMail } from "../middleware/mailer.js";

export const change_email = async (req, res) => {
  try {
    const { id } = req.user;

    const { currentEmail, newEmail } = req.body;

    if (!currentEmail || !newEmail) {
      throw new Error("All fields are required");
    }

    if (currentEmail === newEmail) {
      throw new Error("New email must be different from the current email");
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      currentEmail,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json("CurrentEmail is incorrect");
    }

    await sendMail(req, res, newEmail);

    //await mailRecived();

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
    });
  }
};
