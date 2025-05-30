-- Insertar roles (clave primaria es nombre)
INSERT IGNORE INTO rol (nombre) VALUES ('ROLE_EMPLEADO');
INSERT IGNORE INTO rol (nombre) VALUES ('ROLE_CLIENTE');
INSERT IGNORE INTO rol (nombre) VALUES ('ROLE_PROPIETARIO');
INSERT INTO tipo (nombre) VALUES
                              ('construccion'),
                              ('agricultura'),
                              ('mineria'),
                              ('jardineria');
INSERT INTO marca (nombre) VALUES
                               ('Caterpillar'),
                               ('Komatsu'),
                               ('Hitachi'),
                               ('Volvo'),
                               ('Liebherr'),
                               ('John Deere'),
                               ('Doosan'),
                               ('JCB'),
                               ('Case'),
                               ('Hyundai');
-- Insertar usuario propietario de ejemplo
INSERT INTO persona (dni, nombre, apellido, email, clave, telefono)
VALUES ('1234567!', 'roberto', 'Paredes', 'bobelalquilador.personal@gmail.com', '$2a$10$UQgvE99wAFwSbHiZ7SZeQOOFbCbV7sdOwZzUoF0A2Ip25q6A03I0K', '')
ON DUPLICATE KEY UPDATE email=email;

-- Asignar el rol PROPIETARIO al usuario (ajusta los nombres de columna según tu modelo real)
-- Suponiendo que la tabla intermedia se llama persona_rol y los campos son persona_dni y rol_nombre
INSERT INTO persona_roles (persona_email, rol_id)
VALUES ('bobelalquilador.personal@gmail.com', '3')
ON DUPLICATE KEY UPDATE persona_email=persona_email;