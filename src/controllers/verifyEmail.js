import { pool } from "../db.js";
import {  sendMailRecovery } from "../middleware/mailer.js";

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const url = "newPassword";

    //Validate if the email exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    //Validate if the user is active
    if (!user.rows[0].statusu) {
        return res.status(400).json(["The user does not exist "]);
    }
    //Create the token
    await sendMailRecovery(req, res, user.rows[0].id ,email, url);

  } catch (err) {
    return res.status(400).send({
      message: err.message,
    });
  }
};
