USE expedientes_db; 
GO
IF OBJECT_ID('sp_Indicios_ActivarDesactivar') IS NOT NULL DROP PROC sp_Indicios_ActivarDesactivar; 
GO
CREATE PROC sp_Indicios_ActivarDesactivar
  @id INT,
  @activo BIT
AS
BEGIN
  UPDATE Indicios SET activo=@activo WHERE id=@id;
  SELECT @@ROWCOUNT AS updated;
END;
GO
