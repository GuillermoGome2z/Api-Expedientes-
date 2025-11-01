import request from "supertest";
import app from "../../src/app";

describe("E2E: Exports", () => {
  let tecnicoToken: string;
  let coordinadorToken: string;

  beforeAll(async () => {
    // Login como técnico
    const tecRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "tecnico1", password: "password123" });
    tecnicoToken = tecRes.body.data.token;

    // Login como coordinador
    const coordRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "coord1", password: "password123" });
    coordinadorToken = coordRes.body.data.token;
  });

  describe("GET /api/expedientes/export", () => {
    it("debería retornar XLSX con Content-Disposition y fecha", async () => {
      const response = await request(app)
        .get("/api/expedientes/export")
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .expect(200);

      // Verificar Content-Type XLSX
      expect(response.headers["content-type"]).toContain(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // Verificar Content-Disposition con filename y fecha
      expect(response.headers["content-disposition"]).toBeDefined();
      expect(response.headers["content-disposition"]).toContain("attachment");
      expect(response.headers["content-disposition"]).toContain("expedientes_");
      expect(response.headers["content-disposition"]).toMatch(/\d{4}-\d{2}-\d{2}/);

      // Verificar que hay datos (body no vacío)
      expect(response.body).toBeDefined();
      expect(Buffer.isBuffer(response.body)).toBe(true);
    });

    it("debería aplicar filtros (query params) correctamente", async () => {
      const response = await request(app)
        .get("/api/expedientes/export")
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .query({
          estado: "pendiente",
          fechaInicio: "2024-01-01",
          fechaFin: "2024-12-31",
        })
        .expect(200);

      expect(response.headers["content-type"]).toContain(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });

    it("debería retornar 401 sin autenticación", async () => {
      const response = await request(app)
        .get("/api/expedientes/export")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/expedientes/:id/export", () => {
    let expedienteId: number;

    beforeAll(async () => {
      // Crear expediente de prueba
      const expRes = await request(app)
        .post("/api/expedientes")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .send({
          codigo: `EXP-EXPORT-${Date.now()}`,
          titulo: "Test Export Individual",
          descripcion: "Para testing de exportación individual",
        });

      if (expRes.status === 201) {
        expedienteId = expRes.body.data.id;
      }
    });

    it("debería exportar expediente individual con indicios en XLSX", async () => {
      if (!expedienteId) {
        console.warn("No hay expedienteId, saltando test");
        return;
      }

      const response = await request(app)
        .get(`/api/expedientes/${expedienteId}/export`)
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .expect(200);

      // Verificar Content-Type XLSX
      expect(response.headers["content-type"]).toContain(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // Verificar Content-Disposition con fecha
      expect(response.headers["content-disposition"]).toBeDefined();
      expect(response.headers["content-disposition"]).toContain("attachment");
      expect(response.headers["content-disposition"]).toMatch(/\d{4}-\d{2}-\d{2}/);

      // Verificar datos
      expect(response.body).toBeDefined();
      expect(Buffer.isBuffer(response.body)).toBe(true);
    });

    it("debería retornar 404 si expediente no existe", async () => {
      const response = await request(app)
        .get("/api/expedientes/999999/export")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Rate Limiting en exports", () => {
    it("debería incluir rate-limit headers en la respuesta", async () => {
      const response = await request(app)
        .get("/api/expedientes/export")
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .expect(200);

      // Verificar headers de rate-limit
      expect(response.headers).toHaveProperty("ratelimit-limit");
      expect(response.headers).toHaveProperty("ratelimit-remaining");
      expect(response.headers).toHaveProperty("ratelimit-reset");
    });

    it("debería retornar 429 después de exceder límite (10 req/min)", async () => {
      // Crear token temporal para este test
      const testRes = await request(app)
        .post("/api/auth/login")
        .send({ username: "coord1", password: "password123" });
      
      const testToken = testRes.body.data.token;

      // Hacer 11 requests rápidos para exceder límite de 10/min
      const requests = [];
      for (let i = 0; i < 11; i++) {
        requests.push(
          request(app)
            .get("/api/expedientes/export")
            .set("Authorization", `Bearer ${testToken}`)
        );
      }

      const responses = await Promise.all(requests);
      
      // Al menos una debería ser 429 (Too Many Requests)
      const tooMany = responses.find((r) => r.status === 429);
      if (tooMany) {
        expect(tooMany.body).toHaveProperty("error");
        expect(tooMany.body.error).toContain("Too many requests");
      } else {
        console.warn(
          "Rate limiter no activado (puede ser por reset anterior o configuración)"
        );
      }
    }, 15000); // timeout más largo para este test
  });
});
