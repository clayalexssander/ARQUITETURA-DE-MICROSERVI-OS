const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'db_pedidos',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('[ms-pedidos] Conexão com o banco de dados MySQL estabelecida com sucesso.');
  } catch (error) {
    console.error('[ms-pedidos] Erro ao conectar ao MySQL:', error.message);
  }
};

module.exports = { sequelize, testConnection };
