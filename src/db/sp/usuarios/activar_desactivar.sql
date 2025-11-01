CREATE PROCEDURE sp_Usuarios_ActivarDesactivar
    @id INT,
    @activo BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Usuarios
    SET activo = @activo
    WHERE id = @id;
    
    IF @@ROWCOUNT > 0
        SELECT 1 AS updated;
    ELSE
        SELECT 0 AS updated;
END
