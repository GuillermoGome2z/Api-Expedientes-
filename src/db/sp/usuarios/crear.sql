USE expedientes_db; 
GO
IF OBJECT_ID('sp_Usuarios_Crear') IS NOT NULL DROP PROC sp_Usuarios_Crear; 
GO
CREATE PROC sp_Usuarios_Crear
  @username NVARCHAR(50),
  @password_hash NVARCHAR(255),
  @rol NVARCHAR(20)
AS
BEGIN
  INSERT INTO Usuarios(username, password_hash, rol)
  VALUES (@username, @password_hash, @rol);
  SELECT SCOPE_IDENTITY() AS id;
END;
GO
