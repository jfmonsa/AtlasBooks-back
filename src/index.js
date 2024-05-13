import express from "express";
//NOTA:(cors) Libreria necesaria al utilizar al tener el back y el front separados
// mas info: https://www.youtube.com/watch?v=zGCjxCqxVY4
import cors from "cors";
//import morgan from "morgan";
import router from "./routes/atlas.routes.js";
import { port } from "./config.js";
import { pool } from "./db.js";
const app = express();

//---------------------
// Middlewares
app.use(cors());
//app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my API" });
});

app.use(router);

// handling errors
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server at: http://localhost:${port}`);
});
