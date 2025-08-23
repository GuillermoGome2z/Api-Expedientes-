import { Response } from "express";
import { getPool, sql } from "../db/db";
import { AuthRequest } from "../middlewares/auth.middleware";

/* =========================
   GET /expedientes
   - Técnicos: solo ven los suyos (tecnico_id del token)
   - Coordinadores (u otros): ven todos
========================= */
export async function listarExpedientes(req: AuthRequest, res: Response) {
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 10);
  const q = String(req.query.q ?? "");

  const pool = await getPool();
  const request = pool.request()
    .input("page", sql.Int, page)
    .input("pageSize", sql.Int, pageSize)
    .input("q", sql.NVarChar(255), q);

  // Si el usuario es técnico, filtrar por su tecnico_id
  if (req.user?.rol === "tecnico") {
    request.input("tecnico_id", sql.Int, req.user.id);
  } else {
    request.input("tecnico_id", sql.Int, null);
  }

  const r = await request.execute("sp_Expedientes_Listar");
  res.json({
    page,
    pageSize,
    total: r.recordset?.[0]?.total ?? 0,
    data: r.recordset ?? []
  });
}

/* =========================
   GET /expedientes/:id
========================= */
export async function obtenerExpediente(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const pool = await getPool();
  const r = await pool.request().input("id", sql.Int, id).execute("sp_Expedientes_Obtener");
  const exp = r.recordset[0];
  if (!exp) return res.status(404).json({ error: "No existe" });
  res.json(exp);
}

/* =========================
   POST /expedientes  (solo técnico)
========================= */
export async function crearExpediente(req: AuthRequest, res: Response) {
  const { codigo, titulo, descripcion } = req.body as {
    codigo: string; titulo?: string; descripcion: string;
  };

  if (!codigo || !descripcion) {
    return res.status(400).json({ error: "codigo y descripcion son obligatorios" });
  }
  const tecnico_id = req.user!.id;

  const pool = await getPool();
  const r = await pool.request()
    .input("codigo", sql.NVarChar(50), codigo)
    .input("titulo", sql.NVarChar(255), titulo ?? "")
    .input("descripcion", sql.NVarChar(sql.MAX), descripcion)
    .input("tecnico_id", sql.Int, tecnico_id)
    .execute("sp_Expedientes_Crear");

  // Opcional: el SP puede devolver el nuevo id
  const created = r.recordset?.[0] ?? null;
  res.status(201).json({ ok: true, created });
}

/* =========================
   PUT /expedientes/:id  (solo dueño/técnico)
========================= */
export async function actualizarExpediente(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { titulo, descripcion } = req.body as { titulo: string; descripcion: string };
  const tecnico_id = req.user!.id;

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("titulo", sql.NVarChar(255), titulo)
    .input("descripcion", sql.NVarChar(sql.MAX), descripcion)
    .input("tecnico_id", sql.Int, tecnico_id)
    .execute("sp_Expedientes_Actualizar");

  if (!r.recordset[0]?.updated) return res.status(403).json({ error: "Sin permisos o no existe" });
  res.json({ ok: true });
}

/* =========================
   PATCH /expedientes/:id/estado  (solo coordinador)
========================= */
export async function cambiarEstado(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { estado, justificacion } = req.body as { estado: "aprobado"|"rechazado"; justificacion?: string };
  const aprobador_id = req.user!.id;

  if (!["aprobado", "rechazado"].includes(estado)) {
    return res.status(400).json({ error: "estado inválido" });
  }

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("estado", sql.NVarChar(20), estado)
    .input("aprobador_id", sql.Int, aprobador_id)
    .input("justificacion", sql.NVarChar(sql.MAX), justificacion ?? null)
    .execute("sp_Expedientes_CambiarEstado");

  if (!r.recordset[0]?.updated) return res.status(400).json({ error: "No se pudo cambiar estado" });
  res.json({ ok: true });
}

/* =========================
   PATCH /expedientes/:id/activo  (soft delete / reactivar)
========================= */
export async function toggleActivoExpediente(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { activo } = req.body as { activo: boolean };

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("activo", sql.Bit, activo ? 1 : 0)
    .execute("sp_Expedientes_ActivarDesactivar");

  if (!r.recordset[0]?.updated) return res.status(400).json({ error: "No se pudo actualizar activo" });
  res.json({ ok: true });
}
