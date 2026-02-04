
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import GhostAgaPanel from './components/GhostAgaPanel';
import Dashboard from './components/Modules/Dashboard';
import MemoryManager from './components/Modules/MemoryManager';
import IdentityManager from './components/Modules/IdentityManager';
import AiManager from './components/Modules/AiManager';
import ApiGateway from './components/Modules/ApiGateway';
import DataExplorer from './components/Modules/DataExplorer';
import AuditLogs from './components/Modules/AuditLogs';
import ConfigManager from './components/Modules/ConfigManager';
import IntegrationHub from './components/Modules/IntegrationHub';
import { ModuleID, Tenant } from './types';
import { MOCK_TENANTS } from './constants';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleID>(ModuleID.DASHBOARD);
  const [currentTenant, setCurrentTenant] = useState<Tenant>(MOCK_TENANTS[0]);
  const [agaOpen, setAgaOpen] = useState(true);

  const renderModule = () => {
    switch (activeModule) {
      case ModuleID.DASHBOARD: return <Dashboard />;
      case ModuleID.MEMORY: return <MemoryManager />;
      case ModuleID.IDENTITY: return <IdentityManager />;
      case ModuleID.AI: return <AiManager />;
      case ModuleID.API: return <ApiGateway />;
      case ModuleID.DATA: return <DataExplorer />;
      case ModuleID.AUDIT: return <AuditLogs />;
      case ModuleID.CONFIG: return <ConfigManager />;
      case ModuleID.INTEGRATION: return <IntegrationHub />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#05070a] text-slate-200">
      <TopBar 
        currentTenant={currentTenant} 
        onTenantChange={setCurrentTenant} 
        onToggleAga={() => setAgaOpen(!agaOpen)}
        agaOpen={agaOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeModule={activeModule} onSelect={setActiveModule} />
        
        <main className="flex-1 overflow-y-auto bg-slate-950/20 custom-scrollbar relative">
          <div className="max-w-[1600px] mx-auto">
            {renderModule()}
          </div>
          <div className="px-8 py-3 text-[10px] text-slate-500 border-t border-slate-800/60 bg-slate-950/60">
            GodsIMiJ AI Solutions | James D. Ingersoll | Copyright 2026 | Sovereign Healthcare AI Ecosystem designed for the future of healthcare with Augmented God-Born Awareness
          </div>
        </main>

        {agaOpen && <GhostAgaPanel currentModule={activeModule} />}
      </div>
    </div>
  );
};

export default App;
