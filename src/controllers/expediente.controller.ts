import { Response } from "express";
import * as XLSX from "xlsx";
import { getPool, sql } from "../db/db";
import { AuthRequest } from "../middlewares/auth.middleware";

/* =========================
   GET /expedientes
   - Técnicos: solo ven los suyos (tecnico_id del token)
   - Coordinadores (u otros): ven todos
========================= */
export async function listarExpedientes(req: AuthRequest, res: Response) {
  const page = Number(req.query.page ?? req.query.pagina ?? 1);
  const pageSize = Number(req.query.pageSize ?? 10);
  const q = String(req.query.q ?? "");
  const estado = req.query.estado ? String(req.query.estado) : null;
  const tecnicoId = req.query.tecnicoId ? Number(req.query.tecnicoId) : null;
  const fechaInicio = req.query.fechaInicio ? String(req.query.fechaInicio) : null;
  const fechaFin = req.query.fechaFin ? String(req.query.fechaFin) : null;

  const pool = await getPool();
  const request = pool.request()
    .input("page", sql.Int, page)
    .input("pageSize", sql.Int, pageSize)
    .input("q", sql.NVarChar(255), q || null)
    .input("codigo", sql.NVarChar(50), null)
    .input("estado", sql.NVarChar(20), estado)
    .input("fechaInicio", sql.DateTime, fechaInicio ? new Date(fechaInicio) : null)
    .input("fechaFin", sql.DateTime, fechaFin ? new Date(fechaFin) : null);

  // Si el usuario es técnico, forzar filtro por su tecnico_id
  if (req.user?.rol === "tecnico") {
    request.input("tecnico_id", sql.Int, req.user.id);
  } else {
    request.input("tecnico_id", sql.Int, tecnicoId);
  }

  const r = await request.execute("sp_Expedientes_Listar");
  res.json({
    pagina: page,
    page,
    pageSize,
    total: r.recordset?.[0]?.total ?? 0,
    estado: estado,
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
  const modificado_por = req.user!.id;

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("titulo", sql.NVarChar(255), titulo)
    .input("descripcion", sql.NVarChar(sql.MAX), descripcion)
    .input("tecnico_id", sql.Int, tecnico_id)
    .input("modificado_por", sql.Int, modificado_por)
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
  const modificado_por = req.user!.id;

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("activo", sql.Bit, activo ? 1 : 0)
    .input("modificado_por", sql.Int, modificado_por)
    .execute("sp_Expedientes_ActivarDesactivar");

  if (!r.recordset[0]?.updated) return res.status(400).json({ error: "No se pudo actualizar activo" });
  res.json({ ok: true });
}

/* =========================
   GET /expedientes/export  (exportar a Excel)
========================= */
export async function exportarExpedientes(req: AuthRequest, res: Response) {
  const estado = req.query.estado ? String(req.query.estado) : null;
  const tecnicoId = req.query.tecnicoId ? Number(req.query.tecnicoId) : null;
  const fechaInicio = req.query.fechaInicio ? String(req.query.fechaInicio) : null;
  const fechaFin = req.query.fechaFin ? String(req.query.fechaFin) : null;

  const pool = await getPool();
  const request = pool.request()
    .input("page", sql.Int, 1)
    .input("pageSize", sql.Int, 99999)
    .input("q", sql.NVarChar(255), null)
    .input("codigo", sql.NVarChar(50), null)
    .input("estado", sql.NVarChar(20), estado)
    .input("fechaInicio", sql.DateTime, fechaInicio ? new Date(fechaInicio) : null)
    .input("fechaFin", sql.DateTime, fechaFin ? new Date(fechaFin) : null);

  // Si el usuario es técnico, forzar filtro por su tecnico_id
  if (req.user?.rol === "tecnico") {
    request.input("tecnico_id", sql.Int, req.user.id);
  } else {
    request.input("tecnico_id", sql.Int, tecnicoId);
  }

  const r = await request.execute("sp_Expedientes_Listar");
  const expedientes = r.recordset ?? [];

  // Mapear datos para Excel
  const data = expedientes.map((exp: any) => ({
    ID: exp.id,
    Codigo: exp.codigo,
    Titulo: exp.titulo,
    Estado: exp.estado,
    Tecnico: exp.tecnico_username,
    Aprobador: exp.aprobador_username || "",
    FechaCreacion: exp.fecha_creacion ? new Date(exp.fecha_creacion).toISOString().split('T')[0] : "",
    FechaEstado: exp.fecha_estado ? new Date(exp.fecha_estado).toISOString().split('T')[0] : ""
  }));

  // Crear workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Expedientes");

  // Generar buffer
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  // Enviar archivo
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=expedientes.xlsx");
  res.send(buffer);
}
