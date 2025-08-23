import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwt.utils";

export interface AuthRequest extends Request {
  user?: { id: number; username: string; rol: "tecnico"|"coordinador" };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
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
