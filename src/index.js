import express from "express";
// import dotenv from 'dotenv';
// dotenv.config();
// const morganBody = require("morgan-body"); ni idea que es, dejar comentado por si trin
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
import router from "./routes/atlas.routes.js";

// Middlewares
app.use(cors());
// -- support post requests
app.use(express.json());
// -- support file uploading
app.use(express.static("storage"));
// -- xd?
app.use(express.urlencoded({ extended: false }));

// Routes
// TODO: Abstraer toda la logica de las rutas al router
/*
 * API Rest
 */
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

/**
 * API - Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 */
