# API de Gestión de Expedientes e Indicios# API de Gestion de Expedientes e Indicios# API de Gestion de Expedientes e Indicios



API REST desarrollada en **TypeScript + Express** con persistencia en **SQL Server** mediante procedimientos almacenados, autenticación con **JWT** y control de roles (técnico y coordinador).



**Proyecto:** Desarrollo Web - Universidad Mariano Gálvez (2025)API REST desarrollada en TypeScript + Express con persistencia en SQL Server mediante procedimientos almacenados, autenticacion con JWT y control de roles.API REST desarrollada en **TypeScript + Express** con persistencia en **SQL Server** mediante procedimientos almacenados, autenticacion con **JWT** y control de roles (tecnico y coordinador).



---



## ✨ Características**Proyecto:** Desarrollo Web - Universidad Mariano Galvez (2025)Proyecto entregado para la clase de **Desarrollo Web - Universidad Mariano Galvez (2025)**.



- ✅ Autenticación con JWT (bcrypt para hash de contraseñas)

- ✅ Roles: Técnico y Coordinador

- ✅ CRUD completo de Expedientes e Indicios------

- ✅ Flujo de aprobación de expedientes (aprobado/rechazado con justificación obligatoria)

- ✅ Eliminación lógica mediante campo `activo`

- ✅ Validaciones robustas con express-validator + Zod

- ✅ Filtros avanzados: estado, técnicoId, rango de fechas, búsqueda por texto## Caracteristicas## Caracteristicas

- ✅ **Paginación flexible:** Soporta `page`/`pagina` y `pageSize`/`tamanoPagina` (español/inglés)

- ✅ Exportación a Excel con filtros aplicados

- ✅ Campos de auditoría: `fecha_creacion`, `fecha_actualizacion`, `modificado_por`

- ✅ Validación de ownership (técnicos solo pueden modificar sus expedientes/indicios)- Autenticacion JWT con bcrypt- Autenticacion con JWT (bcrypt para hash de contrasenas)

- ✅ **Middleware de errores global** con manejo de UnauthorizedError

- ✅ **Validación de variables de entorno con Zod** (fail-fast al iniciar)- Roles: Tecnico y Coordinador- Roles: Tecnico y Coordinador

- ✅ **BASE_PATH configurable** (por defecto `/api`)

- ✅ **Tipado TypeScript completo** con extensiones globales para Express- CRUD completo de Expedientes e Indicios- CRUD completo de Expedientes e Indicios

- ✅ Documentación completa con Swagger UI en `/docs`

- ✅ Scripts SQL completos (schema + seed + stored procedures)- Flujo de aprobacion de expedientes- Flujo de aprobacion de expedientes (aprobado/rechazado con justificacion)



---- Validaciones con express-validator- Eliminacion logica mediante campo `activo`



## 🛠 Tecnologías- Filtros avanzados: estado, tecnico, rango de fechas, busqueda- Validaciones con express-validator:



- **Backend:** TypeScript 5.9, Express 5.1, Node.js- Paginacion en listados  - Codigo de expediente unico

- **Base de datos:** SQL Server 2022 (Docker)

- **Autenticación:** JWT + bcrypt- Exportacion a Excel  - Peso mayor o igual a 0

- **Validación:** express-validator + Zod

- **Documentación:** Swagger UI (swagger-jsdoc)- Campos de auditoria automaticos  - Control de permisos por rol

- **Exportación:** xlsx

- Validacion de ownership (tecnicos solo modifican sus expedientes)  - Validacion de ownership (tecnicos solo pueden modificar sus expedientes)

---

- Eliminacion logica con campo `activo`- Filtros avanzados: estado, tecnicoId, rango de fechas, busqueda por texto

## 📁 Estructura del proyecto

- Documentacion Swagger UI completa- Paginacion en listados

