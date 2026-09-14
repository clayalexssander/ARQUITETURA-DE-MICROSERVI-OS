import React from 'react';
import { Package, ShoppingCart, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { deleteProduto } from '../services/api';

export default function CatalogoProdutos({ 
  produtos, 
  carregando, 
  erro, 
  onSelecionarProduto, 
  onAbrirModalCadastro,
  onRecarregar
}) {
  const handleRemover = async (id, nome) => {
    if (window.confirm(`Deseja realmente remover o produto "${nome}"?`)) {
      try {
        await deleteProduto(id);
        onRecarregar();
      } catch (err) {
        alert('Erro ao remover produto: ' + (err.response?.data?.mensagem || err.message));
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <Package size={22} color="#2563eb" />
          Catálogo de Produtos
        </h2>
        <button className="btn btn-primary" onClick={onAbrirModalCadastro}>
          <Plus size={16} />
          Novo Produto
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
          Carregando catálogo de produtos...
        </div>
      ) : produtos.length === 0 && !erro ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
          Nenhum produto cadastrado no momento. Cadastre seu primeiro produto!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {produtos.map((p) => {
            const semEstoque = p.estoque <= 0;
            const estoqueBaixo = p.estoque > 0 && p.estoque <= 5;

            return (
              <div 
                key={p.id} 
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                      {p.nome}
                    </h3>
                    <button 
                      onClick={() => handleRemover(p.id, p.nome)}
                      title="Excluir produto"
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#64748b', minHeight: '38px', marginBottom: '0.75rem' }}>
                    {p.descricao || 'Sem descrição cadastrada.'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Preço Unitário</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2563eb' }}>
                        {Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>

                    <div>
                      {semEstoque ? (
                        <span className="badge badge-danger">Esgotado</span>
                      ) : estoqueBaixo ? (
                        <span className="badge badge-warning">{p.estoque} un. restantes</span>
                      ) : (
                        <span className="badge badge-success">{p.estoque} em estoque</span>
                      )}
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    onClick={() => onSelecionarProduto(p)}
                    disabled={semEstoque}
                  >
                    <ShoppingCart size={16} />
                    {semEstoque ? 'Sem Estoque' : 'Comprar Item'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
