import { Router } from "express";
const router = Router();
import { createList } from "../controllers/lists.js";

router.get("/", async (req, res) => {
  res.send({ message: "ruta de las listas" });
});

router.post("/", createList);

export default router;
