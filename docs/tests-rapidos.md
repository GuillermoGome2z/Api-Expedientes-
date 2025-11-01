# 🧪 Tests Rápidos - API Expedientes

Este documento contiene comandos curl para probar todos los endpoints de la API.

## 🔐 Autenticación

### Login Técnico
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tecnico1","password":"tecnico123"}'
```
**Respuesta esperada (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "tecnico1",
    "rol": "tecnico"
  }
}
```

### Login Coordinador
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"coord1","password":"tecnico123"}'
```
**Respuesta esperada (200):** Similar a técnico pero con `rol: "coordinador"`

---

## 👥 Usuarios

**Variables de entorno:**
```bash
# Guardar tokens
TOKEN_TECNICO="<token_de_tecnico1>"
TOKEN_COORD="<token_de_coord1>"
```

### Crear Usuario (solo coordinador)
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_COORD" \
  -d '{
    "username": "tecnico3",
    "password": "password123",
    "rol": "tecnico"
  }'
```
**Respuesta esperada (201):**
```json
{
  "id": 4,
  "username": "tecnico3",
  "rol": "tecnico"
}
```

**Error esperado si lo intenta un técnico (403):**
```json
{
  "error": "Rol no autorizado"
}
```

### Cambiar Contraseña (propio usuario)
```bash
curl -X PATCH http://localhost:3000/api/usuarios/1/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "passwordActual": "tecnico123",
    "passwordNueva": "nuevapass456"
  }'
```
**Respuesta esperada (200):**
```json
{
  "ok": true,
  "message": "Contraseña actualizada correctamente"
}
```

**Error si la contraseña actual es incorrecta (401):**
```json
{
  "error": "Contraseña actual incorrecta"
}
```

### Listar Usuarios (solo coordinador)
```bash
curl -X GET "http://localhost:3000/api/usuarios?page=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN_COORD"
```
**Respuesta esperada (200):**
```json
{
  "pagina": 1,
  "page": 1,
  "pageSize": 10,
  "total": 3,
  "data": [
    {"id": 1, "username": "tecnico1", "rol": "tecnico", "activo": true},
    {"id": 2, "username": "tecnico2", "rol": "tecnico", "activo": true},
    {"id": 3, "username": "coord1", "rol": "coordinador", "activo": true}
  ]
}
```

---

## 📂 Expedientes

### Listar Expedientes (con filtros)
```bash
# Técnico - solo ve los suyos
curl -X GET "http://localhost:3000/api/expedientes?page=1&pageSize=10" \
  -H "Authorization: Bearer $TOKEN_TECNICO"

# Con filtro de estado
curl -X GET "http://localhost:3000/api/expedientes?estado=abierto" \
  -H "Authorization: Bearer $TOKEN_TECNICO"

# Con filtro de fechas (coordinador puede filtrar por técnico)
curl -X GET "http://localhost:3000/api/expedientes?fechaInicio=2025-01-01&fechaFin=2025-12-31&tecnicoId=1" \
  -H "Authorization: Bearer $TOKEN_COORD"

# Usando alias 'pagina'
curl -X GET "http://localhost:3000/api/expedientes?pagina=1&pageSize=5&estado=aprobado" \
  -H "Authorization: Bearer $TOKEN_COORD"
```
**Respuesta esperada (200):**
```json
{
  "pagina": 1,
  "page": 1,
  "pageSize": 10,
  "total": 3,
  "estado": "abierto",
  "data": [
    {
      "id": 1,
      "codigo": "EXP-2025-001",
      "titulo": "Robo en residencia",
      "estado": "abierto",
      "tecnico_username": "tecnico1",
      "fecha_creacion": "2025-10-31T..."
    }
  ]
}
```

### Obtener Expediente por ID
```bash
curl -X GET http://localhost:3000/api/expedientes/1 \
  -H "Authorization: Bearer $TOKEN_TECNICO"
```

### Crear Expediente (solo técnico)
```bash
curl -X POST http://localhost:3000/api/expedientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "codigo": "EXP-2025-010",
    "titulo": "Nuevo caso de investigación",
    "descripcion": "Descripción detallada del nuevo expediente"
  }'
```
**Respuesta esperada (201):**
```json
{
  "ok": true,
  "created": {
    "id": 6
  }
}
```

**Error de validación (400):**
```json
{
  "errors": [
    {
      "msg": "El código debe tener entre 3 y 30 caracteres",
      "param": "codigo"
    }
  ]
}
```

### Actualizar Expediente (solo técnico dueño)
```bash
curl -X PUT http://localhost:3000/api/expedientes/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "titulo": "Robo en residencia - Actualizado",
    "descripcion": "Descripción actualizada con nuevos datos"
  }'
```
**Respuesta esperada (200):**
```json
{
  "ok": true
}
```

### Cambiar Estado (solo coordinador)

**Aprobar:**
```bash
curl -X PATCH http://localhost:3000/api/expedientes/1/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_COORD" \
  -d '{
    "estado": "aprobado",
    "justificacion": "El expediente cumple con todos los requisitos"
  }'
```

**Rechazar (justificación obligatoria):**
```bash
curl -X PATCH http://localhost:3000/api/expedientes/2/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_COORD" \
  -d '{
    "estado": "rechazado",
    "justificacion": "Falta de evidencia suficiente para proceder"
  }'
```
**Respuesta esperada (200):**
```json
{
  "ok": true
}
```

**Error sin justificación al rechazar (400):**
```json
{
  "errors": [
    {
      "msg": "La justificación es obligatoria cuando el estado es rechazado",
      "param": "justificacion"
    }
  ]
}
```

**Error si lo intenta un técnico (403):**
```json
{
  "error": "Rol no autorizado"
}
```

