import bycript from "bcryptjs";
import { pool } from "../db.js";
import { tokenSign } from "../utils/handleJWT.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, nickName, country, registerDate } = req.body;

    //Validate if the fields are empty
    if (
      !name ||
      !email ||
      !password ||
      !nickName ||
      !country ||
      !registerDate
    ) {
      return res.status(400).json("Missing fields");
    }

    //Encrypt the password
    const passwordHash = await bycript.hash(password, 10);

    //Validate if the email already exists
    const errorEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (errorEmail.rows.length > 0) {
      return res.status(400).json("Email already exists");
    }

    //Validate if the nickname already exists
    const errorNick = await pool.query(
      "SELECT * FROM users WHERE nickname = $1",
      [nickName]
    );

    if (errorNick.rows.length > 0) {
      return res.status(400).json("Nickname already exists");
    }

    //Insert the user into the database
    const result = await pool.query(
      "INSERT INTO users (nameu, email, passwordu, nickname, country, registerdate,statusu,isadmin) VALUES ($1, $2, $3, $4,$5, $6,$7,$8) returning *",
      [name, email, passwordHash, nickName, country, registerDate, true, false]
    );

    // //Create the token
    const data = {
      token: await tokenSign(result.rows[0]),
      user: result.rows[0],
    };

    //Return the response
    res.status(201).json("User created successfully");
    console.log(data);
  } catch (error) {
    console.log(error.message);
  }
};
