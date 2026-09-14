-- Script de Inicialização para db_produtos
CREATE DATABASE IF NOT EXISTS `db_produtos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_produtos`;

CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `preco` DECIMAL(10, 2) NOT NULL,
  `descricao` TEXT NULL,
  `estoque` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `produtos` (`nome`, `preco`, `descricao`, `estoque`) VALUES
('Notebook Gamer Dell G15', 5299.90, 'Intel Core i7, 16GB RAM, SSD 512GB, RTX 3050', 10),
('Mouse Sem Fio Logitech MX Master 3S', 489.90, 'Design ergonômico, sensor 8K DPI e clique silencioso', 25),
('Teclado Mecânico Keychron K2', 650.00, 'Layout 75%, switches Gateron Brown, Bluetooth/Cabo', 15),
('Monitor Ultrawide LG 29"', 1299.00, 'Painel IPS Full HD 75Hz com HDR10 e FreeSync', 8),
('Headset HyperX Cloud II', 499.00, 'Som Surround 7.1 virtual e almofadas com memory foam', 0);
