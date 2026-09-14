const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Rotas CRUD e controle de estoque
router.post('/produtos', produtoController.cadastrarProduto);
router.get('/produtos', produtoController.listarProdutos);
router.get('/produtos/:id', produtoController.buscarPorId);
router.put('/produtos/:id', produtoController.atualizarProduto);
router.patch('/produtos/:id/estoque', produtoController.atualizarEstoque);
router.delete('/produtos/:id', produtoController.deletarProduto);

module.exports = router;
