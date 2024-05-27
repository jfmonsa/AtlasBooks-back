import { pool } from "../db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import removeFileExt from "../utils/removeFileExt.js";
import { get } from "http";
import { getComments } from "./comments.js";

// Obtén la ruta del archivo actual (este módulo)
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Get books from the data base
 * @param {*} req
 * @param {*} res
 */
export const getBooks = async (req, res) => {
  try {
    const db_result = await pool.query("SELECT * FROM BOOK");
    res.send({ message: "ruta de los libros", rows: db_result.rows });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get a single book information by its id from the data base
 * @param {*} req
 * @param {*} res
 */
export const getBook = async (req, res) => {
  try {
    const idBook = req.params.id;
    const query_book = await pool.query("SELECT * FROM BOOK WHERE id = $1", [
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
    const book_files = query_book_files.rows.map((fileObj) => fileObj.pathf);
    //getting each file extention, deleting duplicates and CAPITALIZING
    const book_files_type = [
      ...new Set(book_files.map((file) => removeFileExt(file).toUpperCase())),
    ];

    //Getting book rate
    const query_rate = await pool.query(
      "SELECT AVG(ratevalue) as rate_avg FROM BOOK_RATE WHERE idbook = $1",
      [idBook]
    );
    const book_rate = query_rate.rows[0].rate_avg ? query_rate[0].rate_avg : 0;

    //Get subcategories and categories
    const query_subcategories = await pool.query(
      "SELECT idcategoryFather, sub.subcategoryname FROM BOOK_IN_SUBCATEGORY insub INNER JOIN SUBCATEGORY sub ON insub.idsubcategory = sub.id  WHERE idbook = $1",
      [idBook]
    );
    const book_subcategories = query_subcategories.rows.map(
      (subObj) => subObj.subcategoryname
    );

    let subcategories;
    let category;
    if (query_subcategories.rows > 0) {
      const query_categoryname = await pool.query(
        "SELECT distinct id, categoryname FROM CATEGORY WHERE id = $1",
        [query_subcategories?.rows[0]?.idcategoryfather]
      );
      subcategories = query_subcategories.rows.map((row) => row.idsubcategory);
      category =
        query_categoryname.rows > 0 ? query_categoryname.rows[0].id : null;
    } else {
      subcategories = null;
      category = null;
    }

    //Get related books (20)
    const related_books = await getRelatedBooks(
      idBook,
      subcategories,
      category
    );

    //Get comments
    const comments = await getComments(req);

    //TODO: Si la imagen del libro es null, mandar una por default

    //Send response
    res.status(201).send({
      idBook: query_book.rows[0].id,
      isbn: query_book.rows[0].isbn,
      title: query_book.rows[0].title,
      description: query_book.rows[0].descriptionb,
      year: query_book.rows[0].yearreleased,
      vol: query_book.rows[0].vol,
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
      comments: comments,
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

/**
 * Create a book in the db
 * @param {*} req
 * @param {*} res
 */
export const createBook = async (req, res) => {
  try {
    //getting data
    const {
      isbn,
      title,
      descriptionB,
      yearReleased,
      vol,
      nPages,
      publisher,
      //multivalued fields
      authors,
      languages,
      //(n,m) rel
      subcategoryIds,
    } = req.body;

    //Get path book cover
    const cover = req.files["cover"] ? req.files["cover"][0].filename : null;

    // ==== insert into BOOK table =====
    const query_values = [
      isbn,
      title,
      descriptionB,
      yearReleased,
      vol,
      nPages,
      publisher,
      cover,
    ];

    const newBook_query = await pool.query(
      "INSERT INTO BOOK (isbn, title, descriptionB, yearReleased, vol, nPages, publisher, pathBookCover) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      query_values
    );

    // ==== insert into BOOK_FILES talbe =====
    // -- getting the auto increment id of BOOK
    const bookId = newBook_query.rows[0].id;

    // -- Get the paths of uploaded files
    const bookFiles = req.files["bookFiles"]
      ? req.files["bookFiles"].map((file) => file.filename)
      : [];

    if (bookFiles.length > 0) {
      const fileQueries = bookFiles.map((path) =>
        pool.query("INSERT INTO BOOK_FILES (idBook, pathF) VALUES ($1, $2)", [
          bookId,
          path,
        ])
      );
      await Promise.all(fileQueries);
    } else {
      res.status(500).send({ error: "there should be at least one book file" });
    }

    // ==== insert into BOOK_AUTHORS talbe =====
    if (authors) {
      const insertAuthorQueries = authors.map(async (author) => {
        pool.query(
          "INSERT INTO BOOK_AUTHORS (idBook, author) VALUES ($1, $2)",
          [bookId, author]
        );
      });
      await Promise.all(insertAuthorQueries);
    } else {
      res.status(500).send({ error: "there should be at least one author" });
    }

    // ==== insert into BOOK_LANG talbe =====
    if (languages) {
      const insertLanguageQueries = languages.map(async (language) => {
        pool.query(
          "INSERT INTO BOOK_LANG (idBook, languageB) VALUES ($1, $2)",
          [bookId, language]
        );
      });
      await Promise.all(insertLanguageQueries);
    } else {
      res.status(500).send({ error: "there should be at least one language" });
    }

    // ==== insert into  BOOK_IN_SUBCATEGORY table ====
    if (subcategoryIds) {
      const insertSubcategoryQueries = subcategoryIds.map((subcategoryId) => {
        return pool.query(
          "INSERT INTO BOOK_IN_SUBCATEGORY (idBook, idSubcategory) VALUES ($1, $2)",
          [bookId, subcategoryId]
        );
      });
      await Promise.all(insertSubcategoryQueries);
    }

    // ==== response ====
    res.status(201).send({ message: "Book created successfully" });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).send({ error: "Failed to create book" });
  }
};

/**
 * Update book info in the db
 * @param {*} req
 * @param {*} res
 */
export const updateBook = async (req, res) => {};

/**
 * Delete a book in the db
 * @param {*} req
 * @param {*} res
 */
export const deleteBook = async (req, res) => {};
