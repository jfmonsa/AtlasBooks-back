import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options_v1 = {
  definition: {
    openapi: "3.0.0",
    failOnErrors: true,
    info: {
      title: "AtlasBooks REST API",
      description: "Documentation for AtlasBooks endpoints",
      version: "1.0.0",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  apis: ["./src/api/**/v1.route.js"],
};

const swaggerSpecs = swaggerJsdoc(options_v1);

export const swaggerDocs = app => {
  // html/ui version
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  // json version
  app.use("/api/v1/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecs);
  });

  console.log(
    `-> 📚 API v1 docs available at ${process.env.SERVER_URL}/api/v1/docs`
  );
};
