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
        schemas: {
          SuccessResponse: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: true,
              },
              data: {
                type: "object",
                description: "Payload de la respuesta exitosa",
              },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              error: {
                type: "string",
                example: "Mensaje de error descriptivo",
              },
              details: {
                type: "string",
                description: "Información adicional sobre el error (opcional)",
              },
            },
          },
          PaginatedResponse: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: true,
              },
              data: {
                type: "object",
                properties: {
                  page: {
                    type: "integer",
                    example: 1,
                  },
                  pageSize: {
                    type: "integer",
                    example: 10,
                  },
                  total: {
                    type: "integer",
                    example: 45,
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          UnauthorizedError: {
            description: "Token no proporcionado o inválido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  success: false,
                  error: "Token requerido",
                },
              },
            },
          },
          ForbiddenError: {
            description: "No tienes permisos para acceder a este recurso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  success: false,
                  error: "No tienes permiso para realizar esta acción",
                },
              },
            },
          },
          RateLimitExceeded: {
            description: "Has excedido el límite de peticiones permitidas",
            headers: {
              "RateLimit-Limit": {
                schema: {
                  type: "integer",
                },
                description: "Número máximo de peticiones permitidas",
              },
              "RateLimit-Remaining": {
                schema: {
                  type: "integer",
                },
                description: "Número de peticiones restantes",
              },
              "RateLimit-Reset": {
                schema: {
                  type: "integer",
                },
                description: "Timestamp (epoch) cuando se resetea el límite",
              },
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
                example: {
                  success: false,
                  error: "Too many requests, please try again later.",
                },
              },
            },
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
