import { pool } from "../db.js";

/**
 * Create a list in the db
 * @param {*} req
 * @param {*} res
 */
export const createList = async (req, res) => {
  try {
    // Obtener datos del cuerpo de la solicitud
    const { title, descriptionL, dateL, idUserCreator, isPublic } = req.body;

    // Validar que no exista una lista con el mismo nombre para el mismo usuario
    const checkQuery =
      `SELECT * 
      FROM BOOK_LIST 
      WHERE title = $1 AND idUserCreator = $2`;
    const checkResult = await pool.query(checkQuery, [title, idUserCreator]);

    if (checkResult.rows.length > 0) {
      return res.status(400).send({
        error: true,
        message: "Ya existe una lista con el mismo nombre.",
      });
    }

    // Preparar valores para la consulta
    const query_values = [title, descriptionL, dateL, idUserCreator, isPublic];

    // Insertar la nueva lista en la tabla BOOK_LIST
    const newList_query = await pool.query(
      `INSERT INTO BOOK_LIST 
        (title, descriptionL, dateL, idUserCreator, isPublic) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id`,
      query_values
    );

    // Obtener el id auto-incrementado de la nueva lista
    const listId = newList_query.rows[0].id;

    // Enviar respuesta
    res.status(201).send({ message: "Lista creada exitosamente", listId });
  } catch (error) {
    console.error("Error creando la lista:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
};

/**
 * Get a single list information by its id from the database
 * @param {*} req
 * @param {*} res
 */
export const getList = async (req, res) => {
  try {
    const idList = req.params.id;

    // Get the list details
    const query_list = await pool.query(
      "SELECT * FROM BOOK_LIST WHERE id = $1",
      [idList]
    );

    // If the list is not found, return a 404 error
    if (query_list.rows.length === 0) {
      return res.status(404).json({ error: "List not found" });
    }

    // Get book IDs in the list
    const query_books_in_list = await pool.query(
      "SELECT idBook FROM BOOK_IN_LIST WHERE idList = $1",
      [idList]
    );
    const bookIds = query_books_in_list.rows.map((row) => row.idbook);

    // Get details of books and their authors
    let books = [];
    if (bookIds.length > 0) {
      const query_books_details = await pool.query(
        `SELECT b.id, b.title, b.pathbookcover, array_agg(ba.author) AS authors
         FROM BOOK b
         INNER JOIN BOOK_AUTHORS ba ON b.id = ba.idbook
         WHERE b.id = ANY($1::int[])
         GROUP BY b.id`,
        [bookIds]
      );
      books = query_books_details.rows.map((book) => {
        return {
          bookId: book.id,
          title: book.title,
          pathBookCover: book.pathbookcover,
          authors: book.authors.join(", "),
        };
      });
    }

    // Send response
    return res.status(200).json({
      title: query_list.rows[0].title,
      description: query_list.rows[0].descriptionl,
      date: query_list.rows[0].datel,
      isPublic: query_list.rows[0].ispublic,
      books: books,
    });
  } catch (error) {
    console.error("Error getting list:", error);
    res.status(500).send({ error: "Error getting the list" });
  }
};

/**
 * Get all lists from the database
 * @param {*} req
 * @param {*} res
 */
export const getAllListsOfUser = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    if (!userId || !bookId) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required parameters" });
    }

    // Consulta para obtener las listas del usuario y verificar si el libro está en cada lista
    const query = `
      SELECT 
        bl.id AS listId,
        bl.title AS listTitle,
        EXISTS (
          SELECT 1
          FROM book_in_list bil
          WHERE bil.idList = bl.id AND bil.idBook = $2
        ) AS currentBookIn
      FROM 
        book_list bl
      WHERE 
        bl.idUserCreator = $1
    `;
    const result = await pool.query(query, [userId, bookId]);

    const lists = result.rows.map((row) => ({
      listTitle: row.listtitle,
      listId: row.listid,
      currentBookIn: row.currentbookin,
    }));

    // Enviar respuesta
    res.status(200).send(lists);
  } catch (error) {
    console.error("Error getting lists:", error);
    res.status(500).send({ error: "Error getting the lists" });
  }
};

/**
 * Guardar un libro en una lista especificada.
 * @param {*} req
 * @param {*} res
 */
export const addBookToList = async (req, res) => {
  try {
    const { bookId, userId, listId } = req.body;

    if (!bookId || !userId || !listId) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required parameters" });
    }

    // Verificar que el libro y la lista existen y pertenecen al usuario
    const verifyBookQuery = `
      SELECT id 
      FROM book 
      WHERE id = $1
    `;
    const verifyBookValues = [bookId];
    const verifyBookResult = await pool.query(
      verifyBookQuery,
      verifyBookValues
    );

    if (verifyBookResult.rows.length === 0) {
      return res.status(404).json({ error: true, message: "Book not found" });
    }

    const verifyListQuery = `
      SELECT id 
      FROM book_list 
      WHERE id = $1 AND idUserCreator = $2
    `;
    const verifyListValues = [listId, userId];
    const verifyListResult = await pool.query(
      verifyListQuery,
      verifyListValues
    );

    if (verifyListResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "List not found or user not authorized",
      });
    }

    // Insertar el libro en la lista
    const insertQuery = `
      INSERT INTO book_in_list (idBook, idList)
      VALUES ($1, $2)
    `;
    const insertValues = [bookId, listId];
    await pool.query(insertQuery, insertValues);

    res
      .status(200)
      .json({ error: false, message: "Book added to list successfully" });
  } catch (error) {
    console.error("Error adding book to list:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

/**
 * Guardar un libro en una lista especificada.
 * @param {*} req
 * @param {*} res
 */
export const deleteBookFromList = async (req, res) => {
  try {
    const { bookId, userId, listId } = req.body;
    if (!bookId || !userId || !listId) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required parameters" });
    }

    // Verificar que la lista pertenece al usuario
    const verifyListQuery = `
      SELECT id 
      FROM book_list 
      WHERE id = $1 AND idUserCreator = $2
    `;
    const verifyListValues = [listId, userId];
    const verifyListResult = await pool.query(
      verifyListQuery,
      verifyListValues
    );

    if (verifyListResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "List not found or user not authorized",
      });
    }

    // Eliminar el libro de la lista
    const deleteQuery = `
      DELETE FROM book_in_list 
      WHERE idBook = $1 AND idList = $2
    `;
    const deleteValues = [bookId, listId];
    await pool.query(deleteQuery, deleteValues);

    res
      .status(200)
      .json({ error: false, message: "Book removed from list successfully" });
  } catch (error) {
    console.error("Error removing book from list:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
