USE expedientes_db; 
GO
IF OBJECT_ID('sp_Usuarios_Login') IS NOT NULL DROP PROC sp_Usuarios_Login; 
GO
CREATE PROC sp_Usuarios_Login
  @username NVARCHAR(50)
AS
BEGIN
  SET NOCOUNT ON;
  SELECT TOP 1 id, username, password_hash, rol, activo
  FROM Usuarios
  WHERE username = @username AND activo = 1;
END;
GO
