
import React, { useState } from 'react';
import { User, Course, Module, UserProgress, Certification, AuditEntry, DrMentorActionResponse } from '../../types';
import { ICONS, MOCK_COURSES } from '../../constants';
import { queryDrMentor } from '../../services/geminiService';

type ViewMode = 'LOBBY' | 'DETAIL' | 'VIEWER' | 'QUIZ' | 'RESULTS';

interface TrainingViewProps {
  user: User;
  userProgress: UserProgress;
  onEarnCertification: (cert: Certification) => void;
  onCompleteModule: (moduleId: string) => void;
  onLogAudit: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
}

const TrainingView: React.FC<TrainingViewProps> = ({ user, userProgress, onEarnCertification, onCompleteModule, onLogAudit }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('LOBBY');
  const [filter, setFilter] = useState<'All' | 'Required' | 'In Progress' | 'Completed'>('All');
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [apiResponse, setApiResponse] = useState<DrMentorActionResponse | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const filteredCourses = MOCK_COURSES.filter(c => {
    if (filter === 'All') return true;
    if (filter === 'Required') return c.required_for_roles.length > 0;
    if (filter === 'In Progress') return c.status === 'in_progress';
    if (filter === 'Completed') return userProgress.completed_modules.some(m => c.modules.some(cm => cm.id === m));
    return true;
  });

  const handleStartModule = async (course: Course, module: Module) => {
    setIsLoading(true);
    setCurrentCourse(course);
    setCurrentModule(module);
    
    try {
      const resp = await queryDrMentor('start_lesson', {
        userId: user.id,
        moduleId: module.id,
        moduleTitle: module.title
      });
      setApiResponse(resp);
      setViewMode('VIEWER');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizAnswers([]);
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
    setViewMode('QUIZ');
  };

  const handleSubmitAnswer = (choiceIdx: number) => {
    if (showFeedback) return;
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestionIndex] = choiceIdx;
    setQuizAnswers(newAnswers);
    setShowFeedback(true);
  };

  const handleNextQuestion = async () => {
    if (!currentModule?.quiz) return;
    
    if (currentQuestionIndex < currentModule.quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      setIsLoading(true);
      try {
        const result = await queryDrMentor('submit_quiz', {
          userId: user.id,
          moduleId: currentModule.id,
          moduleTitle: currentModule.title,
          answers: quizAnswers,
          questions: currentModule.quiz.questions
        });
        
        setApiResponse(result);
        
        // Audit Logging
        onLogAudit({
          aiSystem: 'dr-mentor',
          userId: user.id,
          userName: user.name,
          input: `QUIZ_SUBMISSION: ${currentModule.title}`,
          outputSummary: `Score: ${result.score?.percentage}%. Passed: ${result.score?.passed}`,
          requiresReview: !result.score?.passed
        });

        if (result.score?.passed) {
          onCompleteModule(currentModule.id);
          if (result.certification_state_update?.certification_issued) {
            onEarnCertification({
              id: `CERT-${Date.now()}`,
              name: `${currentCourse?.title} Institutional Certification`,
              issued_at: new Date().toISOString().split('T')[0],
              expires_at: result.certification_state_update.expires_at || '2026-01-01'
            });
          }
        }
        
        setViewMode('RESULTS');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ScoreCircle = ({ percentage }: { percentage: number }) => (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
          strokeDasharray={364} strokeDashoffset={364 - (364 * percentage) / 100}
          className={`${percentage >= 80 ? 'text-emerald-500' : 'text-amber-500'} transition-all duration-1000`} />
      </svg>
      <span className="absolute text-2xl font-bold">{Math.round(percentage)}%</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto min-h-full animate-in fade-in duration-500">
      {viewMode === 'LOBBY' && (
        <div className="space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-indigo-600 mb-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <ICONS.GraduationCap size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Training Hub powered by Dr.Mentor</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Institutional Competency</h1>
              <p className="text-slate-500 mt-1">Professional development and compliance tracking.</p>
            </div>
            <div className="flex bg-white p-1 border border-slate-200 rounded-xl shadow-sm">
              {['All', 'Required', 'In Progress', 'Completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Learning Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-2xl font-bold text-slate-900">{userProgress.completed_modules.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Passed</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-2xl font-bold text-slate-900">{userProgress.certifications.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Certs</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors">
                  View Career Path
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Certs</h3>
                <div className="space-y-3">
                  {userProgress.certifications.map((cert) => (
                    <div key={cert.id} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <ICONS.Award className="text-emerald-600" size={16} />
                        <p className="text-[10px] font-bold text-emerald-900 truncate">{cert.name}</p>
                      </div>
                      <p className="text-[9px] text-emerald-600 font-medium">Valid through {cert.expires_at}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-200 transition-all">
                  <div className="h-32 bg-slate-100 relative overflow-hidden">
                    <img src={`https://picsum.photos/seed/${course.id}/400/200`} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                       <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold uppercase">{course.category}</span>
                       {course.required_for_roles.length > 0 && <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase">Mandatory</span>}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-800 leading-tight mb-2">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">{course.description}</p>
                    <div className="mt-auto space-y-4">
                       <div className="flex justify-between items-end text-[10px] font-bold text-slate-400">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }}></div>
                       </div>
                       <button 
                        onClick={() => { setCurrentCourse(course); setViewMode('DETAIL'); }}
                        className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                       >
                         {course.progress === 100 ? 'Review Training' : 'Continue Path'}
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'DETAIL' && currentCourse && (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
          <button onClick={() => setViewMode('LOBBY')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600">
            <ICONS.ChevronLeft size={16} /> Back to Hub
          </button>
          
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
             <div className="p-10 bg-indigo-900 text-white relative">
                <div className="relative z-10 max-w-2xl">
                   <h2 className="text-3xl font-bold mb-4">{currentCourse.title}</h2>
                   <p className="text-indigo-200 leading-relaxed mb-6">{currentCourse.description}</p>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-xs font-bold"><ICONS.Clock size={16} /> {currentCourse.duration_minutes} Minutes</div>
                      <div className="flex items-center gap-2 text-xs font-bold"><ICONS.BookOpen size={16} /> {currentCourse.modules.length} Modules</div>
                   </div>
                </div>
                <ICONS.GraduationCap className="absolute top-0 right-0 p-10 text-indigo-800/40" size={240} />
             </div>
             
             <div className="p-10 space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Course Curriculum</h4>
                {currentCourse.modules.map((m, idx) => (
                  <button 
                    key={m.id}
                    disabled={isLoading}
                    onClick={() => handleStartModule(currentCourse, m)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4 text-left">
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:text-indigo-600 transition-colors">
                         {idx + 1}
                       </div>
                       <div>
                          <p className="font-bold text-slate-800">{m.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Module</p>
                       </div>
                    </div>
                    {userProgress.completed_modules.includes(m.id) ? (
                      <ICONS.CheckCircle className="text-emerald-500" size={20} />
                    ) : (
                      <ICONS.PlayCircle className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={20} />
                    )}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {viewMode === 'VIEWER' && currentModule && (
        <div className="max-w-4xl mx-auto h-full flex flex-col animate-in slide-in-from-right-8 duration-500">
           <header className="flex items-center justify-between mb-8">
              <button onClick={() => setViewMode('DETAIL')} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ICONS.ChevronLeft size={20} /></button>
              <h2 className="text-xl font-bold text-slate-900">{currentModule.title}</h2>
              <div className="w-10" />
           </header>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-12">
              <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm prose prose-slate max-w-none">
                 <div className="whitespace-pre-wrap leading-relaxed text-slate-700">{currentModule.content}</div>
              </div>
              
              <div className="bg-indigo-900 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg border border-white/10">
                 <div className="relative z-10 flex gap-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-bold">Dr.M</div>
                    <div>
                       <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">Mentor Professional Rationale</p>
                       <p className="text-lg leading-relaxed italic">"{currentModule.mentor_note}"</p>
                    </div>
                 </div>
                 <ICONS.GraduationCap className="absolute -bottom-10 -right-10 text-white/5" size={180} />
              </div>
           </div>

           <footer className="py-8 border-t border-slate-100 flex justify-end">
             {currentModule.quiz ? (
                <button 
                  onClick={handleStartQuiz}
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
                >
                  Start Knowledge Check <ICONS.ChevronRight size={18} />
                </button>
             ) : (
                <button 
                  onClick={() => { onCompleteModule(currentModule.id); setViewMode('DETAIL'); }}
                  className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Complete Lesson
                </button>
             )}
           </footer>
        </div>
      )}

      {viewMode === 'QUIZ' && currentModule?.quiz && (
        <div className="max-w-3xl mx-auto h-full flex flex-col animate-in fade-in duration-500">
           <div className="flex-1 flex flex-col justify-center py-12">
              <header className="text-center mb-12">
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">Knowledge Check</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Question {currentQuestionIndex + 1} of {currentModule.quiz.questions.length}</p>
              </header>

              <div className="space-y-6">
                 <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                    <p className="text-xl font-bold text-slate-800 leading-relaxed">{currentModule.quiz.questions[currentQuestionIndex].question}</p>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-3">
                    {currentModule.quiz.questions[currentQuestionIndex].choices.map((choice, idx) => {
                      const isSelected = quizAnswers[currentQuestionIndex] === idx;
                      const isCorrect = idx === currentModule.quiz?.questions[currentQuestionIndex].correct_index;
                      
                      let btnClass = 'bg-white border-slate-200 text-slate-700 hover:border-indigo-600 hover:bg-indigo-50';
                      if (showFeedback) {
                        if (isCorrect) btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-900';
                        else if (isSelected) btnClass = 'bg-red-100 border-red-500 text-red-900';
                        else btnClass = 'bg-slate-50 border-slate-100 text-slate-400';
                      } else if (isSelected) {
                        btnClass = 'bg-indigo-50 border-indigo-600 text-indigo-700';
                      }

                      return (
                        <button 
                          key={idx}
                          onClick={() => handleSubmitAnswer(idx)}
                          disabled={showFeedback}
                          className={`w-full p-5 rounded-2xl border-2 font-bold text-left transition-all ${btnClass}`}
                        >
                           <div className="flex items-center gap-4">
                              <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-xs uppercase">{String.fromCharCode(65 + idx)}</span>
                              {choice}
                           </div>
                        </button>
                      );
                    })}
                 </div>

                 {showFeedback && (
                   <div className="bg-slate-900 p-8 rounded-3xl text-white animate-in slide-in-from-top-4 duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-1 rounded-full ${quizAnswers[currentQuestionIndex] === currentModule.quiz.questions[currentQuestionIndex].correct_index ? 'bg-emerald-500' : 'bg-red-500'}`}>
                           <ICONS.CheckCircle size={20} />
                        </div>
                        <h4 className="font-bold text-lg">{quizAnswers[currentQuestionIndex] === currentModule.quiz.questions[currentQuestionIndex].correct_index ? 'Correct Assessment' : 'Misinterpreted Protocol'}</h4>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{currentModule.quiz.questions[currentQuestionIndex].explanation}</p>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Dr.Mentor Clinical Rationale</p>
                        <p className="text-sm text-slate-300 italic">"{currentModule.quiz.questions[currentQuestionIndex].rationale}"</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           <footer className="py-8 flex justify-center">
              {showFeedback && (
                <button 
                  onClick={handleNextQuestion}
                  disabled={isLoading}
                  className={`px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3 ${isLoading ? 'opacity-50' : ''}`}
                >
                  {isLoading ? 'Processing Assessment...' : currentQuestionIndex < currentModule.quiz.questions.length - 1 ? 'Next Question' : 'Evaluate Results'}
                </button>
              )}
           </footer>
        </div>
      )}

      {viewMode === 'RESULTS' && apiResponse && (
        <div className="max-w-2xl mx-auto h-full flex flex-col justify-center animate-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl p-12 text-center space-y-8 overflow-hidden relative">
              <header className="space-y-2">
                 <h2 className="text-4xl font-bold text-slate-900">Evaluation Result</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Institutional Standards Verification</p>
              </header>

              <div className="flex flex-col items-center">
                <ScoreCircle percentage={apiResponse.score?.percentage || 0} />
                <p className="text-slate-500 mt-4 font-bold">Assessment Score: {apiResponse.score?.points_earned}/{apiResponse.score?.points_possible}</p>
              </div>

              <div className={`p-6 rounded-3xl ${apiResponse.score?.passed ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                 <div className="flex items-center justify-center gap-3 mb-2 font-bold text-2xl">
                    {apiResponse.score?.passed ? <ICONS.CheckCircle size={24} /> : <ICONS.AlertTriangle size={24} />}
                    {apiResponse.score?.passed ? 'INSTITUTIONAL PASS' : 'RE-ATTEMPT REQUIRED'}
                 </div>
                 <p className="text-sm leading-relaxed">{apiResponse.feedback}</p>
              </div>

              {apiResponse.score?.passed ? (
                 <div className="bg-slate-900 p-8 rounded-3xl text-white">
                    <div className="flex items-center gap-4 text-left mb-6">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><ICONS.Award className="text-emerald-400" size={24} /></div>
                       <div>
                          <p className="text-lg font-bold">Certification Issued</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Added to Professional Portfolio</p>
                       </div>
                    </div>
                    <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                       <ICONS.Download size={18} /> Download Certificate (PDF)
                    </button>
                 </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Suggested Review Topics</p>
                    <ul className="space-y-2">
                       {apiResponse.suggested_review.map((item, i) => (
                         <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {item}
                         </li>
                       ))}
                    </ul>
                  </div>
                  <button onClick={handleStartQuiz} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors">Retry Assessment</button>
                </div>
              )}

              <button onClick={() => setViewMode('LOBBY')} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Return to Dashboard</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default TrainingView;
