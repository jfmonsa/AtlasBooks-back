import { pool } from "../db.local.js";

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
  const {
    isbn,
    title,
    descriptionB,
    yearReleased,
    vol,
    nPages,
    publisher,
    pathBookCover,
  } = req.body;

  //arr values for db query
  const values = [
    isbn,
    title,
    descriptionB,
    yearReleased,
    vol,
    nPages,
    publisher,
    pathBookCover,
  ];
  console.log(values);

  /*const db_query = await pool.query(
  "INSERT INTO BOOK (isbn, title, descriptionB, yearReleased, vol, nPages, publisher, pathBookCover) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
  values
);*/
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
