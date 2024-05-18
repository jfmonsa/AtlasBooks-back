import bycript from "bcryptjs";
import  {pool}  from "../db.js";

export const change_password = async (req, res) => {
    try{

       const {currentPassword, newPassword, confirmPassword} = req.body;

        if(!currentPassword || !newPassword || !confirmPassword){
            throw new Error("All fields are required");
        }

        if(currentPassword === newPassword){
            throw new Error("New password must be different from the current password");
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
        return res.status(400).json("Email or password is incorrect");
        }

         

         const passwordHash = await bycript.hash(newPassword, 10);

         const result = await pool.query(
            "UPDATE users SET passwordu = $1 WHERE id = $2",
            [passwordHash, req.user.passwordu]
          );
        

    }catch(err){
        return res.status(400).send({
            message: err.message,
            data: err
        })
    }
}  