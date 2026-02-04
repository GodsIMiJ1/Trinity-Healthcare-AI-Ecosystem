
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AuditEntry } from '../../types';

interface AdminViewProps {
  logs: AuditEntry[];
}

const AdminView: React.FC<AdminViewProps> = ({ logs }) => {
  const [activeTab, setActiveTab] = useState<'Audit' | 'AI Log' | 'Permissions' | 'Schema'>('Audit');

  const schemaTables = [
    { name: 'clinic_tenants', description: 'Multi-tenant root configuration and governance rules.' },
    { name: 'user_staff', description: 'Internal staff profiles, RBAC permissions, and tenant linking.' },
    { name: 'patients', description: 'PHI data, demographics, and consent records.' },
    { name: 'visits', description: 'Clinical encounter records, scheduling, and outcome logs.' },
    { name: 'notes', description: 'Clinical documentation with AI author chain tracking.' },
    { name: 'tasks', description: 'Operational tasks, priority assignments, and status tracking.' },
    { name: 'sops', description: 'Institutional protocols, versioning, and required role linking.' },
    { name: 'training_modules', description: 'Educational content, quiz logic, and certification definitions.' },
    { name: 'certifications', description: 'Issued credentials, expiration dates, and competency scores.' },
    { name: 'audit_events', description: 'Immutable append-only record of all system actions.' },
    { name: 'ai_interaction_log', description: 'Immutable log of all AI prompts and outputs for safety review.' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Governance & Admin</h1>
          <p className="text-slate-500 mt-1">Institutional integrity, system architecture, and AI oversight.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors">
             <ICONS.Download size={16} /> Export Governance Data
           </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[60vh] flex flex-col">
        <div className="border-b border-slate-100 flex p-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['Audit Log', 'AI Usage Log', 'Permissions', 'Database Schema'].map(tab => {
            const tabKey = tab.split(' ')[0] as any;
            const displayTab = tabKey === 'Database' ? 'Schema' : tabKey;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(displayTab)}
                className={`px-8 py-4 text-sm font-bold transition-all relative ${
                  activeTab === displayTab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeTab === displayTab && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full" />}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-x-auto">
          {activeTab === 'AI' && (
             <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">AI System</th>
                  <th className="px-6 py-4">Interaction Summary</th>
                  <th className="px-6 py-4 text-right">Review Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {logs.length > 0 ? logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{log.userName}</td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded">
                         {log.aiSystem}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{log.outputSummary}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.requiresReview ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {log.requiresReview ? 'Review Required' : 'Verified'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No AI interactions logged in this session yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'Audit' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {[
                  { time: '10:12 AM', user: 'Dr. Adams', action: 'Approved Draft', res: 'Note: Sarah Miller', status: 'Verified' },
                  { time: '09:45 AM', user: 'System (Bianca)', action: 'Pre-drafted', res: 'Note: Sarah Miller', status: 'Pending' },
                  { time: '09:30 AM', user: 'Receptionist', action: 'Checked In', res: 'Patient: James Wilson', status: 'Logged' },
                  { time: '08:15 AM', user: 'Admin', action: 'Updated SOP', res: 'Sanitation Guide', status: 'Approved' },
                ].map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-medium">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{log.user}</td>
                    <td className="px-6 py-4 text-slate-600">{log.action}</td>
                    <td className="px-6 py-4 text-slate-600">{log.res}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'Schema' && (
            <div className="p-8 space-y-8">
               <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-center gap-6">
                 <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <ICONS.ShieldCheck size={32} />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-blue-900">Institutional Database Architecture</h3>
                   <p className="text-sm text-blue-700 max-w-2xl leading-relaxed">
                     Clinic OS utilizes a multi-tenant relational schema with <strong>Row-Level Security (RLS)</strong> to ensure absolute data isolation. 
                     All clinical logs are immutable and append-only for regulatory compliance.
                   </p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {schemaTables.map(table => (
                   <div key={table.name} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <h4 className="font-bold text-slate-900 font-mono text-xs">{table.name}</h4>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed">{table.description}</p>
                     <button className="mt-4 text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        View SQL Definition
                     </button>
                   </div>
                 ))}
               </div>

               <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-blue-400">Governance Policy (SQL)</h4>
                    <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON patients
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);`}
                    </pre>
                  </div>
                  <ICONS.ShieldCheck className="absolute top-0 right-0 p-8 text-white/5" size={160} />
               </div>
            </div>
          )}

          {activeTab === 'Permissions' && (
            <div className="p-20 text-center text-slate-400 italic">
               Permissions module is currently locked by Lead Practitioner.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
