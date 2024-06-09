import {pool} from "../db.js";

export const rateBook = async (req, res) => {
    try {
        const { idbook, rate } = req.body;
        const { id } = req.user;
    
        //Validate if the user has already rated the book
        const rated = await pool.query(
        "SELECT * FROM book_rate WHERE iduser = $1 AND idbook = $2",
        [id, idbook]
        );
    
        //If the user has already rated the book
        if (rated.rows.length > 0) {
        return res.status(400).json(["You have already rated this book"]);
        }
    
        //Insert the rate
         await pool.query(
         "INSERT INTO book_rate (iduser, idbook, ratevalue) VALUES ($1, $2, $3)",
         [id, idbook, rate]
         );
    
        //Return the response
        res.status(200).json(["Rating sent successfully"]);
    } catch (error) {
        console.error("Error getting rate:", error.message);
        res.status(400).json(["Error getting rate"]);
    }
    }