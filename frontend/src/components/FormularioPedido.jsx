import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { createPedido } from '../services/api';

export default function FormularioPedido({ 
  produtos, 
  produtoSelecionado, 
  onPedidoRealizado 
}) {
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  // Atualiza campo quando um produto é clicado no catálogo
  useEffect(() => {
    if (produtoSelecionado && produtoSelecionado.id) {
      setProdutoId(String(produtoSelecionado.id));
      setQuantidade(1);
      setMensagemSucesso('');
      setMensagemErro('');
    }
  }, [produtoSelecionado]);

  const produtoAtual = produtos.find(p => String(p.id) === String(produtoId));
  const precoCalculado = produtoAtual ? (parseFloat(produtoAtual.preco) * (parseInt(quantidade, 10) || 0)) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemSucesso('');
    setMensagemErro('');

    if (!produtoId) {
      setMensagemErro('Por favor, selecione um produto para realizar o pedido.');
      return;
    }

    const qtd = parseInt(quantidade, 10);
    if (!qtd || qtd <= 0) {
      setMensagemErro('A quantidade deve ser maior que zero.');
      return;
    }

    if (produtoAtual && qtd > produtoAtual.estoque) {
      setMensagemErro(`Estoque insuficiente! Disponível: ${produtoAtual.estoque}, solicitado: ${qtd}.`);
      return;
    }

    try {
      setCarregando(true);
      const res = await createPedido({
        produtoId: parseInt(produtoId, 10),
        quantidade: qtd
      });

      setMensagemSucesso(
        `Pedido #${res.dados?.id || ''} efetuado com sucesso! Snapshot gravado com o valor de ${
          Number(res.dados?.valorTotal || precoCalculado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        }.`
      );

      setQuantidade(1);
      if (onPedidoRealizado) {
        onPedidoRealizado();
      }
    } catch (err) {
      const msg = err.response?.data?.mensagem || err.message || 'Erro ao comunicar com o Microserviço de Pedidos.';
      setMensagemErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <ShoppingBag size={22} color="#2563eb" />
          Realizar Novo Pedido
        </h2>
      </div>

      {mensagemSucesso && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {mensagemErro && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{mensagemErro}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Selecionar Produto do Catálogo *</label>
          <select 
            className="form-select"
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            required
          >
            <option value="">-- Escolha um item disponível --</option>
            {produtos.map(p => (
              <option key={p.id} value={p.id} disabled={p.estoque <= 0}>
                {p.nome} — {Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} {p.estoque <= 0 ? '(Esgotado)' : `(${p.estoque} em estoque)`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Quantidade de Itens *</label>
          <input 
            type="number"
            min="1"
            max={produtoAtual ? produtoAtual.estoque : 9999}
            className="form-input"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
          {produtoAtual && (
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Estoque atual disponível: <strong>{produtoAtual.estoque} unidades</strong>
            </small>
          )}
        </div>

        {/* Painel com Snapshot Financeiro e Resumo do Pedido */}
        <div 
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Preço Unitário (Snapshot):</span>
            <span style={{ fontWeight: 600 }}>
              {produtoAtual 
                ? Number(produtoAtual.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                : 'R$ 0,00'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Quantidade:</span>
            <span style={{ fontWeight: 600 }}>{quantidade || 0} un.</span>
          </div>

          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              borderTop: '1px dashed var(--border)', 
              paddingTop: '0.5rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#1e293b'
            }}
          >
            <span>Total Previsto:</span>
            <span style={{ color: '#2563eb' }}>
              {Number(precoCalculado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '0.75rem' }}
          disabled={carregando || !produtoId || (produtoAtual && produtoAtual.estoque <= 0)}
        >
          {carregando ? (
            <>
              <RefreshCw className="spin" size={16} />
              Processando e Gravando Snapshot...
            </>
          ) : (
            'Confirmar e Finalizar Pedido'
          )}
        </button>
      </form>
    </div>
  );
}
