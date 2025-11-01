USE expedientes_db; 
GO
IF OBJECT_ID('sp_Indicios_ListarPorExpediente') IS NOT NULL DROP PROC sp_Indicios_ListarPorExpediente; 
GO
CREATE PROC sp_Indicios_ListarPorExpediente
  @expediente_id INT,
  @page INT = 1,
  @pageSize INT = 10
AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @total INT;
  
  SELECT @total = COUNT(*) 
  FROM Indicios 
  WHERE expediente_id=@expediente_id AND activo=1;
  
  SELECT *, @total AS total 
  FROM Indicios 
  WHERE expediente_id=@expediente_id AND activo=1
  ORDER BY id DESC
  OFFSET (@page-1)*@pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;
END;
GO
