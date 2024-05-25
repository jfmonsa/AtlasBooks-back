import { pool } from "../db.js";

/**
 * Create a list in the db
 * @param {*} req
 * @param {*} res
 */
export const createList = async (req, res) => {
  try {
    // Getting data from the request body
    const { title, descriptionL, dateL, idUserCreator, isPublic } = req.body;

    // Preparing values for the query
    const query_values = [title, descriptionL, dateL, idUserCreator, isPublic];

    // Inserting the new list into the LIST table
    const newList_query = await pool.query(
      "INSERT INTO BOOK_LIST (title, descriptionL, dateL, idUserCreator, isPublic) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      query_values
    );

    // Getting the auto-incremented id of the new list
    const listId = newList_query.rows[0].id;

    // Sending response
    res.status(201).send({ message: "List created successfully", listId });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).send({ error: "Failed to create list" });
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
