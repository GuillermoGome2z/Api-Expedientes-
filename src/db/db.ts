import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function getPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((pool: sql.ConnectionPool) => {
        console.log("✅ Conectado a SQL Server");
        return pool;
      })
      .catch((err: Error) => {
        console.error("❌ Error conectando a SQL Server:", err);
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

export { sql };
