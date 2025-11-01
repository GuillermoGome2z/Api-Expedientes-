#!/bin/bash
# Script para inicializar la base de datos en el contenedor Docker

echo "🗄️  Inicializando Base de Datos en Docker..."

# Esperar a que SQL Server esté listo
echo "⏳ Esperando a que SQL Server esté disponible..."
sleep 10

# Ejecutar schema.sql
echo "📋 Creando esquema de base de datos..."
docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P "YourStrong!Passw0rd" \
  -C \
  -d master \
  -i /scripts/schema.sql

if [ $? -eq 0 ]; then
  echo "✅ Esquema creado exitosamente"
else
  echo "❌ Error al crear esquema"
  exit 1
fi

# Ejecutar seed.sql
echo "🌱 Insertando datos de prueba..."
docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost \
  -U sa \
  -P "YourStrong!Passw0rd" \
  -C \
  -d expedientes_db \
  -i /scripts/seed.sql

if [ $? -eq 0 ]; then
  echo "✅ Datos de prueba insertados exitosamente"
else
  echo "❌ Error al insertar datos de prueba"
  exit 1
fi

# Ejecutar stored procedures
echo "⚙️  Creando stored procedures..."

# Expedientes
for sp in /scripts/sp/expedientes/*.sql; do
  echo "  📝 $(basename $sp)"
  docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U sa \
    -P "YourStrong!Passw0rd" \
    -C \
    -d expedientes_db \
    -i "$sp"
done

# Indicios
for sp in /scripts/sp/indicios/*.sql; do
  echo "  📝 $(basename $sp)"
  docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U sa \
    -P "YourStrong!Passw0rd" \
    -C \
    -d expedientes_db \
    -i "$sp"
done

# Usuarios
for sp in /scripts/sp/usuarios/*.sql; do
  echo "  📝 $(basename $sp)"
  docker exec expedientes-sqlserver /opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U sa \
    -P "YourStrong!Passw0rd" \
    -C \
    -d expedientes_db \
    -i "$sp"
done

echo ""
echo "✅ Base de datos inicializada completamente"
echo "🚀 Puedes acceder al API en http://localhost:3000"
echo "📝 Documentación Swagger: http://localhost:3000/docs"
