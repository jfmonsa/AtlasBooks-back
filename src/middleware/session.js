import { tokenVerify } from "../utils/handleJWT.js";
import { pool } from "../db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).send({
        message: "Not_Token",
      });
    }

    const token = req.headers.authorization.split(" ").pop();

    const dataToken = await tokenVerify(token);

    if (!dataToken.id) {
      return res.status(401).send({
        message: "Error_Token_Id",
      });
    }

    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      dataToken.id,
    ]);

    req.user = user.rows[0];

    next();
  } catch (err) {
    return res.status(401).send({
      message: err.message,
    });
  }
};
