require('dotenv').config();
const app = require('./src/app');
const { sequelize, testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await testConnection();
    // Sincroniza tabelas se ainda não criadas
    await sequelize.sync({ alter: false });
    console.log('[ms-produtos] Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  🚀 ms-produtos em execução na porta ${PORT}`);
      console.log(`  📖 Swagger UI disponível em: http://localhost:${PORT}/api-docs`);
      console.log(`  🩺 Health check: http://localhost:${PORT}/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[ms-produtos] Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();
