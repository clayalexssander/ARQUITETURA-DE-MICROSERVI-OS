import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CatalogoProdutos from './components/CatalogoProdutos';
import FormularioPedido from './components/FormularioPedido';
import HistoricoPedidos from './components/HistoricoPedidos';
import ModalNovoProduto from './components/ModalNovoProduto';
import { getProdutos, getPedidos, checkHealth } from './services/api';
import { ShoppingBag, Package, AlertOctagon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('loja'); // 'loja' ou 'historico'
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);

  // Estados de carregamento e resiliência
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [erroProdutos, setErroProdutos] = useState('');
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  const [erroPedidos, setErroPedidos] = useState('');
  const [health, setHealth] = useState({ produtos: false, pedidos: false });

  // Carregar produtos
  const carregarProdutos = useCallback(async () => {
    try {
      setCarregandoProdutos(true);
      setErroProdutos('');
      const res = await getProdutos();
      if (res && res.dados) {
        setProdutos(res.dados);
      }
    } catch (err) {
      console.warn('[Frontend] Falha ao consultar ms-produtos:', err.message);
      setErroProdutos('Não foi possível conectar ao Microserviço de Produtos (Porta 3001). Verifique se o serviço está ativo.');
    } finally {
      setCarregandoProdutos(false);
    }
  }, []);

  // Carregar pedidos
  const carregarPedidos = useCallback(async () => {
    try {
      setCarregandoPedidos(true);
      setErroPedidos('');
      const res = await getPedidos();
      if (res && res.dados) {
        setPedidos(res.dados);
      }
    } catch (err) {
      console.warn('[Frontend] Falha ao consultar ms-pedidos:', err.message);
      setErroPedidos('Não foi possível conectar ao Microserviço de Pedidos (Porta 3002). Verifique se o serviço está ativo.');
    } finally {
      setCarregandoPedidos(false);
    }
  }, []);

  // Monitoramento de saúde periódico
  const atualizarHealth = useCallback(async () => {
    const status = await checkHealth();
    setHealth(status);
  }, []);

  useEffect(() => {
    carregarProdutos();
    carregarPedidos();
    atualizarHealth();

    // Polling a cada 10s para status de saúde dos microserviços
    const interval = setInterval(atualizarHealth, 10000);
    return () => clearInterval(interval);
  }, [carregarProdutos, carregarPedidos, atualizarHealth]);

  const handlePedidoRealizado = () => {
    // Atualiza catálogo (pois o estoque diminuiu) e atualiza histórico
    carregarProdutos();
    carregarPedidos();
  };

  const handleSelecionarProduto = (prod) => {
    setProdutoSelecionado(prod);
    setActiveTab('loja');
    // Rola a tela até o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar health={health} onRefresh={() => { atualizarHealth(); carregarProdutos(); carregarPedidos(); }} />

      <main className="container">
        {/* Banner de Resiliência caso algum serviço esteja offline */}
        {(!health.produtos || !health.pedidos) && (
          <div className="alert alert-warning" style={{ alignItems: 'center' }}>
            <AlertOctagon size={20} />
            <div>
              <strong>Aviso de Resiliência de Arquitetura:</strong>
              {!health.produtos && !health.pedidos && ' Ambos os microserviços (Produtos e Pedidos) estão temporariamente indisponíveis.'}
              {!health.produtos && health.pedidos && ' O Microserviço de Produtos está inacessível. Pedidos não poderão ser validados.'}
              {health.produtos && !health.pedidos && ' O Microserviço de Pedidos está inacessível. O catálogo de produtos continua navegável.'}
            </div>
          </div>
        )}

        {/* Abas de Navegação */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'loja' ? 'active' : ''}`}
            onClick={() => setActiveTab('loja')}
          >
            <Package size={18} />
            Catálogo & Compras
          </button>
          <button 
            className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => { setActiveTab('historico'); carregarPedidos(); }}
          >
            <ShoppingBag size={18} />
            Histórico de Pedidos ({pedidos.length})
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'loja' && (
          <div className="grid-2">
            <div>
              <FormularioPedido 
                produtos={produtos}
                produtoSelecionado={produtoSelecionado}
                onPedidoRealizado={handlePedidoRealizado}
              />
            </div>

            <div>
              <CatalogoProdutos 
                produtos={produtos}
                carregando={carregandoProdutos}
                erro={erroProdutos}
                onSelecionarProduto={handleSelecionarProduto}
                onAbrirModalCadastro={() => setModalProdutoAberto(true)}
                onRecarregar={carregarProdutos}
              />
            </div>
          </div>
        )}

        {activeTab === 'historico' && (
          <div>
            <HistoricoPedidos 
              pedidos={pedidos}
              carregando={carregandoPedidos}
              erro={erroPedidos}
              onRecarregar={carregarPedidos}
            />
          </div>
        )}
      </main>

      {/* Modal para Cadastro de Produto */}
      <ModalNovoProduto 
        isOpen={modalProdutoAberto}
        onClose={() => setModalProdutoAberto(false)}
        onProdutoCriado={() => {
          carregarProdutos();
          atualizarHealth();
        }}
      />
    </div>
  );
}
