import {pool} from "../db.js";

export const search_filter = async (req, res) => {
    try {
        const { yearFrom, yearTo } = req.body;

        const book = await pool.query("SELECT * FROM book WHERE yearreleased >= $1 AND yearreleased <= $2 ", [yearFrom , yearTo]);

        if (book.rows.length === 0) {
            return res.status(400).json({ error: true, message: "No books found" });
        
        }

        res.status(200).json({ error: false, message: "Books found", data: book.rows });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: true, message: "Internal server error"});
    }
};

