import express from "express";
// middlewares
import cors from "cors";
import corsOptions from "./config/cors.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { formatResponse } from "./middlewares/formatResponse.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
// api
import { swaggerDocs as swaggerDocsV1 } from "./config/swagger.js";
//import router_modular_v1 from "./api/v1/router.js";
import router from "./api/router.js";

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

// log requests
if (process.env.SERVER_ENV === "dev") {
  app.use(morgan("dev"));
}

// format response
app.use(formatResponse);

// Routes API Rest
//app.use("/api/v1", router_modular_v1);
app.use("/api/:version", router);

// handling errors
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  swaggerDocsV1(app);
  console.log(`💻 Server at: ${process.env.SERVER_URL}`);
});