```

src/- Exportacion a Excel con filtros aplicados

├── controllers/        # Lógica de negocio

├── routes/             # Definición de endpoints---- Campos de auditoria: fecha_creacion, fecha_actualizacion, modificado_por

├── middlewares/        # Autenticación, validación, roles, errores

├── config/             # Validación de variables de entorno (Zod)- Documentacion con Swagger UI en `/docs`

├── types/              # Extensiones de tipos TypeScript

├── db/## Tecnologias- Scripts SQL completos (schema + seed + stored procedures)

│   ├── db.ts           # Conexión a SQL Server

│   └── sp/             # Stored procedures

├── auth/               # Utilidades JWT

├── scripts/            # Schema y seed SQL- **Backend:** TypeScript 5.9, Express 5.1, Node.js---

└── swagger.ts          # Documentación OpenAPI

```- **Base de datos:** SQL Server 2022 (Docker)



---- **Autenticacion:** JWT + bcrypt## Estructura del proyecto



## ⚙️ Instalación y ejecución- **Validacion:** express-validator



### 1️⃣ Clonar el repositorio- **Documentacion:** Swagger UI```

```bash

git clone https://github.com/GuillermoGome2z/Api-Expedientes-.git- **Exportacion:** xlsxsrc/

cd Api-Expedientes-

```├─ controllers/     # Logica de negocio



### 2️⃣ Instalar dependencias---├─ routes/          # Definicion de endpoints

```bash

npm install├─ middlewares/     # Autenticacion, validacion, roles

```

## Instalacion rapida├─ db/

### 3️⃣ Configurar variables de entorno

│  ├─ db.ts        # Conexion a SQL Server

Crear archivo `.env` en la raíz del proyecto:

### 1. Clonar repositorio│  └─ sp/          # Stored procedures

```env

# Servidor```bash├─ auth/           # Utilidades JWT

NODE_ENV=development       # development | production

PORT=3000                  # Puerto del servidor (convertido a number)git clone https://github.com/GuillermoGome2z/Api-Expedientes-.git├─ scripts/        # Schema y seed SQL



# Seguridad JWTcd Api-Expedientes-└─ swagger.ts      # Documentacion OpenAPI

JWT_SECRET=tu_secreto_super_seguro_minimo_32_caracteres  # ⚠️ Mínimo 32 caracteres

JWT_EXPIRES=1h``````



# Base de datos SQL Server

DB_SERVER=localhost

DB_USER=sa### 2. Instalar dependencias---

DB_PASS=YourStrong!Passw0rd

DB_NAME=expedientes_db```bash



# Autenticaciónnpm install---

BCRYPT_SALT_ROUNDS=10

```

# API Configuration

BASE_PATH=/api             # Prefijo de rutas (default: /api)## ⚙️ Instalación y ejecución

CORS_ORIGIN=http://localhost:5173,http://localhost:3001  # Orígenes CORS separados por coma

```### 3. Configurar variables de entorno



> **⚠️ Nota importante:** Todas las variables de entorno son **validadas con Zod** al iniciar el servidor. Si falta alguna o tiene formato inválido, el servidor no arrancará y mostrará un error descriptivo.Crear archivo `.env`:### 1️⃣ Clonar el repositorio



#### Variables requeridas:```env```bash

- `JWT_SECRET` debe tener **mínimo 32 caracteres**

- `PORT` será convertido automáticamente a númeroPORT=3000git clone https://github.com/GuillermoGome2z/Api-Expedientes-.git

- `NODE_ENV` debe ser `development` o `production`

- `BASE_PATH` es el prefijo de todas las rutas (default: `/api`)JWT_SECRET=tu_secreto_super_segurocd Api-Expedientes-



### 4️⃣ Levantar SQL Server con DockerJWT_EXPIRES=1h```

```bash

docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \DB_SERVER=localhost

  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest

```DB_USER=sa### 2️⃣ Instalar dependencias



### 5️⃣ Inicializar base de datosDB_PASS=YourStrong!Passw0rd```bash



**PowerShell:**DB_NAME=expedientes_dbnpm install

```powershell

# Crear base de datos y tablasBCRYPT_SALT_ROUNDS=10```

