import { pool } from "../db.js";
import { sendMail } from "../middleware/mailer.js";

export const change_email_send = async (req, res) => {
  try {
    const { id } = req.user;

    const { currentEmail, newEmail } = req.body;

    if (!currentEmail || !newEmail) {
      throw new Error("All fields are required");
    }

    if (currentEmail === newEmail) {
      throw new Error("New email must be different from the current email");
    }

    const userCurrentEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1 and id = $2",
      [currentEmail, id]
    );

    if (userCurrentEmail.rows.length === 0) {
      return res.status(400).json("CurrentEmail is incorrect");
    }

    const userNewEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [newEmail]
    );

    if (userNewEmail.rows.length != 0) {
      return res.status(400).json("NewEmail already in use by another user");
    }

    await sendMail(req, res, newEmail);

    res.status(200).send({
      message: "Email enviado",
    });
  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
};
