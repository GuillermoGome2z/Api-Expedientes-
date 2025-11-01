import { Request, Response, NextFunction } from "express";

/**
 * Middleware de control de acceso basado en roles (RBAC).
 * Verifica que el usuario autenticado tenga uno de los roles especificados.
 * 
 * @param roles - Array de roles permitidos ('tecnico' | 'coordinador')
 * @returns Middleware function
 */
export function requireRole(...roles: Array<"tecnico"|"coordinador">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const rol = req.user?.rol;
    if (!rol || !roles.includes(rol)) {
      return res.status(403).json({ error: "Rol no autorizado" });
    }
    next();
  };
}

