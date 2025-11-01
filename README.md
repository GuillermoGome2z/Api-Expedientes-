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

```
api-expedientes/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ swagger.ts
│  ├─ auth/
│  │  └─ jwt.utils.ts
│  ├─ controllers/
│  │  ├─ auth.controller.ts
│  │  ├─ expediente.controller.ts
│  │  ├─ indicio.controller.ts
│  │  └─ usuario.controller.ts
│  ├─ db/
│  │  ├─ db.ts
│  │  └─ sp/
│  │     ├─ expedientes/
│  │     ├─ indicios/
│  │     └─ usuarios/
│  ├─ middlewares/
│  │  ├─ auth.middleware.ts
│  │  ├─ role.middleware.ts
│  │  └─ validate.middleware.ts
│  ├─ routes/
│  │  ├─ auth.routes.ts
│  │  ├─ expediente.routes.ts
│  │  ├─ indicio.routes.ts
│  │  ├─ usuario.routes.ts
│  │  └─ index.ts
│  └─ scripts/
│     ├─ schema.sql
│     ├─ seed.sql
│     └─ hash-seed.ts
├─ docs/
│  └─ tests-rapidos.md
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

---

## ⚙️ Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/GuillermoGome2z/Api-Expedientes-.git
cd Api-Expedientes-
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar variables de entorno
Copia .env.example a .env y ajusta valores:

```bash
PORT=3000

JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES=1h

DB_SERVER=localhost
DB_USER=sa
DB_PASS=YourStrong!Passw0rd
DB_NAME=expedientes_db

BCRYPT_SALT_ROUNDS=10
```

## Levantar SQL Server con Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

## Inicializar la base de datos

**Opción 1 - SSMS o DBeaver:**
1. Conectarse a SQL Server
2. Ejecutar `src/scripts/schema.sql` (crea tablas con campos de auditoría)
3. Ejecutar `src/scripts/seed.sql` (inserta usuarios y datos de prueba)
4. Ejecutar todos los SP en `src/db/sp/`:
   - `src/db/sp/usuarios/*.sql`
   - `src/db/sp/expedientes/*.sql`
   - `src/db/sp/indicios/*.sql`

**Opción 2 - Comando único (PowerShell):**
```powershell
Get-Content src/scripts/schema.sql, src/scripts/seed.sql, src/db/sp/**/*.sql | sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd"
```

### 5️⃣ Ejecutar la API

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm run build
npm start
```

El servidor estará disponible en: http://localhost:3000

---
## 📖 Endpoints principales

### 🔐 Auth
- `POST /api/auth/login` → Iniciar sesión y obtener JWT

### � Usuarios
- `POST /api/usuarios` → Crear usuario (solo coordinador)
- `PATCH /api/usuarios/:id/password` → Cambiar contraseña
- `GET /api/usuarios` → Listar usuarios (solo coordinador)

### �📂 Expedientes
- `GET /api/expedientes?page=1&pageSize=10&estado=abierto&fechaInicio=2025-01-01&fechaFin=2025-12-31&tecnicoId=1` → Listar con filtros avanzados
- `GET /api/expedientes/:id` → Obtener detalle
- `POST /api/expedientes` → Crear (solo técnico)
- `PUT /api/expedientes/:id` → Actualizar (solo técnico dueño)
- `PATCH /api/expedientes/:id/estado` → Aprobar/rechazar (solo coordinador)
- `PATCH /api/expedientes/:id/activo` → Soft delete
- `GET /api/expedientes/export?estado=aprobado` → Exportar a Excel

### 🔎 Indicios
- `GET /api/expedientes/:id/indicios?page=1&pageSize=10` → Listar con paginación
- `POST /api/expedientes/:id/indicios` → Crear (solo técnico dueño del expediente)
- `PUT /api/indicios/:id` → Actualizar (solo técnico dueño)
- `PATCH /api/indicios/:id/activo` → Soft delete (solo técnico dueño)

### � Nuevas características
- **Filtros avanzados:** estado, fechaInicio, fechaFin, tecnicoId
- **Paginación:** Soporta `page`/`pagina` y `pageSize`
- **Validación de ownership:** Técnicos solo pueden modificar sus propios expedientes/indicios
- **Auditoría:** Campos `fecha_creacion`, `fecha_actualizacion`, `modificado_por`
- **Exportación:** Excel con filtros aplicados

## �📑 Documentación
- **Swagger UI:** http://localhost:3000/docs
- **Health check:** http://localhost:3000/api/health
- **Tests rápidos:** Ver `docs/tests-rapidos.md` para comandos curl completos
- La ruta raíz `/` redirige automáticamente a `/docs`

## 🧪 Credenciales de prueba

Los datos de seed incluyen:

**Usuarios:**
- Técnico 1: `tecnico1` / `tecnico123`
- Técnico 2: `tecnico2` / `tecnico123`
- Coordinador: `coord1` / `tecnico123`

**Expedientes de prueba:** 5 expedientes
- 3 abiertos (2 de tecnico1, 1 de tecnico2)
- 1 aprobado (tecnico2)
- 1 rechazado con justificación (tecnico1)

**Indicios de prueba:** 8 indicios distribuidos entre expedientes

## 🚀 Smoke Test

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tecnico1","password":"tecnico123"}' | jq -r '.token')

# 2. Listar expedientes
curl -X GET http://localhost:3000/api/expedientes \
  -H "Authorization: Bearer $TOKEN"

# 3. Crear expediente
curl -X POST http://localhost:3000/api/expedientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"codigo":"TEST-001","titulo":"Test","descripcion":"Expediente de prueba"}'

# 4. Ver documentación
open http://localhost:3000/docs
```

---

## 🎨 Frontend

El frontend se encuentra en un repositorio separado para mantener una arquitectura desacoplada:

**Repositorio Frontend:** _(Pendiente de publicar)_

**Conexión:** El frontend se conectará a esta API mediante las rutas `/api/*` documentadas en Swagger.

**CORS configurado para:**
- `http://localhost:5173` (Vite/React dev)
- `http://localhost:3001` 
- `http://localhost:3000`

---

## 👨‍💻 Autor

**Guillermo Gómez**
- GitHub: [@GuillermoGome2z](https://github.com/GuillermoGome2z)
- Universidad Mariano Gálvez - Desarrollo Web (2025)

---

## 📄 Licencia

ISC
