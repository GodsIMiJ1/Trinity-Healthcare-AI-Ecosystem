import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { SystemMessage, ModuleID } from '../types';

interface GhostAgaPanelProps {
  currentModule: ModuleID;
}

const GhostAgaPanel: React.FC<GhostAgaPanelProps> = ({ currentModule }) => {
  const [messages, setMessages] = useState<SystemMessage[]>([
    {
      id: 'init',
      role: 'aga',
      content: "Sovereign intelligence online. How may I guide your infrastructure decisions today?",
      timestamp: new Date(),
      structured_output: {
        analysis: "GhostVault core layers are operating within nominal boundaries. Tenant isolation is verified.",
        guidance_steps: ["Monitor memory latency in Layer 2", "Audit recent identity credential rotation"],
        warnings: [],
        governance_check: "passed"
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isQuerying]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isQuerying) return;

    const userMsg: SystemMessage = { id: Date.now().toString(), role: 'admin', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsQuerying(true);

    const history = messages.map(m => ({
      role: m.role === 'aga' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const result = await geminiService.queryGhostAGA(input, history, currentModule);
    
    const agaMsg: SystemMessage = {
      id: (Date.now() + 1).toString(),
      role: 'aga',
      content: result.system_message,
      timestamp: new Date(),
      structured_output: result
    };

    setMessages(prev => [...prev, agaMsg]);
    setIsQuerying(false);
  };

  return (
    <div className="w-[420px] h-full flex flex-col bg-slate-950 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <i className="fas fa-microchip text-cyan-400 text-sm"></i>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">Ghost-AGA</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">INTELLIGENCE_ACTIVE</span>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Infrastructure Consciousness v4.1</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'admin' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-xl text-sm ${
              m.role === 'aga' ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-50'
            }`}>
              {m.content}

              {m.structured_output && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-black/40 rounded-lg border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Analysis</p>
                    <p className="text-xs text-slate-400 leading-relaxed italic">{m.structured_output.analysis}</p>
                  </div>

                  {m.structured_output.guidance_steps.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-cyan-500 uppercase">Guidance Steps</p>
                      {m.structured_output.guidance_steps.map((step, i) => (
                        <div key={i} className="flex gap-2 text-xs text-slate-300">
                          <span className="text-cyan-600 font-mono">{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {m.structured_output.warnings.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-rose-500 uppercase">Warnings</p>
                      {m.structured_output.warnings.map((w, i) => (
                        <div key={i} className={`p-2 rounded text-[10px] flex gap-2 items-center ${
                          w.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          <i className="fas fa-triangle-exclamation"></i>
                          {w.text}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                      m.structured_output.governance_check === 'passed' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'
                    }`}>
                      GOV_{m.structured_output.governance_check}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">{m.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isQuerying && (
          <div className="flex gap-2 items-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono uppercase">Thinking...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isQuerying}
            placeholder={`Query context: ${currentModule}...`}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim() || isQuerying}
            className="absolute right-2 top-2 bottom-2 w-8 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 rounded-lg flex items-center justify-center transition-all"
          >
            <i className="fas fa-bolt-lightning text-xs"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GhostAgaPanel;