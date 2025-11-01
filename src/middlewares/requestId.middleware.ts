import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Middleware que inyecta un requestId único por petición
 * Se almacena en req.requestId para logging y trazabilidad
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = uuidv4();
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
}
