import { pool } from "../db.js";
import bycript from "bcryptjs";
import { tokenSign } from "../utils/handleJWT.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate if the fields are empty
    if (!email || !password) {
      return res.status(400).json("Missing fields");
    }

    //Validate if the email exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json("Email or password is incorrect");
    }

    //Validate the password
    const validPassword = await bycript.compare(
      password,
      user.rows[0].passwordu
    );
    if (!validPassword) {
      return res.status(400).json("Email or password is incorrect");
    }

    //Create the token
    const data = {
      token: await tokenSign(user.rows[0]),
      user: user.rows[0],
    };

    //Return the response
    res.json({ data });
  } catch (error) {
    console.log(error.message);
  }
};
