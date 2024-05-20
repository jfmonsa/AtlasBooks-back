import { pool } from "../db.js";
import bycript from "bcryptjs";
import { tokenSign } from "../utils/handleJWT.js";

export const login = async (req, res) => {
  try {
    const { userNickname, userPassword } = req.body;

    //Validate if the fields are empty
    if (!userNickname || !userPassword) {
      return res.status(400).json(["Missing fields"]);
    }

    //Validate if the userNickname exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1 or nickname = $1", [
      userNickname,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json(["userNickname or password is incorrect"]);
    }

    //Validate if the user is active
    if (!user.rows[0].statusu) {
      return res.status(400).json(["The user does not exist "]);
    }

    //Validate the password
    const validPassword = await bycript.compare(
      userPassword,
      user.rows[0].passwordu
    );
    if (!validPassword) {
      return res.status(400).json(["userNickname or password is incorrect"]);
    }

    //Create the token
    const token = await tokenSign(user.rows[0]);
    // //Create the cookie
    res.cookie("token", token);

    //select information from the user
    const dataUser = {
      id: user.rows[0].id,
      name: user.rows[0].nameu,
      userNickname: user.rows[0].userNickname,
      nickname: user.rows[0].nickname,
      country: user.rows[0].country,
      registerDate: user.rows[0].registerdate,
      isAdmin: user.rows[0].isadmin,
      pathProfilePic: user.rows[0].pathprofilepic,
    };


    //Return the response
    res.status(200).json(dataUser);
  } catch (error) {
    res.status(400).json(['Error login in user']);
  }
};


