import { pool } from "../db.js";

export const report = async (req, res) => {
  try {
    const { context, idbook } = req.body;
    const { id } = req.user;
    const date = new Date();
    
    //validate if the user has already reported the book
    const report = await pool.query(
      "SELECT * FROM book_report WHERE iduser = $1 AND idbook = $2 AND status = $3",
      [id, idbook, true]
    );
    //if the user has already reported the book
    if (report.rows.length > 0) {
      return res.status(400).json(["You have already reported this book"]);
    }
    
    //insert the report
    await pool.query(
      "INSERT INTO book_report (iduser, idbook, motivation, datereport, status) VALUES ($1, $2, $3, $4, $5)",
      [id, idbook, context, date, true]
    );
    
    //return the response
    res.status(200).json(["Report sent successfully"]);
  } catch (error) {
    console.error("Error getting reports:", error.message);
    res.status(400).json(["Error getting reports"]);
  }
};

export const getReports = async (req, res) => {
  try {
    //validate if the user is an admin
     if (!req.user.isAdmin) {
       return res.status(401).json(["Unauthorized"]);
     }

    //get the reports
    const reports = await pool.query(
      "SELECT * FROM book_report WHERE status = $1",
      [true]
    );
    
    //return the response
    res.status(200).json(reports.rows);
  } catch (error) {
    console.error("Error getting reports:", error.message);
    res.status(400).json(["Error getting reports"]);
  }
};