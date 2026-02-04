
import React from 'react';
import { ViewType } from '../../types';
import { ICONS } from '../../constants';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { type: ViewType.HOME, icon: ICONS.Home, label: 'Home' },
    { type: ViewType.PATIENT_QUEUE, icon: ICONS.Users, label: 'Patient Queue' },
    { type: ViewType.PATIENT_PROFILE, icon: ICONS.UserCircle, label: 'Patient Profile' },
    { type: ViewType.DOCUMENTATION, icon: ICONS.FileText, label: 'Documentation' },
    { type: ViewType.SOP_LIBRARY, icon: ICONS.BookOpen, label: 'SOP Library' },
    { type: ViewType.TRAINING_HUB, icon: ICONS.GraduationCap, label: 'Training Hub' },
    { type: ViewType.ADMIN, icon: ICONS.ShieldCheck, label: 'Admin & Governance' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">Clinic OS</h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.type}
              onClick={() => setActiveView(item.type)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.type
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Support</p>
          <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Help Center</button>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
            <span>v2.4.1</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span> System Healthy
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
