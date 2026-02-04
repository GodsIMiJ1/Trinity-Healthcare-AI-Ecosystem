
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { SystemMessage, ArchitectureLayer } from '../types';

interface IntelligenceConsoleProps {
  activeLayer: ArchitectureLayer | 'DASHBOARD';
}

const IntelligenceConsole: React.FC<IntelligenceConsoleProps> = ({ activeLayer }) => {
  const [messages, setMessages] = useState<SystemMessage[]>([
    {
      id: '1',
      role: 'aga',
      content: `Ghost-AGA initialized. System consciousness online. I am standing by to guide your administration of the GhostVault Sovereign OS. Governance evaluator is active at ${activeLayer} level. How shall we secure the infrastructure today?`,
      timestamp: new Date(),
      metadata: { governanceCheck: 'passed' }
    }
  ]);
  const [input, setInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isQuerying]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isQuerying) return;

    const userMessage: SystemMessage = {
      id: Date.now().toString(),
      role: 'admin',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsQuerying(true);

    const history = messages.map(m => ({
      role: m.role === 'aga' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Fixed: Passed activeLayer as the third argument and handled structured JSON response
    const response = await geminiService.queryGhostAGA(input, history, activeLayer);

    const agaMessage: SystemMessage = {
      id: (Date.now() + 1).toString(),
      role: 'aga',
      content: response.system_message,
      timestamp: new Date(),
      metadata: { 
        governanceCheck: response.governance_check,
        securityLevel: response.warnings.some((w: any) => w.severity === 'critical') ? 'critical' : 'medium'
      }
    };

    setMessages(prev => [...prev, agaMessage]);
    setIsQuerying(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/50">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">Ghost-AGA Secure Channel</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500">CONTEXT: {activeLayer}</span>
          <div className="w-px h-3 bg-slate-800"></div>
          <span className="text-[10px] font-mono text-emerald-500">EVAL: PASS</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] space-y-1 ${msg.role === 'admin' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono font-bold uppercase ${msg.role === 'aga' ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {msg.role === 'aga' ? 'Ghost-AGA' : 'Sovereign Admin'}
                </span>
                <span className="text-[10px] text-slate-600">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              
              <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'aga' 
                  ? 'bg-slate-900 border border-slate-800 text-slate-200' 
                  : 'bg-cyan-600/10 border border-cyan-500/20 text-cyan-50 text-right'
              }`}>
                {msg.content}
                
                {msg.metadata && msg.role === 'aga' && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex gap-3">
                    {msg.metadata.governanceCheck && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${
                        msg.metadata.governanceCheck === 'passed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-amber-500/30 text-amber-400 bg-amber-500/5'
                      }`}>
                        <i className={`fas ${msg.metadata.governanceCheck === 'passed' ? 'fa-shield-check' : 'fa-triangle-exclamation'}`}></i>
                        GOV_{msg.metadata.governanceCheck}
                      </span>
                    )}
                    {msg.metadata.securityLevel && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${
                        msg.metadata.securityLevel === 'critical' ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' : 'border-slate-500/30 text-slate-400 bg-slate-500/5'
                      }`}>
                        <i className="fas fa-shield"></i>
                        SEC_{msg.metadata.securityLevel}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isQuerying && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Processing Intelligence Query...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isQuerying}
            placeholder="Type infrastructure query or policy request..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim() || isQuerying}
            className="absolute right-2 top-2 bottom-2 w-10 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 rounded-lg flex items-center justify-center transition-colors shadow-lg"
          >
            <i className="fas fa-arrow-up"></i>
          </button>
        </form>
        <div className="mt-2 flex items-center gap-4 px-1">
          <p className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter flex items-center gap-1">
            <i className="fas fa-circle-info text-[8px]"></i> 
            Advisory Mode Active: Actions must be human-executed
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceConsole;
