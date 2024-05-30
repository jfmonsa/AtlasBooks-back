import { Router } from "express";
const router = Router();
import {
  createList,
  getAllLists,
  getList,
  saveBookToList,
} from "../controllers/lists.js";

router.post("/:listId", saveBookToList);
// Ruta para crear una lista
router.post("/", createList);

//

// Ruta para obtener una lista por su ID
router.get("/:id", getList);

//Ruta para obtener todas las listas
router.get("/", getAllLists);

export default router;
