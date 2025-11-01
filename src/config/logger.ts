import winston from "winston";
import { env } from "./env";

/**
 * Logger estructurado con Winston
 * - Transports: combined.log (todos los logs) y error.log (solo errores)
 * - Formato: JSON con timestamp, nivel, mensaje y metadatos
 * - Console en desarrollo, archivos en producción
 */
const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "expedientes-api" },
  transports: [
    // Logs de error: solo nivel error y superior
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Logs combinados: todos los niveles
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// En desarrollo, también loguear a consola con colores
if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export { logger };
