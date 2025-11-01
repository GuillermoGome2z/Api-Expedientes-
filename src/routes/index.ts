// src/routes/index.ts
import { Router } from "express";
import { getPool } from "../db/db";
import authRoutes from "./auth.routes";
import expedienteRoutes from "./expediente.routes";
import indicioRoutes from "./indicio.routes";
import usuarioRoutes from "./usuario.routes";

const r = Router();

// health y ping
r.get("/health", (_req, res) => res.json({ ok: true }));
r.get("/db/ping", async (_req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT 1 AS ok");
    res.json({ db: "ok", result: result.recordset[0] });
  } catch (e: any) { res.status(500).json({ db: "error", message: e?.message }); }
});

// subrutas
r.use("/auth", authRoutes);
r.use("/usuarios", usuarioRoutes);
r.use("/expedientes", expedienteRoutes);
r.use("/", indicioRoutes); // expone /expedientes/:id/indicios y /indicios/:id...

export default r;
