import dotenv from "dotenv";

// Cargar variables de entorno PRIMERO
dotenv.config();

// Validar variables de entorno antes de continuar
import { env } from "./config/env";

// Ahora sí importar la app
import app from "./app";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Documentación Swagger: http://localhost:${PORT}/docs`);
});
