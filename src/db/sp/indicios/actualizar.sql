USE expedientes_db; 
GO
IF OBJECT_ID('sp_Indicios_Actualizar') IS NOT NULL DROP PROC sp_Indicios_Actualizar; 
GO
CREATE PROC sp_Indicios_Actualizar
  @id INT,
  @descripcion NVARCHAR(MAX),
  @peso DECIMAL(10,2) = NULL,
  @color NVARCHAR(50) = NULL,
  @tamano NVARCHAR(50) = NULL,
  @modificado_por INT
AS
BEGIN
  IF (@peso IS NOT NULL AND @peso < 0)
    BEGIN RAISERROR('peso inválido',16,1); RETURN; END

  UPDATE Indicios
  SET descripcion=@descripcion, 
      peso=@peso, 
      color=@color, 
      tamano=@tamano,
      fecha_actualizacion=GETDATE(),
      modificado_por=@modificado_por
  WHERE id=@id AND activo=1;

  SELECT @@ROWCOUNT AS updated;
END;
GO
