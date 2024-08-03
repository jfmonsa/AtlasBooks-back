import bycript from "bcryptjs";
import { pool } from "../db.js";
import { tokenSign } from "../../v0/utils/handleJWT.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, nickName, country } = req.body;

    //Validate if the fields are empty
    if (!name || !email || !password || !nickName || !country) {
      return res.status(400).json(["Missing fields"]);
    }

    //Encrypt the password
    const passwordHash = await bycript.hash(password, 10);

    //Validate if the email already exists
    const errorEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (errorEmail.rows.length > 0) {
      return res.status(400).json(["Email already exists"]);
    }

    //Validate if the nickname already exists
    const errorNick = await pool.query(
      "SELECT * FROM users WHERE nickname = $1",
      [nickName]
    );

    if (errorNick.rows.length > 0) {
      return res.status(400).json(["Nickname already exists"]);
    }

    //Get the current date
    const registerDate = new Date(Date.now());

    //Insert the user into the database
    const result = await pool.query(
      `
      INSERT INTO users (
        nameu, email, passwordu, nickname, country, registerdate, statusu, isadmin, pathprofilepic
      ) 
      VALUES ($1, $2, $3, $4,$5, $6,$7,$8,$9) returning *`,
      [
        name,
        email,
        passwordHash,
        nickName,
        country,
        registerDate,
        true,
        false,
        "../storage/usersProfilePic/default.webp",
      ]
    );

    //Create default list for the user
    await pool.query(
      `INSERT INTO book_list 
        (title, descriptionl, datel, idusercreator, ispublic) 
      VALUES ($1, $2, $3, $4, $5)`,

      [
        "Me Gusta",
        "Aqui se muestran los libros a los que les has dado 'me gusta'.",
        registerDate,
        result.rows[0].id,
        false,
      ]
    );

    const newUser = {
      id: result.rows[0].id,
      name: result.rows[0].nameu,
      email: result.rows[0].email,
      nickname: result.rows[0].nickname,
      country: result.rows[0].country,
      registerDate: result.rows[0].registerdate,
      status: result.rows[0].statusu,
      isAdmin: result.rows[0].isadmin,
      pathProfilePic: result.rows[0].pathprofilepic,
    };

    //Create the token
    const token = await tokenSign(result.rows[0]);
    // //Create the cookie
    res.cookie("token", token);

    //Return the response
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json(["Error creating the user"]);
  }
};
