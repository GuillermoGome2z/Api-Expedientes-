import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import {
  listarExpedientes, crearExpediente, obtenerExpediente,
  actualizarExpediente, cambiarEstado, toggleActivoExpediente
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
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Expediente creado
 *       400:
 *         description: Datos inválidos
 */
r.post("/", requireAuth, requireRole("tecnico"), crearExpediente);

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
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expediente actualizado
 *       403:
 *         description: No autorizado
 */
r.put("/:id", requireAuth, requireRole("tecnico"), actualizarExpediente);

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
 *             required: [estado, justificacion]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [aprobado, rechazado]
 *               justificacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado cambiado
 *       403:
 *         description: Solo coordinador puede cambiar estado
 */
r.patch("/:id/estado", requireAuth, requireRole("coordinador"), cambiarEstado);

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

export default r;
