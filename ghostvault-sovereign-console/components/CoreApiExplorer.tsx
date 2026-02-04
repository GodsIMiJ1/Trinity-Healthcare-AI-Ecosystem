
import React, { useState } from 'react';
import { Patient, AGAMemory, AuditEvent } from '../types';

// Updated MOCK_PATIENTS to satisfy the Patient interface requirements
const MOCK_PATIENTS: Patient[] = [
  { 
    id: 'p-8821', 
    tenant_id: 't-01', 
    first_name: 'Elias', 
    last_name: 'Vance', 
    email: 'elias.vance@ghostvault.local',
    date_of_birth: '1978-05-12', 
    aga_linked: true,
    aga_companion_linked: true, 
    status: 'active',
    trust_score: 0.89 
  },
  { 
    id: 'p-9910', 
    tenant_id: 't-01', 
    first_name: 'Sarah', 
    last_name: 'Connor', 
    email: 'sarah.connor@ghostvault.local',
    date_of_birth: '1984-11-20', 
    aga_linked: false,
    aga_companion_linked: false, 
    status: 'active',
    trust_score: 0.45 
  },
];

// Updated MOCK_MEMORIES to include required tags property
const MOCK_MEMORIES: AGAMemory[] = [
  { id: 'mem-1', user_id: 'p-8821', memory_type: 'emotional', content: 'Expressed anxiety about upcoming treatment cycle.', emotional_valence: -0.4, significance: 0.75, created_at: '2024-03-10T14:22:00Z', tags: ['anxiety', 'treatment'] },
  { id: 'mem-2', user_id: 'p-8821', memory_type: 'journey', content: 'Completed first week of recovery protocol.', emotional_valence: 0.6, significance: 0.9, created_at: '2024-03-12T09:15:00Z', tags: ['recovery', 'milestone'] },
];

const CoreApiExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TABLES' | 'RLS' | 'AUDIT'>('TABLES');

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Core API Architecture</h2>
          <p className="text-slate-400 font-mono text-sm mt-1">Direct management plane for GhostVault sovereign data structures.</p>
        </div>
        <div className="flex gap-2">
          {['TABLES', 'RLS', 'AUDIT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'TABLES' && (
        <div className="space-y-6">
          <section className="glass rounded-xl overflow-hidden border-slate-800">
            <div className="bg-slate-900/80 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">TABLE: patients</h3>
              <span className="text-[10px] font-mono text-slate-500">ROW_LEVEL_SECURITY: ENABLED</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-mono">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="px-6 py-3 font-medium">UUID</th>
                    <th className="px-6 py-3 font-medium">NAME</th>
                    <th className="px-6 py-3 font-medium">AGA_LINK</th>
                    <th className="px-6 py-3 font-medium">TRUST_LEVEL</th>
                    <th className="px-6 py-3 font-medium text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {MOCK_PATIENTS.map(p => (
                    <tr key={p.id} className="hover:bg-cyan-500/5 transition-colors group">
                      <td className="px-6 py-4 text-slate-400">{p.id}</td>
                      <td className="px-6 py-4 text-slate-200 font-bold">{p.first_name} {p.last_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${p.aga_companion_linked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                          {p.aga_companion_linked ? 'LINKED' : 'UNLINKED'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 w-16 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500" style={{ width: `${p.trust_score * 100}%` }}></div>
                          </div>
                          <span className="text-xs text-slate-400">{(p.trust_score * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-500 hover:text-cyan-400 transition-colors">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="glass rounded-xl overflow-hidden border-slate-800">
            <div className="bg-slate-900/80 px-6 py-3 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">TABLE: aga_memory</h3>
              <span className="text-[10px] font-mono text-slate-500">SOVEREIGNTY: USER_OWNED</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_MEMORIES.map(m => (
                <div key={m.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded uppercase font-bold tracking-widest">{m.memory_type}</span>
                    <span className="text-[10px] text-slate-600 font-mono">{m.id}</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{m.content}"</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                    <div className="flex gap-4">
                      <div className="space-y-0.5">
                        <p className="text-[8px] text-slate-500 uppercase">Valence</p>
                        <p className={`text-xs font-bold ${m.emotional_valence > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{m.emotional_valence > 0 ? '+' : ''}{m.emotional_valence}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[8px] text-slate-500 uppercase">Significance</p>
                        <p className="text-xs font-bold text-cyan-400">{m.significance}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-600 uppercase font-mono">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'RLS' && (
        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <i className="fas fa-lock text-emerald-400"></i>
            </div>
            <h3 className="text-lg font-bold text-white">Row-Level Security Configuration</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Multi-tenant isolation is enforced at the database level. Direct queries without a valid <code className="text-cyan-400 bg-slate-800 px-1 rounded">app.current_tenant_id</code> are rejected by the PostgreSQL policy engine.
          </p>
          <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm text-slate-300 border border-slate-800 relative group">
            <div className="absolute top-4 right-4 text-[10px] text-slate-600 uppercase">SQL_ENFORCEMENT</div>
            <pre className="whitespace-pre-wrap">
{`-- Tenant Isolation Policy for Clinical Records
ALTER TABLE clinical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_records ON clinical_records
USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- AGA Memory Sovereignty Policy
CREATE POLICY user_ownership_memory ON aga_memory
USING (user_id = auth.uid());`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
        <div className="glass rounded-xl border-slate-800 overflow-hidden">
          <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <i className="fas fa-list-check"></i> Immutable Audit Stream
            </h3>
            <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              VERIFIED_INTEGRITY
            </span>
          </div>
          <div className="divide-y divide-slate-800/50">
            {[
              { action: 'DATA_READ', resource: 'patients', result: 'success', time: '2m ago', user: 'SYSADMIN_01' },
              { action: 'POLICY_UPDATE', resource: 'governance_rules', result: 'denied', time: '14m ago', user: 'SUPPORT_AI' },
              { action: 'MEMORY_SYNC', resource: 'aga_memory', result: 'success', time: '1h ago', user: 'AGA_COMPANION' }
            ].map((log, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between group hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${log.result === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    <i className={`fas ${log.result === 'success' ? 'fa-check' : 'fa-xmark'}`}></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-slate-200">{log.action}</span>
                      <span className="text-[10px] text-slate-600 uppercase">→ {log.resource}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{log.user} @ {log.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-slate-700 font-mono truncate w-32 uppercase tracking-tighter">SHA256: 4f1a2e3...{i}d</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoreApiExplorer;
