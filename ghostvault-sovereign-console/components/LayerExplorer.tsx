
import React from 'react';
import { ArchitectureLayer } from '../types';
import { ARCHITECTURE_DATA } from '../constants';

interface LayerExplorerProps {
  layer: ArchitectureLayer;
}

const LayerExplorer: React.FC<LayerExplorerProps> = ({ layer }) => {
  const data = ARCHITECTURE_DATA.find(d => d.id === layer);

  if (!data) return null;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          {data.name}
          <span className="text-xs font-mono px-2 py-1 bg-slate-800 text-cyan-400 rounded border border-slate-700">L{ARCHITECTURE_DATA.indexOf(data) + 1}</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl">{data.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-500 flex items-center gap-2">
            <i className="fas fa-microchip"></i> Core Components
          </h3>
          <ul className="space-y-3">
            {data.components.map((comp, i) => (
              <li key={i} className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-500 transition-colors"></div>
                <span className="text-slate-200 font-mono text-sm">{comp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
            <i className="fas fa-shield-check"></i> Sovereign Principles
          </h3>
          <ul className="space-y-3">
            {data.principles.map((p, i) => (
              <li key={i} className="flex items-center gap-3">
                <i className="fas fa-check-circle text-emerald-500/50 text-xs"></i>
                <span className="text-slate-300 italic">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass p-6 rounded-xl border-cyan-500/20 bg-cyan-500/[0.02]">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Operational Insight</h3>
        <p className="text-slate-300 leading-relaxed font-mono text-sm">
          System integrity check for {data.name.toLowerCase()} shows all components operating within sovereign boundaries. 
          No governance drift detected in last 24 cycles. Administrative oversight is required for any logic modification 
          at this layer to prevent cascading policy violations.
        </p>
      </div>
    </div>
  );
};

export default LayerExplorer;
