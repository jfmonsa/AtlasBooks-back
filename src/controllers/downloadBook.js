import path from "path";
import fs from "fs";
import { pool } from "../db.js";
export const downloadBookFile = async (req, res) => {
  try {
    const { fileName } = req.params;

    // Construye la ruta completa al archivo
    const filePath = path.resolve(`../../storage/books/${fileName}`);

    // Verifica que el archivo exista en el sistema de archivos
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Envía el archivo al cliente
    res.download(filePath);
  } catch (error) {
    console.error("Error downloading the book file:", error);
    res.status(500).send({ error: "Error downloading the book file" });
  }
};
