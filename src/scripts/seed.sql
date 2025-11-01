USE expedientes_db;
GO

-- Usuarios (password: tecnico123 para todos)
-- Hash generado con bcrypt rounds=10
INSERT INTO Usuarios (username, password_hash, rol) VALUES
('tecnico1', '$2b$10$Q1Kv1nUW81hQC.VvK/WLCecTdHtaKtHVrE.S.4IzAoHZ7/P19Zg3G', 'tecnico'),
('tecnico2', '$2b$10$Q1Kv1nUW81hQC.VvK/WLCecTdHtaKtHVrE.S.4IzAoHZ7/P19Zg3G', 'tecnico'),
('coord1',   '$2b$10$Q1Kv1nUW81hQC.VvK/WLCecTdHtaKtHVrE.S.4IzAoHZ7/P19Zg3G', 'coordinador');
GO

-- Expedientes: 5 expedientes con diferentes estados
INSERT INTO Expedientes (codigo, titulo, descripcion, estado, tecnico_id, aprobador_id, fecha_estado) VALUES
('EXP-2025-001', 'Robo en residencia', 'Caso de robo con fractura de cerradura', 'abierto', 1, NULL, NULL),
('EXP-2025-002', 'Accidente vehicular', 'Colisi\u00f3n en avenida principal', 'abierto', 1, NULL, NULL),
('EXP-2025-003', 'Fraude bancario', 'Transferencias no autorizadas', 'aprobado', 2, 3, GETDATE()),
('EXP-2025-004', 'Vandalismo', 'Da\u00f1os a propiedad p\u00fablica', 'abierto', 2, NULL, NULL),
('EXP-2025-005', 'Falsificaci\u00f3n', 'Documentos adulterados.
Justificaci\u00f3n: Falta de evidencia suficiente', 'rechazado', 1, 3, GETDATE());
GO

-- Indicios: 8 indicios variados distribuidos entre expedientes
INSERT INTO Indicios (expediente_id, descripcion, peso, color, tamano) VALUES
(1, 'Herramienta met\u00e1lica encontrada en la escena', 2.5, 'plateado', 'mediano'),
(1, 'Fragmento de vidrio de ventana rota', 0.15, 'transparente', 'peque\u00f1o'),
(2, 'Trozo de pintura del veh\u00edculo', 0.05, 'rojo', 'peque\u00f1o'),
(2, 'Rastro de l\u00edquido de frenos', 0.3, 'amarillo', 'peque\u00f1o'),
(3, 'Documento bancario falsificado', 0.02, 'blanco', 'mediano'),
(3, 'Tarjeta bancaria clonada', 0.01, 'azul', 'peque\u00f1o'),
(4, 'Lata de pintura en aerosol', 0.4, 'negro', 'grande'),
(5, 'Documento adulterado', 0.03, 'blanco', 'mediano');
GO
