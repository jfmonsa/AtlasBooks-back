import { Router } from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import removeFileExt from "../../utils/removeFileExtension.js";

const router = Router();

/**
 * # loadRoutes()
 * Reads .route.js files in ./modules/<module>/ and dynamically loads each route in the express router.
 */
const loadRoutes = async () => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const modulesPath = path.join(__dirname, "modules");

    // Get the list of module directories
    const modules = fs.readdirSync(modulesPath);

    // Iterate over each module directory
    for (const module of modules) {
      const modulePath = path.join(modulesPath, module);
      const moduleFiles = fs.readdirSync(modulePath);

      // Search for .route.js files in each module directory
      for (const file of moduleFiles) {
        if (file.endsWith(".route.js")) {
          const fileWithoutExt = removeFileExt(file);
          try {
            // Dynamic importing of the route file
            let routeModule = await import(path.join(modulePath, file));
            router.use(`/${module}`, routeModule.default); // Use the module name as the base route
          } catch (error) {
            console.error(`Error importing ${fileWithoutExt} module: `, error);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading ./modules directory: ", error);
  }
};

// Load the routes
loadRoutes();

export default router;
