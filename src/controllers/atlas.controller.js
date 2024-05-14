import  {pool}  from "../db.js";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  
    try {
        const { name, email, password, nickName, country, registerDate} = req.body;
        const passwordHash = await bycript.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (nameu, email, passwordu, nickname, country, registerdate,statusu,isadmin) VALUES ($1, $2, $3, $4,$5, $6,$7,$8)",
            [name, email, passwordHash,nickName, country, registerDate, true, false]
          );
            console.log(result);
    } catch (error) {
         console.log(error.message);
    }

  res.send("registering");
};
export const login = async (req, res) => {
  res.send("login");
};
