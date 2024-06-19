import { pool } from "../db.js";

export const banUser = async (req, res) => {
  const date = new Date();

  try {
    const { id, isadmin } = req.user;
    const { idUser, status } = req.body;

    if (!isadmin) {
      if (id !== idUser) {
        if (status === true) {
          await pool.query(`
            UPDATE users 
            SET statusu = $1 
            WHERE id = $2`, [
            false,
            idUser,
          ]);

          await pool.query(
            `INSERT INTO user_ban 
              (iduserbanned, idadmin, motivation, dateban) 
            VALUES ($1, $2, $3, $4)`,
            [idUser, id, "No reason", date]
          );
          res.status(200).send({
            message: "Account banned successfully",
          });
        } else {
          res.status(401).send({
            message: "User is already banned",
          });
        }
      } else {
        res.status(401).send({
          message: "You are banned yourself",
        });
      }
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
      await pool.query(`
        UPDATE users 
        SET statusu = $1 
        WHERE id = $2`, [
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
