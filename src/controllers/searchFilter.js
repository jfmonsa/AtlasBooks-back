import { pool } from "../db.js";

export const searchFilter = async (req, res) => {
  try {
    const { search, language, yearFrom, yearTo } = req.query;

    // Log to check received query parameters
    console.log("Received query parameters:", {
      search,
      language,
      yearFrom,
      yearTo,
    });

    if (!search) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required parameters" });
    }

    // Construye la consulta SQL dinámicamente
    let baseQuery = `
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
        `;

    let conditions = [];
    let params = [];

    if (search) {
      conditions.push(`(
                book.title ILIKE $${conditions.length + 1}
                OR book_authors.author ILIKE $${conditions.length + 1}
                OR book.isbn ILIKE $${conditions.length + 1}
            )`);
      params.push(`%${search}%`);
    }

    if (yearFrom) {
      conditions.push(`
                
                book.yearreleased >= $${conditions.length + 1}
            `);
      params.push(yearFrom);
    }

    if (yearTo) {
      conditions.push(`
                book.yearreleased <= $${conditions.length + 1}
            `);
      params.push(yearTo);
    }

    if (language) {
      conditions.push(`book_lang.languageb = $${conditions.length + 1}`);
      params.push(language);
    }

    if (conditions.length > 0) {
      baseQuery += " WHERE " + conditions.join(" AND ");
    }

    const book = await pool.query(baseQuery, params);

    if (book.rows.length === 0) {
      return res.status(404).json({ error: true, message: "No books found" });
    }

    console.log(book.rows);

    const databook = book.rows.map((row) => ({
      title: row.title,
      year: row.yearreleased,
      pathCoverBook: row.pathbookcover,
      id: row.id,
      publisher: row.publisher,
      autors: row.author,
      language: row.language,
      rate: row.rating || "",
    }));

    res
      .status(200)
      .json({ error: false, message: "Books found", data: databook });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
