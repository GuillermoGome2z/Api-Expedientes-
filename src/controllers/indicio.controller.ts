import { Response } from "express";
import { getPool, sql } from "../db/db";
import { AuthRequest } from "../middlewares/auth.middleware";

// GET /expedientes/:id/indicios
export async function listarIndiciosPorExpediente(req: AuthRequest, res: Response) {
  const expediente_id = Number(req.params.id);
  const pool = await getPool();
  const r = await pool.request().input("expediente_id", sql.Int, expediente_id)
    .execute("sp_Indicios_ListarPorExpediente");
  res.json(r.recordset);
}

// POST /expedientes/:id/indicios  (solo técnico dueño; regla validada en SP de actualizar/crear por dueño)
export async function crearIndicio(req: AuthRequest, res: Response) {
  const expediente_id = Number(req.params.id);
  const { descripcion, peso, color, tamano } = req.body as {
    descripcion: string; peso?: number; color?: string; tamano?: string;
  };

  const pool = await getPool();
  const r = await pool.request()
    .input("expediente_id", sql.Int, expediente_id)
    .input("descripcion", sql.NVarChar(sql.MAX), descripcion)
    .input("peso", sql.Decimal(10,2), peso ?? null)
    .input("color", sql.NVarChar(50), color ?? null)
    .input("tamano", sql.NVarChar(50), tamano ?? null)
    .execute("sp_Indicios_Crear");

  res.status(201).json({ id: r.recordset[0].id });
}

// PUT /indicios/:id
export async function actualizarIndicio(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { descripcion, peso, color, tamano } = req.body as {
    descripcion: string; peso?: number; color?: string; tamano?: string;
  };

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("descripcion", sql.NVarChar(sql.MAX), descripcion)
    .input("peso", sql.Decimal(10,2), peso ?? null)
    .input("color", sql.NVarChar(50), color ?? null)
    .input("tamano", sql.NVarChar(50), tamano ?? null)
    .execute("sp_Indicios_Actualizar");

  if (!r.recordset[0]?.updated) return res.status(400).json({ error: "No se pudo actualizar" });
  res.json({ ok: true });
}

// PATCH /indicios/:id/activo
export async function toggleActivoIndicio(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { activo } = req.body as { activo: boolean };

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("activo", sql.Bit, activo ? 1 : 0)
    .execute("sp_Indicios_ActivarDesactivar");

  if (!r.recordset[0]?.updated) return res.status(400).json({ error: "No se pudo actualizar activo" });
  res.json({ ok: true });
}
