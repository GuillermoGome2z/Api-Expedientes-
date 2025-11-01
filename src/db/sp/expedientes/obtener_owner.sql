USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_ObtenerOwner') IS NOT NULL DROP PROC sp_Expedientes_ObtenerOwner; 
GO
CREATE PROC sp_Expedientes_ObtenerOwner
  @expediente_id INT
AS
BEGIN
  SELECT tecnico_id, activo
  FROM Expedientes
  WHERE id=@expediente_id;
END;
GO
