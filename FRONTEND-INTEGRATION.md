# 📘 Guía de Integración Frontend con Docker

## 🎯 Resumen para el Equipo de Frontend

El backend ya está 100% dockerizado y funcionando. Este documento explica **qué necesita hacer el frontend** para integrarse con la infraestructura Docker existente.

---

## 📋 Estado Actual

### ✅ Backend (Ya Listo)
- Backend corriendo en contenedor Docker
- Puerto: **3000**
- Base URL: `http://localhost:3000/api`
- Health check: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/docs`
- SQL Server en contenedor (puerto 1433)

### ⏳ Frontend (Pendiente de Integración)
- El servicio `web` está **comentado** en `docker-compose.yml`
- Existe un `Dockerfile.frontend` template
- Existe un `.env.frontend.docker` con la configuración

---

## 🛠️ Tareas del Frontend

### 1. Estructura de Carpetas Requerida

El frontend debe estar en la **raíz del proyecto** en una carpeta llamada `frontend/`:

```
Api-Expedientes-/
├── src/                    # Backend (ya existe)
├── frontend/               # ⬅️ CREAR ESTA CARPETA
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── docker-compose.yml
└── ...
```

### 2. Configurar Variables de Entorno

**Copiar el archivo de configuración:**
```bash
# Desde la raíz del proyecto
cp .env.frontend.docker frontend/.env
```

**Contenido de `frontend/.env`:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Sistema de Expedientes
```

### 3. Modificar `vite.config.ts`

El frontend debe escuchar en `0.0.0.0` para ser accesible desde fuera del contenedor:

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ⬅️ IMPORTANTE: Permite acceso desde fuera del contenedor
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true  // ⬅️ Necesario para hot reload en Docker
    }
  }
})
```

### 4. Actualizar `package.json`

**Agregar o modificar el script `dev`:**

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 5. Configurar Cliente HTTP (Axios/Fetch)

**Opción A: Usar variable de entorno (Recomendado)**

```typescript
// frontend/src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// frontend/src/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Opción B: Variables hardcodeadas con condición**

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.tudominio.com/api'
  : 'http://localhost:3000/api';
```

### 6. Activar el Servicio Web en Docker Compose

**Editar `docker-compose.yml` en la raíz:**

Descomentar estas líneas (aproximadamente líneas 46-60):

```yaml
# DESCOMENTAR DESDE AQUÍ ⬇️
  web:
    build:
      context: ./frontend
      dockerfile: ../Dockerfile.frontend
    container_name: expedientes-web
    ports:
      - "5173:5173"
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/.env:/app/.env
    depends_on:
      - api
    networks:
      - expedientes-network
    restart: unless-stopped
# HASTA AQUÍ ⬆️
```

---

## 🚀 Levantar Todo con Docker

### Pasos para desarrollo:

```bash
# 1. Asegurarse que Docker Desktop está corriendo

# 2. Levantar todos los servicios
npm run compose:up

# 3. Esperar ~30 segundos

# 4. En otra terminal, inicializar la BD
.\init-db-docker.ps1

# 5. Verificar servicios
# Backend: http://localhost:3000/health
# Frontend: http://localhost:5173
# Swagger: http://localhost:3000/docs
```

### Comandos útiles:

```bash
# Ver logs en tiempo real
npm run compose:logs

# Ver logs solo del frontend
docker compose logs -f web

# Reiniciar solo el frontend
docker compose restart web

# Detener todo
npm run compose:down

# Limpiar todo (incluye volúmenes)
npm run compose:clean
```

---

## 🔌 Endpoints del Backend Disponibles

### Autenticación
```
POST /api/auth/login
Body: { username: string, password: string }
Response: { success: true, data: { token: string, user: {...} } }
```

### Expedientes
```
GET    /api/expedientes?page=1&pageSize=10
POST   /api/expedientes
GET    /api/expedientes/:id
PUT    /api/expedientes/:id
PATCH  /api/expedientes/:id/estado
PATCH  /api/expedientes/:id/activo
```

### Indicios
```
GET    /api/indicios/expediente/:expedienteId
POST   /api/indicios
PUT    /api/indicios/:id
PATCH  /api/indicios/:id/activo
```

### Usuarios (Solo Coordinadores)
```
GET    /api/usuarios?page=1&pageSize=10
POST   /api/usuarios
PATCH  /api/usuarios/:id/password
PATCH  /api/usuarios/:id/activo
```

### Otros
```
GET    /health
GET    /metrics (Prometheus)
GET    /docs (Swagger UI)
```

**📝 Nota:** Todos los endpoints (excepto `/auth/login` y `/health`) requieren header:
```
Authorization: Bearer <token>
```

---

## 🔐 Credenciales de Prueba

```
Usuario Técnico:
  username: tecnico1
  password: tecnico123

