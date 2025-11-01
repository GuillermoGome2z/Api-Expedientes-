# Endpoints de Exportación de Expedientes

## Resumen

Se han implementado dos endpoints para exportar expedientes a formato Excel:

1. **Exportación Masiva** - `GET /api/expedientes/export` (ya existía, verificado)
2. **Exportación Individual** - `GET /api/expedientes/:id/export` (nuevo)

---

## 1. Exportación Masiva de Expedientes

### Endpoint
```
GET /api/expedientes/export
```

### Descripción
Exporta todos los expedientes con filtros opcionales a un archivo Excel.

### Headers Requeridos
```
Authorization: Bearer <token>
```

### Query Parameters (todos opcionales)
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `estado` | string | Filtrar por estado | `aprobado`, `abierto`, `rechazado` |
| `tecnicoId` | number | Filtrar por ID de técnico | `1` |
| `fechaInicio` | date | Fecha inicio del rango | `2025-01-01` |
| `fechaFin` | date | Fecha fin del rango | `2025-12-31` |

### Ejemplo con PowerShell
```powershell
# 1. Obtener token
$response = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -ContentType "application/json" -Body '{"username":"tecnico1","password":"tecnico123"}'
$token = $response.token

# 2. Exportar todos los expedientes
Invoke-WebRequest -Uri "http://localhost:3000/api/expedientes/export" -Method GET -Headers @{"Authorization"="Bearer $token"} -OutFile "expedientes.xlsx"

# 3. Exportar con filtros
Invoke-WebRequest -Uri "http://localhost:3000/api/expedientes/export?estado=aprobado" -Method GET -Headers @{"Authorization"="Bearer $token"} -OutFile "expedientes_aprobados.xlsx"
```

### Ejemplo con cURL
```bash
# 1. Obtener token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tecnico1","password":"tecnico123"}'

# 2. Exportar (reemplaza <TOKEN> con el token obtenido)
curl -X GET "http://localhost:3000/api/expedientes/export" \
  -H "Authorization: Bearer <TOKEN>" \
  -o expedientes.xlsx

# 3. Exportar con filtros
curl -X GET "http://localhost:3000/api/expedientes/export?estado=aprobado&fechaInicio=2025-01-01" \
  -H "Authorization: Bearer <TOKEN>" \
  -o expedientes_filtrados.xlsx
```

### Estructura del Excel
Una sola hoja "Expedientes" con las siguientes columnas:

| ID | Código | Título | Estado | Técnico | Aprobador | FechaCreacion | FechaEstado |
|----|--------|--------|--------|---------|-----------|---------------|-------------|

### Respuestas
- **200 OK** - Archivo Excel descargado exitosamente
- **401 Unauthorized** - Token inválido o no proporcionado
- **500 Internal Server Error** - Error en el servidor

---

## 2. Exportación Individual de Expediente (NUEVO)

### Endpoint
```
GET /api/expedientes/:id/export
```

### Descripción
Exporta un expediente específico con sus indicios relacionados en un archivo Excel de dos hojas.

### Headers Requeridos
```
Authorization: Bearer <token>
```

### Path Parameters
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id` | number | ID del expediente a exportar | `1` |

### Ejemplo con PowerShell
```powershell
# 1. Obtener token
$response = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -ContentType "application/json" -Body '{"username":"tecnico1","password":"tecnico123"}'
$token = $response.token

# 2. Exportar expediente específico (ID = 1)
Invoke-WebRequest -Uri "http://localhost:3000/api/expedientes/1/export" -Method GET -Headers @{"Authorization"="Bearer $token"} -OutFile "expediente_1.xlsx"

# 3. Exportar otro expediente (ID = 2)
Invoke-WebRequest -Uri "http://localhost:3000/api/expedientes/2/export" -Method GET -Headers @{"Authorization"="Bearer $token"} -OutFile "expediente_2.xlsx"
```

### Ejemplo con cURL
```bash
# 1. Obtener token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tecnico1","password":"tecnico123"}' | jq -r '.token')

# 2. Exportar expediente con ID = 1
curl -X GET "http://localhost:3000/api/expedientes/1/export" \
  -H "Authorization: Bearer $TOKEN" \
  -o expediente_1_2025-11-01.xlsx

# 3. Exportar expediente con ID = 5
curl -X GET "http://localhost:3000/api/expedientes/5/export" \
  -H "Authorization: Bearer $TOKEN" \
  -o expediente_5_2025-11-01.xlsx
