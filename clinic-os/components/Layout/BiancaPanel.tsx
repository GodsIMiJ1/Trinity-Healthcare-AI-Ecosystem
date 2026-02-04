
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../constants';
import { queryBianca } from '../../services/geminiService';
import { BiancaMessage, Task, StructuredOutput, AuditEntry } from '../../types';

interface BiancaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: any;
  onAddTask: (task: any) => void;
  onOpenDraft: (draft: any) => void;
  onLogAudit: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
}

const BiancaPanel: React.FC<BiancaPanelProps> = ({ isOpen, onClose, context, onAddTask, onOpenDraft, onLogAudit }) => {
  const [messages, setMessages] = useState<BiancaMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I am Bianca, your Clinical Operations Assistant. How can I assist you with patient flow or documentation today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [crisisAcknowledged, setCrisisAcknowledged] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue('');
    const newMessages = [...messages, { 
      role: 'user', 
      content: userMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } as BiancaMessage];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await queryBianca(userMsg, context);
      
      // Update messages with structured output
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: response.assistant_message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredOutput: response
      }]);

      // Audit Logging
      onLogAudit({
        aiSystem: 'bianca',
        userId: context.currentUser.id,
        userName: context.currentUser.name,
        patientId: context.selectedPatient?.id,
        input: userMsg,
        outputSummary: response.assistant_message,
        requiresReview: response.required_human_review
      });
      
      if (response.crisis_detected) {
        setCrisisAcknowledged(false);
      }
    } catch (error) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the clinical backend. Please check your network.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="w-80 md:w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col fixed right-0 top-0 bottom-0 z-40 shadow-2xl animate-in slide-in-from-right duration-300 transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <ICONS.Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-none">Bianca</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Operations Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ICONS.Plus className="rotate-45" size={20} />
        </button>
      </div>

      {/* Messages & Structured Output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-4">
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] space-y-1">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-sm font-medium' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <p className={`text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>

            {/* Structured Output Components */}
            {msg.structuredOutput && (
              <div className="space-y-3 pl-2 animate-in fade-in slide-in-from-bottom-2">
                {/* Crisis Alert */}
                {msg.structuredOutput.crisis_detected && !crisisAcknowledged && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-600 dark:border-red-600/50 p-4 rounded-xl space-y-3 shadow-lg shadow-red-500/10">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <ICONS.AlertTriangle size={20} />
                      <h4 className="font-bold text-sm">IMMEDIATE ACTION REQUIRED</h4>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-red-100 dark:border-red-900/30 backdrop-blur-sm">
                       <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-2">Institutional Escalation Protocol:</p>
                       <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{msg.structuredOutput.escalation_protocol || "1. Notify on-duty clinician immediately\n2. Do not leave patient unattended\n3. Follow Crisis SOP-089\n4. Document incident in Safety Event Log"}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setCrisisAcknowledged(true);
                        onLogAudit({
                          aiSystem: 'bianca',
                          userId: context.currentUser.id,
                          userName: context.currentUser.name,
                          input: "CRISIS ACKNOWLEDGMENT",
                          outputSummary: "User confirmed escalation protocol followed.",
                          requiresReview: true
                        });
                      }}
                      className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-md active:scale-95"
                    >
                      I Have Escalated
                    </button>
                  </div>
                )}

                {/* Suggested Tasks */}
                {msg.structuredOutput.suggested_tasks && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Suggested Ops Tasks</p>
                    {msg.structuredOutput.suggested_tasks.map((task, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{task.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{task.description}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 
                            task.priority === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onAddTask(task)}
                            className="flex-1 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            Accept Task
                          </button>
                          <button className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg text-[10px] font-bold hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Risk Flags */}
                {msg.structuredOutput.risk_flags && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Institutional Risks Identified</p>
                    {msg.structuredOutput.risk_flags.map((flag, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border-l-4 shadow-sm ${
                        flag.severity === 'high' ? 'bg-red-50 dark:bg-red-900/10 border-red-500 text-red-900 dark:text-red-300' : 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 text-amber-900 dark:text-amber-300'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                           <ICONS.AlertTriangle size={14} />
                           <p className="text-xs font-bold uppercase tracking-wider">{flag.type}</p>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-80">{flag.description}</p>
                        <div className="mt-2 flex gap-2">
                          <button className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            flag.severity === 'high' ? 'bg-red-200 dark:bg-red-800/40 hover:bg-red-300 dark:hover:bg-red-800/60' : 'bg-amber-200 dark:bg-amber-800/40 hover:bg-amber-300 dark:hover:bg-amber-800/60'
                          }`}>
                            Review Resources
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Draft Note Preview */}
                {msg.structuredOutput.draft_note && (
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm space-y-3 transition-colors">
                    <div className="flex items-center justify-between">
                       <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Visit Note Draft</p>
                       <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded uppercase">AI Workspace</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 italic line-clamp-3 transition-colors">
                      "{msg.structuredOutput.draft_note.content}"
                    </div>
                    {msg.structuredOutput.draft_note.missing_fields.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.structuredOutput.draft_note.missing_fields.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold rounded border border-red-100 dark:border-red-900/30">
                            Missing: {f}
                          </span>
                        ))}
                      </div>
                    )}
                    <button 
                      onClick={() => onOpenDraft(msg.structuredOutput?.draft_note)}
                      className="w-full py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      Populate Documentation Workspace
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 flex gap-1 items-center transition-colors">
              <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <span className="ml-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Processing AGA Task</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div className="relative flex items-center">
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Bianca to draft notes or brief ops..." 
            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/10 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner dark:text-slate-100 dark:placeholder-slate-500"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-md active:scale-95"
          >
            <ICONS.ChevronRight size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default BiancaPanel;
