import React from 'react';
import { Layers, Server, Activity } from 'lucide-react';

export default function Navbar({ health, onRefresh }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <Layers className="icon" size={26} color="#2563eb" />
          <span>Microserviços DSW 3</span>
          <span className="brand-badge">IFSP • 5º Semestre</span>
        </div>

        <div className="status-pills">
          <div className="status-pill" title="Microserviço de Produtos (Porta 3001)">
            <Server size={14} color="#64748b" />
            <span>ms-produtos:</span>
            <span className={`status-dot ${health.produtos ? 'online' : 'offline'}`} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: health.produtos ? '#10b981' : '#ef4444' }}>
              {health.produtos ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="status-pill" title="Microserviço de Pedidos (Porta 3002)">
            <Server size={14} color="#64748b" />
            <span>ms-pedidos:</span>
            <span className={`status-dot ${health.pedidos ? 'online' : 'offline'}`} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: health.pedidos ? '#10b981' : '#ef4444' }}>
              {health.pedidos ? 'Online' : 'Offline'}
            </span>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} 
            onClick={onRefresh}
            title="Atualizar status dos microserviços"
          >
            <Activity size={14} />
            Checar Conexão
          </button>
        </div>
      </div>
    </header>
  );
}
