import { tokenVerify } from "../../../../utils/handleJWT.js";
import { pool } from "../../../../db.js";
import { CustomError } from "../../middlewares/errorMiddleware.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).send({
        message: "Not_Token",
      });
    }

    const dataToken = await tokenVerify(token);

    if (!dataToken.id) {
      return res.status(401).send({
        message: "Error_Token_Id",
      });
    }

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      dataToken.id,
    ]);

    //verify if the user exists
    if (user.rows.length === 0) {
      return res.status(401).send({
        message: "User_Not_Found",
      });
    }

    //verify if the user is active
    if (!user.rows[0].statusu) {
      return res.status(401).send({
        message: "User_Not_Active",
      });
    }

    req.user = {
      id: dataToken.id,
      newEmail: dataToken.email,
    };

    res.status(200).send({
      message: "Token_Valid",
      user: req.user,
    });
  } catch (err) {
    return res.status(401).send({
      message: err.message,
    });
  }
};

export const verify = async (req, res) => {
  // try {
  console.log("verifyToken");
  const { token } = req.cookies;

  if (!token) {
    throw new CustomError("Not_Token", 401);
  }

  const dataToken = await tokenVerify(token);

  if (!dataToken?.id) {
    throw new CustomError("Error_Token_Id", 401);
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

  res.status(200).send({
    message: "Token_Valid",
    user: req.user,
  });
  // } catch (err) {
  //   console.log(err);
  //   res.status(401).send({
  //     message: err.message,
  //   });
  // }
};
