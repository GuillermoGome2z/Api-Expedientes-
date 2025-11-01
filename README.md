# API de Gestión de Expedientes e Indicios

API REST desarrollada en **TypeScript + Express** con persistencia en **SQL Server** mediante procedimientos almacenados, autenticación con **JWT** y control de roles (técnico y coordinador).

**Proyecto:** Desarrollo Web - Universidad Mariano Gálvez (2025)

---

## ✨ Características principales

### 🔐 Seguridad
- Autenticación con **JWT** (bcrypt para hash de contraseñas)
- Control de acceso basado en roles (**RBAC**): Técnico y Coordinador
- Validación de **ownership**: técnicos solo pueden modificar sus propios expedientes
- **Rate limiting**: Login (5 intentos/15min), Export (10/minuto) para prevenir brute-force
- **Helmet** con CSP conservador y HSTS en producción
- CORS multi-origen con validación dinámica
- Middleware global de manejo de errores con mensajes diferenciados por entorno
- Validación de variables de entorno con **Zod** (type-safe en tiempo de ejecución)

### 📊 Funcionalidad
- **CRUD completo** de Expedientes e Indicios
- Flujo de aprobación de expedientes (aprobado/rechazado con justificación obligatoria)
- Eliminación lógica mediante campo `activo`
- **Filtros avanzados**: estado, técnicoId, rango de fechas, búsqueda por texto
- **Paginación** en listados con aliases en español (`page/pagina`, `pageSize/tamanoPagina`)
- **Exportación a Excel** con filtros aplicados
- Campos de auditoría: `fecha_creacion`, `fecha_actualizacion`, `modificado_por`

### 🛠️ Arquitectura
- TypeScript **strict mode** con tipado completo (incluyendo extensión de `Express.Request`)
- **Stored Procedures** para todas las operaciones de base de datos
- Rutas configurables mediante `BASE_PATH` (útil para subdominios o proxies)
- CORS configurable por entorno
- Documentación completa con **Swagger UI** en `/docs` (incluyendo `bearerAuth` scheme)
- Scripts SQL completos (schema + seed + stored procedures)

### 📊 Observabilidad
- **Winston** logger con transports a `combined.log` y `error.log`
- **Request ID** único por petición para trazabilidad
- **Métricas Prometheus**: histogramas de latencia, contadores por ruta
- Endpoint `/health` con verificación de DB (retorna 503 si falla)
- Endpoint `/metrics` para scraping de Prometheus
- Compresión HTTP para mejorar performance en respuestas grandes

---

## 🏗️ Tecnologías

- **Backend:** TypeScript 5.9, Express 5.1, Node.js
- **Base de datos:** SQL Server 2022 (Docker)
- **Autenticación:** JWT + bcrypt
- **Validación:** express-validator + Zod
- **Documentación:** Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Exportación:** xlsx
- **Seguridad:** Helmet, express-rate-limit, compression
- **Logging:** Winston (structured logging)
- **Métricas:** prom-client (Prometheus)

---

## 📁 Estructura del proyecto

```
src/
├─ controllers/       # Lógica de negocio
├─ routes/            # Definición de endpoints
├─ middlewares/       # Autenticación, validación, roles, errores
├─ config/            # Validación de env con Zod
├─ types/             # Extensiones TypeScript (Express.Request)
├─ db/
│  ├─ db.ts          # Conexión a SQL Server
│  └─ sp/            # Stored procedures organizados por módulo
├─ auth/             # Utilidades JWT
├─ scripts/          # Schema y seed SQL
└─ swagger.ts        # Documentación OpenAPI
```

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

Crear archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`):

```env
NODE_ENV=development
PORT=3000

JWT_SECRET=supersecreto_cambiame_en_produccion_minimo_32_caracteres
JWT_EXPIRES=1h

DB_SERVER=localhost
DB_USER=sa
DB_PASS=YourStrong!Passw0rd
DB_NAME=expedientes_db

BCRYPT_SALT_ROUNDS=10

