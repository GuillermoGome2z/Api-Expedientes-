USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_Obtener') IS NOT NULL DROP PROC sp_Expedientes_Obtener; 
GO
CREATE PROC sp_Expedientes_Obtener
  @id INT
AS
BEGIN
  SELECT * FROM Expedientes WHERE id=@id AND activo=1;
END;
GO
