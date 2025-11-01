import rateLimit from "express-rate-limit";

/**
 * Rate limiter para login: previene brute-force
 * 5 intentos cada 15 minutos por IP
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 peticiones
  message: {
    success: false,
    error:
      "Demasiados intentos de login. Por favor intenta de nuevo en 15 minutos.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate limiter para exportaciones: previene abuso de recursos
 * 10 exportaciones por minuto por IP
 */
export const exportRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 peticiones
  message: {
    success: false,
    error: "Demasiadas exportaciones. Por favor espera un minuto.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter general para API: protección básica
 * 100 peticiones por minuto por IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  message: {
    success: false,
    error: "Demasiadas peticiones. Por favor intenta de nuevo en un minuto.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
