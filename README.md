# 🚀 API de Gestión de Expedientes e Indicios

API REST desarrollada en **TypeScript + Express** con persistencia en **SQL Server** mediante procedimientos almacenados, autenticación con **JWT** y control de roles (técnico y coordinador).  
Proyecto entregado para la clase de **Desarrollo Web — Universidad Mariano Gálvez (2025)**.

---

## 📌 Características

- Autenticación con JWT (bcrypt para hash de contraseñas).
- Roles: **Técnico** y **Coordinador**.
- CRUD de **Expedientes** e **Indicios**.
- Flujo de aprobación de expedientes (aprobado/rechazado).
- Eliminación lógica mediante campo `activo`.
- Validaciones (código único, peso ≥ 0, permisos según rol).
- Documentación con **Swagger UI** en `/docs`.
- Scripts SQL (`schema.sql` y procedimientos almacenados).
- Usuarios semilla: técnico y coordinador.

---

## 📂 Estructura del proyecto

backend/
├─ src/
│ ├─ app.ts
│ ├─ server.ts
│ ├─ swagger.ts
│ ├─ auth/
│ │ └─ jwt.utils.ts
│ ├─ controllers/
│ │ ├─ auth.controller.ts
│ │ ├─ expediente.controller.ts
│ │ └─ indicio.controller.ts
│ ├─ db/
│ │ ├─ db.ts
│ │ └─ sp/ # procedimientos almacenados (.sql)
│ ├─ middlewares/
│ │ ├─ auth.middleware.ts
│ │ └─ role.middleware.ts
│ ├─ routes/
│ │ ├─ auth.routes.ts
│ │ ├─ expediente.routes.ts
│ │ └─ indicio.routes.ts
│ └─ types/
│ └─ express.d.ts
├─ scripts/
│ ├─ schema.sql
│ └─ seed.sql
├─ .env.example
├─ package.json
└─ README.md
