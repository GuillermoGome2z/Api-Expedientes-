# Script de prueba para verificar los fixes de usuarios
$baseUrl = "http://localhost:3000/api"

Write-Host "`n=== Test 1: Login como coordinador ===" -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body (@{
    username = "coord1"
    password = "Coord123!"
} | ConvertTo-Json)

$token = $loginResponse.data.token
Write-Host "✅ Token obtenido" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n=== Test 2: Listar usuarios (deben aparecer activos e inactivos) ===" -ForegroundColor Cyan
$usuarios = Invoke-RestMethod -Uri "$baseUrl/usuarios?page=1&pageSize=10" -Method GET -Headers $headers
Write-Host "Total usuarios: $($usuarios.data.total)" -ForegroundColor Yellow
$usuarios.data.data | ForEach-Object {
    $estado = if ($_.activo) { "✅ ACTIVO" } else { "❌ INACTIVO" }
    Write-Host "  - Usuario #$($_.id): $($_.username) [$($_.rol)] $estado"
}

Write-Host "`n=== Test 3: Desactivar usuario #1 ===" -ForegroundColor Cyan
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/usuarios/1/activo" -Method PATCH -Headers $headers -Body (@{
        activo = $false
    } | ConvertTo-Json)
    Write-Host "✅ Usuario desactivado:" -ForegroundColor Green
    Write-Host "   ID: $($result.data.id), Username: $($result.data.username), Activo: $($result.data.activo)"
} catch {
    Write-Host "❌ Error al desactivar: $_" -ForegroundColor Red
}

Write-Host "`n=== Test 4: Cambiar contraseña (formato newPassword) ===" -ForegroundColor Cyan
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/usuarios/2/password" -Method PATCH -Headers $headers -Body (@{
        newPassword = "nuevaPass123"
    } | ConvertTo-Json)
    Write-Host "✅ Contraseña cambiada exitosamente" -ForegroundColor Green
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "❌ Error: $($errorDetails.error)" -ForegroundColor Red
}

Write-Host "`n=== Test 5: Activar usuario #1 de nuevo ===" -ForegroundColor Cyan
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/usuarios/1/activo" -Method PATCH -Headers $headers -Body (@{
        activo = $true
    } | ConvertTo-Json)
    Write-Host "✅ Usuario activado:" -ForegroundColor Green
    Write-Host "   ID: $($result.data.id), Username: $($result.data.username), Activo: $($result.data.activo)"
} catch {
    Write-Host "❌ Error al activar: $_" -ForegroundColor Red
}

Write-Host "`n=== Tests completados ===" -ForegroundColor Cyan
