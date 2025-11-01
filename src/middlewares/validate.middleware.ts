import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Middleware genérico que verifica los resultados de express-validator.
 * Si hay errores, responde con 400 y un array de { msg, param }.
 * Si no hay errores, pasa al siguiente middleware.
 */
export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      msg: err.msg,
      param: err.type === "field" ? err.path : "unknown",
    }));
    return res.status(400).json({ errors: formattedErrors });
  }
  next();
}
