import request from "supertest";
import app from "../../src/app";

describe("E2E: Smoke Tests", () => {
  describe("Health & Metrics", () => {
    it("/api/health debería retornar 200", async () => {
      const response = await request(app)
        .get("/api/health")
        .expect(200);

      expect(response.body).toHaveProperty("status", "healthy");
      expect(response.body).toHaveProperty("database");
    });

    it("/api/metrics debería retornar 200 y formato Prometheus", async () => {
      const response = await request(app)
        .get("/api/metrics")
        .expect(200);

      expect(response.text).toContain("# HELP");
      expect(response.text).toContain("http_requests_total");
    });
  });

  describe("Auth Basic Flow", () => {
    it("debería rechazar acceso sin token", async () => {
      const response = await request(app)
        .get("/api/expedientes")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    it("debería permitir login con credenciales válidas", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "tecnico1",
          password: "password123",
        });

      // Si el login falla, mostrar el error para debug
      if (response.status !== 200) {
        console.error("Login failed:", response.status, response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("token");
    });
  });
});
