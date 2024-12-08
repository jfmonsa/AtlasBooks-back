import fs from "fs/promises";
import axios from "axios";
import pdf from "pdf-parse";

async function downloadPDF(url) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });
  return response.data;
}

async function readFile(filePath) {
  return fs.readFile(filePath);
}

export async function processPDF(filePath) {
  try {
    let dataBuffer;
    if (filePath.startsWith("http")) {
      dataBuffer = await downloadPDF(filePath);
    } else {
      dataBuffer = await readFile(filePath);
    }

    const data = await pdf(dataBuffer);

    let cuerpo = data.text;

    // Limpiar el texto eliminando saltos de línea adicionales, pero manteniendo los espacios entre palabras
    cuerpo = cuerpo.replace(/\n+/g, " ").trim();

    // Eliminar los símbolos :, (, y )
    cuerpo = cuerpo.replace(/[:()]/g, "");

    return cuerpo;
  } catch (error) {
    console.error("Error al procesar el PDF:", error);
    throw error;
  }
}
