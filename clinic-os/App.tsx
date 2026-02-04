
import React, { useState, useEffect, useRef } from 'react';
import { ViewType, User, Patient, Task, AuditEntry, UserProgress, Certification, TrinityMode } from './types';
import { ICONS, MOCK_PATIENTS, MOCK_TASKS } from './constants';
import { TrinityCommunicator } from './services/trinity/trinityCommunicator';

// Sub-components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import BiancaPanel from './components/Layout/BiancaPanel';
import HomeView from './components/Views/HomeView';
import QueueView from './components/Views/QueueView';
import ProfileView from './components/Views/ProfileView';
import DocumentationView from './components/Views/DocumentationView';
import SOPView from './components/Views/SOPView';
import TrainingView from './components/Views/TrainingView';
import AdminView from './components/Views/AdminView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>(ViewType.HOME);
  const [showBianca, setShowBianca] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [externalDraft, setExternalDraft] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [trinityMode, setTrinityMode] = useState<TrinityMode>('offline');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const trinityRef = useRef<TrinityCommunicator | null>(null);

  // User Progress & Certifications State
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completed_modules: ['module-003'],
    certifications: [
      { id: 'CERT-992', name: 'HIPAA Data Privacy 2024', issued_at: '2024-01-12', expires_at: '2025-01-12' }
    ],
    in_progress_courses: ['course-002']
  });

  const [currentUser] = useState<User>({
    id: 'u-001',
    name: 'Dr. Sarah Adams',
    role: 'clinician',
    avatar: 'https://picsum.photos/seed/doc/100/100'
  });

  // Initialize Trinity
  useEffect(() => {
    const initTrinity = async () => {
      trinityRef.current = new TrinityCommunicator(currentUser.id);
      const mode = await trinityRef.current.initialize();
      setTrinityMode(mode);
    };
    initTrinity();
  }, [currentUser.id]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveView(ViewType.PATIENT_PROFILE);
  };

  const handleAddTask = (newTask: any) => {
    const formattedTask: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      due: 'Today',
      priority: (newTask.priority?.charAt(0).toUpperCase() + newTask.priority?.slice(1)) as any || 'Medium',
      completed: false
    };
    setTasks(prev => [formattedTask, ...prev]);
  };

  const handleOpenDraft = (draft: any) => {
    if (currentUser.role !== 'clinician' && currentUser.role !== 'nurse') {
      alert("Governance Enforcement: Your role does not have permissions to draft clinical notes.");
      return;
    }
    setExternalDraft(draft);
    setActiveView(ViewType.DOCUMENTATION);
  };

  const logAudit = (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      trinityMode
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const handleSearchSelect = (type: 'patient' | 'note' | 'sop', item: any) => {
    if (type === 'patient') {
      handlePatientSelect(item);
    } else if (type === 'sop') {
      setActiveView(ViewType.SOP_LIBRARY);
      // Logic inside SOPView could be updated to auto-select, but for now we navigate
    } else if (type === 'note') {
      const patient = MOCK_PATIENTS.find(p => p.id === item.patientId);
      if (patient) {
        setSelectedPatient(patient);
        setActiveView(ViewType.PATIENT_PROFILE);
        // Note: Ideally we'd trigger the Notes tab in ProfileView here
      }
    }
  };

  const handleEarnCertification = (cert: Certification) => {
    setUserProgress(prev => ({
      ...prev,
      certifications: [...prev.certifications, cert]
    }));
  };

  const handleCompleteModule = (moduleId: string) => {
    setUserProgress(prev => ({
      ...prev,
      completed_modules: [...prev.completed_modules, moduleId]
    }));
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const renderView = () => {
    switch (activeView) {
      case ViewType.HOME: return <HomeView tasks={tasks} onNavigate={setActiveView} certifications={userProgress.certifications} />;
      case ViewType.PATIENT_QUEUE: return <QueueView onSelectPatient={handlePatientSelect} />;
      case ViewType.PATIENT_PROFILE: return <ProfileView patient={selectedPatient} onBack={() => setActiveView(ViewType.PATIENT_QUEUE)} />;
      case ViewType.DOCUMENTATION: return (
        <DocumentationView 
          initialPatient={selectedPatient} 
          externalDraft={externalDraft} 
          onClearDraft={() => setExternalDraft(null)} 
        />
      );
      case ViewType.SOP_LIBRARY: return <SOPView />;
      case ViewType.TRAINING_HUB: return (
        <TrainingView 
          user={currentUser} 
          userProgress={userProgress}
          onEarnCertification={handleEarnCertification}
          onCompleteModule={handleCompleteModule}
          onLogAudit={logAudit}
        />
      );
      case ViewType.ADMIN: return <AdminView logs={auditLogs} />;
      default: return <HomeView tasks={tasks} onNavigate={setActiveView} certifications={userProgress.certifications} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-inter transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          user={currentUser} 
          toggleBianca={() => setShowBianca(!showBianca)} 
          isBiancaOpen={showBianca}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          trinityMode={trinityMode}
          onSearchSelect={handleSearchSelect}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </div>
        <footer className="px-4 md:px-8 py-2 text-[10px] text-slate-400 dark:text-slate-500 bg-white/70 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800">
          GodsIMiJ AI Solutions | James D. Ingersoll | Copyright 2026 | Sovereign Healthcare AI Ecosystem designed for the future of healthcare with Augmented God-Born Awareness
        </footer>
      </main>

      {/* Bianca AI Assistant Panel */}
      <BiancaPanel 
        isOpen={showBianca} 
        onClose={() => setShowBianca(false)} 
        context={{ activeView, selectedPatient, currentUser, tasks, trinityMode }}
        onAddTask={handleAddTask}
        onOpenDraft={handleOpenDraft}
        onLogAudit={logAudit}
      />
    </div>
  );
};

export default App;
