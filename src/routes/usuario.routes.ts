import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { crearUsuario, cambiarContrasena, listarUsuarios } from "../controllers/usuario.controller";

const r = Router();

/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario (solo coordinador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, rol]
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "nuevo_tecnico"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               rol:
 *                 type: string
 *                 enum: [tecnico, coordinador]
 *                 example: "tecnico"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o username duplicado
 *       403:
 *         description: Solo coordinadores pueden crear usuarios
 */
r.post(
  "/",
  requireAuth,
  requireRole("coordinador"),
  body("username").isString().trim().isLength({ min: 3, max: 50 }).withMessage("El username debe tener entre 3 y 50 caracteres"),
  body("password").isString().isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("rol").isString().isIn(["tecnico", "coordinador"]).withMessage("El rol debe ser tecnico o coordinador"),
  validate,
  crearUsuario
);

/**
 * @openapi
 * /usuarios/{id}/password:
 *   patch:
 *     summary: Cambiar contraseña de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [passwordActual, passwordNueva]
 *             properties:
 *               passwordActual:
 *                 type: string
 *                 example: "password123"
 *               passwordNueva:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       401:
 *         description: Contraseña actual incorrecta
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
r.patch(
  "/:id/password",
  requireAuth,
  body("passwordActual").isString().notEmpty().withMessage("La contraseña actual es requerida"),
  body("passwordNueva").isString().isLength({ min: 6 }).withMessage("La contraseña nueva debe tener al menos 6 caracteres"),
  validate,
  cambiarContrasena
);

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Listar usuarios (solo coordinador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *         description: Número de página (alias)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Tamaño de página
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: Solo coordinadores pueden listar usuarios
 */
r.get("/", requireAuth, requireRole("coordinador"), listarUsuarios);

export default r;
