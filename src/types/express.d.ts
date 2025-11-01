import { Request } from "express";

/**
 * Extensión de tipos de Express para incluir el usuario autenticado.
 * Esto permite type-safety en req.user después de pasar por requireAuth middleware.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        rol: "tecnico" | "coordinador";
      };
    }
  }
}

export {};