# Configuración de rutas base (opcional, default: /api)
BASE_PATH=/api

# CORS (opcional, por defecto permite todos los orígenes)
# CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

**Importante:**
- `JWT_SECRET` debe tener **mínimo 32 caracteres** en producción
- `BASE_PATH` configura el prefijo de todas las rutas (útil para subdominios o proxies)
- `CORS_ORIGIN` acepta múltiples orígenes separados por comas

### 4️⃣ Levantar SQL Server con Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

### 5️⃣ Inicializar base de datos

**Opción 1 - PowerShell (Recomendado):**

```powershell
# Crear base de datos y tablas
Get-Content .\src\scripts\schema.sql | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C

# Insertar datos de prueba (3 usuarios, 5 expedientes, 8 indicios)
Get-Content .\src\scripts\seed.sql | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C

# Crear stored procedures (usuarios, expedientes, indicios)
Get-ChildItem -Path .\src\db\sp\usuarios\*.sql | ForEach-Object { 
  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db 
}

Get-ChildItem -Path .\src\db\sp\expedientes\*.sql | ForEach-Object { 
  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db 
}

Get-ChildItem -Path .\src\db\sp\indicios\*.sql | ForEach-Object { 
  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db 
}
```

**Opción 2 - SSMS o DBeaver (Manual):**

1. Conectarse a SQL Server (localhost:1433, usuario: sa)
2. Ejecutar `src/scripts/schema.sql`
3. Ejecutar `src/scripts/seed.sql`
4. Ejecutar todos los stored procedures en `src/db/sp/`

### 6️⃣ Ejecutar la API

**Desarrollo:**

```bash
npm run dev
```

**Producción:**

```bash
npm run build
npm start
```

El servidor estará disponible en: **http://localhost:3000**

**Verificar que todo funciona:**
1. Abre http://localhost:3000/docs (debería mostrar Swagger UI)
2. Prueba el endpoint de salud: http://localhost:3000/api/health
3. Verifica métricas: http://localhost:3000/metrics
4. Haz login con las credenciales de prueba (ver sección de Pruebas)

---

## 📖 Endpoints principales

### 🔐 Auth
- `POST /api/auth/login` → Iniciar sesión y obtener JWT (rate limited: 5 intentos/15min)

### 👥 Usuarios
- `POST /api/usuarios` → Crear usuario (solo coordinador)
- `PATCH /api/usuarios/:id/password` → Cambiar contraseña
- `GET /api/usuarios` → Listar usuarios con paginación (solo coordinador)

### 🏥 Observabilidad
- `GET /api/health` → Health check con estado de DB, uptime y memoria
- `GET /metrics` → Métricas de Prometheus (latencia, contadores, recursos)

### 📂 Expedientes
- `GET /api/expedientes?page=1&pageSize=10&estado=abierto&fechaInicio=2025-01-01&fechaFin=2025-12-31&tecnicoId=1` → Listar con filtros avanzados
- `GET /api/expedientes/:id` → Obtener detalle de un expediente
- `POST /api/expedientes` → Crear expediente (solo técnico)
- `PUT /api/expedientes/:id` → Actualizar expediente (solo técnico dueño)
- `PATCH /api/expedientes/:id/estado` → Cambiar estado: aprobado/rechazado (solo coordinador, requiere `justificacion` si rechazado)
- `PATCH /api/expedientes/:id/activo` → Soft delete (técnico dueño o coordinador)
- `GET /api/expedientes/export?estado=abierto&tecnicoId=1` → Exportar a Excel con filtros (rate limited: 10 req/min)

### 🔍 Indicios
- `GET /api/expedientes/:id/indicios?page=1&pageSize=10` → Listar indicios de un expediente con paginación
- `POST /api/expedientes/:id/indicios` → Crear indicio (solo técnico dueño del expediente)
- `PUT /api/indicios/:id` → Actualizar indicio (solo técnico dueño)
- `PATCH /api/indicios/:id/activo` → Soft delete (técnico dueño)

