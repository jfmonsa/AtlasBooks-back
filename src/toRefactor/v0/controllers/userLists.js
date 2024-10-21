import { pool } from "../db.js";

export const userLists = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required parameters" });
    }

    const userListsQuery = await pool.query(
        `
        SELECT 
          book_list.id,
          book_list.title,
          book_list.descriptionl,
          book_list.ispublic,
          COUNT(book_in_list.idlist) as book_count
        FROM book_list
        LEFT JOIN book_in_list ON book_list.id = book_in_list.idlist
        WHERE book_list.idusercreator = $1
        GROUP BY book_list.id
      `,
      [id]
    );

    const userLists = userListsQuery.rows;

    if (userLists.length === 0) {
      return res.status(400).json({ error: true, message: "No lists found" });
    }

    res
      .status(200)
      .json({ error: false, message: "Lists found", data: userLists });
  } catch (error) {
    // Handle the error here
    console.error(error);
    // Optionally, you can send an error response to the client
    res.status(500).json({ error: "Internal Server Error" });
  }
};
