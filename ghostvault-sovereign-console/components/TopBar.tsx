import React from 'react';
import { MOCK_TENANTS } from '../constants';
import { Tenant } from '../types';

interface TopBarProps {
  currentTenant: Tenant;
  onTenantChange: (tenant: Tenant) => void;
  onToggleAga: () => void;
  agaOpen: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ currentTenant, onTenantChange, onToggleAga, agaOpen }) => {
  return (
    <header className="h-16 glass border-b border-slate-800 flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center glow-purple">
            <i className="fas fa-ghost text-white text-sm"></i>
          </div>
          <h1 className="text-lg font-bold tracking-tighter text-white">GhostVault <span className="text-slate-500 font-light">Console</span></h1>
        </div>

        <div className="h-8 w-px bg-slate-800"></div>

        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
            <i className="fas fa-hospital text-xs text-indigo-400"></i>
            <span className="text-xs font-semibold text-slate-200">{currentTenant.name}</span>
            <i className="fas fa-chevron-down text-[10px] text-slate-500"></i>
          </button>
          
          <div className="absolute top-full left-0 mt-2 w-56 glass rounded-xl border-slate-800 hidden group-hover:block z-50 overflow-hidden shadow-2xl">
            {MOCK_TENANTS.map(t => (
              <button 
                key={t.id}
                onClick={() => onTenantChange(t)}
                className="w-full px-4 py-3 text-left text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>{t.name}</span>
                {t.id === currentTenant.id && <i className="fas fa-check text-[10px]"></i>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleAga}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
            agaOpen 
            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 glow-cyan' 
            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${agaOpen ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`}></div>
          Ghost-AGA
        </button>

        <div className="flex items-center gap-3 ml-2 border-l border-slate-800 pl-4">
          <button className="text-slate-400 hover:text-slate-200"><i className="fas fa-bell"></i></button>
          <button className="text-slate-400 hover:text-slate-200"><i className="fas fa-gear"></i></button>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;