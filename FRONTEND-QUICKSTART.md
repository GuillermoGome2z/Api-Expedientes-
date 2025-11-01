# 🚀 Quick Start para Frontend

## TL;DR - Lo Mínimo que Necesitas Saber

### 1. ¿Dónde poner el código del frontend?
```
Api-Expedientes-/
├── frontend/          ← AQUÍ VA TU CÓDIGO
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
```

### 2. Configurar variables de entorno
```bash
# Copiar archivo de configuración
cp .env.frontend.docker frontend/.env
```

Contenido:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Configurar Vite

```typescript
// frontend/vite.config.ts
export default defineConfig({
  server: {
    host: '0.0.0.0',    // ← IMPORTANTE
    port: 5173,
    watch: {
      usePolling: true  // ← IMPORTANTE para hot reload
    }
  }
})
```

### 4. Configurar API Client

```typescript
// frontend/src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 5. Activar en Docker

Editar `docker-compose.yml` y descomentar el servicio `web` (líneas 46-60)

### 6. Levantar todo

```bash
npm run compose:up
```

---

## 🔗 URLs Importantes

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Swagger Docs: `http://localhost:3000/docs`
- Health Check: `http://localhost:3000/health`

## 🔐 Credenciales de Prueba

```
Técnico:
  user: tecnico1
  pass: tecnico123

Coordinador:
  user: coord1
  pass: Coord123!
```

## 📡 Ejemplo de Login

```typescript
const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  const { token, user } = response.data.data;
  localStorage.setItem('token', token);
  return user;
};
```

## 📊 Formato de Respuestas

**Success:**
```json
{ "success": true, "data": {...} }
```

**Error:**
```json
{ "success": false, "error": "mensaje" }
```

---

📖 **Documentación completa:** Ver `FRONTEND-INTEGRATION.md`
