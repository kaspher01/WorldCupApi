import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "World Cup API",
    version: "1.0.0",
    description: "API for managing World Cup teams and players",
  },
};

const options = {
  swaggerDefinition,
  apis: [
    "./src/rest/routes/worldCups/*.js",
    "./src/rest/routes/teams/*.js",
    "./src/rest/routes/players/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
