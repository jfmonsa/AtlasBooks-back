import bycript from "bcryptjs";
import  {pool}  from "../db.js";
import { JWTE } from "jsonwebtoken";

export const current_user = async (req, res) => {
    return res.status(200).send({
        message: "Current user data successfully fetched",
        data: req.user
    });
}

export const change_password = async (req, res) => {
    try{

       const {currentPassword, newPassword, confirmPassword} = req.body;

        if(!currentPassword || !newPassword || !confirmPassword){
            throw new Error("All fields are required");
        }

        if(currentPassword === newPassword){
            throw new Error("New password must be different from the current password");
        }

         if(newPassword !== confirmPassword){
              throw new Error("Passwords do not match");
         }

         

         const passwordHash = await bycript.hash(newPassword, 10);

         const result = await pool.query(
            "UPDATE users SET passwordu = $1 WHERE id = $2",
            [passwordHash, req.user.id]
          );
        

    }catch(err){
        return res.status(400).send({
            message: err.message,
            data: err
        })
    }
}  