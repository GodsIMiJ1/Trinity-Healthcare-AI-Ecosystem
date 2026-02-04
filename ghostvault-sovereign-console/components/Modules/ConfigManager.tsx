
import React from 'react';
import { MOCK_POLICIES } from '../../constants';

const ConfigManager: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Config Manager</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Sovereign OS orchestration and safety guardrails</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800">
          Restore Backup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass rounded-2xl border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/30">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">System Parameters</h3>
          </div>
          <div className="p-6 space-y-6">
            {[
              { label: 'Vault Sovereignty Lock', val: true, type: 'toggle' },
              { label: 'Auto-Backup Frequency', val: 'Hourly', type: 'select' },
              { label: 'Session Timeout (m)', val: 15, type: 'number' },
              { label: 'IPFS Audit Sync', val: true, type: 'toggle' }
            ].map((cfg, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs text-slate-300">{cfg.label}</span>
                {cfg.type === 'toggle' ? (
                  <button className={`w-10 h-5 rounded-full relative transition-colors ${cfg.val ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${cfg.val ? 'right-1' : 'left-1'}`}></div>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-indigo-400 font-mono">{cfg.val}</span>
                )}
              </div>
            ))}
            <div className="pt-6 border-t border-slate-800/50">
              <button className="w-full py-3 bg-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg glow-purple">Apply Changes</button>
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Governance Policies</h3>
            <button className="text-[10px] text-indigo-400 font-bold">+ Define Policy</button>
          </div>
          <div className="p-6 space-y-4">
            {MOCK_POLICIES.map(pol => (
              <div key={pol.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2 group hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-200">{pol.name}</h4>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                    pol.status === 'enforced' ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'
                  }`}>
                    {pol.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">{pol.description}</p>
                <div className="pt-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[10px] text-slate-500 hover:text-white">Edit</button>
                  <button className="text-[10px] text-slate-500 hover:text-rose-500">Disable</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass p-8 rounded-2xl border-slate-800 space-y-6 bg-gradient-to-br from-rose-500/[0.03] to-transparent">
        <h3 className="text-sm font-bold uppercase tracking-widest text-rose-500 flex items-center gap-2">
          <i className="fas fa-triangle-exclamation"></i> Emergency Handoff Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-300">Crisis Keywords</p>
            <div className="flex flex-wrap gap-2">
              {['harm', 'emergency', 'distress', 'critical'].map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-500 font-mono">"{tag}"</span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-300">Escalation Threshold</p>
            <div className="flex items-center gap-4">
              <input type="range" className="flex-1 accent-rose-500" defaultValue={85} />
              <span className="text-sm font-bold text-rose-400 font-mono">0.85</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-300">Notification Channels</p>
            <div className="flex gap-4">
              <i className="fas fa-envelope text-slate-500 hover:text-rose-400 cursor-pointer"></i>
              <i className="fas fa-comment-sms text-rose-500 cursor-pointer"></i>
              <i className="fas fa-pager text-slate-500 hover:text-rose-400 cursor-pointer"></i>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConfigManager;
