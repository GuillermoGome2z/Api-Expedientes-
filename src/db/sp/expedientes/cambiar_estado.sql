USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_CambiarEstado') IS NOT NULL DROP PROC sp_Expedientes_CambiarEstado; 
GO
CREATE PROC sp_Expedientes_CambiarEstado
  @id INT,
  @estado NVARCHAR(20),        -- aprobado|rechazado
  @aprobador_id INT,
  @justificacion NVARCHAR(MAX) = NULL
AS
BEGIN
  IF @estado NOT IN ('aprobado','rechazado')
    BEGIN RAISERROR('estado inválido',16,1); RETURN; END

  UPDATE Expedientes
  SET estado=@estado,
      aprobador_id=@aprobador_id,
      fecha_estado=GETDATE(),
      descripcion = CASE WHEN @justificacion IS NOT NULL 
                         THEN CONCAT(descripcion, CHAR(10), 'Justificación: ', @justificacion)
                         ELSE descripcion END
  WHERE id=@id AND activo=1;

  SELECT @@ROWCOUNT AS updated;
END;
GO
