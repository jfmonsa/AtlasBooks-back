import { Router } from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
const router = Router();

//Aux code
const PATH_ROUTES = path.dirname(fileURLToPath(import.meta.url));
const removeExtension = (filename) => {
  return filename.split(".").shift();
};

/*
 * leer el directorio ./routes y cargar dinamicamente cada archivo
 * para agregarlo en las rutas
 *
 * agregar archivos en ./routes  y de ese archivo se generará automaticamente
 * una ruta
 */
const loadRoutes = async () => {
  try {
    const files = await fs.readdirSync(PATH_ROUTES);
    for (const file of files) {
      const fileWithOutExt = removeExtension(file);

      if (fileWithOutExt !== "index") {
        try {
          // Utiliza la importación dinámica para importar el módulo
          let module = await import(`./${fileWithOutExt}.js`);
          router.use(`/${fileWithOutExt}`, module.default);
        } catch (error) {
          console.error(
            `Error al importar el módulo ${fileWithOutExt}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.error("Error al leer el directorio:", error);
  }
};
loadRoutes();

export default router;
