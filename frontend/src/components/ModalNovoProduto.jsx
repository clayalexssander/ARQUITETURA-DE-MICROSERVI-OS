import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle } from 'lucide-react';
import { createProduto } from '../services/api';

export default function ModalNovoProduto({ isOpen, onClose, onProdutoCriado }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estoque, setEstoque] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !preco || !estoque) {
      setErro('Por favor, preencha nome, preço e quantidade em estoque.');
      return;
    }

    if (parseFloat(preco) < 0 || parseInt(estoque, 10) < 0) {
      setErro('Preço e estoque não podem ser negativos.');
      return;
    }

    try {
      setCarregando(true);
      await createProduto({
        nome: nome.trim(),
        preco: parseFloat(preco),
        descricao: descricao.trim(),
        estoque: parseInt(estoque, 10)
      });

      // Limpar formulário e fechar
      setNome('');
      setPreco('');
      setDescricao('');
      setEstoque('');
      onProdutoCriado();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.mensagem || err.message || 'Falha ao cadastrar produto.';
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="card-title">
            <PlusCircle size={20} color="#2563eb" />
            Cadastrar Novo Produto
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {erro && (
              <div className="alert alert-danger">
                <AlertCircle size={18} />
                <span>{erro}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Nome do Produto *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Teclado Mecânico RGB" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preço Unitário (R$) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  className="form-input" 
                  placeholder="0.00" 
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estoque Inicial *</label>
                <input 
                  type="number" 
                  min="0"
                  className="form-input" 
                  placeholder="10" 
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Breve descrição sobre as características do item"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={carregando}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
