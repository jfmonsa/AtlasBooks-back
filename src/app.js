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

class Server {
  constructor() {
    this.app = express();
  }

  async create() {
    setupDIContainer();
    await this.#setupMiddlewares();
    return this.app;
  }

  async #setupMiddlewares() {
    // -- Middlewares --
    this.app.use(cors(corsOptions));
    // support post requests
    this.app.use(express.json());
    // for form data
    this.app.use(express.urlencoded({ extended: false }));
    // support cookies
    this.app.use(cookieParser());

    // log requests
    if (process.env.NODE_ENV === "dev") {
      this.app.use(morgan("dev"));
    }
    // format response
    this.app.use(formatResponse);

    // Routes API Rest
    this.app.use("/api/:version", await loadRoutes());

    // handling errors
    this.app.use(errorHandlerMiddleware);
  }

  // for local devlopment
  async start() {
    const port = process.env.PORT;

    this.app.listen(port, () => {
      console.log(`-> 💻 Server runing at: ${process.env.SERVER_URL}`);
      swaggerDocsV1(this.app);
    });
  }
}

export default Server;
