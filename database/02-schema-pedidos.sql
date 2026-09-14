-- Script de Inicialização para db_pedidos
CREATE DATABASE IF NOT EXISTS `db_pedidos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_pedidos`;

CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `produtoId` INT NOT NULL,
  `nomeProduto` VARCHAR(255) NOT NULL,
  `precoUnitario` DECIMAL(10, 2) NOT NULL,
  `quantidade` INT NOT NULL,
  `valorTotal` DECIMAL(10, 2) NOT NULL,
  `dataPedido` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('REALIZADO', 'CANCELADO') NOT NULL DEFAULT 'REALIZADO',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `pedidos` (`produtoId`, `nomeProduto`, `precoUnitario`, `quantidade`, `valorTotal`, `status`) VALUES
(1, 'Notebook Gamer Dell G15', 5299.90, 1, 5299.90, 'REALIZADO'),
(2, 'Mouse Sem Fio Logitech MX Master 3S', 489.90, 2, 979.80, 'REALIZADO');
