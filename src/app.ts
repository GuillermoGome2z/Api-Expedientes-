import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routes from "./routes";
import { mountSwagger } from "./swagger";
import { errorHandler } from "./middlewares/error.middleware";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";
import { metricsMiddleware } from "./middlewares/metrics.middleware";
import { apiRateLimiter } from "./middlewares/rateLimiter.middleware";
import { healthCheck } from "./controllers/health.controller";
import { metricsEndpoint } from "./controllers/metrics.controller";
import { logger } from "./config/logger";
import { env } from "./config/env";

const app = express();

// BasePath configurable desde .env (default: /api)
const BASE_PATH = env.BASE_PATH;

// 1. Helmet para seguridad de headers (CSP, HSTS, etc.)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Para Swagger UI
        scriptSrc: ["'self'", "'unsafe-inline'"], // Para Swagger UI
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: env.NODE_ENV === "production" 
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false, // HSTS solo en producción
  })
);

// 2. Compresión HTTP para respuestas grandes (Excel, JSON)
app.use(compression());

// 3. Request ID para trazabilidad
app.use(requestIdMiddleware);

// 4. Métricas de Prometheus
app.use(metricsMiddleware);

// 5. Parseo de JSON
app.use(express.json());

// 6. CORS multi-origen robusto con validación dinámica
const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3001", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn("Origen CORS bloqueado", { origin });
        callback(new Error("Origen no permitido por política CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// 7. Rate limiting general para toda la API
app.use(BASE_PATH, apiRateLimiter);

// 8. Endpoints especiales (health y metrics)
app.get(`${BASE_PATH}/health`, healthCheck);
app.get("/metrics", metricsEndpoint);

// 9. Montar rutas bajo BASE_PATH
app.use(BASE_PATH, routes);
mountSwagger(app);

// 10. Redirect root to docs
app.get("/", (_, res) => res.redirect("/docs"));

// 11. Middleware global de errores (debe ir al final)
app.use(errorHandler);

export default app;
