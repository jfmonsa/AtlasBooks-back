import { Router } from "express";
const router = Router();

//Hello world
router.get("/", (req, res) => {
  res.send({ message: "Welcome to AtlasBooks" });
});

export default router;
