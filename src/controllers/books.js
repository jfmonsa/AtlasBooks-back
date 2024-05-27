import { pool } from "../db.js";

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
