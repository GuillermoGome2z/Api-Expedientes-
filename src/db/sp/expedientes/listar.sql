USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_Listar') IS NOT NULL DROP PROC sp_Expedientes_Listar; 
GO
CREATE PROC sp_Expedientes_Listar
  @page INT = 1,
  @pageSize INT = 10,
  @q NVARCHAR(255) = NULL,
  @codigo NVARCHAR(50) = NULL,
  @estado NVARCHAR(20) = NULL,
  @tecnico_id INT = NULL,
  @fechaInicio DATETIME = NULL,
  @fechaFin DATETIME = NULL
AS
BEGIN
  SET NOCOUNT ON;
  
  DECLARE @total INT;
  
  WITH FilteredExpedientes AS (
    SELECT e.*, u.username AS tecnico_username,
           ua.username AS aprobador_username
    FROM Expedientes e
    JOIN Usuarios u ON u.id = e.tecnico_id
    LEFT JOIN Usuarios ua ON ua.id = e.aprobador_id
    WHERE e.activo = 1
      AND (@q IS NULL OR e.codigo LIKE '%'+@q+'%' OR e.titulo LIKE '%'+@q+'%' OR e.descripcion LIKE '%'+@q+'%')
      AND (@codigo IS NULL OR e.codigo LIKE '%'+@codigo+'%')
      AND (@estado IS NULL OR e.estado = @estado)
      AND (@tecnico_id IS NULL OR e.tecnico_id = @tecnico_id)
      AND (@fechaInicio IS NULL OR e.fecha_creacion >= @fechaInicio)
      AND (@fechaFin IS NULL OR e.fecha_creacion <= @fechaFin)
  )
  SELECT @total = COUNT(*) FROM FilteredExpedientes;
  
  SELECT *, @total AS total
  FROM FilteredExpedientes
  ORDER BY id DESC
  OFFSET (@page-1)*@pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;
END;
GO