### Exportar a Excel
```bash
# Exportar todos (coordinador)
curl -X GET "http://localhost:3000/api/expedientes/export" \
  -H "Authorization: Bearer $TOKEN_COORD" \
  -o expedientes.xlsx

# Con filtros
curl -X GET "http://localhost:3000/api/expedientes/export?estado=aprobado&fechaInicio=2025-01-01" \
  -H "Authorization: Bearer $TOKEN_COORD" \
  -o expedientes_aprobados.xlsx

# Técnico - solo exporta los suyos
curl -X GET "http://localhost:3000/api/expedientes/export" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -o mis_expedientes.xlsx
```
**Respuesta esperada:** Archivo .xlsx descargado

---

## 🔍 Indicios

### Listar Indicios de un Expediente (con paginación)
```bash
# Sin paginación explícita (por defecto page=1, pageSize=10)
curl -X GET http://localhost:3000/api/expedientes/1/indicios \
  -H "Authorization: Bearer $TOKEN_TECNICO"

# Con paginación
curl -X GET "http://localhost:3000/api/expedientes/1/indicios?page=1&pageSize=5" \
  -H "Authorization: Bearer $TOKEN_TECNICO"

# Usando alias 'pagina'
curl -X GET "http://localhost:3000/api/expedientes/1/indicios?pagina=1&pageSize=5" \
  -H "Authorization: Bearer $TOKEN_TECNICO"
```
**Respuesta esperada (200):**
```json
{
  "pagina": 1,
  "page": 1,
  "pageSize": 5,
  "total": 2,
  "data": [
    {
      "id": 1,
      "expediente_id": 1,
      "descripcion": "Herramienta metálica encontrada en la escena",
      "peso": 2.50,
      "color": "plateado",
      "tamano": "mediano"
    }
  ]
}
```

### Crear Indicio (solo técnico dueño del expediente)
```bash
# Técnico1 crea indicio en su expediente (éxito)
curl -X POST http://localhost:3000/api/expedientes/1/indicios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "descripcion": "Nueva evidencia encontrada",
    "peso": 1.5,
    "color": "negro",
    "tamano": "pequeño"
  }'
```
**Respuesta esperada (201):**
```json
{
  "id": 9
}
```

**Técnico1 intenta crear indicio en expediente de técnico2 (error 403):**
```bash
curl -X POST http://localhost:3000/api/expedientes/3/indicios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "descripcion": "Intento de agregar indicio a expediente ajeno",
    "peso": 1.0,
    "color": "rojo",
    "tamano": "pequeño"
  }'
```
**Respuesta esperada (403):**
```json
{
  "error": "No es dueño del expediente"
}
```

**Error de validación - peso negativo (400):**
```bash
curl -X POST http://localhost:3000/api/expedientes/1/indicios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "descripcion": "Prueba con peso inválido",
    "peso": -5,
    "color": "azul",
    "tamano": "grande"
  }'
```
**Respuesta esperada (400):**
```json
{
  "errors": [
    {
      "msg": "El peso debe ser un número mayor o igual a 0",
      "param": "peso"
    }
  ]
}
```

### Actualizar Indicio (solo técnico dueño)
```bash
# Técnico1 actualiza su propio indicio (éxito)
curl -X PUT http://localhost:3000/api/indicios/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "descripcion": "Herramienta metálica - descripción actualizada",
    "peso": 2.8,
    "color": "plateado",
    "tamano": "mediano"
  }'
```
**Respuesta esperada (200):**
```json
{
  "ok": true
}
```

**Técnico1 intenta actualizar indicio de otro técnico (error 403):**
```bash
curl -X PUT http://localhost:3000/api/indicios/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "descripcion": "Intento de modificar indicio ajeno",
    "peso": 1.0
  }'
```
**Respuesta esperada (403):**
```json
{
  "error": "No es dueño del expediente"
}
```

### Desactivar Indicio (solo técnico dueño)
```bash
# Técnico1 desactiva su indicio (éxito)
curl -X PATCH http://localhost:3000/api/indicios/1/activo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "activo": false
  }'
```
**Respuesta esperada (200):**
```json
{
  "ok": true
}
```

**Técnico1 intenta desactivar indicio de otro (error 403):**
```bash
curl -X PATCH http://localhost:3000/api/indicios/5/activo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_TECNICO" \
  -d '{
    "activo": false
  }'
```
**Respuesta esperada (403):**
```json
{
  "error": "No es dueño del expediente"
}
```

---

## 🏥 Health Checks

### Health
```bash
curl -X GET http://localhost:3000/api/health
```
**Respuesta (200):**
```json
{
  "ok": true
}
```

### DB Ping
```bash
curl -X GET http://localhost:3000/api/db/ping
```
**Respuesta (200):**
```json
{
  "db": "ok",
  "result": {
    "ok": 1
  }
}
```

---

## 📝 Notas

### Tokens
- Los tokens JWT expiran según `JWT_EXPIRES` (por defecto 1h)
- Guarda los tokens en variables de entorno para reutilizarlos
- Cada vez que hagas login obtendrás un nuevo token

### Permisos
- **Técnicos:** Solo pueden ver/editar sus propios expedientes e indicios
- **Coordinadores:** Pueden ver todo, cambiar estados, gestionar usuarios

### Validaciones
- Todos los endpoints validan los datos de entrada con `express-validator`
- Los errores 400 incluyen detalles específicos del campo inválido
- Los errores 403 indican falta de permisos
- Los errores 401 indican token inválido o ausente

### Fechas
- Formato de fechas en filtros: `YYYY-MM-DD`
- Las fechas en respuestas están en formato ISO 8601

### Paginación
- Parámetros: `page`/`pagina` y `pageSize`
- Por defecto: `page=1`, `pageSize=10`
- La respuesta incluye `total` para calcular páginas
