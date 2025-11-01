import { z } from "zod";

/**
 * Schema de validación para variables de entorno.
 * Se valida al inicio de la aplicación para asegurar configuración correcta.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  
  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive()),
  
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  
  JWT_EXPIRES: z.string().default("1h"),
  
  DB_SERVER: z.string().min(1, "DB_SERVER es requerido"),
  
  DB_USER: z.string().min(1, "DB_USER es requerido"),
  
  DB_PASS: z.string().min(1, "DB_PASS es requerido"),
  
  DB_NAME: z.string().min(1, "DB_NAME es requerido"),
  
  BCRYPT_SALT_ROUNDS: z
    .string()
    .default("10")
    .transform((val) => parseInt(val, 10)),
  
  BASE_PATH: z.string().default("/api"),
  
  CORS_ORIGIN: z.string().optional(),
});

/**
 * Valida y parsea las variables de entorno.
 * Lanza error si alguna variable requerida falta o es inválida.
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Error en validación de variables de entorno:");
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
      throw new Error("Configuración de entorno inválida. Verifica tu archivo .env");
    }
    throw error;
  }
}

/**
 * Variables de entorno validadas y tipadas.
 * Usar este objeto en lugar de process.env para mejor type-safety.
 */
export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
