import { Response } from "express";

/**
 * Utilidades para respuestas HTTP estandarizadas
 * Formato de éxito: { success: true, data: any }
 * Formato de error: { success: false, error: string, details?: any }
 */

export function sendSuccess(res: Response, data: any, statusCode: number = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendError(
  res: Response,
  error: string,
  statusCode: number = 400,
  details?: any
) {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(details && { details }),
  });
}

export function sendCreated(res: Response, data: any) {
  return sendSuccess(res, data, 201);
}

export function sendNotFound(res: Response, message: string = "Recurso no encontrado") {
  return sendError(res, message, 404);
}

export function sendUnauthorized(res: Response, message: string = "No autorizado") {
  return sendError(res, message, 401);
}

export function sendForbidden(res: Response, message: string = "Prohibido") {
  return sendError(res, message, 403);
}

export function sendBadRequest(res: Response, message: string = "Petición inválida") {
  return sendError(res, message, 400);
}
