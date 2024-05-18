import { pool } from "../db.js";
/**
 * Get books from the data base
 * @param {*} req
 * @param {*} res
 */
export const getBooks = async (req, res) => {
  try {
    const db_result = await pool.query("SELECT * FROM BOOK");
    console.log(db_result.rows);
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
  const idBook = req.params.id;
  const query_bd = await pool.query("SELECT * FROM BOOK WHERE isbn = $1", [
    idBook,
  ]);
  res.send({ idBook, data: query_bd.rows });
};

/**
 * Create a book in the db
 * @param {*} req
 * @param {*} res
 */

export const createBook = async (req, res) => {
  //getting data
  console.log(req.body);

  const { isbn, title, descriptionB, yearReleased, vol, nPages, publisher } =
    req.body;

  //arr values for db query
  const query_values = [
    isbn,
    title,
    descriptionB,
    yearReleased,
    vol,
    nPages,
    publisher,
  ];

  console.log(req.files);

  // Obtén los archivos subidos
  const cover = req.files["cover"] ? req.files["cover"][0].path : null;
  const bookFiles = req.files["bookFiles"]
    ? req.files["bookFiles"].map((file) => file.path)
    : [];

  /*
  const db_query = await pool.query(
  "INSERT INTO BOOK (isbn, title, descriptionB, yearReleased, vol, nPages, publisher, pathBookCover) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
  query_values
);*/

  /*
   const bookId = db_query.rows[0].id;

    // Si tienes una tabla separada para almacenar las rutas de los archivos, puedes hacer algo como esto:
    if (bookFiles.length > 0) {
      const fileQueries = bookFiles.map(path => pool.query(
        'INSERT INTO BookFiles (bookId, filePath) VALUES ($1, $2)',
        [bookId, path]
      ));
      await Promise.all(fileQueries);
    }
*/
  res.send({ algo: 1 });
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
