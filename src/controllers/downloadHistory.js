import { pool } from "../db.js";

export const downloadHistory = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res
                .status(400)
                .json({ error: true, message: "Missing required parameters" });
        }

        const downloadHistoryQuery = await pool.query(
            `
        SELECT 
            dh.iduser,
            dh.datedownload,
            b.id AS book_id,
            b.isbn,
            b.title,
            b.descriptionb,
            b.yearreleased,
            b.vol,
            b.npages,
            b.publisher,
            b.pathbookcover,
            a.author
        FROM 
           book_download dh
        JOIN 
            book b ON dh.idbook = b.id
        JOIN 
            book_authors a ON b.id = a.idbook
        WHERE 
            dh.iduser = $1
        ORDER BY 
            dh.datedownload DESC;`,
            [id]
        );
        const downloads = downloadHistoryQuery.rows;

        res
        .status(200)
        .json({ error: false, message: "Books found", data: downloads });
        
    } catch (error) {
        // Handle the error here
        console.error(error);
        // Optionally, you can send an error response to the client
        res.status(500).json({ error: 'Internal Server Error' });

    }
    
};
