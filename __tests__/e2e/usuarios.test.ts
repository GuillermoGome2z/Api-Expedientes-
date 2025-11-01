import request from "supertest";
import app from "../../src/app";

describe("E2E: Usuarios", () => {
  let coordinadorToken: string;
  let tecnicoToken: string;
  let nuevoUsuarioId: number;

  beforeAll(async () => {
    // Login como coordinador (admin)
    const coordRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "coord1", password: "password123" });
    coordinadorToken = coordRes.body.data.token;

    // Login como técnico
    const tecRes = await request(app)
      .post("/api/auth/login")
      .send({ username: "tecnico1", password: "password123" });
    tecnicoToken = tecRes.body.data.token;
  });

  describe("POST /api/usuarios", () => {
    it("coordinador debería crear usuario y retornar 201", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .send({
          username: `user_test_${Date.now()}`,
          password: "pass1234",
          rol: "tecnico",
        })
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("username");
      expect(response.body.data).toHaveProperty("rol", "tecnico");
      nuevoUsuarioId = response.body.data.id;
    });

    it("debería retornar 400 si username < 3 caracteres", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .send({
          username: "ab",
          password: "pass1234",
          rol: "tecnico",
        })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.error).toContain("3 caracteres");
    });

    it("debería retornar 400 si password < 6 caracteres", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .send({
          username: "usuario123",
          password: "12345",
          rol: "tecnico",
        })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.error).toContain("6 caracteres");
    });

    it("técnico NO debería poder crear usuario (403)", async () => {
      const response = await request(app)
        .post("/api/usuarios")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .send({
          username: "intentotecnico",
          password: "pass1234",
          rol: "tecnico",
        })
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/usuarios", () => {
    it("coordinador debería listar usuarios con paginación", async () => {
      const response = await request(app)
        .get("/api/usuarios")
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .query({ pagina: 1, tamanoPagina: 10 })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("page", 1);
      expect(response.body.data).toHaveProperty("pageSize", 10);
      expect(response.body.data).toHaveProperty("total");
      expect(response.body.data).toHaveProperty("data");
      expect(Array.isArray(response.body.data.data)).toBe(true);
    });

    it("técnico NO debería poder listar usuarios (403)", async () => {
      const response = await request(app)
        .get("/api/usuarios")
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PATCH /api/usuarios/:id/password", () => {
    it("coordinador debería cambiar contraseña y retornar 200", async () => {
      if (!nuevoUsuarioId) {
        console.warn("No hay nuevoUsuarioId, saltando test");
        return;
      }

      const response = await request(app)
        .patch(`/api/usuarios/${nuevoUsuarioId}/password`)
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .send({ passwordNueva: "nuevapass123" })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });

    it("debería retornar 400 si passwordNueva < 6 caracteres", async () => {
      if (!nuevoUsuarioId) {
        console.warn("No hay nuevoUsuarioId, saltando test");
        return;
      }

      const response = await request(app)
        .patch(`/api/usuarios/${nuevoUsuarioId}/password`)
        .set("Authorization", `Bearer ${coordinadorToken}`)
        .send({ passwordNueva: "12345" })
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.error).toContain("6 caracteres");
    });

    it("técnico NO debería poder cambiar contraseña (403)", async () => {
      if (!nuevoUsuarioId) {
        console.warn("No hay nuevoUsuarioId, saltando test");
        return;
      }

      const response = await request(app)
        .patch(`/api/usuarios/${nuevoUsuarioId}/password`)
        .set("Authorization", `Bearer ${tecnicoToken}`)
        .send({ passwordNueva: "nuevapass123" })
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });
});
