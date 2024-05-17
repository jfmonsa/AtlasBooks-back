import { pool } from "../db.js";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import { tokenSign } from "../utils/handleJWT.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, nickName, country, registerDate } = req.body;
    
    //Validate if the fields are empty
    if (!name || !email || !password || !nickName || !country || !registerDate) {
      return res.status(400).json("Missing fields");
    }

    //Encrypt the password
    const passwordHash = await bycript.hash(password, 10);
    
    //Validate if the email already exists
    const errorEmail = await pool.query("SELECT * FROM users WHERE email = $1", [email]); 
    if (errorEmail.rows.length > 0) {
      return res.status(400).json("Email already exists");
    }

    //Validate if the nickname already exists
    const errorNick = await pool.query("SELECT * FROM users WHERE nickname = $1", [nickName]);

    if (errorNick.rows.length > 0) {
      return res.status(400).json("Nickname already exists");
    }


    //Insert the user into the database
    const result = await pool.query(
      "INSERT INTO users (nameu, email, passwordu, nickname, country, registerdate,statusu,isadmin) VALUES ($1, $2, $3, $4,$5, $6,$7,$8)",
      [name, email, passwordHash, nickName, country, registerDate, true, false]
    );
    
    const data = {
      token : await tokenSign(result.rows[0]),
      user : result,
    }

    //Return the response
    res.status(201).json("User created successfully");
    console.log(data)
  } catch (error) {
    console.log(error.message);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate if the fields are empty
    if (!email || !password) {
      return res.status(400).json("Missing fields");
    }

    //Validate if the email exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json("Email or password is incorrect");
    }

    //Validate the password
    const validPassword = await bycript.compare(password, user.rows[0].passwordu);
    if (!validPassword) {
      return res.status(400).json("Email or password is incorrect");
    }

    //Create the token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //Return the response
    res.json({ token });
  } catch (error) {
    console.log(error.message);
  }
  
  res.send("login");
};
