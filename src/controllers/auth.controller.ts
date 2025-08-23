import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getPool, sql } from "../db/db";
import { signToken } from "../auth/jwt.utils";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) return res.status(400).json({ error: "username y password son requeridos" });

  const pool = await getPool();
  const result = await pool.request()
    .input("username", sql.NVarChar(50), username)
    .execute("sp_Usuarios_Login");

  const user = result.recordset[0];
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = signToken({ id: user.id, username: user.username, rol: user.rol });
  res.json({ token, user: { id: user.id, username: user.username, rol: user.rol } });
}
