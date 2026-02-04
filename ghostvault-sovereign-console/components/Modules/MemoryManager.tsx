import React from 'react';

const MemoryManager: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Memory Manager</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Cognitive fabric orchestration layer</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800">
            Export Nebula Data
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-500">
            Manual Memory Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Memories', val: '1,240,512', color: 'text-indigo-400' },
          { label: 'Nebulae (Clusters)', val: '842', color: 'text-cyan-400' },
          { label: 'Active Domains', val: '5', color: 'text-emerald-400' },
          { label: 'Latency (Avg)', val: '24ms', color: 'text-amber-400' }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden border-slate-800">
        <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex gap-6">
            {['AGA_MEMORY', 'CLINICAL', 'ORG', 'AI_INTERACTION'].map((tab, i) => (
              <button key={tab} className={`text-xs font-bold tracking-widest uppercase ${i === 0 ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input type="text" placeholder="Search memories..." className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/30 text-slate-500 uppercase border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Memory ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Valence</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="hover:bg-indigo-600/5 transition-colors group">
                  <td className="px-6 py-4 text-slate-400">MEM-{821 + i}</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300">Emotional</span></td>
                  <td className="px-6 py-4 text-rose-400">-0.42</td>
                  <td className="px-6 py-4 text-slate-500">2024-03-20 12:44:21</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-600 hover:text-indigo-400"><i className="fas fa-eye"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemoryManager;