import multer from "multer";

const storage = multer.memoryStorage(); // store image in memory
const uploadMiddleware = multer({ storage: storage });

export default uploadMiddleware;