```

### Estructura del Excel

#### Hoja 1: "Información del Expediente"
Formato vertical (Campo - Valor):

| Campo | Valor |
|-------|-------|
| ID | 1 |
| Código | EXP-2025-001 |
| Título | Título del expediente |
| Estado | abierto |
| Técnico Responsable | tecnico1 |
| Aprobador | coord1 |
| Fecha de Creación | 01/11/2025 |
| Fecha de Estado | 01/11/2025 |
| Descripción | Descripción detallada... |
| Ubicación | Sala 205 |
| Justificación | N/A |
| Activo | Sí |

#### Hoja 2: "Indicios"
Formato tabla horizontal:

| ID | Descripción | Peso_kg | Color | Tamaño | Estado | Fecha_Creación |
|----|-------------|---------|-------|--------|--------|----------------|
| 1 | Indicio A | 2.5 | Rojo | Grande | Activo | 01/11/2025 |
| 2 | Indicio B | 1.2 | Azul | Pequeño | Activo | 01/11/2025 |

### Nombre del Archivo
El archivo se descarga con el formato: `expediente_{id}_{fecha}.xlsx`

Ejemplo: `expediente_1_2025-11-01.xlsx`

### Respuestas
- **200 OK** - Archivo Excel descargado exitosamente
- **400 Bad Request** - ID inválido (no es un número)
- **401 Unauthorized** - Token inválido o no proporcionado
- **404 Not Found** - Expediente no existe
- **500 Internal Server Error** - Error en el servidor

---

## Validaciones y Seguridad

### Autenticación
✅ Ambos endpoints requieren JWT token válido en el header `Authorization`

### Autorización
- **Técnicos**: Solo pueden exportar sus propios expedientes
- **Coordinadores**: Pueden exportar cualquier expediente

### Validaciones
- ID debe ser un número válido
- El expediente debe existir en la base de datos
- El usuario debe tener permisos para ver el expediente

---

## Pruebas Completas

### Script de Prueba PowerShell
```powershell
# Guardar este script como test-exportacion.ps1

# 1. Login
Write-Host "🔐 Iniciando sesión..."
$response = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -ContentType "application/json" -Body '{"username":"tecnico1","password":"tecnico123"}'
$token = $response.token
Write-Host "✅ Token obtenido"

# 2. Crear carpeta de exportaciones
$exportDir = ".\exportaciones"
if (!(Test-Path $exportDir)) {
    New-Item -ItemType Directory -Path $exportDir
}

# 3. Exportar todos los expedientes
Write-Host "`n📦 Exportando todos los expedientes..."
Invoke-WebRequest -Uri "http://localhost:3000/api/expedientes/export" `
    -Method GET `
    -Headers @{"Authorization"="Bearer $token"} `
    -OutFile "$exportDir\expedientes_todos.xlsx"
Write-Host "✅ Guardado en: $exportDir\expedientes_todos.xlsx"

# 4. Exportar expedientes aprobados
Write-Host "`n✅ Exportando expedientes aprobados..."
Invoke-WebRequest -Uri "http://localhost:3000/api/expedientes/export?estado=aprobado" `
    -Method GET `
    -Headers @{"Authorization"="Bearer $token"} `
    -OutFile "$exportDir\expedientes_aprobados.xlsx"
Write-Host "✅ Guardado en: $exportDir\expedientes_aprobados.xlsx"

# 5. Exportar expediente individual (ID=1)
Write-Host "`n📄 Exportando expediente individual (ID=1)..."
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/expedientes/1/export" `
        -Method GET `
        -Headers @{"Authorization"="Bearer $token"} `
        -OutFile "$exportDir\expediente_1.xlsx"
    Write-Host "✅ Guardado en: $exportDir\expediente_1.xlsx"
} catch {
    Write-Host "❌ Error: $_"
}

# 6. Exportar expediente que no existe (debe fallar)
Write-Host "`n❌ Probando expediente inexistente (ID=9999)..."
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/expedientes/9999/export" `
        -Method GET `
        -Headers @{"Authorization"="Bearer $token"} `
        -OutFile "$exportDir\expediente_9999.xlsx"
    Write-Host "✅ Guardado (no esperado)"
} catch {
    Write-Host "✅ Error esperado: Expediente no encontrado"
}

Write-Host "`n✅ Pruebas completadas. Verifica los archivos en: $exportDir"
```

### Ejecutar las Pruebas
```powershell
# Ejecutar el script de pruebas
.\test-exportacion.ps1
```

---

## Swagger UI

Puedes probar ambos endpoints desde la interfaz Swagger:

1. Abrir: http://localhost:3000/docs
2. Hacer click en "Authorize" y pegar el token JWT
3. Probar los endpoints:
   - `GET /api/expedientes/export`
   - `GET /api/expedientes/{id}/export`

---

## Notas Técnicas

### Librería Utilizada
- **xlsx** (ya instalada en el proyecto)
- No se requiere instalar dependencias adicionales

### Formatos de Fecha
- Las fechas se formatean con `toLocaleDateString()`
- Formato: DD/MM/YYYY (según la configuración regional)

### Anchos de Columna
Los anchos están optimizados para legibilidad:
- Campos de texto corto: 10-15 caracteres
- Descripciones: 40-50 caracteres
- Valores: 50 caracteres

### Límites
- Exportación masiva: Sin límite (usa pageSize=99999)
- Exportación individual: No aplica

---

## Solución de Problemas

### Error 401 Unauthorized
**Causa**: Token inválido o expirado
**Solución**: Volver a hacer login para obtener un nuevo token

### Error 404 Not Found
**Causa**: El expediente con ese ID no existe
**Solución**: Verificar que el ID sea correcto usando `GET /api/expedientes`

### Error 500 Internal Server Error
**Causa**: Error en el servidor o base de datos
**Solución**: Verificar que:
- SQL Server esté corriendo
- Los stored procedures existan
- Los logs del servidor para más detalles

### El archivo Excel está vacío
**Causa**: No hay expedientes que cumplan los filtros
**Solución**: Verificar los filtros o exportar sin filtros

---

## Conclusión

✅ **Endpoint 1**: `GET /api/expedientes/export` - Exportación masiva (ya existía, verificado)
✅ **Endpoint 2**: `GET /api/expedientes/:id/export` - Exportación individual (nuevo, implementado)

Ambos endpoints están completamente funcionales y documentados en Swagger.
