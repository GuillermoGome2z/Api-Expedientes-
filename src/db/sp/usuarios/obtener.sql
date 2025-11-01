USE expedientes_db; 
GO
IF OBJECT_ID('sp_Usuarios_Obtener') IS NOT NULL DROP PROC sp_Usuarios_Obtener; 
GO
CREATE PROC sp_Usuarios_Obtener
  @id INT
AS
BEGIN
  SELECT id, username, rol, activo, password_hash
  FROM Usuarios
  WHERE id=@id;
END;
GO
