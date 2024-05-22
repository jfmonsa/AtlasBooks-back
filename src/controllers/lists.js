import { pool } from "../db.js";

  /**
 * Create a list in the db
 * @param {*} req
 * @param {*} res
 */
export const createList = async (req, res) => {
    try {
      // Getting data from the request body
      const { 
        title, 
        descriptionL, 
        dateL, 
        idUserCreator, 
        isPublic 
    } = req.body;
  
      // Preparing values for the query
      const query_values = [
        title,
        descriptionL,
        dateL,
        idUserCreator,
        isPublic
    ];
  
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
  