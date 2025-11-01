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
  
  SELECT @total = COUNT(*) FROM Usuarios WHERE activo=1;
  
  SELECT id, username, rol, activo, @total AS total
  FROM Usuarios
  WHERE activo=1
  ORDER BY id
  OFFSET (@page-1)*@pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;
END;
GO
