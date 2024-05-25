import { Router } from "express";
const router = Router();
import { createList, getList } from "../controllers/lists.js";

// Ruta para crear una lista
router.post("/", createList);

// Ruta para obtener una lista por su ID
router.get("/:id", getList);

// Eliminar esta ruta ya que no tiene sentido tener una ruta get "/" que se solapa con get("/:id")
// router.get("/", getList);

export default router;
