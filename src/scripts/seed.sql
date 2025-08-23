USE expedientes_db;
GO

INSERT INTO Usuarios (username, password_hash, rol) VALUES
('tecnico1', '$2b$10$3mzgnCMxEf58XCzB5iQieubQ0yMLFop05ndHrltjJc8Hcy5QB.3v2', 'tecnico'),
('coord1',   '$2b$10$3mzgnCMxEf58XCzB5iQieubQ0yMLFop05ndHrltjJc8Hcy5QB.3v2', 'coordinador');
