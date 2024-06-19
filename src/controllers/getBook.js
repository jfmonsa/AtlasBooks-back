import { pool } from "../db.js";
import { getComments } from "./comments.js";

/**
 * Get a single book information by its id from the data base
 * @param {*} req
 * @param {*} res
 */
export const getBook = async (req, res) => {
  try {
    const idBook = req.params.id;
    const query_book = await pool.query(`
      SELECT * 
      FROM BOOK 
      WHERE id = $1`, [
      idBook,
    ]);

    // Si no se encuentra el libro, devolver un error 404
    if (query_book.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    //Get book's authors
    const query_book_authors = await pool.query(
      "SELECT author FROM BOOK_AUTHORS WHERE idBook = $1",
      [idBook]
    );

    //Get book's languages
    const query_book_lang = await pool.query(
      "SELECT languageb FROM BOOK_LANG WHERE idBook = $1",
      [idBook]
    );

    //Get book's files
    const query_book_files = await pool.query(
      "SELECT pathf FROM BOOK_FILES WHERE idBook = $1",
      [idBook]
    );
    // Dividir la cadena en un array de cadenas
    const book_files =
      query_book_files.rows.length > 0
        ? query_book_files.rows[0].pathf.split(",").map((file) => file.trim())
        : [];

    // Obtener tipos de archivos del libro
    const book_files_type = [
      ...new Set(book_files.map((file) => file.split(".").pop().toUpperCase())),
    ];

    //Getting book rate
    const query_rate = await pool.query(
      `
      SELECT ROUND(AVG(ratevalue),1) as rate_avg 
      FROM BOOK_RATE 
      WHERE idbook = $1`,
      [idBook]
    );
    const book_rate = query_rate.rows[0].rate_avg
      ? query_rate.rows[0].rate_avg
      : 0;
    //Get subcategories and categories
    const query_subcategories = await pool.query(
      `SELECT idcategoryFather, sub.subcategoryname 
      FROM BOOK_IN_SUBCATEGORY insub INNER JOIN SUBCATEGORY sub 
        ON insub.idsubcategory = sub.id  
      WHERE idbook = $1"`,
      [idBook]
    );
    let subcategoriesIds;
    let subcategories;
    let category;
    let categoryId;
    if (query_subcategories.rows.length > 0) {
      const query_categoryname = await pool.query(
        `SELECT distinct id, categoryname 
        FROM CATEGORY 
        WHERE id = $1`,
        [query_subcategories?.rows[0]?.idcategoryfather]
      );
      subcategories = query_subcategories.rows.map(
        (subObj) => subObj.subcategoryname
      );
      subcategoriesIds = query_subcategories.rows.map((subObj) => subObj.id);
      category =
        query_categoryname.rows.length > 0
          ? query_categoryname.rows[0].categoryname
          : null;
      categoryId =
        query_categoryname.rows.length > 0
          ? query_categoryname.rows[0].id
          : null;
    } else {
      subcategories = null;
      subcategoriesIds = null;
      category = null;
      categoryId = null;
    }

    //Get related books (20)
    const related_books = await getRelatedBooks(
      idBook,
      subcategoriesIds,
      categoryId
    );

    //Get comments
    const comments = await getComments(req);

    //Send response
    res.status(201).send({
      idBook: query_book.rows[0].id,
      isbn: query_book.rows[0].isbn,
      title: query_book.rows[0].title,
      description: query_book.rows[0].descriptionb,
      year: query_book.rows[0].yearreleased,
      vol: query_book.rows[0].vol ? query_book.rows[0].vol : "N/A",
      n_pages: query_book.rows[0].npages,
      publisher: query_book.rows[0].publisher,
      cover_path: query_book.rows[0].pathbookcover,
      book_rate: book_rate,
      //Multi valued
      book_authors: query_book_authors.rows.map(
        (authorObj) => authorObj.author
      ),
      book_lang: query_book_lang.rows.map((langObj) => langObj.languageb),
      book_files,
      book_files_type,
      book_category: category,
      book_subcategories: subcategories,
      related_books,
      comments,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).send({ error: "Error getting the book" });
  }
};

//Aux functions
// Retorna 20 libros relacionados primero por subcategorias y los restantes por categoria y random
const getRelatedBooks = async (idBook, subcategoryIds, categoryId) => {
  try {
    let relatedBooks = [];

    // Get related books by subcategory
    if (subcategoryIds) {
      let relatedBooksQuery = await pool.query(
        `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors 
         FROM BOOK b
         INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.idbook
         INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
         WHERE bis.idsubcategory = ANY($1) AND b.id != $2
         GROUP BY b.id
         LIMIT 20`,
        [subcategoryIds, idBook]
      );
      relatedBooks.concat(relatedBooksQuery.rows);
    }

    // Si hay menos de 20 libros, obtener más libros relacionados por categoría
    if (relatedBooks.length < 20 && categoryId) {
      const additionalBooksQuery = await pool.query(
        `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
         FROM BOOK b
         INNER JOIN BOOK_IN_SUBCATEGORY bis ON b.id = bis.idbook
         INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
         WHERE bis.idsubcategory IN (
           SELECT id FROM SUBCATEGORY WHERE idcategoryfather = $1
         ) AND b.id != $2
         GROUP BY b.id
         LIMIT $3`,
        [categoryId, idBook, 20 - relatedBooks.length]
      );
      relatedBooks = relatedBooks.concat(additionalBooksQuery.rows);
    }

    // Si no hay suficientes libros relacionados, obtener libros aleatorios adicionales
    if (relatedBooks.length < 20) {
      const additionalBooksQuery = await pool.query(
        `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
         FROM BOOK b
         INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
         WHERE b.id != $1
         GROUP BY b.id
         ORDER BY RANDOM()
         LIMIT $2`,
        [idBook, 20 - relatedBooks.length]
      );
      relatedBooks = relatedBooks.concat(additionalBooksQuery.rows);
    }

    return relatedBooks.map((book) => ({
      authors: book.authors.join(", "),
      title: book.title,
      pathBookCover: book.pathbookcover,
      bookId: book.id,
    }));
  } catch (error) {
    console.error("Error getting related books:", error);
    return [];
  }
};
