import { Request, Response } from "express";
import { register } from "../config/metrics";

/**
 * Endpoint para exponer métricas de Prometheus
 * Accesible en /metrics
 */
export async function metricsEndpoint(req: Request, res: Response) {
  res.setHeader("Content-Type", register.contentType);
  const metrics = await register.metrics();
  res.send(metrics);
}
