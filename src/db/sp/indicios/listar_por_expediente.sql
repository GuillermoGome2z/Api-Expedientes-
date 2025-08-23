USE expedientes_db; 
GO
IF OBJECT_ID('sp_Indicios_ListarPorExpediente') IS NOT NULL DROP PROC sp_Indicios_ListarPorExpediente; 
GO
CREATE PROC sp_Indicios_ListarPorExpediente
  @expediente_id INT
AS
BEGIN
  SELECT * FROM Indicios WHERE expediente_id=@expediente_id AND activo=1;
END;
GO
