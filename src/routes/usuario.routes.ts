import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { crearUsuario, cambiarContrasena, listarUsuarios, toggleActivoUsuario } from "../controllers/usuario.controller";

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
  // Validación personalizada: aceptar passwordNueva O newPassword
  body().custom((value, { req }) => {
    const passwordNueva = req.body.passwordNueva || req.body.newPassword;
    if (!passwordNueva || typeof passwordNueva !== 'string' || passwordNueva.length < 6) {
      throw new Error('La contraseña nueva debe ser un string de al menos 6 caracteres (usar passwordNueva o newPassword)');
    }
    return true;
  }),
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
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/PageSizeQuery'
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: Solo coordinadores pueden listar usuarios
 */
r.get("/", requireAuth, requireRole("coordinador"), listarUsuarios);

/**
 * @openapi
 * /usuarios/{id}/activo:
 *   patch:
 *     summary: Activar/Desactivar usuario (solo coordinador)
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
 *             required: [activo]
 *             properties:
 *               activo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Estado del usuario actualizado
 *       400:
 *         description: No se pudo actualizar
 *       403:
 *         description: Solo coordinadores pueden modificar usuarios
 */
r.patch(
  "/:id/activo",
  requireAuth,
  requireRole("coordinador"),
  body("activo").isBoolean().withMessage("El campo activo debe ser booleano"),
  validate,
  toggleActivoUsuario
);

export default r;
