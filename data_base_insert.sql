-- Insertar roles (clave primaria es nombre)
INSERT IGNORE INTO rol (nombre) VALUES ('ROLE_EMPLEADO');
INSERT IGNORE INTO rol (nombre) VALUES ('ROLE_CLIENTE');
INSERT IGNORE INTO rol (nombre) VALUES ('ROLE_PROPIETARIO');

-- Insertar usuario propietario de ejemplo
INSERT INTO persona (dni, nombre, apellido, email, clave, telefono)
VALUES ('1234567!', 'roberto', 'Paredes', 'BobElAlquilador@gmail.com', '$2a$10$UQgvE99wAFwSbHiZ7SZeQOOFbCbV7sdOwZzUoF0A2Ip25q6A03I0K', '')
ON DUPLICATE KEY UPDATE email=email;

-- Asignar el rol PROPIETARIO al usuario (ajusta los nombres de columna según tu modelo real)
-- Suponiendo que la tabla intermedia se llama persona_rol y los campos son persona_dni y rol_nombre
INSERT INTO persona_roles (persona_email, rol_nombre)
VALUES ('BobElAlquilador@gmail.com', 'ROLE_PROPIETARIO')
ON DUPLICATE KEY UPDATE persona_email=persona_email;