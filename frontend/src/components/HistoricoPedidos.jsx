import React from 'react';
import { History, AlertTriangle, XCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { cancelarPedido } from '../services/api';

export default function HistoricoPedidos({ 
  pedidos, 
  carregando, 
  erro, 
  onRecarregar 
}) {
  const handleCancelar = async (id) => {
    if (window.confirm(`Tem certeza de que deseja cancelar o Pedido #${id}? O estoque correspondente será estornado.`)) {
      try {
        await cancelarPedido(id);
        onRecarregar();
      } catch (err) {
        alert('Erro ao cancelar pedido: ' + (err.response?.data?.mensagem || err.message));
      }
    }
  };

  const formatarData = (dataIso) => {
    try {
      const data = new Date(dataIso);
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dataIso;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <History size={22} color="#2563eb" />
          Histórico de Pedidos
        </h2>
        <button className="btn btn-secondary" onClick={onRecarregar} disabled={carregando}>
          <RefreshCw size={14} className={carregando ? 'spin' : ''} />
          Atualizar
        </button>
      </div>

      {erro && (
        <div className="alert alert-danger">
          <AlertTriangle size={20} />
          <div>
            <strong>Falha de Comunicação:</strong>
            <p>{erro}</p>
          </div>
        </div>
      )}

      {carregando ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
          Carregando histórico de pedidos...
        </div>
      ) : pedidos.length === 0 && !erro ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
          Nenhum pedido realizado ainda. Faça sua primeira compra acima!
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto (Snapshot)</th>
                <th>Preço Unit.</th>
                <th>Qtd</th>
                <th>Valor Total</th>
                <th>Data do Pedido</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((ped) => {
                const isRealizado = ped.status === 'REALIZADO';

                return (
                  <tr key={ped.id}>
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>
                      #{ped.id}
                    </td>
                    <td>
                      <strong>{ped.nomeProduto}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Ref. Produto #{ped.produtoId}
                      </div>
                    </td>
                    <td>
                      {Number(ped.precoUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {ped.quantidade}
                    </td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>
                      {Number(ped.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {formatarData(ped.dataPedido || ped.createdAt)}
                    </td>
                    <td>
                      {isRealizado ? (
                        <span className="badge badge-success">
                          <CheckCircle size={12} />
                          Realizado
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <XCircle size={12} />
                          Cancelado
                        </span>
                      )}
                    </td>
                    <td>
                      {isRealizado ? (
                        <button 
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleCancelar(ped.id)}
                        >
                          Cancelar
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
