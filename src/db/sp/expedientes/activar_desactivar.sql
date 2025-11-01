USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_ActivarDesactivar') IS NOT NULL DROP PROC sp_Expedientes_ActivarDesactivar; 
GO
CREATE PROC sp_Expedientes_ActivarDesactivar
  @id INT,
  @activo BIT,
  @modificado_por INT
AS
BEGIN
  UPDATE Expedientes 
  SET activo=@activo,
      fecha_actualizacion=GETDATE(),
      modificado_por=@modificado_por
  WHERE id=@id;
  SELECT @@ROWCOUNT AS updated;
END;
GO
