import {pool} from "../db.js";
import { tokenVerify } from "../utils/handleJWT.js";
import bycript from "bcryptjs";

export const createNewPass = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    console.log("password ", password);
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

    if (!password || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const hashedPassword = await bycript.hash(password, 10);
    console.log("pepepepeppepeppepepepe", dataToken.id, hashedPassword)
    await pool.query("UPDATE users SET passwordu = $1 WHERE id = $2", [
      hashedPassword,
      dataToken.id,
    ]);

    res.status(200).send({
      message: "Password changed successfully",
    });
    console.log("Password changed successfully");
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};
