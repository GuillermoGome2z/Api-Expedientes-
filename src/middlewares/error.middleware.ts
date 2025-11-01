import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { env } from "../config/env";

/**
 * Middleware global de manejo de errores.
 * Debe registrarse al final de todos los middlewares en app.ts.
 * 
 * Loguea errores con Winston incluyendo requestId para trazabilidad.
 * Retorna respuestas normalizadas con formato { success, error, details? }
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log estructurado con Winston + requestId
  logger.error("Error capturado en la aplicación", {
    requestId: req.requestId,
    name: err.name,
    message: err.message,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Error de autenticación (JWT)
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      error: "No autorizado",
      details: env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Usar statusCode si existe, sino 500
  const statusCode = err.statusCode || 500;

  // Mensaje de error según entorno
  const message =
    env.NODE_ENV === "production"
      ? "Error interno del servidor"
      : err.message || "Error desconocido";

  // Respuesta normalizada
  return res.status(statusCode).json({
    success: false,
    error: message,
    details: env.NODE_ENV === "development" ? { stack: err.stack } : undefined,
  });
}
