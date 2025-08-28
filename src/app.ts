// src/app.ts
import express from "express";
import cors from "cors";
import routes from "./routes";
import { mountSwagger } from "./swagger";

const app = express();

app.use(express.json());

// Permitir a tu frontend (ajusta el origin a tu URL de frontend)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3001", "http://localhost:3000"], // Vite/CRA/etc
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

app.use("/api", routes);
mountSwagger(app);

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.get("/", (_, res) => res.redirect("/docs"));

export default app;
