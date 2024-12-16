import fs from "fs/promises";
import axios from "axios";
import pdf from "pdf-parse";

/**
 * Downloads a PDF from a given URL.
 */
async function downloadPDF(url) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
  });
  return response.data;
}

/**
 * Processes a PDF file from a given file path or URL.
 * Downloads the PDF if the file path is a URL.
 * Reads the PDF file if the file path is a local path.
 * Extracts and cleans the text content from the PDF.
 */
export async function processPDF(filePath) {
  try {
    let dataBuffer;
    if (filePath.startsWith("http")) {
      dataBuffer = await downloadPDF(filePath);
    } else {
      dataBuffer = await fs.readFile(filePath);
    }

    const data = await pdf(dataBuffer);

    let textContent = data.text;

    // Clean the text by removing additional line breaks but keeping spaces between words
    textContent = textContent.replace(/\n+/g, " ").trim();

    // Remove the symbols :, (, and )
    textContent = textContent.replace(/[:()]/g, "");

    return textContent;
  } catch (error) {
    console.error("Error processing the PDF:", error);
    throw error;
  }
}