Get-Content .\src\scripts\schema.sql | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C

```

# Insertar datos de prueba

Get-Content .\src\scripts\seed.sql | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C### 3 - Configurar variables de entorno



# Crear stored procedures### 4. Levantar SQL Server con Docker

Get-ChildItem -Path .\src\db\sp\usuarios\*.sql | ForEach-Object { 

  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db ```bashCrear archivo `.env` en la raiz del proyecto:

}

docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \

Get-ChildItem -Path .\src\db\sp\expedientes\*.sql | ForEach-Object { 

  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db   -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest```env

}

```PORT=3000

Get-ChildItem -Path .\src\db\sp\indicios\*.sql | ForEach-Object { 

  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db JWT_SECRET=tu_secreto_super_seguro

}

```### 5. Inicializar base de datos (PowerShell)JWT_EXPIRES=1h



**Opción 2 - SSMS o DBeaver (Manual):**```powershellDB_SERVER=localhost

1. Conectarse a SQL Server (localhost:1433, usuario: sa)

2. Ejecutar `src/scripts/schema.sql` (crea base de datos y tablas con campos de auditoría)# Crear estructuraDB_USER=sa

3. Ejecutar `src/scripts/seed.sql` (inserta 3 usuarios, 5 expedientes, 8 indicios)

4. Ejecutar todos los stored procedures en orden:Get-Content .\src\scripts\schema.sql | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -CDB_PASS=YourStrong!Passw0rd

   - `src/db/sp/usuarios/*.sql`

   - `src/db/sp/expedientes/*.sql`DB_NAME=expedientes_db

   - `src/db/sp/indicios/*.sql`

# Insertar datosBCRYPT_SALT_ROUNDS=10

### 6️⃣ Ejecutar la API

Get-Content .\src\scripts\seed.sql | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C```

**Desarrollo:**

```bash

npm run dev

```# Crear stored procedures### 4 - Levantar SQL Server con Docker



**Producción:**Get-ChildItem -Path .\src\db\sp\**\*.sql | ForEach-Object { 

```bash

npm run build  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db ```bash

npm start

```}docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \



El servidor estará disponible en: **http://localhost:3000**```  -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest



**Verificar que todo funciona:**```

1. Abre http://localhost:3000/docs (debería mostrar Swagger UI)

2. Prueba el endpoint de salud: http://localhost:3000/api/health### 6. Ejecutar servidor

3. Haz login con las credenciales de prueba (ver sección de Pruebas)

```bash### 5 - Inicializar base de datos

---

npm run dev

## 📖 Endpoints principales

```**PowerShell:**

### 🔐 Auth

- `POST {BASE_PATH}/auth/login` → Iniciar sesión y obtener JWT```powershell



### 👥 UsuariosServidor disponible en: http://localhost:3000# Crear base de datos y tablas

- `POST {BASE_PATH}/usuarios` → Crear usuario (solo coordinador)

- `PATCH {BASE_PATH}/usuarios/:id/password` → Cambiar contraseñaGet-Content .\src\scripts\schema.sql | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C

- `GET {BASE_PATH}/usuarios?page=1&pageSize=10` → Listar usuarios (solo coordinador)

---

### 📂 Expedientes

- `GET {BASE_PATH}/expedientes?page=1&pageSize=10&estado=abierto&fechaInicio=2025-01-01&fechaFin=2025-12-31&tecnicoId=1` → Listar con filtros avanzados# Insertar datos de prueba

- `GET {BASE_PATH}/expedientes/:id` → Obtener detalle

- `POST {BASE_PATH}/expedientes` → Crear (solo técnico)## Endpoints principalesGet-Content .\src\scripts\seed.sql | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C

- `PUT {BASE_PATH}/expedientes/:id` → Actualizar (solo técnico dueño)

- `PATCH {BASE_PATH}/expedientes/:id/estado` → Aprobar/rechazar (solo coordinador, **justificación obligatoria para rechazado**)

