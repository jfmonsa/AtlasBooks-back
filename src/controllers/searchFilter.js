import {pool} from "../db.js";

export const search_filter = async (req, res) => {
    try {
        const { query, yearFrom, yearTo } = req.query;

        const baseQuery = 'SELECT * FROM book WHERE 1=1';
        const values = [];
        const index = 1;

        if (query) {
            baseQuery += ` AND (title ILIKE $${index} OR id ILIKE $${index} OR isbn ILIKE $${index} OR publisher ILIKE $${index})`;
            values.push(`%${query}%`);
            index++;
        }

        if (yearFrom) {
            baseQuery += ` AND yearreleased >= $${index}`;
            values.push(yearFrom);
            index++;
        }

        if (yearTo) {
            baseQuery += ` AND yearreleased <= $${index}`;
            values.push(yearTo);
            index++;
        }

        // if (language) {
        //     baseQuery += ` AND language = $${index}`;
        //     values.push(language);
        //     index++;
        // }
        console.log("Query: ", baseQuery);
        console.log("Values: ", values);

        const results = await pool.query(baseQuery, values);
        res.json(results.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

