import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwt.utils";

/**
 * @deprecated Use Request from express directly (types/express.d.ts extends it)
 * Mantenido por compatibilidad con código existente
 */
export interface AuthRequest extends Request {
  user?: { id: number; username: string; rol: "tecnico"|"coordinador" };
}

/**
 * Middleware de autenticación JWT.
 * Verifica el token Bearer en el header Authorization.
 * Si es válido, adjunta req.user con los datos del usuario.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token requerido" });
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}