Usuario Coordinador:
  username: coord1
  password: Coord123!
```

---

## 📊 Formato de Respuestas

Todas las respuestas siguen este formato estandarizado:

**Success:**
```json
{
  "success": true,
  "data": { /* payload aquí */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}
```

**Paginación:**
```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "data": [ /* items aquí */ ]
  }
}
```

---

## 🐛 Troubleshooting Frontend

### Problema: "Network Error" o "Failed to fetch"

**Causa:** El frontend no puede conectar al backend

**Solución:**
1. Verificar que el backend esté corriendo: `http://localhost:3000/health`
2. Verificar `VITE_API_URL` en `.env`
3. Verificar CORS (ya está configurado en backend)

### Problema: "CORS policy blocked"

**Solución:** El backend ya tiene CORS configurado para:
```javascript
// Backend permite estos orígenes:
- http://localhost:5173
- http://localhost:3000
- http://127.0.0.1:5173
```

Si necesitas agregar más orígenes, modificar `src/app.ts` en el backend.

### Problema: Hot reload no funciona

**Solución:**
1. Asegurarse que `vite.config.ts` tiene `usePolling: true`
2. Verificar que el volumen está montado correctamente en `docker-compose.yml`

### Problema: "Port 5173 already in use"

**Solución:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml:
ports:
  - "5174:5173"  # Usar 5174 en host
```

---

## 📸 Validación de Integración

### Checklist para el equipo de frontend:

- [ ] Carpeta `frontend/` creada en la raíz
- [ ] `.env` configurado con `VITE_API_URL=http://localhost:3000/api`
- [ ] `vite.config.ts` con `host: '0.0.0.0'` y `usePolling: true`
- [ ] `package.json` con script `"dev": "vite --host 0.0.0.0"`
- [ ] Cliente HTTP configurado con `API_BASE_URL`
- [ ] Servicio `web` descomentado en `docker-compose.yml`
- [ ] `docker compose up` levanta frontend sin errores
- [ ] `http://localhost:5173` accesible desde navegador
- [ ] Login exitoso con `tecnico1` / `tecnico123`
- [ ] Token guardado en localStorage
- [ ] Requests al backend incluyen `Authorization: Bearer <token>`
- [ ] Listado de expedientes funciona
- [ ] Hot reload funciona al editar archivos

---

## 📚 Documentación Adicional

- **Swagger UI:** `http://localhost:3000/docs` (Documentación interactiva de todos los endpoints)
- **README Principal:** Ver `README.md` en la raíz
- **Guía Docker Completa:** Ver `DOCKER-DEPLOYMENT.md`

---

## 💡 Tips de Desarrollo

### Desarrollo sin Docker (alternativa)

Si prefieres desarrollar el frontend fuera de Docker:

```bash
# Backend en Docker, Frontend local
docker compose up sqlserver api

# En otra terminal
cd frontend
npm install
npm run dev
```

El frontend local se conectará al backend en Docker sin problemas.

### Debug del Backend desde Frontend

Para ver los logs del backend en tiempo real:

```bash
docker compose logs -f api
```

---

## 🎯 Entregables Esperados del Frontend

1. **Código:**
   - Carpeta `frontend/` con estructura Vite + React
   - Configuración Docker funcional
   
2. **Funcionalidades:**
   - Login con JWT
   - CRUD de Expedientes
   - CRUD de Indicios (asociados a expedientes)
   - Gestión de usuarios (solo coordinadores)
   - Manejo de estados (abierto, en_revision, aprobado, rechazado)
   - Paginación en listados
   
3. **Validaciones:**
   - Solo técnicos pueden crear/editar expedientes
   - Solo coordinadores pueden aprobar/rechazar
   - Solo coordinadores pueden crear usuarios
   - Campos requeridos según contrato API

---

## 🆘 Soporte

Si tienen dudas o problemas:

1. Revisar `http://localhost:3000/docs` (Swagger)
2. Ver logs: `docker compose logs -f`
3. Revisar `DOCKER-DEPLOYMENT.md`
4. Contactar al equipo de backend

---

**Última actualización:** 2025-11-01  
**Versión del Backend:** 1.0.0  
**Docker Compose:** 3.8
