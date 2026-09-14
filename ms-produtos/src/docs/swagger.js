const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Microserviço de Produtos (ms-produtos)',
    version: '1.0.0',
    description: 'Microsserviço responsável pelo catálogo e controle de inventário de produtos - DSW 3 (IFSP).'
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor Local'
    }
  ],
  tags: [
    {
      name: 'Produtos',
      description: 'Operações de catálogo e estoque'
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificação de saúde do serviço',
        responses: {
          200: {
            description: 'Serviço operacional'
          }
        }
      }
    },
    '/produtos': {
      post: {
        tags: ['Produtos'],
        summary: 'Cadastra um novo produto',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nome', 'preco', 'estoque'],
                properties: {
                  nome: { type: 'string', example: 'Teclado Mecânico Keychron K2' },
                  preco: { type: 'number', format: 'float', example: 650.00 },
                  descricao: { type: 'string', example: 'Switches Gateron Brown sem fio' },
                  estoque: { type: 'integer', example: 15 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Produto cadastrado com sucesso' },
          400: { description: 'Dados inválidos' }
        }
      },
      get: {
        tags: ['Produtos'],
        summary: 'Lista todos os produtos cadastrados',
        responses: {
          200: {
            description: 'Lista de produtos retornada com sucesso'
          }
        }
      }
    },
    '/produtos/{id}': {
      get: {
        tags: ['Produtos'],
        summary: 'Busca detalhes de um produto específico',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Detalhes do produto' },
          404: { description: 'Produto não encontrado' }
        }
      },
      put: {
        tags: ['Produtos'],
        summary: 'Atualiza um produto existente',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  preco: { type: 'number' },
                  descricao: { type: 'string' },
                  estoque: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Produto atualizado' },
          404: { description: 'Produto não encontrado' }
        }
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Remove um produto',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Produto excluído' },
          404: { description: 'Produto não encontrado' }
        }
      }
    },
    '/produtos/{id}/estoque': {
      patch: {
        tags: ['Produtos'],
        summary: 'Atualiza a quantidade de estoque por delta (+ ou -)',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quantidadeDelta'],
                properties: {
                  quantidadeDelta: { type: 'integer', example: -1, description: 'Valor positivo para acréscimo ou negativo para dedução' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Estoque atualizado' },
          400: { description: 'Estoque insuficiente ou dados inválidos' },
          404: { description: 'Produto não encontrado' }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
