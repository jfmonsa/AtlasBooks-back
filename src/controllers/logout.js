<<<<<<< HEAD
import { pool } from "../db.js";

export const logout = (req, res) => {
  console.log("logout");
};
=======


export const logout = (req, res) => {
    res.cookie('token',"",{expires: new Date(0)}
  );
    return res.sendStatus(200);
  }


>>>>>>> 42482312054c3eb51ad31bcd3f57c2a8f162f901
