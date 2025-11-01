# Script para configurar SQL Server con Docker
# Ejecutar este script antes de iniciar el backend

Write-Host "Configurando SQL Server para Api-Expedientes..." -ForegroundColor Cyan

# Verificar si Docker está corriendo
Write-Host "`n1️⃣ Verificando Docker..." -ForegroundColor Yellow
try {
    docker info > $null 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker no está corriendo. Iniciando Docker Desktop..." -ForegroundColor Red
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        Write-Host "⏳ Esperando 30 segundos a que Docker inicie..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
    } else {
        Write-Host "✅ Docker está corriendo" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error al verificar Docker: $_" -ForegroundColor Red
    exit 1
}

# Verificar si el contenedor ya existe
Write-Host "`n2️⃣ Verificando contenedor SQL Server..." -ForegroundColor Yellow
$container = docker ps -a --filter "name=sqlserver" --format "{{.Names}}"

if ($container -eq "sqlserver") {
    Write-Host "📦 Contenedor 'sqlserver' encontrado" -ForegroundColor Cyan
    
    # Verificar si está corriendo
    $status = docker ps --filter "name=sqlserver" --format "{{.Status}}"
    if ($status) {
        Write-Host "✅ SQL Server ya está corriendo" -ForegroundColor Green
        Write-Host "`n🔗 Conexión: localhost:1433" -ForegroundColor Cyan
        Write-Host "👤 Usuario: sa" -ForegroundColor Cyan
        Write-Host "🔑 Password: YourStrong!Passw0rd" -ForegroundColor Cyan
    } else {
        Write-Host "▶️ Iniciando contenedor existente..." -ForegroundColor Yellow
        docker start sqlserver
        Write-Host "⏳ Esperando 10 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        Write-Host "✅ SQL Server iniciado" -ForegroundColor Green
    }
} else {
    Write-Host "📦 Creando nuevo contenedor SQL Server..." -ForegroundColor Yellow
    docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" `
        -p 1433:1433 --name sqlserver `
        -d mcr.microsoft.com/mssql/server:2022-latest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Contenedor creado exitosamente" -ForegroundColor Green
        Write-Host "⏳ Esperando 15 segundos a que SQL Server inicie..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
    } else {
        Write-Host "❌ Error al crear el contenedor" -ForegroundColor Red
        exit 1
    }
}

# Verificar conexión
Write-Host "`n3️⃣ Verificando conexión..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n✅ SQL Server listo!" -ForegroundColor Green
Write-Host "`n📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Ejecutar scripts de base de datos:" -ForegroundColor White
Write-Host "      - src/scripts/schema.sql" -ForegroundColor Gray
Write-Host "      - src/scripts/seed.sql" -ForegroundColor Gray
Write-Host "      - src/db/sp/**/*.sql (todos los stored procedures)" -ForegroundColor Gray
Write-Host "`n   2. Iniciar el backend:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host "`n🔗 Conexión SQL Server:" -ForegroundColor Cyan
Write-Host "   Host: localhost:1433" -ForegroundColor White
Write-Host "   Usuario: sa" -ForegroundColor White
Write-Host "   Password: YourStrong!Passw0rd" -ForegroundColor White
Write-Host "   Base de datos: expedientes_db" -ForegroundColor White
Write-Host ""
