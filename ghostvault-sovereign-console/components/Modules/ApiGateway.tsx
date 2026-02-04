
import React from 'react';
import { MOCK_API_ENDPOINTS } from '../../constants';

const ApiGateway: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">API Gateway</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Interface management and rate limiting</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-500">
          Issue API Key
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-slate-900/30">
          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Endpoint Health</h3>
        </div>
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/50 text-slate-500 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Endpoint</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Rate Limit</th>
              <th className="px-6 py-4">Usage (24h)</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {MOCK_API_ENDPOINTS.map(ep => (
              <tr key={ep.id} className="hover:bg-indigo-600/5 transition-colors group">
                <td className="px-6 py-4 text-slate-200 font-bold">{ep.path}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    ep.method === 'POST' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {ep.method}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{ep.rate_limit}</td>
                <td className="px-6 py-4 text-slate-300">{ep.usage.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-2xl border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Active API Keys</h3>
            <span className="text-[10px] text-slate-600">Total: 42</span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'TRINITY_MOBILE_APP', key: 'gv_live_...x42a', usage: 'High' },
              { name: 'CLINIC_OS_INTEGRATION', key: 'gv_live_...9p1q', usage: 'Medium' },
              { name: 'AUDIT_COLLECTOR', key: 'gv_live_...m3s2', usage: 'Low' }
            ].map((k, i) => (
              <div key={i} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex justify-between items-center group">
                <div>
                  <p className="text-xs font-bold text-slate-200">{k.name}</p>
                  <code className="text-[10px] text-slate-500">{k.key}</code>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold ${k.usage === 'High' ? 'text-amber-400' : 'text-slate-500'}`}>{k.usage}</span>
                  <button className="text-slate-700 hover:text-rose-500 transition-colors"><i className="fas fa-trash-can text-xs"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-2xl border-slate-800 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Global Rate Limiting</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>PEAK CAPACITY</span>
                <span>84%</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-indigo-500 w-[84%]"></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
              * Current global rate limit is set to 10k requests/min. Burst allowance is active. 
              DDoS mitigation layer operating at Layer 7.
            </p>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300">Traffic Shaping</button>
              <button className="flex-1 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-300">IP Blacklist</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiGateway;
