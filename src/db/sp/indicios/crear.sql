USE expedientes_db; 
GO
IF OBJECT_ID('sp_Indicios_Crear') IS NOT NULL DROP PROC sp_Indicios_Crear; 
GO
CREATE PROC sp_Indicios_Crear
  @expediente_id INT,
  @descripcion NVARCHAR(MAX),
  @peso DECIMAL(10,2) = NULL,
  @color NVARCHAR(50) = NULL,
  @tamano NVARCHAR(50) = NULL
AS
BEGIN
  IF (@peso IS NOT NULL AND @peso < 0)
    BEGIN RAISERROR('peso inválido',16,1); RETURN; END

  INSERT INTO Indicios(expediente_id, descripcion, peso, color, tamano)
  VALUES (@expediente_id, @descripcion, @peso, @color, @tamano);

  SELECT SCOPE_IDENTITY() AS id;
END;
GO
