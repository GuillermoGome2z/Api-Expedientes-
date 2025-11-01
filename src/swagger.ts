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
          "Documentación generada con Swagger para la API de Expedientes e Indicios.\n\n" +
          "Incluye endpoints de autenticación, expedientes, indicios y usuarios.\n\n" +
          "**Credenciales de prueba:**\n" +
          "- Técnico: `tecnico1` / `tecnico123`\n" +
          "- Coordinador: `coord1` / `tecnico123`",
      },
      servers: [
        {
          url: "http://localhost:3000/api",
          description: "Servidor local (desarrollo)",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Ingrese el token JWT obtenido del endpoint /auth/login",
          },
        },
        parameters: {
          PageQuery: {
            name: "page",
            in: "query",
            description: "Número de página (empieza en 1). También acepta el alias `pagina`.",
            required: false,
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          PageSizeQuery: {
            name: "pageSize",
            in: "query",
            description: "Tamaño de página. También acepta el alias `tamanoPagina`.",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
        },
      },
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
