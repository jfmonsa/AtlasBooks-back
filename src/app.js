import express from "express";
import moragn from "morgan";

import atlasRoutes from "./routes/atlas.routes.js";
const app = express();

app.use(moragn("dev"));
app.use(express.json());
app.use(atlasRoutes);
export default app;
