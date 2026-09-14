const Produto = require('../models/Produto');

// POST /produtos - Cadastra um novo produto
exports.cadastrarProduto = async (req, res) => {
  try {
    const { nome, preco, descricao, estoque } = req.body;

    if (!nome || preco === undefined || estoque === undefined) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Os campos nome, preco e estoque são obrigatórios.'
      });
    }

    if (parseFloat(preco) < 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O preço do produto não pode ser negativo.'
      });
    }

    if (parseInt(estoque, 10) < 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O estoque inicial não pode ser negativo.'
      });
    }

    const novoProduto = await Produto.create({
      nome,
      preco: parseFloat(preco),
      descricao: descricao || '',
      estoque: parseInt(estoque, 10)
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Produto cadastrado com sucesso.',
      dados: novoProduto
    });
  } catch (error) {
    console.error('[ms-produtos] Erro ao cadastrar produto:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao cadastrar produto.',
      erro: error.message
    });
  }
};

// GET /produtos - Lista todos os produtos
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      sucesso: true,
      total: produtos.length,
      dados: produtos
    });
  } catch (error) {
    console.error('[ms-produtos] Erro ao listar produtos:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao listar produtos.',
      erro: error.message
    });
  }
};

// GET /produtos/:id - Busca detalhes de um produto específico
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Produto com ID ${id} não foi encontrado.`
      });
    }

    return res.status(200).json({
      sucesso: true,
      dados: produto
    });
  } catch (error) {
    console.error('[ms-produtos] Erro ao buscar produto por ID:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao buscar produto.',
      erro: error.message
    });
  }
};

// PUT /produtos/:id - Atualiza dados cadastrais de um produto
exports.atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, descricao, estoque } = req.body;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Produto com ID ${id} não encontrado.`
      });
    }

    if (preco !== undefined && parseFloat(preco) < 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O preço não pode ser negativo.'
      });
    }

    if (estoque !== undefined && parseInt(estoque, 10) < 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O estoque não pode ser negativo.'
      });
    }

    await produto.update({
      nome: nome !== undefined ? nome : produto.nome,
      preco: preco !== undefined ? parseFloat(preco) : produto.preco,
      descricao: descricao !== undefined ? descricao : produto.descricao,
      estoque: estoque !== undefined ? parseInt(estoque, 10) : produto.estoque
    });

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Produto atualizado com sucesso.',
      dados: produto
    });
  } catch (error) {
    console.error('[ms-produtos] Erro ao atualizar produto:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao atualizar produto.',
      erro: error.message
    });
  }
};

// PATCH /produtos/:id/estoque - Ajuste atômico de estoque (ex: decremento na venda ou incremento no cancelamento)
exports.atualizarEstoque = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidadeDelta } = req.body; // pode ser negativo (venda) ou positivo (devolução/reposição)

    if (quantidadeDelta === undefined || typeof quantidadeDelta !== 'number') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O campo quantidadeDelta (número inteiro) é obrigatório.'
      });
    }

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Produto com ID ${id} não encontrado.`
      });
    }

    const novoEstoque = produto.estoque + quantidadeDelta;

    if (novoEstoque < 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: `Estoque insuficiente. Estoque atual: ${produto.estoque}, solicitado: ${Math.abs(quantidadeDelta)}.`
      });
    }

    produto.estoque = novoEstoque;
    await produto.save();

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Estoque atualizado com sucesso.',
      dados: {
        id: produto.id,
        nome: produto.nome,
        estoqueAnterior: produto.estoque - quantidadeDelta,
        estoqueAtual: produto.estoque
      }
    });
  } catch (error) {
    console.error('[ms-produtos] Erro ao alterar estoque:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao alterar estoque.',
      erro: error.message
    });
  }
};

// DELETE /produtos/:id - Exclui um produto
exports.deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: `Produto com ID ${id} não encontrado.`
      });
    }

    await produto.destroy();

    return res.status(200).json({
      sucesso: true,
      mensagem: `Produto ${id} removido com sucesso.`
    });
  } catch (error) {
    console.error('[ms-produtos] Erro ao remover produto:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao remover produto.',
      erro: error.message
    });
  }
};