- `PATCH {BASE_PATH}/expedientes/:id/activo` → Soft delete

- `GET {BASE_PATH}/expedientes/export?estado=aprobado` → Exportar a Excel con filtros### Autenticacion# Crear stored procedures



### 🔎 Indicios- `POST /api/auth/login` - Login con username/passwordGet-ChildItem -Path .\src\db\sp\usuarios\*.sql | ForEach-Object { 

- `GET {BASE_PATH}/expedientes/:id/indicios?page=1&pageSize=10` → Listar con paginación

- `POST {BASE_PATH}/expedientes/:id/indicios` → Crear (solo técnico dueño del expediente)  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db 

- `PUT {BASE_PATH}/indicios/:id` → Actualizar (solo técnico dueño)

- `PATCH {BASE_PATH}/indicios/:id/activo` → Soft delete (solo técnico dueño)### Usuarios (coordinador)}



### 🆕 Nuevas características- `POST /api/usuarios` - Crear usuario



#### Paginación flexible (español/inglés):- `GET /api/usuarios` - Listar usuariosGet-ChildItem -Path .\src\db\sp\expedientes\*.sql | ForEach-Object { 

Los endpoints de listado aceptan **ambos formatos** de parámetros:

- `page` o `pagina` → Número de página (default: 1)- `PATCH /api/usuarios/:id/password` - Cambiar contrasena  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db 

- `pageSize` o `tamanoPagina` → Tamaño de página (default: 10)

}

**Ejemplos:**

```bash### Expedientes

# Formato inglés

GET /api/expedientes?page=2&pageSize=20- `GET /api/expedientes` - Listar con filtros (estado, tecnicoId, fechas, q)Get-ChildItem -Path .\src\db\sp\indicios\*.sql | ForEach-Object { 



# Formato español (para frontend)- `POST /api/expedientes` - Crear (tecnico)  Get-Content $_.FullName | docker exec -i sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -d expedientes_db 

GET /api/expedientes?pagina=2&tamanoPagina=20

- `PUT /api/expedientes/:id` - Actualizar (tecnico dueno)}

# Se pueden mezclar (se usa el primero encontrado)

GET /api/expedientes?page=2&tamanoPagina=20- `PATCH /api/expedientes/:id/estado` - Aprobar/rechazar (coordinador)```

```

- `GET /api/expedientes/export` - Exportar a Excel

**Respuesta consistente:**

```json**Opción 2 - SSMS o DBeaver (Manual):**

{

  "page": 2,### Indicios1. Conectarse a SQL Server (localhost:1433, usuario: sa)

  "pageSize": 20,

  "total": 45,- `GET /api/expedientes/:id/indicios` - Listar con paginacion2. Ejecutar `src/scripts/schema.sql` (crea base de datos y tablas con campos de auditoría)

  "data": [...]

}- `POST /api/expedientes/:id/indicios` - Crear (tecnico dueno)3. Ejecutar `src/scripts/seed.sql` (inserta 3 usuarios, 5 expedientes, 8 indicios)

