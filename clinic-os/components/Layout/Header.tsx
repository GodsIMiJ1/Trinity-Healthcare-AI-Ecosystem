
import React, { useState, useEffect, useRef } from 'react';
import { User, TrinityMode, ViewType, Patient } from '../../types';
import { ICONS, MOCK_PATIENTS, MOCK_NOTES, MOCK_SOPS } from '../../constants';

interface HeaderProps {
  user: User;
  toggleBianca: () => void;
  isBiancaOpen: boolean;
  toggleTheme: () => void;
  isDarkMode: boolean;
  trinityMode: TrinityMode;
  onSearchSelect: (type: 'patient' | 'note' | 'sop', item: any) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  toggleBianca, 
  isBiancaOpen, 
  toggleTheme, 
  isDarkMode, 
  trinityMode,
  onSearchSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = {
    patients: searchTerm ? MOCK_PATIENTS.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dob.includes(searchTerm) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    notes: searchTerm ? MOCK_NOTES.filter(n => n.content.toLowerCase().includes(searchTerm.toLowerCase())) : [],
    sops: searchTerm ? MOCK_SOPS.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())) : []
  };

  const hasResults = results.patients.length > 0 || results.notes.length > 0 || results.sops.length > 0;

  const getTrinityBadge = () => {
    switch (trinityMode) {
      case 'lan':
        return {
          label: 'LAN Active',
          color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800',
          icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        };
      case 'whisper':
        return {
          label: 'WhisperNet P2P',
          color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',
          icon: <ICONS.ShieldCheck size={12} className="text-blue-500" />
        };
      default:
        return {
          label: 'Offline Mode',
          color: 'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
          icon: <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        };
    }
  };

  const badge = getTrinityBadge();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-4">
         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold lg:hidden">C</div>
         
         {/* Trinity Connectivity Badge */}
         <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${badge.color}`}>
           {badge.icon}
           <span className="opacity-80">Trinity:</span>
           {badge.label}
         </div>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden md:block relative" ref={searchRef}>
        <div className="relative group">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search patients, notes, or SOPs..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {!hasResults ? (
                <div className="p-8 text-center text-slate-400 italic text-sm">
                  No institutional matches for "{searchTerm}"
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {results.patients.length > 0 && (
                    <div className="p-2">
                      <p className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Patients</p>
                      {results.patients.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => {
                            onSearchSelect('patient', p);
                            setShowResults(false);
                            setSearchTerm('');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] text-slate-400">DOB: {p.dob}</p>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                    p.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                                    p.status === 'In Consult' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' :
                                    'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                }`}>
                                    {p.status}
                                </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.sops.length > 0 && (
                    <div className="p-2">
                      <p className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">SOP Library</p>
                      {results.sops.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => {
                            onSearchSelect('sop', s);
                            setShowResults(false);
                            setSearchTerm('');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <ICONS.BookOpen size={14} />
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{s.title}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.notes.length > 0 && (
                    <div className="p-2">
                      <p className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Clinical Notes</p>
                      {results.notes.map(n => {
                        const patient = MOCK_PATIENTS.find(p => p.id === n.patientId);
                        return (
                          <button 
                            key={n.id}
                            onClick={() => {
                              onSearchSelect('note', n);
                              setShowResults(false);
                              setSearchTerm('');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <ICONS.FileText size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">{n.content}</p>
                              <p className="text-[10px] text-slate-400">{patient?.name} • {n.date}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
               <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">Global Institutional Search Active</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <ICONS.Sun size={20} /> : <ICONS.Moon size={20} />}
        </button>

        <div className="flex items-center gap-2">
          {/* Bianca Subtle AI Avatar */}
          <div className="relative group hidden sm:block">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-slate-900 overflow-hidden transition-all duration-300 ${isBiancaOpen ? 'scale-110 ring-blue-400' : 'hover:scale-105'}`}>
              <ICONS.Sparkles size={14} className={isBiancaOpen ? 'animate-pulse' : ''} />
            </div>
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Bianca AGA
            </div>
          </div>

          <button 
            onClick={toggleBianca}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              isBiancaOpen 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <ICONS.Sparkles size={16} />
            <span className="hidden sm:inline">Bianca AI</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4 border-l border-slate-200 dark:border-slate-800 pl-2 md:pl-6">
          <div className="relative">
             <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <ICONS.Bell size={20} />
            </button>
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
              3
            </span>
          </div>
          
          <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors hidden sm:block">
            <ICONS.Settings size={20} />
          </button>

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">{user.name}</p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{user.role}</p>
            </div>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
