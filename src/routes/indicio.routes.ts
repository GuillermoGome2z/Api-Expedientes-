import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
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
 *             required: [descripcion, peso, color, tamano]
 *             properties:
 *               descripcion:
 *                 type: string
 *               peso:
 *                 type: number
 *                 example: 1.5
 *               color:
 *                 type: string
 *                 example: negro
 *               tamano:
 *                 type: string
 *                 example: pequeño
 *     responses:
 *       201:
 *         description: Indicio creado
 */
r.post("/expedientes/:id/indicios", requireAuth, requireRole("tecnico"), crearIndicio);

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
 *             properties:
 *               descripcion:
 *                 type: string
 *               peso:
 *                 type: number
 *     responses:
 *       200:
 *         description: Indicio actualizado
 */
r.put("/indicios/:id", requireAuth, requireRole("tecnico"), actualizarIndicio);

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
