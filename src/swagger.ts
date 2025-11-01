import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";
import { env } from "./config/env";

export function mountSwagger(app: Express): void {
  const BASE_PATH = env.BASE_PATH;
  const PORT = env.PORT;
  
  const options: Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API de Gestión de Expedientes e Indicios",
        version: "1.0.0",
        description:
          "Documentación generada con Swagger para la API de Expedientes e Indicios.\n\n" +
          "Incluye endpoints de autenticación, expedientes, indicios y usuarios.\n\n" +
          "**Credenciales de prueba:**\n" +
          "- Técnico: `tecnico1` / `tecnico123`\n" +
          "- Coordinador: `coord1` / `tecnico123`\n\n" +
          "**Paginación:**\n" +
          "Los endpoints de listado soportan alias:\n" +
          "- `page` o `pagina` (número de página)\n" +
          "- `pageSize` o `tamanoPagina` (tamaño de página)",
      },
      servers: [
        {
          url: `http://localhost:${PORT}${BASE_PATH}`,
          description: "Servidor local (desarrollo)",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Ingrese el token JWT obtenido del endpoint /auth/login (sin el prefijo 'Bearer')",
          },
        },
      },
      // Seguridad global por defecto (se puede sobreescribir en rutas individuales)
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./src/routes/*.ts"], // aquí Swagger lee las anotaciones JSDoc de tus rutas
  };

  const swaggerSpec = swaggerJSDoc(options);

  // Monta en /docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
