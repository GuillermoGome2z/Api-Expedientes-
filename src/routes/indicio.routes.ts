import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  listarIndiciosPorExpediente,
  crearIndicio,
  actualizarIndicio,
  toggleActivoIndicio,
} from "../controllers/indicio.controller";

const r = Router();

/**
 * @openapi
 * /expedientes/{id}/indicios:
 *   get:
 *     summary: Listar indicios de un expediente
 *     tags: [Indicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Lista de indicios
 */
r.get("/expedientes/:id/indicios", requireAuth, listarIndiciosPorExpediente);

/**
 * @openapi
 * /expedientes/{id}/indicios:
 *   post:
 *     summary: Crear un nuevo indicio para un expediente (solo técnico)
 *     tags: [Indicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [descripcion]
 *             properties:
 *               descripcion:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 500
 *                 example: "Arma blanca encontrada en la escena del crimen"
 *               peso:
 *                 type: number
 *                 minimum: 0
 *                 example: 1.5
 *               color:
 *                 type: string
 *                 maxLength: 30
 *                 example: "negro"
 *               tamano:
 *                 type: string
 *                 maxLength: 30
 *                 example: "pequeño"
 *     responses:
 *       201:
 *         description: Indicio creado
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *             example:
 *               errors:
 *                 - msg: "La descripción debe tener entre 3 y 500 caracteres"
 *                   param: "descripcion"
 */
r.post(
  "/expedientes/:id/indicios",
  requireAuth,
  requireRole("tecnico"),
  body("descripcion").isString().trim().isLength({ min: 3, max: 500 }).withMessage("La descripción debe tener entre 3 y 500 caracteres"),
  body("peso").optional().isFloat({ min: 0 }).withMessage("El peso debe ser un número mayor o igual a 0"),
  body("color").optional().isString().trim().isLength({ max: 30 }).withMessage("El color no puede exceder 30 caracteres"),
  body("tamano").optional().isString().trim().isLength({ max: 30 }).withMessage("El tamaño no puede exceder 30 caracteres"),
  validate,
  crearIndicio
);

/**
 * @openapi
 * /indicios/{id}:
 *   put:
 *     summary: Actualizar un indicio (solo técnico dueño)
 *     tags: [Indicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [descripcion]
 *             properties:
 *               descripcion:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 500
 *               peso:
 *                 type: number
 *                 minimum: 0
 *               color:
 *                 type: string
 *                 maxLength: 30
 *               tamano:
 *                 type: string
 *                 maxLength: 30
 *     responses:
 *       200:
 *         description: Indicio actualizado
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 */
r.put(
  "/indicios/:id",
  requireAuth,
  requireRole("tecnico"),
  body("descripcion").isString().trim().isLength({ min: 3, max: 500 }).withMessage("La descripción debe tener entre 3 y 500 caracteres"),
  body("peso").optional().isFloat({ min: 0 }).withMessage("El peso debe ser un número mayor o igual a 0"),
  body("color").optional().isString().trim().isLength({ max: 30 }).withMessage("El color no puede exceder 30 caracteres"),
  body("tamano").optional().isString().trim().isLength({ max: 30 }).withMessage("El tamaño no puede exceder 30 caracteres"),
  validate,
  actualizarIndicio
);

/**
 * @openapi
 * /indicios/{id}/activo:
 *   patch:
 *     summary: Activar o desactivar un indicio (soft delete)
 *     tags: [Indicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado de activo actualizado
 */
r.patch("/indicios/:id/activo", requireAuth, toggleActivoIndicio);

export default r;
