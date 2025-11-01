# 🐳 Guía de Despliegue con Docker

Esta guía te ayudará a levantar la aplicación completa usando Docker Compose y a generar las evidencias necesarias.

## 📋 Pre-requisitos

- Docker Desktop instalado y corriendo
- Git (para clonar el proyecto)
- VS Code (opcional, para desarrollo)

## 🚀 Pasos para Levantar la Aplicación

### 1. Clonar y Preparar el Proyecto

```bash
git clone <tu-repositorio>
cd Api-Expedientes-
```

### 2. Verificar Archivos Docker

Asegúrate de que existen estos archivos:
- ✅ `docker-compose.yml`
- ✅ `Dockerfile.backend`
- ✅ `Dockerfile.frontend` (si tienes frontend)
- ✅ `.env.docker`

### 3. Levantar los Contenedores

```bash
# Opción 1: Usando npm script
npm run compose:up

# Opción 2: Usando docker compose directamente
docker compose up --build
```

Esto creará y levantará 3 servicios:
- 🗄️ **sqlserver** (Puerto 1433) - SQL Server 2022
- 🔧 **api** (Puerto 3000) - Backend Express + TypeScript
- 🌐 **web** (Puerto 5173) - Frontend Vite + React (si está habilitado)

### 4. Esperar a que Todo Esté Listo

Verás en la consola:
```
✅ Conectado a SQL Server
🚀 Servidor corriendo en http://localhost:3000
📝 Documentación Swagger: http://localhost:3000/docs
```

**Tiempo estimado:** 2-3 minutos la primera vez (descarga de imágenes + build)

---

## 🧪 Verificación y Evidencias

### Paso 1: Verificar Health Check del API

Abre tu navegador en:
```
http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 25.123456789,
    "timestamp": "2025-11-01T18:30:00.000Z"
  }
}
```

📸 **CAPTURA 1:** Pantalla del navegador mostrando `/health` exitoso

---

### Paso 2: Inicializar la Base de Datos

```bash
# Copiar scripts al contenedor
docker cp src/scripts/schema.sql expedientes-sqlserver:/tmp/
docker cp src/scripts/seed.sql expedientes-sqlserver:/tmp/

# Ejecutar scripts
docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d master -i /tmp/schema.sql
docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db -i /tmp/seed.sql
```

O usando el script PowerShell incluido:
```powershell
.\setup-db.ps1
```

---

### Paso 3: Probar la Aplicación desde la UI

#### 3.1 Hacer Login

Si tienes frontend:
```
http://localhost:5173
```

Credenciales de prueba:
- **Técnico:** `tecnico1` / `tecnico123`
- **Coordinador:** `coord1` / `Coord123!`

Si no tienes frontend, usa Swagger:
```
http://localhost:3000/docs
```

📸 **CAPTURA 2:** Pantalla de login exitoso

---

### Paso 4: Crear o Modificar un Expediente

#### Opción A: Desde la UI (Frontend)
1. Inicia sesión como `tecnico1`
2. Ve a "Expedientes"
3. Crea un nuevo expediente:
   - Código: `EXP-2025-099`
   - Título: `Prueba Docker`
   - Descripción: `Expediente creado para demostrar Docker`
4. Cambia el estado a "En Revisión"

#### Opción B: Desde Swagger/API

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tecnico1","password":"tecnico123"}'

# Guarda el token de la respuesta

# 2. Crear expediente
curl -X POST http://localhost:3000/api/expedientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "codigo": "EXP-2025-099",
    "titulo": "Prueba Docker",
    "descripcion": "Expediente creado para demostrar Docker"
  }'

# 3. Cambiar estado (sustituye :id con el ID del expediente creado)
curl -X PATCH http://localhost:3000/api/expedientes/6/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"estado": "en_revision"}'
```

📸 **CAPTURA 3:** Pantalla mostrando el expediente creado

---

### Paso 5: Verificar los Cambios en la Base de Datos

#### Entrar al Contenedor de SQL Server

```bash
docker exec -it expedientes-sqlserver /bin/bash
```

#### Conectarse a SQL Server

```bash
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db
```

#### Consultas para Verificar

```sql
-- Ver todos los expedientes
SELECT * FROM Expedientes ORDER BY id DESC;
GO

-- Ver el expediente recién creado
SELECT id, codigo, titulo, estado, fecha_creacion, fecha_estado 
FROM Expedientes 
WHERE codigo = 'EXP-2025-099';
GO

