import { Request, Response } from "express";
import { getPool } from "../db/db";
import { logger } from "../config/logger";
import { dbErrorCounter } from "../config/metrics";

/**
 * Health check avanzado que verifica:
 * - Estado de la aplicación
 * - Conexión a base de datos
 * - Uptime del servidor
 * - Uso de memoria
 * 
 * Retorna 200 si todo OK, 503 si DB falla
 */
export async function healthCheck(req: Request, res: Response) {
  const startTime = Date.now();
  
  // Información básica
  const health: any = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: "MB",
    },
  };

  // Verificar conexión a base de datos
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT 1 AS test");
    
    health.database = {
      status: "connected",
      responseTime: `${Date.now() - startTime}ms`,
    };

    logger.info("Health check exitoso", { requestId: req.requestId });
    return res.status(200).json({ success: true, data: health });
    
  } catch (error: any) {
    health.status = "degraded";
    health.database = {
      status: "error",
      message: "No se pudo conectar a la base de datos",
    };

    // Incrementar métrica de error de DB
    dbErrorCounter.inc();

    logger.error("Health check falló: error de base de datos", {
      requestId: req.requestId,
      error: error.message,
    });

    return res.status(503).json({
      success: false,
      error: "Servicio no disponible",
      details: health,
    });
  }
}
