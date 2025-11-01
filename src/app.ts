import express from "express";
import cors from "cors";
import routes from "./routes";
import { mountSwagger } from "./swagger";
import { errorHandler } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();

// BasePath configurable desde .env (default: /api)
const BASE_PATH = env.BASE_PATH;

app.use(express.json());

// CORS configurable
const corsOrigins = env.CORS_ORIGIN 
  ? env.CORS_ORIGIN.split(",") 
  : ["http://localhost:5173", "http://localhost:3001", "http://localhost:3000"];

app.use(cors({
  origin: corsOrigins, 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

// Montar rutas bajo BASE_PATH
app.use(BASE_PATH, routes);
mountSwagger(app);

// Health check
app.get(`${BASE_PATH}/health`, (_, res) => res.json({ ok: true }));

// Redirect root to docs
app.get("/", (_, res) => res.redirect("/docs"));

// Middleware global de errores (debe ir al final)
app.use(errorHandler);

export default app;
