import {pool} from "../db.js";

export const search_filter = async (req, res) => {
    try {
        const { search , language ,yearFrom, yearTo } = req.body;
        console.log(yearFrom, yearTo)

        if (!language || !yearFrom || !yearTo || !search) {
            return res.status(400).json({ error: true, message: "Missing required parameters" });
        }

        const book = await pool.query(`
        SELECT 
        book.title, 
        book.yearreleased,
        book.pathbookcover, 
        book.id, 
        book.publisher, 
        book_authors.author AS author,
        book_lang.languageb AS language,
        book_rate.ratevalue AS rating
    FROM 
        book 
    INNER JOIN 
        book_authors ON book.id = book_authors.idbook 
    INNER JOIN 
        book_lang ON book.id = book_lang.idbook
    INNER JOIN 
        book_rate ON book.id = book_rate.idbook
    WHERE 
        book.yearreleased >= $1
        AND book.yearreleased <= $2
        AND book_lang.languageb = $3
        AND (
            (book_authors.author ILIKE '%${search}%') 
            OR (book.title ILIKE '%${search}%') 
            OR (book.isbn ILIKE '%${search}%')
        )`, [yearFrom , yearTo, language]);

        if (book.rows.length === 0) {
            return res.status(400).json({ error: true , message: "No books found" });
            
        
        }
        

        const databook = book.rows.map(row => ({
            title: row.title, 
            pathbookcover: row.pathbookcover, 
            id: row.id, 
            publisher: row.publisher,
            author: row.author,
            language: row.language,
            rating: row.rating
        }));
        res.status(200).json({ error: false, message: "Books found",
         data: databook
         });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: true, message: "Internal server error"});
    }
};

