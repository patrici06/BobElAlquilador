-- Crea la base de datos solo si no existe
CREATE DATABASE IF NOT EXISTS midb
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- (Opcional) Crea el usuario solo si no existe y otorga permisos
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '1234567!';

-- Otorga todos los privilegios al usuario sobre la base de datos
GRANT ALL PRIVILEGES ON midb.* TO 'root'@'localhost';

-- Aplica los cambios de privilegios
FLUSH PRIVILEGES;

