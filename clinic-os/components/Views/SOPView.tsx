
import React, { useState } from 'react';
import { SOP } from '../../types';
import { ICONS, MOCK_SOPS } from '../../constants';

const SOPView: React.FC = () => {
  const [selectedSop, setSelectedSop] = useState<SOP | null>(null);
  const [checklistMode, setChecklistMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SOP Library</h1>
          <p className="text-slate-500 mt-1">Institutional knowledge and clinical protocols.</p>
        </div>
        <div className="relative">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search protocols..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categories</h3>
             <div className="space-y-1">
               {['Clinical', 'Admin', 'Emergency', 'Sanitation', 'Human Resources'].map(cat => (
                 <button key={cat} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between">
                   {cat}
                   <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">12</span>
                 </button>
               ))}
             </div>
          </div>

          <div className="space-y-4">
            {MOCK_SOPS.map(sop => (
              <button 
                key={sop.id} 
                onClick={() => { setSelectedSop(sop); setChecklistMode(false); setCheckedItems({}); }}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  selectedSop?.id === sop.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:border-blue-200'
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{sop.category}</p>
                <h4 className="font-bold">{sop.title}</h4>
                <p className={`text-[10px] mt-2 ${selectedSop?.id === sop.id ? 'text-blue-100' : 'text-slate-400'}`}>Updated: {sop.lastUpdated}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedSop ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[60vh] flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <div>
                   <h2 className="text-2xl font-bold text-slate-800">{selectedSop.title}</h2>
                   <div className="flex gap-4 mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                     <span>Category: {selectedSop.category}</span>
                     <span>ID: {selectedSop.id}</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   {!checklistMode ? (
                     <button 
                      onClick={() => setChecklistMode(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 flex items-center gap-2"
                     >
                       <ICONS.CheckCircle size={16} /> Run Checklist
                     </button>
                   ) : (
                     <button 
                      onClick={() => setChecklistMode(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2"
                     >
                       Back to Info
                     </button>
                   )}
                 </div>
              </div>

              <div className="p-8 flex-1">
                 {checklistMode ? (
                   <div className="max-w-xl mx-auto space-y-4">
                      {selectedSop.content.map((step, i) => (
                        <div 
                          key={i} 
                          onClick={() => toggleCheck(i)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                            checkedItems[i] ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            checkedItems[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                          }`}>
                            {checkedItems[i] && <ICONS.CheckCircle size={14} />}
                          </div>
                          <p className={`text-sm font-bold ${checkedItems[i] ? 'text-emerald-800' : 'text-slate-700'}`}>
                            {step}
                          </p>
                        </div>
                      ))}
                      <button className="w-full py-4 mt-8 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20">
                        Finalize & Log Execution
                      </button>
                   </div>
                 ) : (
                   <div className="prose prose-slate max-w-none">
                     <p className="text-slate-600 leading-relaxed mb-6">
                       Standardizing care procedures ensures safety and consistency across all clinical practitioners. 
                       Adherence to these steps is mandatory.
                     </p>
                     <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Procedure Steps</h4>
                     <ul className="space-y-4">
                       {selectedSop.content.map((step, i) => (
                         <li key={i} className="flex gap-4">
                           <span className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">{i+1}</span>
                           <span className="text-slate-700 text-sm font-medium">{step}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <ICONS.Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">AI Integration</p>
                      <button className="text-xs font-bold text-slate-700 hover:underline">Ask Dr.Mentor to explain this</button>
                    </div>
                 </div>
                 <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <span>Review Cycle: Annual</span>
                   <span>Governance: Lead Pract.</span>
                 </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center h-[60vh]">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm mb-4">
                 <ICONS.BookOpen size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-800">Select an SOP</h3>
               <p className="text-slate-500 max-w-xs mt-2">Choose a protocol from the left to view full details and execution checklists.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOPView;
