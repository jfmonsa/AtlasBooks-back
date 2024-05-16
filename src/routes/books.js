import { Router } from "express";
const router = Router();

//Hello world
router.get("/books", (req, res) => {
  res.json({ message: "Welcome to AtlasBooks" });
});

export default router;
