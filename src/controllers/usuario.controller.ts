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
    return res.status(400).json({
      success: false,
      error: "username, password y rol son requeridos",
    });
  }

  // Validaciones mínimas
  if (username.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: "El username debe tener al menos 3 caracteres",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "La contraseña debe tener al menos 6 caracteres",
    });
  }

  if (!["tecnico", "coordinador"].includes(rol)) {
    return res.status(400).json({
      success: false,
      error: "rol debe ser tecnico o coordinador",
    });
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
      success: true,
      data: {
        id: created.id,
        username: created.username,
        rol: created.rol,
      },
    });
  } catch (error: any) {
    if (error.message?.includes("duplicado") || error.message?.includes("duplicate")) {
      return res.status(400).json({
        success: false,
        error: "El username ya existe",
      });
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
    return res.status(400).json({
      success: false,
      error: "passwordActual y passwordNueva son requeridos",
    });
  }

  // Validación de longitud mínima
  if (passwordNueva.length < 6) {
    return res.status(400).json({
      success: false,
      error: "La contraseña nueva debe tener al menos 6 caracteres",
    });
  }

  // Solo el propio usuario o un coordinador pueden cambiar la contraseña
  if (req.user!.id !== id && req.user!.rol !== "coordinador") {
    return res.status(403).json({
      success: false,
      error: "No autorizado",
    });
  }

  const pool = await getPool();

  // Obtener usuario actual
  const userRes = await pool.request()
    .input("id", sql.Int, id)
    .execute("sp_Usuarios_Obtener");

  const user = userRes.recordset[0];
  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Usuario no encontrado",
    });
  }

  // Validar contraseña actual SOLO si el usuario cambia su propia contraseña
  // Los coordinadores pueden cambiar contraseñas sin validar la actual
  if (req.user!.id === id && req.user!.rol !== "coordinador") {
    if (!passwordActual) {
      return res.status(400).json({
        success: false,
        error: "La contraseña actual es requerida cuando cambias tu propia contraseña",
      });
    }
    
    const ok = await bcrypt.compare(passwordActual, user.password_hash);
    if (!ok) {
      return res.status(401).json({
        success: false,
        error: "Contraseña actual incorrecta",
      });
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
    return res.status(400).json({
      success: false,
      error: "No se pudo actualizar la contraseña",
    });
  }

  res.json({
    success: true,
    data: { message: "Contraseña actualizada correctamente" },
  });
}

// GET /usuarios - Listar usuarios (solo coordinador)
export async function listarUsuarios(req: Request, res: Response) {
  // Alias de paginación
  const page = Number(req.query.page ?? req.query.pagina ?? 1);
  const pageSize = Number(req.query.pageSize ?? req.query.tamanoPagina ?? 10);

  const pool = await getPool();
  const r = await pool.request()
    .input("page", sql.Int, page)
    .input("pageSize", sql.Int, pageSize)
    .execute("sp_Usuarios_Listar");

  res.json({
    success: true,
    data: {
      page,
      pageSize,
      total: r.recordset?.[0]?.total ?? 0,
      data: r.recordset ?? [],
    },
  });
}

// PATCH /usuarios/:id/activo - Activar/Desactivar usuario (solo coordinador)
export async function toggleActivoUsuario(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { activo } = req.body as { activo: boolean };

  const pool = await getPool();
  const r = await pool.request()
    .input("id", sql.Int, id)
    .input("activo", sql.Bit, activo ? 1 : 0)
    .execute("sp_Usuarios_ActivarDesactivar");

  if (!r.recordset[0]?.updated) {
    return res.status(400).json({
      success: false,
      error: "No se pudo actualizar el estado del usuario",
    });
  }

  res.json({
    success: true,
    data: { ok: true },
  });
}
