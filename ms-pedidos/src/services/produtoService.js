const axios = require('axios');
require('dotenv').config();

const PRODUTOS_API_URL = process.env.MS_PRODUTOS_URL || 'http://localhost:3001';

/**
 * Consulta dados do produto no ms-produtos de forma síncrona
 * @param {number|string} produtoId 
 * @returns {Promise<Object>} Dados do produto
 */
async function buscarProdutoPorId(produtoId) {
  try {
    const response = await axios.get(`${PRODUTOS_API_URL}/produtos/${produtoId}`, {
      timeout: 5000 // 5 segundos de timeout
    });

    if (response.data && response.data.sucesso && response.data.dados) {
      return response.data.dados;
    }

    return null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }

    // Se o serviço de produtos estiver indisponível
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      const err = new Error('O Microserviço de Produtos está temporariamente indisponível. Tente novamente em instantes.');
      err.statusCode = 503;
      throw err;
    }

    throw error;
  }
}

/**
 * Atualiza o estoque no ms-produtos
 * @param {number|string} produtoId 
 * @param {number} delta Quantidade a ser debitada (negativo) ou creditada (positivo)
 */
async function atualizarEstoque(produtoId, delta) {
  try {
    const response = await axios.patch(
      `${PRODUTOS_API_URL}/produtos/${produtoId}/estoque`,
      { quantidadeDelta: delta },
      { timeout: 5000 }
    );
    return response.data;
  } catch (error) {
    console.error(`[ms-pedidos] Falha ao atualizar estoque do produto ${produtoId}:`, error.message);
    // Não interrompe estritamente caso o endpoint seja opcional, mas registra o erro
    return null;
  }
}

module.exports = {
  buscarProdutoPorId,
  atualizarEstoque
};
