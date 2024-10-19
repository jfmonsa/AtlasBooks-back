import multer from "multer";
import getFileExtension from "../utils/helpers/getFileExtension.js";

// Obtener __dirname en ES6
import { fileURLToPath } from "url";
import path from "path";

const CURRENT_DIRNAME = path.dirname(fileURLToPath(import.meta.url));

// storage config
// export const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === "cover") {
//       // save book cover pic
//       return cb(null, `${CURRENT_DIRNAME}/../../../../storage/bookCoverPics/`);
//     } else if (file.fieldname === "bookFiles") {
//       // save book files: epub, pdf
//       return cb(null, `${CURRENT_DIRNAME}/../../../../storage/books/`);
//     }

//     // default
//     return cb(null, `${CURRENT_DIRNAME}/../../../../storage/books`);
//   },
//   filename: genFileName,
// });
export const storage = multer.memoryStorage();

// actual middleware
export const uploadMiddleware = multer({
  storage,
});

// gen random file name
function genFileName(_req, file, cb) {
  const ext = getFileExtension(file.originalname);
  const rand_2 = Math.floor(Math.random() * (99 - 10 + 1) + 100);
  const filename = `${new Date().getTime()}-${rand_2}.${ext}`;
  cb(null, filename);
}
