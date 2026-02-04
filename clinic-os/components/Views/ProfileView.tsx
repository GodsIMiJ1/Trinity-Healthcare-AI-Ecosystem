
import React, { useState } from 'react';
import { Patient } from '../../types';
import { ICONS, MOCK_NOTES } from '../../constants';

interface ProfileViewProps {
  patient: Patient | null;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState<'Timeline' | 'Notes' | 'Care Plan' | 'Risk' | 'Docs' | 'Messages'>('Timeline');

  if (!patient) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 animate-in fade-in">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
        <ICONS.UserCircle size={48} />
      </div>
      <p className="text-lg font-bold text-slate-800">No Patient Selected</p>
      <p className="text-sm text-slate-500 mt-2">Please select a patient from the queue to view institutional data.</p>
      <button onClick={onBack} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">Back to Queue</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Profile Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-slate-200 rounded-[32px] overflow-hidden ring-8 ring-white shadow-xl relative group">
            <img src={`https://picsum.photos/seed/${patient.id}/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={patient.name} />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ICONS.Plus className="text-white" size={24} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{patient.name}</h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border border-blue-100">
                Institutional ID: 0923-A
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2"><ICONS.Clock className="text-blue-500" size={16} /> DOB: {patient.dob} (39y)</span>
              <span className="flex items-center gap-2"><ICONS.CheckCircle className="text-emerald-500" size={16} /> Gender: Female</span>
              <span className="flex items-center gap-2 text-red-600"><ICONS.AlertTriangle size={16} /> Allergies: Penicillin</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm">
            <ICONS.Printer size={20} />
          </button>
          <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2">
            <ICONS.Plus size={18} /> New Clinical Entry
          </button>
        </div>
      </header>

      {/* Modern Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto scrollbar-hide">
        <nav className="flex gap-10">
          {['Timeline', 'Notes', 'Care Plan', 'Risk', 'Docs', 'Messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-5 text-sm font-bold transition-all whitespace-nowrap relative ${
                activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full animate-in slide-in-from-left-2" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Tab Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'Timeline' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <ICONS.Sparkles size={160} />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-blue-200">
                      <ICONS.Sparkles size={20} />
                      <h4 className="font-bold text-xs uppercase tracking-[0.2em]">Bianca Automated Summary</h4>
                    </div>
                    <p className="text-xl font-medium leading-relaxed">
                      Sarah's post-op trajectory is currently 15% ahead of baseline. 
                      Last visit (Oct 15) confirmed range of motion increased to 110°. 
                      Next critical milestone: Level 3 unsupervised physiotherapy.
                    </p>
                    <button className="text-sm font-bold text-blue-100 hover:text-white underline underline-offset-8">View Milestone Detail</button>
                 </div>
              </div>

              <div className="relative pl-10 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 before:dashed">
                {[
                  { date: 'Oct 15, 2024', event: 'Post-Op Follow-up (Week 6)', type: 'Clinical', practitioner: 'Dr. Sarah Adams', summary: 'Wound closure confirmed. Sutures removed. Patient clearing Level 2 exercises with no pain spikes.' },
                  { date: 'Sep 30, 2024', event: 'Right Knee Arthroscopy', type: 'Procedure', practitioner: 'Dr. David Wilson', summary: 'Successful meniscus repair. Minimal blood loss. Stabilized in post-op recovery block B.' },
                  { date: 'Sep 12, 2024', event: 'Institutional Intake & Screening', type: 'Administrative', practitioner: 'Reception HQ', summary: 'Insurance verified. Consent for Bianca AGA companion finalized.' },
                ].map((item, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-12 top-1.5 w-6 h-6 rounded-full bg-white border-4 border-blue-600 shadow-xl group-hover:scale-125 transition-transform z-10" />
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold text-slate-800">{item.event}</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.date} • {item.practitioner}</p>
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">{item.type}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {item.summary}
                      </p>
                      <div className="mt-6 flex gap-4">
                        <button className="text-xs font-bold text-blue-600 hover:underline">View Clinical Record</button>
                        <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Download Assets</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Notes' && (
             <div className="space-y-4 animate-in fade-in duration-500">
               {MOCK_NOTES.map(note => (
                 <div key={note.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
                    {note.isAiDrafted && (
                      <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-bl-2xl shadow-lg">
                        Bianca Draft
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                           <ICONS.FileText size={24} />
                         </div>
                         <div>
                          <h4 className="text-lg font-bold text-slate-800">{note.isAiDrafted ? 'Automated Visit Review (AGA-89)' : 'Institutional Progress Note'}</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{note.date} • Author: {note.author}</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <ICONS.MoreVertical size={20} />
                      </button>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                           note.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                         }`}>
                           {note.status}
                         </div>
                         {note.isAiDrafted && <span className="text-[10px] font-bold text-slate-400">Verified by Dr. Adams</span>}
                       </div>
                       <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                         View Details
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          )}

          {activeTab === 'Care Plan' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                       <ICONS.CheckCircle className="text-emerald-500" /> Active Goals
                    </h3>
                    <div className="space-y-4">
                       {[
                         { goal: 'Restore full flexion to 140°', progress: 75, target: 'Nov 15' },
                         { goal: 'Independent gait for >1km', progress: 40, target: 'Dec 1' },
                         { goal: 'Cease regular pain medication', progress: 90, target: 'Oct 30' },
                       ].map((g, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                               <p className="text-sm font-bold text-slate-700">{g.goal}</p>
                               <span className="text-[10px] font-bold text-slate-400">Target: {g.target}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${g.progress}%` }} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                       <ICONS.Clock className="text-blue-500" /> Planned Interventions
                    </h3>
                    <div className="space-y-3">
                       {[
                         { step: 'Physiotherapy Level 2', status: 'Ongoing', icon: ICONS.Clock },
                         { step: 'Dietary Anti-Inflammatory Block', status: 'Paused', icon: ICONS.Plus },
                         { step: 'Pain Management Protocol', status: 'Complete', icon: ICONS.CheckCircle },
                       ].map((s, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm"><s.icon size={16} /></div>
                               <p className="text-sm font-bold text-slate-700">{s.step}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.status}</span>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'Risk' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-red-50 border-2 border-red-600 p-8 rounded-3xl space-y-4">
                   <div className="flex items-center gap-3 text-red-600">
                      <ICONS.AlertTriangle size={24} />
                      <h3 className="text-xl font-bold uppercase tracking-widest">Active Safety Flags</h3>
                   </div>
                   <div className="space-y-4">
                      <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm group hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-3">
                            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">High Severity</span>
                            <span className="text-[10px] font-bold text-slate-400">Triggered: Oct 12</span>
                         </div>
                         <p className="text-lg font-bold text-slate-800">Potential Drug Interaction (Bianca Detected)</p>
                         <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            Patient reported taking "natural supplements" for sleep. Institutional audit cross-referenced these with current pain meds and identified a potential moderate-risk interaction.
                         </p>
                         <div className="mt-6 flex gap-4">
                            <button className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors">Resolve Institutional Risk</button>
                            <button className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">Flag for MD Review</button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Docs' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
               {[
                 { name: 'Radiology Report (Knee)', date: 'Sep 12', type: 'PDF' },
                 { name: 'Surgical Consent Form', date: 'Sep 10', type: 'DOC' },
                 { name: 'Lab Results (Blood)', date: 'Oct 02', type: 'PDF' },
                 { name: 'Physio Assessment', date: 'Oct 15', type: 'PDF' },
               ].map((doc, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                       <ICONS.FileText size={32} />
                    </div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-2 mb-1">{doc.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.date} • {doc.type}</p>
                    <button className="mt-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                       <ICONS.Download size={16} />
                    </button>
                 </div>
               ))}
               <button className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-slate-400 hover:bg-white hover:border-blue-300 transition-all">
                  <ICONS.Plus size={24} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest">Upload Asset</span>
               </button>
            </div>
          )}

          {activeTab === 'Messages' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[50vh] animate-in fade-in duration-500">
               <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                  <div className="flex justify-start">
                     <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none max-w-sm text-sm text-slate-700">
                        Hello Sarah, following up on your physiotherapy exercises. Are you experiencing any swelling?
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none max-w-sm text-sm text-white shadow-md">
                        Hi Dr. Adams! No swelling today, just a bit of stiffness in the morning.
                     </div>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-4">
                  <input type="text" placeholder="Type a professional message..." className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                  <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/10"><ICONS.ChevronRight size={20} /></button>
               </div>
            </div>
          )}
        </div>

        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Active Diagnoses</h3>
            <div className="space-y-3">
              {['Osteoarthritis (Primary)', 'Vitamin D Insufficiency', 'Post-Op Inflammation'].map(c => (
                <div key={c} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-blue-200 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-xs font-bold text-slate-700">{c}</p>
                </div>
              ))}
              <button className="w-full py-3 mt-4 border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all">
                + Append Record
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Care Team</h3>
            <div className="space-y-4">
               {[
                 { name: 'Dr. Sarah Adams', role: 'Lead Clinician', img: 'https://picsum.photos/seed/doc1/100' },
                 { name: 'David Chen', role: 'Physiotherapist', img: 'https://picsum.photos/seed/doc2/100' },
               ].map((doc, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <img src={doc.img} className="w-10 h-10 rounded-xl object-cover" alt="" />
                    <div>
                       <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                       <p className="text-[10px] font-medium text-slate-500">{doc.role}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
