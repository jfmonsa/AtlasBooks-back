import express from "express";
// import dotenv from 'dotenv';
// dotenv.config();
// const morganBody = require("morgan-body"); ni idea que es, dejar comentado por si trin
//import morgan from "morgan"; ??
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;
import router from "./routes/index.js";

// Middlewares
// app.use(morgan("dev")); ??
const whitelist = [
  "https://atlas-books-back.vercel.app/",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: whitelist,
    credentials: true,
  })
);
// -- support post requests
app.use(express.json());
// -- support file uploading
app.use(express.static("storage"));
// -- converts form data in objects, extended false = accept only simple data, not matrices and so on
app.use(express.urlencoded({ extended: false }));
// -- support cookies
app.use(cookieParser());
// -- support serving static files
app.use("/storage", express.static("storage"));

// Routes API Rest
app.use("/api", router);

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

//y esto xd?
// morganBody(app, {
//   skip: function (req, res) {
//     return (
//       [403, 404, 409, 401].includes(res.statusCode) || res.statusCode < 400
//     );
//   },
//   stream: loggerSlack,
// });
