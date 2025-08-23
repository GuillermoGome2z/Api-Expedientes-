# 🚀 API de Gestión de Expedientes e Indicios

API REST desarrollada en **TypeScript + Express** con persistencia en **SQL Server** mediante procedimientos almacenados, autenticación con **JWT** y control de roles (técnico y coordinador).  
Proyecto entregado para la clase de **Desarrollo Web — Universidad Mariano Gálvez (2025)**.

---

## 📌 Características

- 🔑 Autenticación con **JWT** (bcrypt para hash de contraseñas).
- 👥 Roles: **Técnico** y **Coordinador**.
- 📂 CRUD de **Expedientes** e **Indicios**.
- ✅ Flujo de aprobación de expedientes (aprobado/rechazado con justificación).
- 🗑️ Eliminación lógica mediante campo `activo`.
- ⚖️ Validaciones: 
  - Código de expediente único.
  - Peso ≥ 0.
  - Control de permisos por rol.
- 📖 Documentación con **Swagger UI** en [`/docs`](http://localhost:3000/docs).
- 🗃️ Scripts SQL (`schema.sql` + procedimientos almacenados).
- 👤 Usuarios semilla: técnico y coordinador.

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

---

## ⚙️ Instalación y ejecución

###  Clonar el repositorio
```
git clone https://github.com/<tu_usuario>/<tu_repo>.git
cd <tu_repo>
```
---

## Instalar dependencias

npm install
---

## Variables de entorno
Copia .env.example a .env y ajusta valores:

PORT=3000

JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=1d

SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=YourStrong!Passw0rd
SQLSERVER_DB=expedientes_db
SQL_ENCRYPT=false
SQL_TRUST_SERVER=true

BCRYPT_SALT_ROUNDS=10
Levantar SQL Server con Docker

docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
---
## Inicializar la base de datos
En SSMS o DBeaver:

Ejecutar scripts/schema.sql.

Ejecutar scripts/seed.sql.

Ejecutar todos los SP en src/db/sp/.

Ejecutar la API
npm run dev                   # desarrollo (ts-node-dev)
# o
npm run build && npm start    # producción (dist/)

---
## 📖 Endpoints principales
🔐 Auth
POST /api/auth/login → iniciar sesión y obtener JWT.

## 📂 Expedientes
GET /api/expedientes?page=1&pageSize=10

GET /api/expedientes/{id}

POST /api/expedientes (rol: técnico)

PUT /api/expedientes/{id} (rol: técnico dueño)

PATCH /api/expedientes/{id}/estado (rol: coordinador)

PATCH /api/expedientes/{id}/activo (soft delete / activar)
---

## 🔎 Indicios
GET /api/expedientes/{id}/indicios

POST /api/expedientes/{id}/indicios (rol: técnico)

PUT /api/indicios/{id} (rol: técnico dueño)

PATCH /api/indicios/{id}/activo

## 📑 Documentación
Swagger UI: http://localhost:3000/docs

Health check: http://localhost:3000/api/health

La ruta raíz / redirige automáticamente a /docs.
---

## 🧪 Usuarios semilla
Técnico

email: tecnico@umg.edu

password: tecnico123

Coordinador

email: coordinador@umg.edu

password: coordinador123
