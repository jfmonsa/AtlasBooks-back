import { pool } from "../../../db.js";
import bycript from "bcryptjs";
import { CustomError } from "../middlewares/errorMiddleware.js";
import { createAccessToken } from "../../../utils/handleJWT.js";

export const login = async (req, res) => {
  const { userNickname, userPassword } = req.body;

  //Validate if the fields are empty
  if (!userNickname || !userPassword) {
    throw new CustomError("Missing fields", 400);
  }

  //Validate if the userNickname exists
  const user = await pool.query(
    "SELECT * FROM users WHERE email = $1 or nickname = $1",
    [userNickname]
  );

  if (user.rows.length === 0) {
    throw new CustomError("userNickname or password is incorrect", 400);
  }

  //Validate if the user is active
  if (!user.rows[0].statusu) {
    throw new CustomError("user is not active", 400);
  }

  //Validate the password
  const validPassword = await bycript.compare(
    userPassword,
    user.rows[0].passwordu
  );

  if (!validPassword) {
    throw new CustomError("userNickname or password is incorrect", 400);
  }

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

  //Create the token
  const token = await createAccessToken(user.rows[0]);
  // //Create the cookie
  res.cookie("token", token);

  //Return the response
  res.status(200).json(dataUser);
};
