# Script para inicializar la base de datos en Docker
Write-Host "🗄️  Inicializando Base de Datos en Docker..." -ForegroundColor Cyan

# Esperar a que SQL Server esté listo
Write-Host "⏳ Esperando a que SQL Server esté disponible..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Ejecutar schema.sql
Write-Host "📋 Creando esquema de base de datos..." -ForegroundColor Cyan
$schemaResult = docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd `
  -S localhost `
  -U sa `
  -P "YourStrong!Passw0rd" `
  -C `
  -d master `
  -i /scripts/schema.sql

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Esquema creado exitosamente" -ForegroundColor Green
} else {
  Write-Host "❌ Error al crear esquema" -ForegroundColor Red
  exit 1
}

# Ejecutar seed.sql
Write-Host "🌱 Insertando datos de prueba..." -ForegroundColor Cyan
$seedResult = docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd `
  -S localhost `
  -U sa `
  -P "YourStrong!Passw0rd" `
  -C `
  -d expedientes_db `
  -i /scripts/seed.sql

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Datos de prueba insertados exitosamente" -ForegroundColor Green
} else {
  Write-Host "❌ Error al insertar datos de prueba" -ForegroundColor Red
  exit 1
}

# Ejecutar stored procedures
Write-Host "⚙️  Creando stored procedures..." -ForegroundColor Cyan

# Expedientes
Write-Host "  📁 Stored Procedures de Expedientes..." -ForegroundColor Yellow
$expedientesSPs = @(
  "activar_desactivar.sql",
  "actualizar.sql",
  "cambiar_estado.sql",
  "crear.sql",
  "listar.sql",
  "obtener.sql"
)

foreach ($sp in $expedientesSPs) {
  Write-Host "    📝 $sp" -ForegroundColor Gray
  docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd `
    -S localhost `
    -U sa `
    -P "YourStrong!Passw0rd" `
    -C `
    -d expedientes_db `
    -i "/scripts/sp/expedientes/$sp" | Out-Null
}

# Indicios
Write-Host "  📁 Stored Procedures de Indicios..." -ForegroundColor Yellow
$indiciosSPs = @(
  "activar_desactivar.sql",
  "actualizar.sql",
  "crear.sql",
  "listar_por_expediente.sql"
)

foreach ($sp in $indiciosSPs) {
  Write-Host "    📝 $sp" -ForegroundColor Gray
  docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd `
    -S localhost `
    -U sa `
    -P "YourStrong!Passw0rd" `
    -C `
    -d expedientes_db `
    -i "/scripts/sp/indicios/$sp" | Out-Null
}

# Usuarios
Write-Host "  📁 Stored Procedures de Usuarios..." -ForegroundColor Yellow
$usuariosSPs = @(
  "activar_desactivar.sql",
  "actualizar_password.sql",
  "crear.sql",
  "listar.sql",
  "login.sql",
  "obtener.sql"
)

foreach ($sp in $usuariosSPs) {
  Write-Host "    📝 $sp" -ForegroundColor Gray
  docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd `
    -S localhost `
    -U sa `
    -P "YourStrong!Passw0rd" `
    -C `
    -d expedientes_db `
    -i "/scripts/sp/usuarios/$sp" | Out-Null
}

Write-Host ""
Write-Host "✅ Base de datos inicializada completamente" -ForegroundColor Green
Write-Host "🚀 API disponible en: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📝 Swagger UI en: http://localhost:3000/docs" -ForegroundColor Cyan
Write-Host "🔍 Health Check: http://localhost:3000/health" -ForegroundColor Cyan
