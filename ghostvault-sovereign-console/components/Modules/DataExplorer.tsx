
import React, { useState } from 'react';

const DataExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TABLES' | 'QUERY' | 'SCHEMA'>('TABLES');

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Data Explorer</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Direct sovereign database oversight</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
          {['TABLES', 'QUERY', 'SCHEMA'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'TABLES' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">System Tables</h3>
            <div className="space-y-1">
              {['patients', 'aga_memory', 'clinical_records', 'audit_events', 'tenants', 'auth_users'].map(table => (
                <button 
                  key={table}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-900/50 text-slate-400 hover:text-white group border border-transparent hover:border-slate-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-table text-slate-700 group-hover:text-indigo-500"></i>
                    <span className="text-xs font-mono">{table}</span>
                  </div>
                  <span className="text-[10px] text-slate-700">842 rows</span>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 glass rounded-2xl border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900/30 border-b border-slate-800 flex justify-between items-center">
              <p className="text-xs font-bold text-slate-200 font-mono tracking-tighter uppercase">SELECT * FROM patients LIMIT 10</p>
              <div className="flex gap-2">
                <button className="text-slate-500 hover:text-white p-1"><i className="fas fa-filter text-xs"></i></button>
                <button className="text-slate-500 hover:text-white p-1"><i className="fas fa-download text-xs"></i></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-900/50 text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">UUID</th>
                    <th className="px-4 py-3">FIRST_NAME</th>
                    <th className="px-4 py-3">LAST_NAME</th>
                    <th className="px-4 py-3">TENANT_ID</th>
                    <th className="px-4 py-3">LINKED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="hover:bg-indigo-600/5 text-slate-400">
                      <td className="px-4 py-3">p-{1000 + i}</td>
                      <td className="px-4 py-3 text-slate-200">Patient_{i}</td>
                      <td className="px-4 py-3 text-slate-200">Doe_{i}</td>
                      <td className="px-4 py-3">t-01</td>
                      <td className="px-4 py-3"><i className="fas fa-check text-emerald-500/50"></i></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'QUERY' && (
        <div className="glass rounded-2xl border-slate-800 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 bg-slate-900/30 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sovereign SQL Console</h3>
            <span className="text-[10px] text-emerald-500 font-mono">ENCRYPTED_SESSION: ACTIVE</span>
          </div>
          <div className="flex-1 bg-slate-950 p-6 font-mono text-sm">
            <textarea 
              className="w-full h-full bg-transparent border-none focus:outline-none resize-none text-indigo-400 caret-white"
              defaultValue={`-- Query memory patterns for tenant t-01
SELECT 
  count(*), 
  memory_type 
FROM 
  aga_memory 
WHERE 
  tenant_id = 't-01' 
GROUP BY 
  memory_type;`}
            />
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-3">
            <button className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white">Save Query</button>
            <button className="px-6 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-500 shadow-lg glow-purple">Execute Query</button>
          </div>
        </div>
      )}

      {activeTab === 'SCHEMA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'patients', cols: ['id: UUID', 'tenant_id: UUID', 'first_name: STRING', 'last_name: STRING', 'dob: DATE'] },
            { name: 'aga_memory', cols: ['id: UUID', 'user_id: UUID', 'type: ENUM', 'content: TEXT', 'valence: FLOAT'] },
            { name: 'clinical_records', cols: ['id: UUID', 'patient_id: UUID', 'author_id: UUID', 'data: JSONB'] }
          ].map((table, i) => (
            <div key={i} className="glass p-6 rounded-2xl border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-slate-800 pb-2 flex justify-between">
                {table.name}
                <i className="fas fa-network-wired text-slate-700"></i>
              </h3>
              <ul className="space-y-2">
                {table.cols.map((col, j) => (
                  <li key={j} className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-slate-300">{col.split(': ')[0]}</span>
                    <span className="text-slate-600">{col.split(': ')[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataExplorer;
