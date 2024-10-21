import { tokenVerify } from "../../../utils/handleJWT.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { CustomError } from "./errorMiddleware.js";
import { pool } from "../db.js";

export const authRequired = asyncHandler(async (req, _res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new CustomError("Not_Token", 401);
  }
  const dataToken = tokenVerify(token);

  if (!dataToken.id) {
    throw new CustomError("Invalid_Token", 401);
  }

  const user = await pool.query("SELECT * FROM users WHERE id = $1", [
    dataToken.id,
  ]);

  //verify if the user exists
  if (user.rows.length === 0) {
    throw new CustomError("User_Not_Found", 401);
  }

  //verify if the user is active
  if (!user.rows[0].statusu) {
    throw new CustomError("User_Not_Active", 401);
  }

  req.user = {
    id: user.rows[0].id,
    name: user.rows[0].nameu,
    email: user.rows[0].email,
    nickname: user.rows[0].nickname,
    country: user.rows[0].country,
    registerDate: user.rows[0].registerdate,
    isAdmin: user.rows[0].isadmin,
    pathProfilePic: user.rows[0].pathprofilepic,
  };

  next();
});
