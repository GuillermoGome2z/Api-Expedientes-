USE expedientes_db; 
GO
IF OBJECT_ID('sp_Usuarios_ActualizarPassword') IS NOT NULL DROP PROC sp_Usuarios_ActualizarPassword; 
GO
CREATE PROC sp_Usuarios_ActualizarPassword
  @id INT,
  @password_hash NVARCHAR(255)
AS
BEGIN
  UPDATE Usuarios 
  SET password_hash=@password_hash
  WHERE id=@id AND activo=1;
  
  SELECT @@ROWCOUNT AS updated;
END;
GO