-- Ver usuarios activos
SELECT id, username, rol, activo FROM Usuarios;
GO

-- Ver indicios de un expediente
SELECT i.id, i.descripcion, i.peso, i.color, e.codigo AS expediente
FROM Indicios i
JOIN Expedientes e ON i.expediente_id = e.id
WHERE e.codigo = 'EXP-2025-099';
GO

-- Salir
EXIT
```

📸 **CAPTURA 4:** Terminal mostrando el resultado de `SELECT * FROM Expedientes` con el nuevo registro

📸 **CAPTURA 5:** Terminal mostrando el cambio de estado del expediente

---

## 📸 Lista Completa de Capturas Requeridas

1. ✅ **Health Check** - Navegador mostrando `/health` con respuesta 200
2. ✅ **Login exitoso** - UI o Swagger mostrando token JWT
3. ✅ **Expediente creado** - UI mostrando el nuevo expediente en la lista
4. ✅ **Consulta SQL - Listado** - Terminal con `SELECT * FROM Expedientes`
5. ✅ **Consulta SQL - Detalle** - Terminal con el expediente específico creado
6. ✅ **Docker PS** - `docker ps` mostrando los 3 contenedores corriendo
7. ✅ **Logs del API** - `docker logs expedientes-api` mostrando conexión exitosa

---

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver contenedores corriendo
docker ps

# Ver logs en tiempo real
npm run compose:logs
# o
docker compose logs -f api

# Reiniciar un servicio específico
docker compose restart api

# Parar todo
npm run compose:down

# Limpiar volúmenes (CUIDADO: borra la BD)
npm run compose:clean
```

### Acceso a Contenedores

```bash
# Backend
docker exec -it expedientes-api sh

# SQL Server
docker exec -it expedientes-sqlserver /bin/bash

# Frontend (si existe)
docker exec -it expedientes-web sh
```

### Consultas SQL Rápidas desde Host

```bash
# Ver expedientes
docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db -Q "SELECT * FROM Expedientes"

# Ver usuarios
docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db -Q "SELECT id, username, rol, activo FROM Usuarios"

# Ver indicios
docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db -Q "SELECT * FROM Indicios"
```

---

## 🐛 Troubleshooting

### Problema: "Port 3000 already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml:
ports:
  - "3001:3000"  # host:container
```

### Problema: SQL Server no se conecta

```bash
# Ver logs del contenedor
docker logs expedientes-sqlserver

# Reiniciar SQL Server
docker compose restart sqlserver

# Esperar hasta ver: "SQL Server is now ready for client connections"
```

### Problema: "Cannot find module"

```bash
# Rebuild sin caché
docker compose build --no-cache api
docker compose up api
```

---

## 🎯 Checklist Final para Entrega

- [ ] Todos los contenedores corriendo (`docker ps` muestra 2-3 contenedores)
- [ ] Health check responde 200 OK
- [ ] Login exitoso genera token JWT
- [ ] Expediente creado visible en UI
- [ ] Consulta SQL muestra el nuevo expediente
- [ ] Cambio de estado reflejado en base de datos
- [ ] 7 capturas de pantalla guardadas
- [ ] README.md actualizado con instrucciones
- [ ] `.env.docker` configurado correctamente
- [ ] `docker-compose.yml` funcional

---

## 📚 Arquitectura

```
┌─────────────────┐
│   Frontend      │  http://localhost:5173
│  (Vite/React)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Backend API   │  http://localhost:3000
│  (Express/TS)   │  /api/* endpoints
└────────┬────────┘
         │ TDS Protocol
         ▼
┌─────────────────┐
│   SQL Server    │  localhost:1433
│     2022        │  expedientes_db
└─────────────────┘
```

---

## 🔒 Seguridad en Producción

**⚠️ IMPORTANTE:** Los valores actuales son para DESARROLLO. En producción:

1. Cambiar `SA_PASSWORD` a una contraseña fuerte
2. Cambiar `JWT_SECRET` por uno generado aleatoriamente
3. Usar secretos de Docker/Kubernetes
4. No commitear archivos `.env` con credenciales reales
5. Usar HTTPS/TLS para conexiones
6. Implementar rate limiting más estricto
7. Usar volúmenes persistentes para SQL Server

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs: `docker compose logs`
2. Verifica que Docker Desktop esté corriendo
3. Asegúrate de tener puertos 1433, 3000, 5173 disponibles
4. Consulta la documentación en `/docs`

---

**🎉 ¡Listo! Tu aplicación está corriendo en Docker.**
