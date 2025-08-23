USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_Listar') IS NOT NULL DROP PROC sp_Expedientes_Listar; 
GO
CREATE PROC sp_Expedientes_Listar
  @page INT = 1,
  @pageSize INT = 10,
  @codigo NVARCHAR(50) = NULL,
  @estado NVARCHAR(20) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  WITH F AS (
    SELECT e.*, u.username AS tecnico_username
    FROM Expedientes e
    JOIN Usuarios u ON u.id = e.tecnico_id
    WHERE e.activo = 1
      AND (@codigo IS NULL OR e.codigo LIKE '%'+@codigo+'%')
      AND (@estado IS NULL OR e.estado = @estado)
  )
  SELECT *
  FROM F
  ORDER BY id DESC
  OFFSET (@page-1)*@pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;
END;
GO
