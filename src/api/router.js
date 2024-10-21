import { Router } from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const router = Router({ mergeParams: true });

const loadRoutes = async () => {
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
        try {
          // Dynamic importing of the route file
          console.log(path.join(__dirname, module, file));
          let routeModule = await import(path.join(__dirname, module, file));
          router.use(`/${module}`, routeModule.default); // Use the module name as the base route
        } catch (error) {
          console.error(error);
          //throw new Error(error);
          //throw new Error(`Error importing ${module} module`);
        }
      }
    }
  }
};

await loadRoutes();

export default router;