**Documentación completa con ejemplos:** http://localhost:3000/docs

---

## 🧪 Pruebas

### Credenciales de prueba

| Usuario    | Password     | Rol          |
|------------|--------------|--------------|
| tecnico1   | tecnico123   | tecnico      |
| tecnico2   | tecnico123   | tecnico      |
| coord1     | tecnico123   | coordinador  |

### Opción 1: Swagger UI (Recomendado)

1. Abrir http://localhost:3000/docs
2. Click en `POST /api/auth/login`
3. Probar con credenciales de arriba
4. Copiar el `token` de la respuesta
5. Click en **"Authorize"** (candado arriba a la derecha)
6. Pegar: `Bearer <token>`
7. Probar todos los endpoints protegidos

### Opción 2: PowerShell

```powershell
# 1. Login y obtener token
$loginResponse = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"username":"tecnico1","password":"tecnico123"}'

$token = $loginResponse.token
Write-Host "Token obtenido: $token"

# 2. Listar expedientes con paginación
$headers = @{ Authorization = "Bearer $token" }
$expedientes = Invoke-RestMethod -Uri "http://localhost:3000/api/expedientes?page=1&pageSize=10" `
  -Method GET -Headers $headers
$expedientes | ConvertTo-Json

# 3. Crear expediente
$body = @{
  codigo = "TEST-$(Get-Date -Format 'yyyyMMddHHmmss')"
  titulo = "Expediente de prueba"
  descripcion = "Creado desde PowerShell"
} | ConvertTo-Json

$nuevoExp = Invoke-RestMethod -Uri http://localhost:3000/api/expedientes `
  -Method POST -Headers $headers -ContentType "application/json" -Body $body
$nuevoExp | ConvertTo-Json

# 4. Exportar a Excel (guarda el archivo)
$excelUrl = "http://localhost:3000/api/expedientes/export?estado=abierto"
Invoke-WebRequest -Uri $excelUrl -Headers $headers -OutFile "expedientes.xlsx"
Write-Host "Archivo guardado: expedientes.xlsx"
```

### Opción 3: curl (Bash/Git Bash)

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tecnico1","password":"tecnico123"}' | jq -r '.token')

echo "Token: $TOKEN"

# 2. Listar expedientes con filtros y paginación (aliases en español también funcionan)
curl -X GET "http://localhost:3000/api/expedientes?pagina=1&tamanoPagina=10&estado=abierto" \
  -H "Authorization: Bearer $TOKEN"

# 3. Crear expediente
curl -X POST http://localhost:3000/api/expedientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"codigo":"TEST-001","titulo":"Test","descripcion":"Expediente de prueba"}'

# 4. Aprobar expediente (requiere rol coordinador)
TOKEN_COORD=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"coord1","password":"tecnico123"}' | jq -r '.token')

curl -X PATCH http://localhost:3000/api/expedientes/1/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_COORD" \
  -d '{"estado":"aprobado"}'

# 5. Rechazar con justificación (obligatorio)
curl -X PATCH http://localhost:3000/api/expedientes/2/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_COORD" \
  -d '{"estado":"rechazado","justificacion":"Falta documentación completa"}'
```

---

## 🎨 Frontend Integration

Esta API está diseñada para trabajar con el frontend incluido en la carpeta `frontend/` (React + TypeScript + Vite).

### Configuración del Frontend

El frontend usa la variable de entorno `VITE_API_BASE_URL` para conectarse a la API. Esta debe configurarse según el `BASE_PATH` del backend:

**Ejemplo `.env` en `frontend/`:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Si cambias `BASE_PATH` en el backend (por ejemplo a `/v1` o `/api/v2`), actualiza también el frontend:

```env
# Backend .env
BASE_PATH=/api/v2

# Frontend .env
VITE_API_BASE_URL=http://localhost:3000/api/v2
```

### CORS

El backend acepta peticiones desde los siguientes orígenes por defecto:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3001`
- `http://localhost:3000`

