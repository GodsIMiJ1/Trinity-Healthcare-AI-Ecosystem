import React from 'react';
import { MOCK_STAFF, MOCK_PATIENTS } from '../../constants';

const IdentityManager: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Identity Vault</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Sovereign authority and RBAC management</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-500">
          Add Identity Subject
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass rounded-2xl border-slate-800">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">System Staff</h3>
            <span className="text-[10px] text-slate-500 font-mono">{MOCK_STAFF.length} Records</span>
          </div>
          <div className="divide-y divide-slate-800/50">
            {MOCK_STAFF.map(staff => (
              <div key={staff.id} className="p-4 flex items-center justify-between hover:bg-slate-900/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{staff.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{staff.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 uppercase">{staff.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl border-slate-800">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400">Patient Identities</h3>
            <div className="flex gap-2">
              <button className="p-1.5 text-slate-500 hover:text-white"><i className="fas fa-filter text-xs"></i></button>
              <button className="p-1.5 text-slate-500 hover:text-white"><i className="fas fa-magnifying-glass text-xs"></i></button>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-900/90 text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">AGA</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {MOCK_PATIENTS.slice(0, 8).map(p => (
                  <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{p.id}</td>
                    <td className="px-6 py-4 text-slate-200">{p.first_name} {p.last_name}</td>
                    <td className="px-6 py-4">
                      {p.aga_linked ? (
                        <i className="fas fa-link text-emerald-500"></i>
                      ) : (
                        <i className="fas fa-link-slash text-slate-700"></i>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IdentityManager;