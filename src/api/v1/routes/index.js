import { Router } from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import removeFileExt from "../../../utils/removeFileExtension.js";
const router = Router();

/**
 * # loadRoutes()
 *
 * read the files in `./routes` and dynamically load each file name  (without its extention)
 * as a route in the express router.
 */
const loadRoutes = async () => {
  try {
    const PATH_ROUTES = path.dirname(fileURLToPath(import.meta.url));
    const files = fs.readdirSync(PATH_ROUTES);

    // iterate over files in `./routes` directory
    for (const file of files) {
      const fileWithoutExt = removeFileExt(file);
      if (fileWithoutExt !== "index") {
        try {
          // dynamic importing of modules located in `./routes`
          let module = await import(`./${file}`);
          router.use(`/${fileWithoutExt}`, module.default);
        } catch (error) {
          console.error(`Eror importing ${fileWithoutExt} module: `, error);
        }
      }
    }
  } catch (error) {
    console.error("Error reading ./routes directory: ", error);
  }
};
loadRoutes();

export default router;
