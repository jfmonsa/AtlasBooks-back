import { Router } from "express";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const router = Router({ mergeParams: true });

async function loadRoutes() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const modules = fs.readdirSync(__dirname);

  // read modules (directories) in /src/api
  for (const module of modules) {
    if (module === "router.js") continue;

    const modulePath = path.join(__dirname, module);
    const moduleFiles = fs.readdirSync(modulePath);

    // Search for .routes.js files in each module directory
    for (const file of moduleFiles) {
      if (file.endsWith(".routes.js")) {
        // Convertimos a URL antes de importar
        const routeModulePath = pathToFileURL(
          path.join(__dirname, module, file)
        ).href;
        let routeModule = await import(routeModulePath);
        router.use(`/${module}`, routeModule.default);
      }
    }
  }
  return router;
}

export default loadRoutes;
