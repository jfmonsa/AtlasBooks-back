import express from "express";
import { setupDIContainer } from "./config/di-container.js";

// middlewares
import cors from "cors";
import corsOptions from "./config/cors.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { formatResponse } from "./middlewares/formatResponse.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";

// api
import { swaggerDocs as swaggerDocsV1 } from "./config/swagger.js";
import loadRoutes from "./api/router.js";

setupDIContainer();
const app = express();

// -- Middlewares --
app.use(cors(corsOptions));
// support post requests
app.use(express.json());
// for form data
app.use(express.urlencoded({ extended: false }));
// support cookies
app.use(cookieParser());

// log requests
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
// format response
app.use(formatResponse);

// Routes API Rest
app.use("/api/:version", await loadRoutes());

// test route for server (use for cron job to keep server alive)
app.use("/ping", (_req, res) => {
  res.send("pong");
});

// handling errors
app.use(errorHandlerMiddleware);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`-> 💻 Server runing at: ${process.env.SERVER_URL}`);
  swaggerDocsV1(app);
});

export default app;
