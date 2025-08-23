USE expedientes_db; 
GO
IF OBJECT_ID('sp_Expedientes_Crear') IS NOT NULL DROP PROC sp_Expedientes_Crear; 
GO
CREATE PROC sp_Expedientes_Crear
  @codigo NVARCHAR(50),
  @titulo NVARCHAR(255),
  @descripcion NVARCHAR(MAX),
  @tecnico_id INT
AS
BEGIN
  IF EXISTS (SELECT 1 FROM Expedientes WHERE codigo=@codigo)
    BEGIN RAISERROR('codigo duplicado', 16, 1); RETURN; END

  INSERT INTO Expedientes(codigo,titulo,descripcion,tecnico_id)
  VALUES (@codigo,@titulo,@descripcion,@tecnico_id);

  SELECT SCOPE_IDENTITY() AS id;
END;
GO