```

- `PUT /api/indicios/:id` - Actualizar (tecnico dueno)4. Ejecutar todos los stored procedures en orden:

#### BASE_PATH configurable:

El prefijo de todas las rutas se configura con la variable `BASE_PATH` en `.env` (default: `/api`).   - `src/db/sp/usuarios/*.sql`



**Ejemplo de integración con frontend (Vite/React):**---   - `src/db/sp/expedientes/*.sql`

```env

# Frontend .env   - `src/db/sp/indicios/*.sql`

VITE_API_BASE_URL=http://localhost:3000/api

```## Pruebas



#### Validación de entorno con Zod:### 6️⃣ Ejecutar la API

Al iniciar el servidor, se validan **11 variables de entorno** con Zod. Si alguna falta o es inválida, el servidor no arranca y muestra el error específico.

### Credenciales de prueba

#### Manejo global de errores:

- Los errores `UnauthorizedError` devuelven automáticamente 401- **Tecnico 1:** `tecnico1` / `tecnico123`**Desarrollo:**

- Respeta `err.statusCode` si existe

- En producción, oculta detalles técnicos del error- **Tecnico 2:** `tecnico2` / `tecnico123````bash

- En desarrollo, muestra stack trace completo

- **Coordinador:** `coord1` / `tecnico123`npm run dev

---

```

## 📑 Documentación

### Swagger UI (recomendado)

- **Swagger UI:** http://localhost:3000/docs

- **Health check:** http://localhost:3000/api/health1. Abrir http://localhost:3000/docs**Producción:**

- **Tests rápidos:** Ver `docs/tests-rapidos.md` para comandos curl completos

- La ruta raíz `/` redirige automáticamente a `/docs`2. Click en `POST /api/auth/login````bash



---3. Probar con credenciales de arribanpm run build



## 🧪 Credenciales de prueba4. Copiar el token de la respuestanpm start



Los datos de seed incluyen:5. Click en "Authorize" y pegar: `Bearer <token>````



**Usuarios:**6. Probar todos los endpoints

- Técnico 1: `tecnico1` / `tecnico123`

- Técnico 2: `tecnico2` / `tecnico123`El servidor estará disponible en: http://localhost:3000

- Coordinador: `coord1` / `tecnico123`

### PowerShell

**Expedientes de prueba:** 5 expedientes

- 3 abiertos (2 de tecnico1, 1 de tecnico2)```powershell**Verificar que todo funciona:**

- 1 aprobado (tecnico2)

- 1 rechazado con justificación (tecnico1)# Login1. Abre http://localhost:3000/docs (debería mostrar Swagger UI)



**Indicios de prueba:** 8 indicios distribuidos entre expedientes$response = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login `2. Prueba el endpoint de salud: http://localhost:3000/api/health



---  -Method POST -ContentType "application/json" `3. Haz login con las credenciales de prueba (ver sección de Pruebas)



## 🧪 Cómo hacer pruebas  -Body '{"username":"tecnico1","password":"tecnico123"}'



### Opción 1: Swagger UI (Recomendado)---

1. Abre http://localhost:3000/docs en tu navegador

2. Haz clic en **POST /api/auth/login**$token = $response.token## 📖 Endpoints principales

3. Click en "Try it out"

4. Pega las credenciales:

   ```json

   {# Listar expedientes### 🔐 Auth

     "username": "tecnico1",

     "password": "tecnico123"$headers = @{ Authorization = "Bearer $token" }- `POST /api/auth/login` → Iniciar sesión y obtener JWT

   }

   ```Invoke-RestMethod -Uri http://localhost:3000/api/expedientes -Headers $headers

5. Click en "Execute"

6. Copia el `token` de la respuesta```### � Usuarios

7. Haz clic en el botón "Authorize" (arriba a la derecha) 🔒

8. Pega el token en formato: `Bearer tu_token_aqui`- `POST /api/usuarios` → Crear usuario (solo coordinador)

9. Ahora puedes probar todos los endpoints autenticados ✅

### Curl- `PATCH /api/usuarios/:id/password` → Cambiar contraseña

### Opción 2: PowerShell con Invoke-WebRequest

```powershell```bash- `GET /api/usuarios` → Listar usuarios (solo coordinador)

# 1. Login y obtener token

$loginResponse = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login `# Login

  -Method POST `

  -ContentType "application/json" `TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \### �📂 Expedientes

  -Body '{"username":"tecnico1","password":"tecnico123"}'

  -H "Content-Type: application/json" \- `GET /api/expedientes?page=1&pageSize=10&estado=abierto&fechaInicio=2025-01-01&fechaFin=2025-12-31&tecnicoId=1` → Listar con filtros avanzados

$token = $loginResponse.token

Write-Host "Token obtenido: $token"  -d '{"username":"tecnico1","password":"tecnico123"}' | jq -r '.token')- `GET /api/expedientes/:id` → Obtener detalle



# 2. Listar expedientes con filtros (formato español)- `POST /api/expedientes` → Crear (solo técnico)

$headers = @{ Authorization = "Bearer $token" }

$expedientes = Invoke-RestMethod -Uri "http://localhost:3000/api/expedientes?pagina=1&tamanoPagina=10" `# Listar expedientes- `PUT /api/expedientes/:id` → Actualizar (solo técnico dueño)

  -Method GET -Headers $headers

$expedientes | ConvertTo-Jsoncurl -X GET http://localhost:3000/api/expedientes \- `PATCH /api/expedientes/:id/estado` → Aprobar/rechazar (solo coordinador)



# 3. Crear expediente  -H "Authorization: Bearer $TOKEN"- `PATCH /api/expedientes/:id/activo` → Soft delete

$body = @{

  codigo = "TEST-$(Get-Date -Format 'yyyyMMddHHmmss')"```- `GET /api/expedientes/export?estado=aprobado` → Exportar a Excel

  titulo = "Expediente de prueba"

  descripcion = "Creado desde PowerShell"

} | ConvertTo-Json

Mas ejemplos en `docs/tests-rapidos.md`### 🔎 Indicios

$nuevoExp = Invoke-RestMethod -Uri http://localhost:3000/api/expedientes `

  -Method POST -Headers $headers -ContentType "application/json" -Body $body- `GET /api/expedientes/:id/indicios?page=1&pageSize=10` → Listar con paginación

$nuevoExp | ConvertTo-Json

---- `POST /api/expedientes/:id/indicios` → Crear (solo técnico dueño del expediente)

# 4. Exportar a Excel (abre en navegador)

Start-Process "http://localhost:3000/api/expedientes/export?estado=abierto"- `PUT /api/indicios/:id` → Actualizar (solo técnico dueño)

```

## Documentacion- `PATCH /api/indicios/:id/activo` → Soft delete (solo técnico dueño)

### Opción 3: curl (Bash/Git Bash)

```bash

# 1. Login

TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \- **Swagger UI:** http://localhost:3000/docs### � Nuevas características

  -H "Content-Type: application/json" \

  -d '{"username":"tecnico1","password":"tecnico123"}' | jq -r '.token')- **Health check:** http://localhost:3000/api/health- **Filtros avanzados:** estado, fechaInicio, fechaFin, tecnicoId



echo "Token: $TOKEN"- **Tests completos:** docs/tests-rapidos.md- **Paginación:** Soporta `page`/`pagina` y `pageSize`



# 2. Listar expedientes con filtros (formato español)- **Repositorio:** https://github.com/GuillermoGome2z/Api-Expedientes-- **Validación de ownership:** Técnicos solo pueden modificar sus propios expedientes/indicios

curl -X GET "http://localhost:3000/api/expedientes?estado=abierto&pagina=1&tamanoPagina=10" \

  -H "Authorization: Bearer $TOKEN"- **Auditoría:** Campos `fecha_creacion`, `fecha_actualizacion`, `modificado_por`



# 3. Crear expediente---- **Exportación:** Excel con filtros aplicados

curl -X POST http://localhost:3000/api/expedientes \

  -H "Content-Type: application/json" \

  -H "Authorization: Bearer $TOKEN" \

  -d '{"codigo":"TEST-001","titulo":"Test","descripcion":"Expediente de prueba"}'## Datos de seed## �📑 Documentación



# 4. Aprobar expediente (requiere rol coordinador)- **Swagger UI:** http://localhost:3000/docs

TOKEN_COORD=$(curl -s -X POST http://localhost:3000/api/auth/login \

  -H "Content-Type: application/json" \- **3 usuarios:** 2 tecnicos + 1 coordinador- **Health check:** http://localhost:3000/api/health

  -d '{"username":"coord1","password":"tecnico123"}' | jq -r '.token')

- **5 expedientes:** 3 abiertos, 1 aprobado, 1 rechazado- **Tests rápidos:** Ver `docs/tests-rapidos.md` para comandos curl completos

curl -X PATCH http://localhost:3000/api/expedientes/1/estado \

  -H "Content-Type: application/json" \- **8 indicios:** distribuidos entre expedientes- La ruta raíz `/` redirige automáticamente a `/docs`

  -H "Authorization: Bearer $TOKEN_COORD" \

  -d '{"estado":"aprobado","justificacion":"Cumple con los requisitos"}'



# 5. Rechazar expediente (justificación OBLIGATORIA)---## 🧪 Credenciales de prueba

curl -X PATCH http://localhost:3000/api/expedientes/2/estado \

  -H "Content-Type: application/json" \

  -H "Authorization: Bearer $TOKEN_COORD" \

  -d '{"estado":"rechazado","justificacion":"Falta información del lugar del incidente"}'## AutorLos datos de seed incluyen:

```



### Opción 4: Postman / Insomnia

1. Importa la URL de Swagger: `http://localhost:3000/docs`**Guillermo Gomez****Usuarios:**

2. O crea las peticiones manualmente siguiendo la documentación

3. Configura el header `Authorization: Bearer <token>` después del login- GitHub: [@GuillermoGome2z](https://github.com/GuillermoGome2z)- Técnico 1: `tecnico1` / `tecnico123`



### Tests completos- Universidad Mariano Galvez - Desarrollo Web (2025)- Técnico 2: `tecnico2` / `tecnico123`

Ver `docs/tests-rapidos.md` para más de 30 ejemplos de pruebas con casos de éxito y error, validación de ownership, paginación, filtros y exportación.

- Coordinador: `coord1` / `tecnico123`

---

---

## 🎨 Frontend

**Expedientes de prueba:** 5 expedientes

El frontend se encuentra en un repositorio separado para mantener una arquitectura desacoplada:

## Licencia- 3 abiertos (2 de tecnico1, 1 de tecnico2)

**Repositorio Frontend:** _(Pendiente de publicar)_

- 1 aprobado (tecnico2)

**Conexión:** El frontend se conectará a esta API mediante las rutas `/api/*` documentadas en Swagger.

ISC- 1 rechazado con justificación (tecnico1)

**CORS configurado para:**

- `http://localhost:5173` (Vite/React dev)

- `http://localhost:3001` **Indicios de prueba:** 8 indicios distribuidos entre expedientes

- `http://localhost:3000`

---

**Configuración recomendada en el frontend:**

```env## 🧪 Cómo hacer pruebas

# .env del frontend

VITE_API_BASE_URL=http://localhost:3000/api### Opción 1: Swagger UI (Recomendado)

```1. Abre http://localhost:3000/docs en tu navegador

2. Haz clic en **POST /api/auth/login**

```typescript3. Click en "Try it out"

// Frontend: api/client.ts4. Pega las credenciales:

const api = axios.create({   ```json

  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:3000/api   {

});     "username": "tecnico1",

```     "password": "tecnico123"

   }

---   ```

5. Click en "Execute"

## 📝 Changelog de refactorización reciente6. Copia el `token` de la respuesta

7. Haz clic en el botón "Authorize" (arriba a la derecha)

### ✅ Mejoras implementadas:8. Pega el token: `Bearer tu_token_aqui`

9. Ahora puedes probar todos los endpoints autenticados

1. **Middleware de errores global** (`src/middlewares/error.middleware.ts`)

   - Manejo automático de `UnauthorizedError` → 401### Opción 2: PowerShell con Invoke-WebRequest

   - Respeta `err.statusCode` si existe```powershell

   - Oculta detalles en producción# 1. Login y obtener token

$loginResponse = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login `

2. **Validación de variables de entorno con Zod** (`src/config/env.ts`)  -Method POST `

   - Valida 11 variables al iniciar  -ContentType "application/json" `

   - `JWT_SECRET` requiere mínimo 32 caracteres  -Body '{"username":"tecnico1","password":"tecnico123"}'

   - Fail-fast con mensajes descriptivos

$token = $loginResponse.token

3. **Tipado TypeScript global** (`src/types/express.d.ts`)Write-Host "Token obtenido: $token"

   - `req.user` tipado globalmente en todos los middlewares

   - No se requiere `AuthRequest` personalizado# 2. Listar expedientes

$headers = @{ Authorization = "Bearer $token" }

4. **Paginación flexible español/inglés**$expedientes = Invoke-RestMethod -Uri http://localhost:3000/api/expedientes `

   - Soporta `page`/`pagina` y `pageSize`/`tamanoPagina`  -Method GET -Headers $headers

   - Respuesta consistente: `{ page, pageSize, total, data }`$expedientes | ConvertTo-Json



5. **BASE_PATH configurable**# 3. Crear expediente

   - Variable de entorno `BASE_PATH` (default: `/api`)$body = @{

   - Usado en app.ts y swagger.ts  codigo = "TEST-$(Get-Date -Format 'yyyyMMddHHmmss')"

  titulo = "Expediente de prueba"

6. **RBAC reforzado**  descripcion = "Creado desde PowerShell"

   - Verificación explícita de ownership en expedientes} | ConvertTo-Json

   - Justificación **obligatoria** al rechazar expedientes

   - Coordinadores no pueden modificar expedientes ajenos$nuevoExp = Invoke-RestMethod -Uri http://localhost:3000/api/expedientes `

  -Method POST -Headers $headers -ContentType "application/json" -Body $body

7. **Swagger actualizado**$nuevoExp | ConvertTo-Json

   - Todas las rutas protegidas marcadas con `bearerAuth`

   - Servidor dinámico con `BASE_PATH`# 4. Exportar a Excel (abre en navegador)

   - Documentación de paginación con aliasStart-Process "http://localhost:3000/api/expedientes/export?estado=abierto"

```

---

### Opción 3: curl (Bash/Git Bash)

## 👨‍💻 Autor```bash

# 1. Login

**Guillermo Gómez**TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \

- GitHub: [@GuillermoGome2z](https://github.com/GuillermoGome2z)  -H "Content-Type: application/json" \

- Universidad Mariano Gálvez - Desarrollo Web (2025)  -d '{"username":"tecnico1","password":"tecnico123"}' | jq -r '.token')



---echo "Token: $TOKEN"



## 📄 Licencia# 2. Listar expedientes con filtros

curl -X GET "http://localhost:3000/api/expedientes?estado=abierto&page=1&pageSize=10" \

ISC  -H "Authorization: Bearer $TOKEN"


# 3. Crear expediente
curl -X POST http://localhost:3000/api/expedientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"codigo":"TEST-001","titulo":"Test","descripcion":"Expediente de prueba"}'

# 4. Aprobar expediente (requiere rol coordinador)
curl -X PATCH http://localhost:3000/api/expedientes/1/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_COORDINADOR" \
  -d '{"nuevoEstado":"aprobado"}'
```

### Opción 4: Postman / Insomnia
1. Importa la URL de Swagger: `http://localhost:3000/docs`
2. O crea las peticiones manualmente siguiendo la documentación
3. Configura el header `Authorization: Bearer <token>` después del login

### Tests completos
Ver `docs/tests-rapidos.md` para más de 30 ejemplos de pruebas con casos de éxito y error, validación de ownership, paginación, filtros y exportación.

---

## 🎨 Frontend

El frontend se encuentra en un repositorio separado para mantener una arquitectura desacoplada:

**Repositorio Frontend:** _(Pendiente de publicar)_

**Conexión:** El frontend se conectará a esta API mediante las rutas `/api/*` documentadas en Swagger.

**CORS configurado para:**
- `http://localhost:5173` (Vite/React dev)
- `http://localhost:3001` 
- `http://localhost:3000`

---

## 👨‍💻 Autor

**Guillermo Gómez**
- GitHub: [@GuillermoGome2z](https://github.com/GuillermoGome2z)
- Universidad Mariano Gálvez - Desarrollo Web (2025)

---

## 📄 Licencia

ISC