Para configurar orígenes personalizados, usa la variable `CORS_ORIGIN` en el `.env` del backend:

```env
CORS_ORIGIN=http://localhost:5173,https://mi-dominio.com
```

### Paginación: Aliases en español

La API soporta aliases en español para los parámetros de paginación:

| Inglés       | Español (alias) | Ejemplo                                |
|--------------|-----------------|----------------------------------------|
| `page`       | `pagina`        | `?page=2` o `?pagina=2`                |
| `pageSize`   | `tamanoPagina`  | `?pageSize=20` o `?tamanoPagina=20`    |

Esto permite que el frontend use términos en español sin necesidad de traducción adicional.

**Ejemplo de uso:**
```javascript
// Ambas formas funcionan
fetch(`${API_BASE_URL}/expedientes?page=1&pageSize=10`)
fetch(`${API_BASE_URL}/expedientes?pagina=1&tamanoPagina=10`)
```

---

## 🔧 Scripts disponibles

```bash
npm run dev          # Desarrollo con hot-reload (ts-node-dev)
npm run build        # Compilar a JavaScript (dist/)
npm start            # Ejecutar compilado (producción)
npm run hash:seed    # Generar hashes bcrypt para seed.sql
```

---

## 📝 Notas técnicas

### Validación de variables de entorno

El archivo `src/config/env.ts` usa **Zod** para validar todas las variables de entorno al inicio:

- `NODE_ENV`: "development" | "production" | "test"
- `PORT`: número (convertido automáticamente desde string)
- `JWT_SECRET`: mínimo 32 caracteres (validado en producción)
- `DB_*`: todas las credenciales requeridas
- `BASE_PATH`: default "/api"
- `CORS_ORIGIN`: opcional

Si falta alguna variable o no cumple los requisitos, la app **no arranca** y muestra un mensaje claro del error.

### Middleware de errores

El archivo `src/middlewares/error.middleware.ts` captura todos los errores y devuelve respuestas apropiadas:

- **Desarrollo:** stack trace completo para debugging
- **Producción:** mensajes genéricos para no exponer detalles internos
- Maneja errores de JWT, validación, y excepciones no controladas

### Tipado extendido de Express

El archivo `src/types/express.d.ts` extiende la interfaz `Request` de Express para incluir:

```typescript
interface Request {
  user?: {
    id: number;
    username: string;
    rol: "tecnico" | "coordinador";
  };
  requestId?: string; // UUID para trazabilidad
}
```

Esto proporciona **autocompletado** y **type-safety** en todos los controladores sin necesidad de castings.

### Logging estructurado con Winston

El archivo `src/config/logger.ts` configura Winston con:

- **Transports**: `logs/combined.log` (todos) y `logs/error.log` (solo errores)
- **Formato JSON** con timestamp para fácil parsing
- **Console en desarrollo** con colores para mejor UX
- **Request ID** en cada log para correlacionar peticiones

Ejemplo de uso:
```typescript
import { logger } from "../config/logger";

logger.info("Usuario autenticado", { requestId: req.requestId, userId: 123 });
logger.error("Error de DB", { requestId: req.requestId, error: err.message });
```

### Métricas con Prometheus

El archivo `src/config/metrics.ts` expone:

- `http_requests_total`: contador por método, ruta y código de estado
- `http_request_duration_seconds`: histograma de latencia
- `db_errors_total`: contador de errores de base de datos
- Métricas por defecto: uso de memoria, CPU, heap

Accede a `/metrics` para que Prometheus pueda scrapear.

### Rate Limiting

Protección contra abuso en endpoints críticos:

| Endpoint | Límite | Ventana | Razón |
|----------|--------|---------|-------|
| `/api/auth/login` | 5 req | 15 min | Prevenir brute-force |
| `/api/expedientes/export` | 10 req | 1 min | Evitar sobrecarga de recursos |
| Toda la API | 100 req | 1 min | Protección general |

