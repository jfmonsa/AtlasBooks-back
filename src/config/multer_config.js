import multer from "multer";
import getFileExtension from "./src/utils/getFileExtension.js";

// Obtener __dirname en ES6
import { fileURLToPath } from "url";
import path from "path";

const CURRENT_DIRNAME = path.dirname(fileURLToPath(import.meta.url));

//Aux function to manage file uploading
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //puedo usar la req para hacer la logica de guardar
    //en una carpeta u otra
    /*
    if file.fieldname === "profilePic" {
      return cb(null, `${CURRENT_DIRNAME}/storage/usersProfilePic`);
    }*/
    cb(null, `${CURRENT_DIRNAME}/storage/books`);
  },
  filename: genFileName,
});

function genFileName(req, file, cb) {
  const ext = getFileExtension(file.originalname);
  const rand_2 = Math.floor(Math.random() * (99 - 10 + 1) + 100);
  const filename = `${new Date().getTime()}-${rand_2}.${ext}`;
  cb(null, filename);
}

// Aux functions
/*export const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".pdf") {
    return cb(new Error("Only pdf files are allowed"));
  }
  cb(null, true);
};
*/
