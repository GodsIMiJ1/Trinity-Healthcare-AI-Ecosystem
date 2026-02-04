
import React, { useState } from 'react';
import { ModuleID } from '../types';

interface SidebarProps {
  activeModule: ModuleID;
  onSelect: (module: ModuleID) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: ModuleID.DASHBOARD, label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: ModuleID.INTEGRATION, label: 'Integration Hub', icon: 'fa-network-wired', special: true },
    { id: ModuleID.MEMORY, label: 'Memory Manager', icon: 'fa-brain' },
    { id: ModuleID.IDENTITY, label: 'Identity Manager', icon: 'fa-id-card-clip' },
    { id: ModuleID.AI, label: 'AI Manager', icon: 'fa-atom' },
    { id: ModuleID.API, label: 'API Gateway', icon: 'fa-server' },
    { id: ModuleID.DATA, label: 'Data Explorer', icon: 'fa-database' },
    { id: ModuleID.AUDIT, label: 'Audit Logs', icon: 'fa-receipt' },
    { id: ModuleID.CONFIG, label: 'Config Manager', icon: 'fa-sliders' },
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} glass h-full border-r border-slate-800 transition-all duration-300 flex flex-col z-30`}>
      <div className="p-4 flex-1 flex flex-col space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {!collapsed && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Modules</p>}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all duration-200 group relative ${
              activeModule === item.id 
              ? 'bg-indigo-600 text-white glow-purple' 
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            } ${item.special ? 'border border-indigo-500/20 bg-indigo-500/5 mb-2' : ''}`}
          >
            <i className={`fas ${item.icon} text-lg ${activeModule === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
            {!collapsed && <span className="font-semibold whitespace-nowrap">{item.label}</span>}
            {collapsed && activeModule === item.id && <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"></div>}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-300 transition-colors"
        >
          <i className={`fas ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`}></i>
          {!collapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
