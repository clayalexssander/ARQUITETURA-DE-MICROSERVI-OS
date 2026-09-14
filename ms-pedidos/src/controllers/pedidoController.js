const Pedido = require('../models/Pedido');
const produtoService = require('../services/produtoService');

// POST /pedidos - Criação de novo pedido com validação síncrona e snapshot
exports.criarPedido = async (req, res) => {
  try {
    const { produtoId, quantidade } = req.body;

    // 1. Validação básica de payload
    if (!produtoId || quantidade === undefined) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Os campos produtoId e quantidade são obrigatórios.'
      });
    }

    const qtd = parseInt(quantidade, 10);
    if (isNaN(qtd) || qtd <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'A quantidade solicitada deve ser um número inteiro maior que zero.'
      });
    }

    // 2. Comunicação Service-to-Service: Valida existência do produto no ms-produtos
    let produto;
    try {
      produto = await produtoService.buscarProdutoPorId(produtoId);
    } catch (errService) {
      if (errService.statusCode === 503) {
        return res.status(503).json({
          sucesso: false,
          mensagem: errService.message
        });
      }
      throw errService;
    }

    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Produto com ID ${produtoId} não foi encontrado no catálogo.`
      });
    }

    // 3. Verificação de estoque disponível
    if (produto.estoque < qtd) {
      return res.status(400).json({
        sucesso: false,
        mensagem: `Estoque insuficiente para o produto "${produto.nome}". Quantidade disponível: ${produto.estoque}, solicitada: ${qtd}.`
      });
    }

    // 4. Snapshot Pattern: Capturar preço e nome atuais e calcular total
    const nomeProdutoSnapshot = produto.nome;
    const precoUnitarioSnapshot = parseFloat(produto.preco);
    const valorTotalCalculado = parseFloat((precoUnitarioSnapshot * qtd).toFixed(2));

    // 5. Abater estoque no ms-produtos
    await produtoService.atualizarEstoque(produtoId, -qtd);

    // 6. Persistência do pedido no banco db_pedidos
    const novoPedido = await Pedido.create({
      produtoId: parseInt(produtoId, 10),
      nomeProduto: nomeProdutoSnapshot,
      precoUnitario: precoUnitarioSnapshot,
      quantidade: qtd,
      valorTotal: valorTotalCalculado,
      status: 'REALIZADO'
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Pedido realizado com sucesso!',
      dados: novoPedido
    });
  } catch (error) {
    console.error('[ms-pedidos] Erro ao processar criação de pedido:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao processar criação do pedido.',
      erro: error.message
    });
  }
};

// GET /pedidos - Lista histórico de pedidos
exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      order: [['id', 'DESC']]
    });

    return res.status(200).json({
      sucesso: true,
      total: pedidos.length,
      dados: pedidos
    });
  } catch (error) {
    console.error('[ms-pedidos] Erro ao listar pedidos:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao listar pedidos.',
      erro: error.message
    });
  }
};

// GET /pedidos/:id - Detalhes de um pedido específico
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Pedido com ID ${id} não foi encontrado.`
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: pedido
    });
  } catch (error) {
    console.error('[ms-pedidos] Erro ao buscar pedido:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao buscar pedido.',
      erro: error.message
    });
  }
};

// PATCH /pedidos/:id/cancelar - Cancelar pedido e devolver estoque
exports.cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Pedido com ID ${id} não encontrado.`
      });
    }

    if (pedido.status === 'CANCELADO') {
      return res.status(400).json({
        sucesso: false,
        mensagem: `O pedido ${id} já se encontra cancelado.`
      });
    }

    pedido.status = 'CANCELADO';
    await pedido.save();

    // Devolve o estoque ao produto
    await produtoService.atualizarEstoque(pedido.produtoId, pedido.quantidade);

    return res.status(200).json({
      sucesso: true,
      mensagem: `Pedido ${id} cancelado com sucesso. Estoque do item devolvido ao catálogo.`,
      dados: pedido
    });
  } catch (error) {
    console.error('[ms-pedidos] Erro ao cancelar pedido:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao cancelar pedido.',
      erro: error.message
    });
  }
};
