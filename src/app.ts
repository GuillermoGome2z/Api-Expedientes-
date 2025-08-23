import express from "express";
import routes from "./routes";
import { mountSwagger } from "./swagger";

const app = express();

app.use(express.json());

// Monta las rutas principales
app.use("/api", routes);

// Monta Swagger en /docs
mountSwagger(app);

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.get("/", (_, res) => {
  res.redirect("/docs");
});
export default app;
