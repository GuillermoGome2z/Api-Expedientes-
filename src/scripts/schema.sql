-- Crear base de datos si no existe
IF DB_ID('expedientes_db') IS NULL
    CREATE DATABASE expedientes_db;
GO

USE expedientes_db;
GO

-- Tabla Usuarios
IF OBJECT_ID('Usuarios') IS NULL
CREATE TABLE Usuarios (
    id INT IDENTITY PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    rol NVARCHAR(20) NOT NULL CHECK (rol IN ('tecnico','coordinador')),
    activo BIT NOT NULL DEFAULT 1
);

-- Tabla Expedientes
IF OBJECT_ID('Expedientes') IS NULL
CREATE TABLE Expedientes (
    id INT IDENTITY PRIMARY KEY,
    codigo NVARCHAR(50) UNIQUE NOT NULL,
    titulo NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(MAX) NOT NULL,
    estado NVARCHAR(20) NOT NULL DEFAULT 'abierto' CHECK (estado IN ('abierto','aprobado','rechazado')),
    tecnico_id INT NOT NULL FOREIGN KEY REFERENCES Usuarios(id),
    aprobador_id INT NULL FOREIGN KEY REFERENCES Usuarios(id),
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_actualizacion DATETIME NULL,
    fecha_estado DATETIME NULL,
    modificado_por INT NULL FOREIGN KEY REFERENCES Usuarios(id),
    activo BIT NOT NULL DEFAULT 1
);

-- Tabla Indicios
IF OBJECT_ID('Indicios') IS NULL
CREATE TABLE Indicios (
    id INT IDENTITY PRIMARY KEY,
    expediente_id INT NOT NULL FOREIGN KEY REFERENCES Expedientes(id),
    descripcion NVARCHAR(MAX) NOT NULL,
    peso DECIMAL(10,2) NULL CHECK (peso >= 0),
    color NVARCHAR(50) NULL,
    tamano NVARCHAR(50) NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    fecha_actualizacion DATETIME NULL,
    modificado_por INT NULL FOREIGN KEY REFERENCES Usuarios(id),
    activo BIT NOT NULL DEFAULT 1
);
