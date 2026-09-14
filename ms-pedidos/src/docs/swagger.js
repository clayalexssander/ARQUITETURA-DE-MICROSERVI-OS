const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Microserviço de Pedidos (ms-pedidos)',
    version: '1.0.0',
    description: 'Microsserviço responsável pelo ciclo de vida dos pedidos com Snapshot Pattern - DSW 3 (IFSP).'
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Servidor Local'
    }
  ],
  tags: [
    {
      name: 'Pedidos',
      description: 'Operações de pedidos de clientes'
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Verificação de saúde do serviço',
        responses: {
          200: { description: 'Serviço operacional' }
        }
      }
    },
    '/pedidos': {
      post: {
        tags: ['Pedidos'],
        summary: 'Cria um novo pedido (Valida produto, estoque e grava snapshot)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['produtoId', 'quantidade'],
                properties: {
                  produtoId: { type: 'integer', example: 1 },
                  quantidade: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Pedido criado com sucesso' },
          400: { description: 'Estoque insuficiente ou dados inválidos' },
          404: { description: 'Produto não encontrado no catálogo' },
          503: { description: 'Microserviço de produtos indisponível' }
        }
      },
      get: {
        tags: ['Pedidos'],
        summary: 'Lista histórico de todos os pedidos',
        responses: {
          200: { description: 'Lista de pedidos' }
        }
      }
    },
    '/pedidos/{id}': {
      get: {
        tags: ['Pedidos'],
        summary: 'Busca detalhes de um pedido específico',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Detalhes do pedido' },
          404: { description: 'Pedido não encontrado' }
        }
      }
    },
    '/pedidos/{id}/cancelar': {
      patch: {
        tags: ['Pedidos'],
        summary: 'Cancela um pedido e devolve o estoque ao produto',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Pedido cancelado com sucesso' },
          400: { description: 'Pedido já se encontra cancelado' },
          404: { description: 'Pedido não encontrado' }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
