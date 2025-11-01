import request from "supertest";
import app from "../../src/app";

describe("E2E: Expedientes", () => {
  let tecnicoToken: string;
  let coordinadorToken: string;
  let expedienteId: number;

  beforeAll(async () => {
    // Login como técnico
    const tecnicoRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "tecnico1", password: "password123" });
    tecnicoToken = tecnicoRes.body.data.token;

    // Login como coordinador
    const coordRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "coord1", password: "password123" });
    coordinadorToken = coordRes.body.data.token;
  });

  describe("GET /api/expedientes", () => {
    it("debería retornar paginación normalizada con success:true", async () => {
      const response = await request(app)
        .get("/api/expedientes")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .query({ pagina: 1, tamanoPagina: 5 })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("page", 1);
      expect(response.body.data).toHaveProperty("pageSize", 5);
      expect(response.body.data).toHaveProperty("total");
      expect(response.body.data).toHaveProperty("data");
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it("debería retornar 401 sin token", async () => {
      const response = await request(app)
        .get("/api/expedientes")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/expedientes", () => {
    it("debería crear expediente con técnico y retornar 201", async () => {
      const response = await request(app)
        .post("/api/expedientes")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .send({
          codigo: `EXP-TEST-${Date.now()}`,
          titulo: "Expediente de prueba",
          descripcion: "Descripción de prueba E2E",
        })
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expedienteId = response.body.data.id;
    });

    it("debería retornar 400 si falta codigo o descripcion", async () => {
      const response = await request(app)
        .post("/api/expedientes")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .send({ titulo: "Sin codigo" })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/expedientes/:id", () => {
    it("debería retornar expediente con formato normalizado", async () => {
      const response = await request(app)
        .get(`/api/expedientes/${expedienteId}`)
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id", expedienteId);
    });

    it("debería retornar 404 si el expediente no existe", async () => {
      const response = await request(app)
        .get("/api/expedientes/999999")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PATCH /api/expedientes/:id/estado", () => {
    it("coordinador debería poder cambiar estado a aprobado", async () => {
      if (!expedienteId) {
        console.warn("No hay expedienteId, saltando test");
        return;
      }

      const response = await request(app)
        .patch(`/api/expedientes/${expedienteId}/estado`)
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .send({ estado: "aprobado" })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });

    it("debería retornar 400 si rechaza sin justificación", async () => {
      if (!expedienteId) {
        console.warn("No hay expedienteId, saltando test");
        return;
      }

      const response = await request(app)
        .patch(`/api/expedientes/${expedienteId}/estado`)
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .send({ estado: "rechazado" })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.error).toContain("justificación");
    });

    it("técnico no debería poder cambiar estado (403)", async () => {
      if (!expedienteId) {
        console.warn("No hay expedienteId, saltando test");
        return;
      }

      const response = await request(app)
        .patch(`/api/expedientes/${expedienteId}/estado`)
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .send({ estado: "aprobado" })
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Ownership validation", () => {
    let otroTecnicoToken: string;
    let expedienteIdTecnico1: number;

    beforeAll(async () => {
      // Crear otro técnico si existe
      const otroTecRes = await request(app)
        .post("/api/auth/login")
        .send({ username: "tecnico2", password: "password123" });
      
      if (otroTecRes.status === 200) {
        otroTecnicoToken = otroTecRes.body.data.token;
      }

      // Crear expediente con tecnico1
      const expRes = await request(app)
        .post("/api/expedientes")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .send({
          codigo: `EXP-OWN-${Date.now()}`,
          titulo: "Test ownership",
          descripcion: "Para validar ownership",
        });
      
      if (expRes.status === 201) {
        expedienteIdTecnico1 = expRes.body.data.id;
      }
    });

    it("técnico2 no debería poder actualizar expediente de técnico1 (403)", async () => {
      if (!otroTecnicoToken || !expedienteIdTecnico1) {
        console.warn("No hay segundo técnico o expediente, saltando test");
        return;
      }

      const response = await request(app)
        .put(`/api/expedientes/${expedienteIdTecnico1}`)
        .set("Authorization", `Bearer ${otroTecnicoToken}`)
        .send({
          titulo: "Intento de modificar",
          descripcion: "No debería funcionar",
        })
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.error).toContain("dueño");
    });
  });
});
