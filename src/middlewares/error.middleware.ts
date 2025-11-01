import { Request, Response, NextFunction } from "express";

/**
 * Middleware global de manejo de errores.
 * Debe registrarse al final de todos los middlewares en app.ts.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log del error (en producción usarías un logger como Winston)
  console.error("❌ Error capturado:", {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method,
  });

  // Error de autenticación
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Usar statusCode si existe, sino 500
  const statusCode = err.statusCode || 500;

  // En producción, mensaje genérico; en desarrollo, detallado
  const message =
    process.env.NODE_ENV === "production"
      ? "Error interno del servidor"
      : err.message || "Error desconocido";

  return res.status(statusCode).json({ error: message });
}
