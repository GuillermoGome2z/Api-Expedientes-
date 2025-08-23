import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function requireRole(...roles: Array<"tecnico"|"coordinador">) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const rol = req.user?.rol;
    if (!rol || !roles.includes(rol)) return res.status(403).json({ error: "Rol no autorizado" });
    next();
  };
}

