
import React from 'react';
import { ViewType, Task, Certification } from '../../types';
import { ICONS } from '../../constants';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  tasks: Task[];
  certifications: Certification[];
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, tasks, certifications }) => {
  const activeTasks = tasks.filter(t => !t.completed);
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Clinic Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Oct 24, 2024 • Clinic OS Institutional Workspace</p>
      </header>

      {/* Today at a Glance */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Today at a Glance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Appointments', value: '18', icon: ICONS.Clock, color: 'text-blue-600', darkColor: 'dark:text-blue-400', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20', trend: '↑ 12% vs avg' },
            { label: 'Current Queue', value: '4', icon: ICONS.Users, color: 'text-emerald-600', darkColor: 'dark:text-emerald-400', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20', trend: 'Optimal Flow' },
            { label: 'Active Flags', value: '2', icon: ICONS.AlertTriangle, color: 'text-red-600', darkColor: 'dark:text-red-400', bg: 'bg-red-50', darkBg: 'dark:bg-red-900/20', trend: 'Requires Review' },
            { label: 'Tasks Pending', value: activeTasks.length.toString(), icon: ICONS.CheckCircle, color: 'text-amber-600', darkColor: 'dark:text-amber-400', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20', trend: '3 high priority' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.darkBg} ${stat.color} ${stat.darkColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.trend}</span>
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bianca Brief & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bianca Ops Brief Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-8 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-105 transition-transform duration-700">
                <ICONS.Sparkles size={200} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                    <ICONS.Sparkles className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-blue-300">Bianca AGA</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-none">Operational Briefing</p>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4 leading-tight">Good morning, Dr. Adams.</h2>
                <div className="space-y-4 max-w-2xl">
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Clinic flow is optimized for the AM block. <span className="text-blue-400 font-bold">Sarah Miller</span> is checked in (Room 4) for post-op review. 
                    I have pre-drafted the intake notes based on her mobile pre-screening.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-4">
                    <button 
                      onClick={() => onNavigate(ViewType.PATIENT_QUEUE)}
                      className="px-6 py-3 bg-white text-slate-900 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-lg shadow-white/10 flex items-center gap-2"
                    >
                      Process Queue <ICONS.ChevronRight size={16} />
                    </button>
                    <button className="px-6 py-3 bg-white/10 text-white rounded-2xl text-sm font-bold hover:bg-white/20 transition-all backdrop-blur-md border border-white/10">
                      View Clinical Summary
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                  <ICONS.CheckCircle size={18} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">Operational Tasks</h3>
              </div>
              <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 tracking-widest uppercase">View Full List</button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${
                    task.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 
                    task.priority === 'Medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${task.completed ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Due {task.due}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        task.priority === 'High' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-300 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <ICONS.ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
               <button className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-2">
                 <ICONS.Plus size={14} /> Add Personal Task
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Training & Mentor */}
        <div className="space-y-8">
          {/* Training Status Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <ICONS.GraduationCap size={20} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">Training Status</h3>
              </div>
              <button className="p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <ICONS.MoreVertical size={16} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                  <span>Compliance Mastery</span>
                  <span className="text-indigo-600 dark:text-indigo-400">85% Complete</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.3)]"></div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Credentials</p>
                {certifications.length > 0 ? certifications.slice(0, 3).map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900/30 group hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                      <ICONS.Award size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{cert.name}</p>
                      <p className="text-[9px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase">Valid until {cert.expires_at}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 dark:text-slate-600 italic">No active certifications yet.</p>
                )}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl transition-colors">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Upcoming Required</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Crisis Safety Refresher</p>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded shadow-sm">Due 3d</span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate(ViewType.TRAINING_HUB)}
                className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-slate-900/10 dark:shadow-blue-600/20"
              >
                Enter Training Hub
              </button>
            </div>
          </div>

          {/* Dr.Mentor Coaching Card */}
          <div className="bg-indigo-900 dark:bg-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden group border border-white/5 shadow-2xl shadow-indigo-900/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <ICONS.GraduationCap size={120} />
            </div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-lg">Dr.M</div>
                <div>
                  <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Institutional Mentor</h4>
                  <p className="text-xs font-bold leading-none mt-0.5">Automated Feedback</p>
                </div>
              </div>
              <p className="text-sm font-medium text-indigo-50 dark:text-indigo-100 leading-relaxed italic">
                "Your recent assessment on Crisis Protocols was exemplary. You're currently performing in the top 5% of staff for safety compliance."
              </p>
              <button className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest hover:text-white transition-colors text-left mt-2 underline underline-offset-4">
                View Competency Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
