import { Router } from "express";
import { register, login } from "../controllers/atlas.controller.js";
const router = Router();

//Hello world
router.get("/", (req, res) => {
  res.json({ message: "Welcome to AtlasBooks" });
});

router.post("/register", register);
router.post("/login", login);

// TODO: route /books: GET, POST, DELETE, PUT
router.get("/books", (req, res) => {
  const data = ["hola"];
  res.send({ data });
});

//routes here
export default router;
