const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  produtoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'produtoId deve ser um número inteiro.' }
    }
  },
  nomeProduto: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Snapshot do nome do produto no momento do pedido'
  },
  precoUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Snapshot do preço unitário no momento do pedido'
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'A quantidade deve ser um número inteiro.' },
      min: { args: [1], msg: 'A quantidade deve ser maior que zero.' }
    }
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dataPedido: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('REALIZADO', 'CANCELADO'),
    allowNull: false,
    defaultValue: 'REALIZADO'
  }
}, {
  tableName: 'pedidos',
  timestamps: true
});

module.exports = Pedido;