Headers de respuesta: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`

### Seguridad con Helmet

Configuración de headers de seguridad:

- **CSP**: `default-src 'self'` con excepciones para Swagger UI
- **HSTS**: Solo en producción (`max-age=31536000`)
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`

---

## � Contratos Canónicos (API Contracts)

Esta sección documenta el formato estándar de requests y responses de la API.

### Formato de Respuesta Estándar

Todas las respuestas siguen el patrón:

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": { /* ... payload ... */ }
}
```

**Respuesta con error:**
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo",
  "details": "Información adicional (opcional)"
}
```

### Paginación

Todas las listas paginadas retornan:

```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 45,
    "data": [/* array de items */]
  }
}
```

**Query params (soportan alias en español):**
- `page` o `pagina`: número de página (default: 1)
- `pageSize` o `tamanoPagina`: items por página (default: 10)

### Módulo: Autenticación

#### POST /api/auth/login

**Request:**
```json
{
  "username": "tecnico1",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "username": "tecnico1",
      "rol": "tecnico"
    }
  }
}
```

**Errores comunes:**
- `400`: Faltan username o password
- `401`: Credenciales inválidas

**Rate Limit:** 5 req / 15 minutos

---

### Módulo: Expedientes

#### GET /api/expedientes

**Query params:**
- `page` / `pagina` (número, default: 1)
- `pageSize` / `tamanoPagina` (número, default: 10)
- `q` (string): Búsqueda por texto
- `estado` (string): "pendiente", "aprobado", "rechazado"
- `tecnicoId` (número): Filtrar por técnico
- `fechaInicio` (ISO date): Desde fecha
- `fechaFin` (ISO date): Hasta fecha

**Response (200):**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 5,
    "data": [
      {
        "id": 1,
        "codigo": "EXP-2025-001",
        "titulo": "Título del expediente",
        "descripcion": "Descripción completa",
        "estado": "pendiente",
        "activo": 1,
        "tecnico_id": 1,
        "aprobador_id": null,
        "justificacion_rechazo": null,
        "fecha_creacion": "2025-01-15T10:30:00Z",
        "fecha_actualizacion": "2025-01-15T10:30:00Z",
        "modificado_por": 1
      }
    ]
  }
}
```

**Errores comunes:**
- `401`: Sin token o token inválido

**RBAC:** Técnicos ven solo sus expedientes, coordinadores ven todos

---

#### GET /api/expedientes/:id

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "codigo": "EXP-2025-001",
    "titulo": "Título",
    "descripcion": "Descripción",
    "estado": "pendiente",
    "activo": 1,
    "tecnico_id": 1,
    "aprobador_id": null,
    "justificacion_rechazo": null,
    "fecha_creacion": "2025-01-15T10:30:00Z",
    "fecha_actualizacion": "2025-01-15T10:30:00Z",
    "modificado_por": 1
  }
}
```

**Errores comunes:**
- `404`: Expediente no existe

---

#### POST /api/expedientes

**Requiere:** Rol técnico

**Request:**
```json
{
  "codigo": "EXP-2025-001",
  "titulo": "Título (opcional)",
  "descripcion": "Descripción del expediente"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 5
  }
}
```

**Errores comunes:**
- `400`: Faltan campos obligatorios (codigo, descripcion)
- `401`: Sin autenticación
- `403`: No tienes rol técnico

---

#### PUT /api/expedientes/:id

**Requiere:** Técnico (solo dueño) o Coordinador

**Request:**
```json
{
  "titulo": "Nuevo título",
  "descripcion": "Nueva descripción"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ok": true
  }
}
```

**Errores comunes:**
- `403`: No eres el dueño del expediente
- `404`: Expediente no encontrado

---

#### PATCH /api/expedientes/:id/estado

**Requiere:** Rol coordinador

**Request:**
```json
{
  "estado": "rechazado",
  "justificacion": "Requiere más detalles" // OBLIGATORIO si estado="rechazado"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ok": true
  }
}
```

**Errores comunes:**
- `400`: Estado inválido o falta justificación al rechazar
- `403`: No tienes rol coordinador

