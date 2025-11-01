import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { loginRateLimiter } from "../middlewares/rateLimiter.middleware";

const r = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     description: |
 *       Autentica un usuario y retorna un JWT válido por la duración configurada en JWT_EXPIRES.
 *
 *       **Rate Limit:** 5 peticiones por 15 minutos por IP.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: tecnico1
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Token generado correctamente
 *         headers:
 *           RateLimit-Limit:
 *             schema:
 *               type: integer
 *             description: Máximo de peticiones permitidas (5)
 *           RateLimit-Remaining:
 *             schema:
 *               type: integer
 *             description: Peticiones restantes
 *           RateLimit-Reset:
 *             schema:
 *               type: integer
 *             description: Timestamp epoch cuando se resetea
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: tecnico1
 *                         rol:
 *                           type: string
 *                           enum: [tecnico, coordinador]
 *                           example: tecnico
 *       400:
 *         description: Faltan credenciales
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: username y password son requeridos
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: Credenciales inválidas
 *       429:
 *         $ref: '#/components/responses/RateLimitExceeded'
 */
r.post("/login", loginRateLimiter, login);

export default r;
