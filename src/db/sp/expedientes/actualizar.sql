USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_Actualizar') IS NOT NULL DROP PROC sp_Expedientes_Actualizar; 
GO
CREATE PROC sp_Expedientes_Actualizar
  @id INT,
  @titulo NVARCHAR(255),
  @descripcion NVARCHAR(MAX),
  @tecnico_id INT
AS
BEGIN
  UPDATE Expedientes
  SET titulo=@titulo, descripcion=@descripcion
  WHERE id=@id AND activo=1 AND tecnico_id=@tecnico_id;

  SELECT @@ROWCOUNT AS updated;
END;
GO
