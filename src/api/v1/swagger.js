import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AtlasBooks API",
      description: "Swagger documentation of AtlasBooks API endpoints",
      version: "1.0.0",
      description: "A simple Express API with Swagger documentation",
    },
  },
  apis: ["./../api/v1/modules/*/*.route.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

export const swaggerDocs = app => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  // json version
  app.use("/api/v1/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecs);
  });

  console.log("API v1 docs available at /api/v1/docs");
};
