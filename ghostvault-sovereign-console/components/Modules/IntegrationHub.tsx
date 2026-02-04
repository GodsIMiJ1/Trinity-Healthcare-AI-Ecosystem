
import React, { useState, useEffect } from 'react';
import { MOCK_TRINITY_SERVICES } from '../../constants';
import { ServiceRegistration, CommunicationMode } from '../../types';

const IntegrationHub: React.FC = () => {
  const [services, setServices] = useState<ServiceRegistration[]>(MOCK_TRINITY_SERVICES);
  const [activeMode, setActiveMode] = useState<CommunicationMode | 'all'>('all');

  const filteredServices = activeMode === 'all' 
    ? services 
    : services.filter(s => s.mode === activeMode);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Trinity Integration Hub</h2>
          <p className="text-slate-400 font-mono text-xs mt-1">Sovereign LAN + WhisperNet P2P Orchestration</p>
        </div>
        <div className="flex gap-3 p-1 bg-slate-900 rounded-lg border border-slate-800">
          {['all', 'lan', 'whisper'].map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode as any)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase ${
                activeMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Network Topology Visualizer */}
        <div className="lg:col-span-2 glass rounded-3xl border-slate-800 p-8 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.03] to-transparent">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Communication Topology</h3>
            <span className="text-[10px] text-emerald-500 font-mono animate-pulse">SIGNAL_SYNC_ACTIVE</span>
          </div>

          <div className="relative h-64 flex items-center justify-center">
            {/* GhostVault Central Hub */}
            <div className="z-10 w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center glow-purple animate-pulse-slow">
              <i className="fas fa-ghost text-white text-3xl"></i>
              <div className="absolute -bottom-8 whitespace-nowrap text-[10px] font-bold text-indigo-400 uppercase tracking-widest">GhostVault Core</div>
            </div>

            {/* Connection Lines & Satellites */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Clinic OS Satellites */}
              <div className="absolute top-0 left-1/4 group">
                <div className="w-12 h-12 bg-slate-900 border border-indigo-500/50 rounded-xl flex items-center justify-center transition-all group-hover:border-indigo-400">
                  <i className="fas fa-hospital text-indigo-400 text-lg"></i>
                </div>
                <div className="h-20 w-px bg-gradient-to-t from-indigo-500 to-transparent absolute top-12 left-1/2"></div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] text-slate-500 uppercase">Clinic_OS_North</div>
              </div>

              {/* AGA Companion Satellites */}
              <div className="absolute bottom-4 right-1/4 group">
                <div className="w-12 h-12 bg-slate-900 border border-cyan-500/50 rounded-xl flex items-center justify-center transition-all group-hover:border-cyan-400">
                  <i className="fas fa-mobile-screen text-cyan-400 text-lg"></i>
                </div>
                <div className="h-20 w-px bg-gradient-to-b from-cyan-500 to-transparent absolute bottom-12 left-1/2"></div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] text-slate-500 uppercase">AGA_User_882</div>
              </div>

              {/* Orbital Path */}
              <div className="absolute w-[400px] h-[400px] border border-slate-800/50 rounded-full animate-spin-slow"></div>
            </div>
          </div>
        </div>

        {/* Global Network Stats */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border-slate-800 space-y-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Health</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-white font-mono tracking-tighter">99.9<span className="text-indigo-500">%</span></span>
              <span className="text-[10px] text-emerald-500 font-mono mb-2">OPTIMAL</span>
            </div>
            <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[99.9%]"></div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border-slate-800 space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">P2P Signal Registry</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">STUN Nodes</span>
                <span className="text-emerald-400 font-mono">4 ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">TURN Relay</span>
                <span className="text-slate-600 font-mono">STANDBY</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Signal Latency</span>
                <span className="text-cyan-400 font-mono">12ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Service Registry</h3>
          <button className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 hover:bg-slate-800 transition-colors">
            Scan Local Network (mDNS)
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/50 text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Service Type</th>
                <th className="px-6 py-4">Instance ID</th>
                <th className="px-6 py-4">Comm Mode</th>
                <th className="px-6 py-4">Latency</th>
                <th className="px-6 py-4">Peer ID / LAN Address</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredServices.map(service => (
                <tr key={service.id} className="hover:bg-indigo-600/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                        service.service_type === 'ghost_vault' ? 'bg-indigo-600/10 text-indigo-400' :
                        service.service_type === 'clinic_os' ? 'bg-amber-600/10 text-amber-400' : 'bg-cyan-600/10 text-cyan-400'
                      }`}>
                        <i className={`fas ${
                          service.service_type === 'ghost_vault' ? 'fa-ghost' :
                          service.service_type === 'clinic_os' ? 'fa-hospital' : 'fa-mobile-screen'
                        }`}></i>
                      </div>
                      <span className="font-bold text-slate-200 uppercase tracking-tighter">{service.service_type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{service.instance_id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      service.mode === 'lan' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {service.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{service.latency}</td>
                  <td className="px-6 py-4 font-mono text-slate-400 italic">
                    {service.network_info.lan_address || service.network_info.whisper_peer_id}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[10px] text-slate-600 uppercase">Synced</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;
