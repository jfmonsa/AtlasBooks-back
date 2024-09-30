import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors.js";
import { responseFormatter } from "./api/v1/middlewares/responseFormatter.js";
import { swaggerDocs as swaggerDocsV1 } from "./api/v1/swagger.js";
//import api router
//import router from "./api/v0/routes/index.js";
import router_modular_v1 from "./api/v1/router.js";
import router_v1 from "./api/v1/routes/index.js";

import { errorMiddleware } from "./api/v1/middlewares/errorMiddleware.js";

import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

const app = express();

// -- Middlewares --
app.use(cors(corsOptions));
// support post requests
app.use(express.json());
// converts form data in objects, extended false = accept only simple data, not matrices and so on
app.use(express.urlencoded({ extended: false }));
// support cookies
app.use(cookieParser());
// support serving static files
app.use("/storage", express.static("storage"));
// support file uploading
app.use(express.static("storage"));

// log requests
if (process.env.SERVER_ENV === "dev") {
  app.use(morgan("dev"));
}

// format response
app.use(responseFormatter);

// Routes API Rest
app.use("/api/v1", router_modular_v1);

// handling errors
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  swaggerDocsV1(app);
  console.log(`Server at: http://localhost:${port}`);
});
