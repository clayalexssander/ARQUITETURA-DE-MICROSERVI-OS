const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rotas de pedidos
router.post('/pedidos', pedidoController.criarPedido);
router.get('/pedidos', pedidoController.listarPedidos);
router.get('/pedidos/:id', pedidoController.buscarPorId);
router.patch('/pedidos/:id/cancelar', pedidoController.cancelarPedido);

module.exports = router;
