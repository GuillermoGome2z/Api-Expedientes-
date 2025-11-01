import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getPool, sql } from "../db/db";
import { AuthRequest } from "../middlewares/auth.middleware";

// POST /usuarios - Crear usuario (solo coordinador)
export async function crearUsuario(req: Request, res: Response) {
  const { username, password, rol } = req.body as {
    username: string;
    password: string;
    rol: "tecnico" | "coordinador";
  };

  if (!username || !password || !rol) {
    return res.status(400).json({ error: "username, password y rol son requeridos" });
  }

  if (!["tecnico", "coordinador"].includes(rol)) {
    return res.status(400).json({ error: "rol debe ser tecnico o coordinador" });
  }

  // Hashear contraseña
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const pool = await getPool();
  
  try {
    const r = await pool.request()
      .input("username", sql.NVarChar(50), username)
      .input("password_hash", sql.NVarChar(255), password_hash)
      .input("rol", sql.NVarChar(20), rol)
      .execute("sp_Usuarios_Crear");

    const created = r.recordset[0];
    res.status(201).json({
      id: created.id,
      username: created.username,
      rol: created.rol
    });
  } catch (error: any) {
    if (error.message?.includes("duplicado") || error.message?.includes("duplicate")) {
      return res.status(400).json({ error: "El username ya existe" });
    }
    throw error;
  }
}

// PATCH /usuarios/:id/password - Cambiar contraseña
export async function cambiarContrasena(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { passwordActual, passwordNueva } = req.body as {
    passwordActual: string;
    passwordNueva: string;
  };

  if (!passwordActual || !passwordNueva) {
    return res.status(400).json({ error: "passwordActual y passwordNueva son requeridos" });
  }

  // Solo el propio usuario o un coordinador pueden cambiar la contraseña
  if (req.user!.id !== id && req.user!.rol !== "coordinador") {
    return res.status(403).json({ error: "No autorizado" });
  }

  const pool = await getPool();

  // Obtener usuario actual
  const userRes = await pool.request()
    .input("id", sql.Int, id)
    .execute("sp_Usuarios_Obtener");

  const user = userRes.recordset[0];
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  // Validar contraseña actual (solo si el usuario cambia su propia contraseña)
  if (req.user!.id === id) {
    const ok = await bcrypt.compare(passwordActual, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }
  }

  // Hash de la nueva contraseña
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const newHash = await bcrypt.hash(passwordNueva, saltRounds);

  // Actualizar contraseña
  const updateRes = await pool.request()
    .input("id", sql.Int, id)
    .input("password_hash", sql.NVarChar(255), newHash)
    .execute("sp_Usuarios_ActualizarPassword");

  if (!updateRes.recordset[0]?.updated) {
    return res.status(400).json({ error: "No se pudo actualizar la contraseña" });
  }

  res.json({ ok: true, message: "Contraseña actualizada correctamente" });
}

// GET /usuarios - Listar usuarios (solo coordinador)
export async function listarUsuarios(req: Request, res: Response) {
  const page = Number(req.query.page ?? req.query.pagina ?? 1);
  const pageSize = Number(req.query.pageSize ?? 10);

  const pool = await getPool();
  const r = await pool.request()
    .input("page", sql.Int, page)
    .input("pageSize", sql.Int, pageSize)
    .execute("sp_Usuarios_Listar");

  res.json({
    pagina: page,
    page,
    pageSize,
    total: r.recordset?.[0]?.total ?? 0,
    data: r.recordset ?? []
  });
}
