import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-3xl border-indigo-500/10 flex flex-col justify-center items-center text-center space-y-4 bg-gradient-to-br from-indigo-600/[0.05] to-transparent">
          <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center border border-indigo-500/20 mb-4 animate-pulse-slow">
            <i className="fas fa-ghost text-5xl text-indigo-400 glow-purple"></i>
          </div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Sovereign State: Optimal</h2>
          <p className="text-slate-400 leading-relaxed max-w-md text-sm">
            All system layers are operating within verified governance boundaries. 
            No unauthorized access attempts detected in last 24 cycles.
          </p>
          <div className="flex gap-6 pt-6">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Trust Matrix</p>
              <p className="text-xl font-bold text-emerald-400 font-mono">L5 SECURE</p>
            </div>
            <div className="w-px h-10 bg-slate-800"></div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Session Protocol</p>
              <p className="text-xl font-bold text-indigo-400 font-mono">TLS 1.3+</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Uptime (Infrastructure)', val: '142d 12h 4m', icon: 'fa-clock', color: 'text-slate-400' },
            { label: 'Governance Drift', val: '0.00%', icon: 'fa-scale-balanced', color: 'text-emerald-400' },
            { label: 'Active AGA Nodes', val: '1,204', icon: 'fa-brain', color: 'text-indigo-400' },
            { label: 'Memory Persistence', val: '99.99%', icon: 'fa-hdd', color: 'text-cyan-400' }
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-3xl border-slate-800 hover:border-indigo-500/30 transition-all group flex flex-col justify-between">
              <i className={`fas ${stat.icon} ${stat.color} text-2xl mb-4 group-hover:scale-110 transition-transform`}></i>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold font-mono text-slate-100">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-8 rounded-3xl border-slate-800 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <i className="fas fa-layer-group text-indigo-500"></i> Architecture Integrity Map
          </h3>
          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">ALL_SYSTEMS_OPTIMAL</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {['DATA', 'MEMORY', 'IDENTITY', 'GOVERNANCE', 'AI', 'APPLICATION'].map((layer, i) => (
            <div key={layer} className="space-y-4">
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden relative">
                <div className="absolute inset-0 bg-indigo-500 opacity-20"></div>
                <div className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 w-full animate-pulse shadow-[0_0_12px_rgba(79,70,229,0.5)]"></div>
              </div>
              <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-mono font-bold text-slate-500">L{i + 1}</p>
                <p className="text-[10px] font-mono font-bold text-slate-200">{layer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400">
            <i className="fas fa-shield-halved"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Continuous Audit Active</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase">Last integrity check: 14ms ago • Identity sync: OK • Memory cluster: OK</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;