import client, { register, Counter, Histogram } from "prom-client";

// Habilitar métricas por defecto (memoria, CPU, etc.)
client.collectDefaultMetrics({ register });

/**
 * Contador de peticiones HTTP totales por método, ruta y código de estado
 */
export const httpRequestCounter = new Counter({
  name: "http_requests_total",
  help: "Total de peticiones HTTP",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

/**
 * Histograma de latencia de peticiones HTTP en segundos
 */
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duración de peticiones HTTP en segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5, 10], // Buckets en segundos
  registers: [register],
});

/**
 * Contador de errores de base de datos
 */
export const dbErrorCounter = new Counter({
  name: "db_errors_total",
  help: "Total de errores de conexión a base de datos",
  registers: [register],
});

// Exportar el registro de Prometheus
export { register };
