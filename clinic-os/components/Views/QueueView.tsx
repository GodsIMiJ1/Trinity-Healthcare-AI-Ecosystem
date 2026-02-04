
import React, { useState } from 'react';
import { Patient } from '../../types';
import { ICONS, MOCK_PATIENTS } from '../../constants';

interface QueueViewProps {
  onSelectPatient: (patient: Patient) => void;
}

const QueueView: React.FC<QueueViewProps> = ({ onSelectPatient }) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Checked In': return 'bg-blue-100 text-blue-700';
      case 'Waiting': return 'bg-amber-100 text-amber-700';
      case 'In Consult': return 'bg-purple-100 text-purple-700';
      case 'Follow-up Needed': return 'bg-red-100 text-red-700';
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredPatients = MOCK_PATIENTS.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return p.status === 'Completed';
    return p.status !== 'Completed';
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patient Queue</h1>
          <p className="text-slate-500 mt-1">Manage intake and visit flow for today.</p>
        </div>
        <div className="flex bg-white p-1 border border-slate-200 rounded-xl shadow-sm">
          {['All', 'Active', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Practitioner</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-800">{patient.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">DOB: {patient.dob}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {patient.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {patient.practitioner}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        patient.priority === 'High' ? 'bg-red-500' : 
                        patient.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onSelectPatient(patient)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Open Profile"
                      >
                        <ICONS.UserCircle size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Start Visit">
                        <ICONS.Plus size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <ICONS.MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPatients.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <ICONS.Users size={32} />
            </div>
            <p className="text-slate-500 font-medium">No patients found matching your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueView;
