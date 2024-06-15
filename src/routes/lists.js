import { Router } from "express";
const router = Router();
import {
  createList,
  getList,
  getAllListsOfUser,
  addBookToList,
  deleteBookFromList,
} from "../controllers/lists.js";
import { authMiddleware } from "../middleware/session.js";

// Ruta para crear una lista
router.post("/", createList);

// Ruta para obtener una lista por su ID
router.get("/:id", getList);

//Ruta para obtener todas las listas
router.get(
  "/myLists/basicInfo/:userId/:bookId",
  authMiddleware,
  getAllListsOfUser
);
router.put("/addBookToList", authMiddleware, addBookToList);
router.delete("/deleteBookToList", authMiddleware, deleteBookFromList);

export default router;
