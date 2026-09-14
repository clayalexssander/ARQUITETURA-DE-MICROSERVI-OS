-- =====================================================================
-- PROJETO: ARQUITETURA DE MICROSERVIÇOS (DSW 3) - IFSP
-- SCRIPT SQL PARA MYSQL WORKBENCH
-- Criação dos Bancos de Dados Independentes: db_produtos e db_pedidos
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. BANCO DE DADOS: db_produtos (Microserviço de Produtos)
-- ---------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `db_produtos` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `db_produtos`;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(255) NOT NULL,
  `preco` DECIMAL(10, 2) NOT NULL,
  `descricao` TEXT NULL,
  `estoque` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Dados Iniciais para Teste (Seed)
INSERT INTO `produtos` (`nome`, `preco`, `descricao`, `estoque`) VALUES
('Notebook Gamer Dell G15', 5299.90, 'Intel Core i7, 16GB RAM, SSD 512GB, RTX 3050', 10),
('Mouse Sem Fio Logitech MX Master 3S', 489.90, 'Design ergonômico, sensor 8K DPI e clique silencioso', 25),
('Teclado Mecânico Keychron K2', 650.00, 'Layout 75%, switches Gateron Brown, Bluetooth/Cabo', 15),
('Monitor Ultrawide LG 29"', 1299.00, 'Painel IPS Full HD 75Hz com HDR10 e FreeSync', 8),
('Headset HyperX Cloud II', 499.00, 'Som Surround 7.1 virtual e almofadas com memory foam', 0); -- Produto sem estoque para teste


-- ---------------------------------------------------------------------
-- 2. BANCO DE DADOS: db_pedidos (Microserviço de Pedidos)
-- ---------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `db_pedidos` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `db_pedidos`;

-- Tabela de Pedidos (Aplica Snapshot Pattern para resiliência financeira)
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

-- Pedidos Iniciais para Teste (Exemplos com snapshot histórico)
INSERT INTO `pedidos` (`produtoId`, `nomeProduto`, `precoUnitario`, `quantidade`, `valorTotal`, `status`) VALUES
(1, 'Notebook Gamer Dell G15', 5299.90, 1, 5299.90, 'REALIZADO'),
(2, 'Mouse Sem Fio Logitech MX Master 3S', 489.90, 2, 979.80, 'REALIZADO');
