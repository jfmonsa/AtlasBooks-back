import { Router } from "express";
import { search_filter_lists } from "../controllers/searchFilterLists.js"; // Asegúrate de importar el controlador correcto

const router = Router();

router.get("/", search_filter_lists); // Asegúrate de que la ruta es '/'

export default router;
