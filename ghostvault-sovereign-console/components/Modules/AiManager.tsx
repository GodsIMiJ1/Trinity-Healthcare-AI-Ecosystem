
import React, { useState, useMemo } from 'react';
import { MOCK_AI_SYSTEMS, MOCK_MODELS } from '../../constants';
import { AiModel } from '../../types';

type AiTab = 'SYSTEMS' | 'REGISTRY' | 'PERFORMANCE';

const AiManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AiTab>('SYSTEMS');
  const [selectedModel, setSelectedModel] = useState<AiModel | null>(MOCK_MODELS[0]);
  const [activeProvider, setActiveProvider] = useState<string>('All');
  const [isUpdating, setIsUpdating] = useState(false);

  // Extract unique providers for filtering
  const providers = useMemo(() => {
    const uniqueProviders = Array.from(new Set(MOCK_MODELS.map(m => m.provider)));
    return ['All', ...uniqueProviders];
  }, []);

  const filteredModels = useMemo(() => {
    if (activeProvider === 'All') return MOCK_MODELS;
    return MOCK_MODELS.filter(m => m.provider === activeProvider);
  }, [activeProvider]);

  const getStatusClasses = (status: AiModel['status']) => {
    switch (status) {
      case 'stable':
        return 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5';
      case 'preview':
        return 'border-amber-500/30 text-amber-500 bg-amber-500/5';
      case 'deprecated':
        return 'border-rose-500/30 text-rose-500 bg-rose-500/5';
      default:
        return 'border-slate-500/30 text-slate-500 bg-slate-500/5';
    }
  };

  const handleForceUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">AI Operations Console</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Intelligence routing and model orchestration</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800 shadow-inner">
          {(['SYSTEMS', 'REGISTRY', 'PERFORMANCE'] as AiTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-lg glow-purple' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'SYSTEMS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {MOCK_AI_SYSTEMS.map(sys => (
              <div key={sys.id} className="glass p-6 rounded-2xl border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <i className={`fas ${sys.id === 'ghost-aga' ? 'fa-ghost' : 'fa-robot'} text-indigo-400`}></i>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${sys.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {sys.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">{sys.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{sys.model}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-bold">Requests</p>
                    <p className="text-xs font-bold text-slate-300">{sys.requests_24h.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-bold">Latency</p>
                    <p className="text-xs font-bold text-cyan-400">{sys.avg_latency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl border-slate-800 p-8 space-y-6 bg-gradient-to-r from-indigo-500/[0.02] to-transparent">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <i className="fas fa-route text-indigo-500"></i> Routing Policies & Governance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Default Model', val: 'Gemini 3 Pro' },
                { label: 'Fallback Strategy', val: 'Gemini 3 Flash' },
                { label: 'Safety Filtering', val: 'Strict' },
                { label: 'Reasoning Mode', val: 'High (4k tokens)' }
              ].map((p, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-indigo-500/20 transition-all">
                  <span className="text-xs text-slate-400">{p.label}</span>
                  <span className="text-xs font-bold text-slate-200">{p.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'REGISTRY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Model Registry</h3>
                <button className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <i className="fas fa-arrows-rotate text-[8px]"></i> Scan Repo
                </button>
              </div>

              {/* Provider Filter */}
              <div className="px-2">
                <div className="flex flex-wrap gap-2">
                  {providers.map(p => (
                    <button
                      key={p}
                      onClick={() => setActiveProvider(p)}
                      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter border transition-all ${
                        activeProvider === p 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto custom-scrollbar pr-2">
              {filteredModels.length > 0 ? (
                filteredModels.map(model => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                      selectedModel?.id === model.id
                        ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 relative z-10">
                      <p className="font-bold text-sm tracking-tight">{model.name}</p>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase font-bold border ${getStatusClasses(model.status)}`}>
                        {model.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 relative z-10">{model.version} • {model.provider}</p>
                    {selectedModel?.id === model.id && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500"></div>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-xs font-mono">No models found for this provider filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-8 glass rounded-3xl border-slate-800 min-h-[600px] flex flex-col shadow-2xl overflow-hidden relative">
            {selectedModel ? (
              <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-8 border-b border-slate-800 bg-slate-900/20">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-bold text-white tracking-tighter">{selectedModel.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${getStatusClasses(selectedModel.status)}`}>
                          {selectedModel.status}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-indigo-400 flex items-center gap-2">
                        <i className="fas fa-code-branch text-xs"></i> {selectedModel.version}
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500">{selectedModel.provider}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all hover:bg-slate-800">
                        <i className="fas fa-microscope mr-2"></i> Inspect Weights
                      </button>
                      <button 
                        onClick={handleForceUpdate}
                        disabled={isUpdating}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                          isUpdating ? 'bg-indigo-400 cursor-not-allowed opacity-70' : 'bg-indigo-600 hover:bg-indigo-500 glow-purple'
                        }`}
                      >
                        <i className={`fas ${isUpdating ? 'fa-spinner fa-spin' : 'fa-bolt-lightning'}`}></i>
                        {isUpdating ? 'Updating...' : 'Force Update'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-indigo-500/30 transition-all">
                      <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-2 tracking-widest">
                        <i className="fas fa-box-archive text-indigo-500"></i> Context Window
                      </p>
                      <p className="text-lg font-bold text-slate-200 font-mono tracking-tight">{selectedModel.context_window}</p>
                    </div>
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-indigo-500/30 transition-all">
                      <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-2 tracking-widest">
                        <i className="fas fa-calendar-days text-indigo-500"></i> Deployment Date
                      </p>
                      <p className="text-lg font-bold text-slate-200 font-mono tracking-tight">{selectedModel.release_date}</p>
                    </div>
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-indigo-500/30 transition-all">
                      <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-2 tracking-widest">
                        <i className="fas fa-shield-halved text-indigo-500"></i> Operational Status
                      </p>
                      <p className={`text-lg font-bold uppercase tracking-tight ${
                        selectedModel.status === 'stable' ? 'text-emerald-400' :
                        selectedModel.status === 'preview' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {selectedModel.status}
                      </p>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-tags text-[10px]"></i> Model Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedModel.capabilities.map((cap, i) => (
                        <span key={i} className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 font-medium">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Version Timeline */}
                  <div className="space-y-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-timeline text-[10px]"></i> Version History & Telemetry
                    </h4>
                    <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                      {selectedModel.updates.map((update, i) => (
                        <div key={i} className="pl-8 relative group">
                          <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 bg-slate-950 border-2 rounded-full z-10 transition-all group-hover:scale-125 ${
                            i === 0 ? 'border-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'border-slate-700'
                          }`}></div>
                          <div className="flex justify-between items-baseline mb-2">
                            <p className="text-base font-bold text-slate-200 tracking-tight">{update.version}</p>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{update.date}</span>
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 group-hover:border-indigo-500/20 transition-all">
                            <p className="text-xs text-slate-400 leading-relaxed font-mono italic">"{update.description}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-6 bg-slate-950/20 p-12 text-center">
                <div className="w-20 h-20 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900/50">
                  <i className="fas fa-microchip text-4xl opacity-20 text-indigo-400"></i>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-300">No Model Selected</p>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Select a base model from the registry to view detailed architecture, release history, and sovereign capabilities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'PERFORMANCE' && (
        <div className="space-y-8">
          <div className="glass rounded-3xl border-slate-800 p-8 space-y-6 bg-gradient-to-br from-indigo-500/[0.03] to-transparent">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Inference Throughput (24h)</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Successful</div>
                <div className="flex items-center gap-2 text-[10px] text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Throttled</div>
              </div>
            </div>
            <div className="h-72 flex items-end gap-2 px-4 border-b border-l border-slate-800 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2">
                {[1, 2, 3, 4].map(v => <div key={v} className="w-full border-t border-slate-700 border-dashed"></div>)}
              </div>
              {Array.from({ length: 32 }).map((_, i) => {
                const height = 20 + Math.random() * 80;
                return (
                  <div 
                    key={i} 
                    className="flex-1 bg-indigo-500/40 hover:bg-indigo-500/70 transition-all rounded-t-sm relative group cursor-crosshair z-10"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-[10px] px-2 py-1 rounded shadow-xl hidden group-hover:block whitespace-nowrap z-50">
                      <p className="font-bold text-white">{Math.floor(height * 12)} Req</p>
                      <p className="text-[8px] text-slate-500 font-mono">T-{32 - i}h</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 font-mono px-4">
              <span>T-32h</span>
              <span>T-16h</span>
              <span>LIVE TELEMETRY</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiManager;
