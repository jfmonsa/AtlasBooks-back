import { pool } from "../db.js";

export const userLists = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res
                .status(400)
                .json({ error: true, message: "Missing required parameters" });
        }

        const userListsQuery = await pool.query(`
            SELECT 
            title,
            descriptionl,
            ispublic
            FROM  book_list
            WHERE 
                idusercreator = $1
            `, [id]);
        
            const userLists = userListsQuery.rows;

        if (userLists.length === 0) {res.status(400).json({ error: true, message: "No lists found" });}

        res
            .status(200)
            .json({ error: false, message: "Lists found", data: userLists });

            

    } catch (error) {
        // Handle the error here
        console.error(error);
        // Optionally, you can send an error response to the client
        res.status(500).json({ error: 'Internal Server Error' });
    }


};