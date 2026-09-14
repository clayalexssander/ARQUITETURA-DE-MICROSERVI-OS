require('dotenv').config();
const app = require('./src/app');
const { sequelize, testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    await testConnection();
    // Sincroniza tabelas se ainda não criadas
    await sequelize.sync({ alter: false });
    console.log('[ms-pedidos] Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  🚀 ms-pedidos em execução na porta ${PORT}`);
      console.log(`  📖 Swagger UI disponível em: http://localhost:${PORT}/api-docs`);
      console.log(`  🩺 Health check: http://localhost:${PORT}/health`);
      console.log(`  🔗 Conectado a ms-produtos: ${process.env.MS_PRODUTOS_URL || 'http://localhost:3001'}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[ms-pedidos] Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();
