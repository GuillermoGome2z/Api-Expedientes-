import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  listarExpedientes, crearExpediente, obtenerExpediente,
  actualizarExpediente, cambiarEstado, toggleActivoExpediente, exportarExpedientes
} from "../controllers/expediente.controller";

const r = Router();

/**
 * @openapi
 * /expedientes:
 *   get:
 *     summary: Lista expedientes con paginación y filtros
 *     tags: [Expedientes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Tamaño de página
 *     responses:
 *       200:
 *         description: Lista de expedientes
 */
r.get("/", requireAuth, listarExpedientes);

/**
 * @openapi
 * /expedientes/{id}:
 *   get:
 *     summary: Obtener un expediente por ID
 *     tags: [Expedientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Detalle del expediente
 *       404:
 *         description: No encontrado
 */
r.get("/:id", requireAuth, obtenerExpediente);

/**
 * @openapi
 * /expedientes:
 *   post:
 *     summary: Crear un nuevo expediente (solo técnico)
 *     tags: [Expedientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [codigo, titulo, descripcion]
 *             properties:
 *               codigo:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: "EXP-2025-001"
 *               titulo:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: "Caso de robo en residencia"
 *               descripcion:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 1000
 *                 example: "Descripción detallada del caso..."
 *     responses:
 *       201:
 *         description: Expediente creado
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
 *                 - msg: "El código debe tener entre 3 y 30 caracteres"
 *                   param: "codigo"
 */
r.post(
  "/",
  requireAuth,
  requireRole("tecnico"),
  body("codigo").isString().trim().isLength({ min: 3, max: 30 }).withMessage("El código debe tener entre 3 y 30 caracteres"),
  body("titulo").isString().trim().isLength({ min: 3, max: 100 }).withMessage("El título debe tener entre 3 y 100 caracteres"),
  body("descripcion").isString().trim().isLength({ min: 5, max: 1000 }).withMessage("La descripción debe tener entre 5 y 1000 caracteres"),
  validate,
  crearExpediente
);

/**
 * @openapi
 * /expedientes/{id}:
 *   put:
 *     summary: Actualizar un expediente (solo técnico dueño)
 *     tags: [Expedientes]
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
 *               titulo:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               descripcion:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Expediente actualizado
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
 *       403:
 *         description: No autorizado
 */
r.put(
  "/:id",
  requireAuth,
  requireRole("tecnico"),
  body("titulo").isString().trim().isLength({ min: 3, max: 100 }).withMessage("El título debe tener entre 3 y 100 caracteres"),
  body("descripcion").isString().trim().isLength({ min: 5, max: 1000 }).withMessage("La descripción debe tener entre 5 y 1000 caracteres"),
  validate,
  actualizarExpediente
);

/**
 * @openapi
 * /expedientes/{id}/estado:
 *   patch:
 *     summary: Cambiar estado de un expediente (solo coordinador)
 *     tags: [Expedientes]
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
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [abierto, aprobado, rechazado]
 *                 example: "aprobado"
 *               justificacion:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 example: "El expediente cumple con todos los requisitos establecidos"
 *     responses:
 *       200:
 *         description: Estado cambiado
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
 *                 - msg: "El estado debe ser: abierto, aprobado o rechazado"
 *                   param: "estado"
 *       403:
 *         description: Solo coordinador puede cambiar estado
 */
r.patch(
  "/:id/estado",
  requireAuth,
  requireRole("coordinador"),
  body("estado").isString().isIn(["abierto", "aprobado", "rechazado"]).withMessage("El estado debe ser: abierto, aprobado o rechazado"),
  body("justificacion").optional().isString().trim().isLength({ min: 5, max: 500 }).withMessage("La justificación debe tener entre 5 y 500 caracteres"),
  body("justificacion").if(body("estado").equals("rechazado")).notEmpty().withMessage("La justificación es obligatoria cuando el estado es rechazado"),
  validate,
  cambiarEstado
);

/**
 * @openapi
 * /expedientes/{id}/activo:
 *   patch:
 *     summary: Activar o desactivar un expediente (soft delete)
 *     tags: [Expedientes]
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
r.patch("/:id/activo", requireAuth, toggleActivoExpediente);

/**
 * @openapi
 * /expedientes/export:
 *   get:
 *     summary: Exportar expedientes a Excel
 *     tags: [Expedientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [abierto, aprobado, rechazado]
 *       - in: query
 *         name: tecnicoId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Archivo Excel con expedientes
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
r.get("/export", requireAuth, exportarExpedientes);

export default r;
