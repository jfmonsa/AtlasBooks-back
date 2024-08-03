import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors.js";

//import api router
//import router from "./api/v0/routes/index.js";
import router_v1 from "./api/v1/routes/index.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// -- load cors options
app.use(cors(corsOptions));
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
app.use("/api/v1", router_v1);

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
