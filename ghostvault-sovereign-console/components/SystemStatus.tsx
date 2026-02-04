
import React from 'react';
import { SystemMetric } from '../types';

const SystemStatus: React.FC = () => {
  const metrics: SystemMetric[] = [
    { label: 'SOVEREIGNTY_LOCK', value: 'ACTIVE', status: 'nominal' },
    { label: 'GOVERNANCE_DRIFT', value: '0.002%', status: 'nominal' },
    { label: 'DATA_INTEGRITY', value: '99.999%', status: 'nominal' },
    { label: 'AI_ISOLATION', value: 'OPTIMAL', status: 'nominal' },
    { label: 'AUDIT_LATENCY', value: '14ms', status: 'nominal' },
    { label: 'MEM_COHERENCE', value: '98.4%', status: 'nominal' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 border-b border-slate-800 bg-slate-900/50">
      {metrics.map((metric, i) => (
        <div key={i} className="space-y-1">
          <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">{metric.label}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-sm font-bold font-mono ${
              metric.status === 'nominal' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {metric.value}
            </span>
            <div className={`w-1 h-3 rounded-full ${
              metric.status === 'nominal' ? 'bg-emerald-500/30' : 'bg-amber-500/30'
            }`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemStatus;
