const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const produtoRoutes = require('./routes/produtoRoutes');
const swaggerDocument = require('./docs/swagger');

const app = express();

// Middlewares essenciais
app.use(cors({
  origin: '*', // Permite requisições do frontend React
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    servico: 'ms-produtos',
    timestamp: new Date().toISOString()
  });
});

// Documentação Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas principais
app.use('/', produtoRoutes);

// Middleware para tratamento de rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('[ms-produtos] Erro não tratado:', err);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno no microserviço de produtos.',
    erro: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
