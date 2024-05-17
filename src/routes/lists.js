import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  res.send({ message: "ruta de las listas" });
});

export default router;
