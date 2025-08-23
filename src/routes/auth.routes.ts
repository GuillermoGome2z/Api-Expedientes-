import { Router } from "express";
import { login } from "../controllers/auth.controller";

const r = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: tecnico@umg.edu
 *               password:
 *                 type: string
 *                 example: tecnico123
 *     responses:
 *       200:
 *         description: Token generado correctamente
 *       401:
 *         description: Credenciales inválidas
 */
r.post("/login", login);

export default r;
