import axios from 'axios';

const PRODUTOS_BASE_URL = import.meta.env.VITE_PRODUTOS_API || 'http://localhost:3001';
const PEDIDOS_BASE_URL = import.meta.env.VITE_PEDIDOS_API || 'http://localhost:3002';

export const produtosApi = axios.create({
  baseURL: PRODUTOS_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const pedidosApi = axios.create({
  baseURL: PEDIDOS_BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Serviços de Produtos
export const getProdutos = async () => {
  const response = await produtosApi.get('/produtos');
  return response.data;
};

export const getProdutoPorId = async (id) => {
  const response = await produtosApi.get(`/produtos/${id}`);
  return response.data;
};

export const createProduto = async (produto) => {
  const response = await produtosApi.post('/produtos', produto);
  return response.data;
};

export const deleteProduto = async (id) => {
  const response = await produtosApi.delete(`/produtos/${id}`);
  return response.data;
};

// Serviços de Pedidos
export const getPedidos = async () => {
  const response = await pedidosApi.get('/pedidos');
  return response.data;
};

export const createPedido = async (dadosPedido) => {
  const response = await pedidosApi.post('/pedidos', dadosPedido);
  return response.data;
};

export const cancelarPedido = async (id) => {
  const response = await pedidosApi.patch(`/pedidos/${id}/cancelar`);
  return response.data;
};

// Checagem de Saúde (Resiliência)
export const checkHealth = async () => {
  const status = {
    produtos: false,
    pedidos: false
  };

  try {
    await produtosApi.get('/health');
    status.produtos = true;
  } catch (e) {
    status.produtos = false;
  }

  try {
    await pedidosApi.get('/health');
    status.pedidos = true;
  } catch (e) {
    status.pedidos = false;
  }

  return status;
};
