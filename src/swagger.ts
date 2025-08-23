import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";

export function mountSwagger(app: Express): void {
  const options: Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API de Gestión de Expedientes e Indicios",
        version: "1.0.0",
        description:
          "Documentación generada con Swagger para la API de Expedientes e Indicios.\n\nIncluye endpoints de autenticación, expedientes e indicios.",
      },
      servers: [
        {
          url: "http://localhost:3000/api",
          description: "Servidor local (desarrollo)",
        },
      ],
    },
    apis: ["./src/routes/*.ts"], // aquí Swagger lee las anotaciones JSDoc de tus rutas
  };

  const swaggerSpec = swaggerJSDoc(options);

  // Monta en /docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