---

#### GET /api/expedientes/export

**Requiere:** Autenticación

**Query params:** Mismos filtros que el GET de listado

**Response (200):**
- **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition:** `attachment; filename="expedientes_2025-01-15.xlsx"`
- **Body:** Archivo XLSX binario

**Rate Limit:** 10 req / minuto

---

### Módulo: Indicios

#### GET /api/expedientes/:id/indicios

**Query params:**
- `page` / `pagina` (default: 1)
- `pageSize` / `tamanoPagina` (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 3,
    "data": [
      {
        "id": 1,
        "expediente_id": 1,
        "descripcion": "Descripción del indicio",
        "peso": 15.5,
        "color": "rojo",
        "tamano": "pequeño",
        "activo": 1,
        "fecha_creacion": "2025-01-15T10:30:00Z",
        "fecha_actualizacion": "2025-01-15T10:30:00Z",
        "modificado_por": 1
      }
    ]
  }
}
```

---

#### POST /api/expedientes/:id/indicios

**Requiere:** Técnico (solo dueño) o Coordinador

**Request:**
```json
{
  "descripcion": "Descripción del indicio",
  "peso": 15.5,        // opcional
  "color": "rojo",     // opcional
  "tamano": "pequeño"  // opcional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 8
  }
}
```

**Errores comunes:**
- `403`: No eres el dueño del expediente
- `404`: Expediente no encontrado

---

### Módulo: Usuarios (Admin)

**⚠️ Requiere:** Rol coordinador (admin) para todos los endpoints

#### POST /api/usuarios

**Request:**
```json
{
  "username": "nuevo_tecnico",
  "password": "pass123456",
  "rol": "tecnico"
}
```

**Validaciones:**
- `username`: mínimo 3 caracteres
- `password`: mínimo 6 caracteres
- `rol`: "tecnico" o "coordinador"

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "username": "nuevo_tecnico",
    "rol": "tecnico"
  }
}
```

**Errores comunes:**
- `400`: Validación fallida (username o password muy cortos)
- `403`: No tienes rol coordinador

---

#### GET /api/usuarios

**Query params:**
- `page` / `pagina` (default: 1)
- `pageSize` / `tamanoPagina` (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 3,
    "data": [
      {
        "id": 1,
        "username": "tecnico1",
        "rol": "tecnico",
        "activo": 1,
        "fecha_creacion": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

#### PATCH /api/usuarios/:id/password

**Request:**
```json
{
  "passwordNueva": "nuevapass123"
}
```

**Validaciones:**
- `passwordNueva`: mínimo 6 caracteres

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ok": true
  }
}
```

**Errores comunes:**
- `400`: Password muy corto
- `404`: Usuario no encontrado

---

### Rate Limit Headers

Todas las respuestas incluyen headers de rate limiting cuando aplica:

```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1704081600
```

---

### Testing E2E

El proyecto incluye tests E2E con **Jest + Supertest**.

**Ejecutar tests:**
```bash
npm run test:e2e
```

**Ejecutar con coverage:**
```bash
npm run test:coverage
```

**⚠️ Nota:** Los tests requieren que la base de datos esté poblada con los datos de `seed.sql` y que los usuarios tengan contraseñas correctamente hasheadas con bcrypt.

**Cobertura de tests:**
- ✅ Autenticación (login válido/inválido)
- ✅ Paginación con alias en español
- ✅ RBAC (403 cuando no tienes permisos)
- ✅ Validaciones (username≥3, password≥6)
- ✅ Ownership (técnico solo modifica sus expedientes)
- ✅ Exportaciones con Content-Disposition y fecha
- ✅ Rate limiting (429 después de exceder límites)

---

## �👨‍💻 Autor

**Guillermo Gómez**
- GitHub: [@GuillermoGome2z](https://github.com/GuillermoGome2z)
- Universidad Mariano Gálvez - Desarrollo Web (2025)

---

## 📄 Licencia

ISC
