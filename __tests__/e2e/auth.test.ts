import request from "supertest";
import app from "../../src/app";

describe("E2E: Auth", () => {
  describe("POST /api/auth/login", () => {
    it("debería retornar 200 y token con credenciales válidas", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "tecnico1",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user).toMatchObject({
        username: "tecnico1",
        rol: "tecnico",
      });
    });

    it("debería retornar 401 con credenciales inválidas", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "tecnico1",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error", "Credenciales inválidas");
    });

    it("debería retornar 401 con usuario inexistente", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          username: "noexiste",
          password: "password123",
        })
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });

    it("debería retornar 400 si faltan credenciales", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("error");
    });
  });
});
