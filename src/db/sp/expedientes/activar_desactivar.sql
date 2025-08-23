USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_ActivarDesactivar') IS NOT NULL DROP PROC sp_Expedientes_ActivarDesactivar; 
GO
CREATE PROC sp_Expedientes_ActivarDesactivar
  @id INT,
  @activo BIT
AS
BEGIN
  UPDATE Expedientes SET activo=@activo WHERE id=@id;
  SELECT @@ROWCOUNT AS updated;
END;
GO
