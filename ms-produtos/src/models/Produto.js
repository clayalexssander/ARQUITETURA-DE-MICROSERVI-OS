const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome do produto não pode ser vazio.' }
    }
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'O preço deve ser um valor decimal válido.' },
      min: { args: [0], msg: 'O preço deve ser maior ou igual a zero.' }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: { msg: 'O estoque deve ser um número inteiro.' },
      min: { args: [0], msg: 'O estoque não pode ser negativo.' }
    }
  }
}, {
  tableName: 'produtos',
  timestamps: true
});

module.exports = Produto;
