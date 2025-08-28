import express from "express";
import cors from "cors";
import routes from "./routes";
import { mountSwagger } from "./swagger";

const app = express();

app.use(express.json());


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3001", "http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

app.use("/api", routes);
mountSwagger(app);

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.get("/", (_, res) => res.redirect("/docs"));

export default app;
