USE expedientes_db; 
GO
IF OBJECT_ID('sp_Usuarios_Listar') IS NOT NULL DROP PROC sp_Usuarios_Listar; 
GO
CREATE PROC sp_Usuarios_Listar
  @page INT = 1,
  @pageSize INT = 10
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @total INT;
  
  -- Mostrar TODOS los usuarios (activos e inactivos)
  SELECT @total = COUNT(*) FROM Usuarios;
  
  SELECT id, username, rol, activo, @total AS total
  FROM Usuarios
  ORDER BY id
  OFFSET (@page-1)*@pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;
END;
GO
