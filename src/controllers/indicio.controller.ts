import { Response } from "express";
import { getPool, sql } from "../db/db";
import { AuthRequest } from "../middlewares/auth.middleware";

// Helper: obtener dueño del expediente
async function getExpedienteOwner(expedienteId: number): Promise<{ tecnico_id: number; activo: boolean } | null> {
  const pool = await getPool();
  const r = await pool.request()
    .input("expediente_id", sql.Int, expedienteId)
    .execute("sp_Expedientes_ObtenerOwner");
  return r.recordset[0] || null;
}

// GET /expedientes/:id/indicios
export async function listarIndiciosPorExpediente(req: AuthRequest, res: Response) {
  const expediente_id = Number(req.params.id);
  // Alias de paginación
  const page = Number(req.query.page ?? req.query.pagina ?? 1);
  const pageSize = Number(req.query.pageSize ?? req.query.tamanoPagina ?? 10);

  const pool = await getPool();
  const r = await pool.request()
    .input("expediente_id", sql.Int, expediente_id)
    .input("page", sql.Int, page)
    .input("pageSize", sql.Int, pageSize)
    .execute("sp_Indicios_ListarPorExpediente");

  res.json({
    page,
    pageSize,
    total: r.recordset?.[0]?.total ?? 0,
    data: r.recordset ?? []
  });
}

// POST /expedientes/:id/indicios  (solo técnico dueño)
export async function crearIndicio(req: AuthRequest, res: Response) {
  const expediente_id = Number(req.params.id);
  const { descripcion, peso, color, tamano } = req.body as {
    descripcion: string; peso?: number; color?: string; tamano?: string;
  };

  // Validar ownership si es técnico
  if (req.user?.rol === "tecnico") {
    const owner = await getExpedienteOwner(expediente_id);
    if (!owner || owner.tecnico_id !== req.user.id) {
      return res.status(403).json({ error: "No es dueño del expediente" });
    }
  }

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
  const modificado_por = req.user!.id;

  // Validar ownership si es técnico: obtener expediente_id del indicio
  if (req.user?.rol === "tecnico") {
    const pool = await getPool();
    const indicioRes = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT expediente_id FROM Indicios WHERE id=@id AND activo=1");
    
    if (!indicioRes.recordset[0]) {
      return res.status(404).json({ error: "Indicio no encontrado" });
    }
    
    const expediente_id = indicioRes.recordset[0].expediente_id;
    const owner = await getExpedienteOwner(expediente_id);
    
    if (!owner || owner.tecnico_id !== req.user.id) {
      return res.status(403).json({ error: "No es dueño del expediente" });
    }
  }

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("descripcion", sql.NVarChar(sql.MAX), descripcion)
    .input("peso", sql.Decimal(10,2), peso ?? null)
    .input("color", sql.NVarChar(50), color ?? null)
    .input("tamano", sql.NVarChar(50), tamano ?? null)
    .input("modificado_por", sql.Int, modificado_por)
    .execute("sp_Indicios_Actualizar");

  if (!r.recordset[0]?.updated) return res.status(400).json({ error: "No se pudo actualizar" });
  res.json({ ok: true });
}

// PATCH /indicios/:id/activo
export async function toggleActivoIndicio(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { activo } = req.body as { activo: boolean };
  const modificado_por = req.user!.id;

  // Validar ownership si es técnico
  if (req.user?.rol === "tecnico") {
    const pool = await getPool();
    const indicioRes = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT expediente_id FROM Indicios WHERE id=@id");
    
    if (!indicioRes.recordset[0]) {
      return res.status(404).json({ error: "Indicio no encontrado" });
    }
    
    const expediente_id = indicioRes.recordset[0].expediente_id;
    const owner = await getExpedienteOwner(expediente_id);
    
    if (!owner || owner.tecnico_id !== req.user.id) {
      return res.status(403).json({ error: "No es dueño del expediente" });
    }
  }

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("activo", sql.Bit, activo ? 1 : 0)
    .input("modificado_por", sql.Int, modificado_por)
    .execute("sp_Indicios_ActivarDesactivar");

  if (!r.recordset[0]?.updated) return res.status(400).json({ error: "No se pudo actualizar activo" });
  res.json({ ok: true });
}
