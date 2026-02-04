
import React, { useState } from 'react';
import { MOCK_AUDIT_LOGS } from '../../constants';

const AuditLogs: React.FC = () => {
  const [activeType, setActiveType] = useState<'all' | 'ai' | 'security'>('all');

  const filteredLogs = activeType === 'all' 
    ? MOCK_AUDIT_LOGS 
    : MOCK_AUDIT_LOGS.filter(l => l.type === activeType);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Audit Ledger</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Immutable system-wide event stream</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
          {['all', 'ai', 'security'].map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type as any)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase ${
                activeType === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border-slate-800">
        <div className="p-4 bg-slate-900/30 border-b border-slate-800 flex justify-between items-center">
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Filter by user, resource, or action..." 
              className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-4 text-xs font-mono focus:outline-none focus:border-indigo-500 w-80" 
            />
            <input type="date" className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-4 text-xs font-mono text-slate-500" />
          </div>
          <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Advanced Search <i className="fas fa-chevron-down ml-1"></i></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/50 text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Operation</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Result</th>
                <th className="px-6 py-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/30 transition-colors group">
                  <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                  <td className="px-6 py-4 text-slate-200 font-bold">{log.user}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400 text-[10px]">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{log.resource}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 ${log.result === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <i className={`fas ${log.result === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'} text-[10px]`}></i>
                      {log.result.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] text-slate-700 font-mono italic">0x{Math.random().toString(16).slice(2, 10)}...</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Security Alerts', val: 0, color: 'text-emerald-400' },
          { label: 'AI Review Pending', val: 12, color: 'text-indigo-400' },
          { label: 'Audit Storage (IPFS)', val: '42.1 GB', color: 'text-cyan-400' }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border-slate-800 flex flex-col justify-between h-32">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogs;
