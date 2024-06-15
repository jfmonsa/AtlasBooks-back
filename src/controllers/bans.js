import { pool } from "../db.js";

export const banUser = async (req, res) => {
  try {
    const { isadmin } = req.user;
    const { id } = req.body;

    if (!isadmin) {
      await pool.query("UPDATE users SET statusu = $1 WHERE id = $2", [
        false,
        id,
      ]);
      res.status(200).send({
        message: "Account banned successfully",
      });
    } else {
      res.status(401).send({
        message: "You are not an admin",
      });
    }
  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err,
    });
  }
};

export const desBanUser = async (req, res) => {
  try {
    const { isadmin } = req.user;
    const { id } = req.body;

    if (!isadmin) {
      await pool.query("UPDATE users SET statusu = $1 WHERE id = $2", [
        true,
        id,
      ]);
      res.status(200).send({
        message: "Account desbanned successfully",
      });
    } else {
      res.status(401).send({
        message: "You are not an admin",
      });
    }
  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err,
    });
  }
};
