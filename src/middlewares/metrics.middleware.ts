import { Request, Response, NextFunction } from "express";
import { httpRequestCounter, httpRequestDuration } from "../config/metrics";

/**
 * Middleware para registrar métricas de Prometheus
 * Captura método, ruta, código de estado y latencia de cada petición
 */
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  // Capturar el fin de la respuesta
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000; // Convertir a segundos
    const route = req.route?.path || req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();

    // Incrementar contador de peticiones
    httpRequestCounter.inc({
      method,
      route,
      status_code: statusCode,
    });

    // Registrar duración en histograma
    httpRequestDuration.observe(
      {
        method,
        route,
        status_code: statusCode,
      },
      duration
    );
  });

  next();
}
