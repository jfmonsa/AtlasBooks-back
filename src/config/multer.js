import multer from "multer";

const storage = multer.memoryStorage(); // store image in memory
const uploadMiddleware = multer({ storage: storage });

export default uploadMiddleware;
// Obtener __dirname en ES6
// import { fileURLToPath } from "url";
// import path from "path";
//const CURRENT_DIRNAME = path.dirname(fileURLToPath(import.meta.url));
// // gen random file name
// function genFileName(_req, file, cb) {
//   const ext = getFileExtension(file.originalname);
//   const rand_2 = Math.floor(Math.random() * (99 - 10 + 1) + 100);
//   const filename = `${new Date().getTime()}-${rand_2}.${ext}`;
//   cb(null, filename);
// }
