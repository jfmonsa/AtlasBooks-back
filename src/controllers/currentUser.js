import  {pool}  from "../db.js";

export const current_user = async (req, res) => {
    return res.status(200).send({
        message: "Current user data successfully fetched",
        data: req.user
    });
}
