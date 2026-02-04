
export enum ViewType {
  HOME = 'home',
  PATIENT_QUEUE = 'queue',
  PATIENT_PROFILE = 'profile',
  DOCUMENTATION = 'documentation',
  SOP_LIBRARY = 'sop',
  TRAINING_HUB = 'training',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  role: 'nurse' | 'clinician' | 'admin' | 'support';
  avatar: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  status: 'Checked In' | 'Waiting' | 'In Consult' | 'Follow-up Needed' | 'Completed';
  time: string;
  practitioner: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Task {
  id: string;
  title: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  description?: string;
}

export interface BiancaMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredOutput?: StructuredOutput;
}

export interface StructuredOutput {
  assistant_message: string;
  suggested_tasks?: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    assigned_to?: string;
  }[];
  draft_note?: {
    content: string;
    sections: {
      chief_complaint: string;
      history: string;
      assessment: string;
      plan: string;
    };
    extracted_action_items: string[];
    missing_fields: string[];
  };
  risk_flags?: {
    type: string;
    description: string;
    severity: string;
    requires_immediate_review: boolean;
  }[];
  required_human_review: boolean;
  audit_context?: {
    reasoning_summary: string;
    data_accessed: string[];
    confidence_level: number;
  };
  crisis_detected: boolean;
  escalation_protocol?: string;
}

export interface AuditEntry {
  id: string;
  aiSystem: 'bianca' | 'dr-mentor';
  userId: string;
  userName: string;
  patientId?: string;
  input: string;
  outputSummary: string;
  requiresReview: boolean;
  timestamp: string;
  trinityMode?: string;
}

export interface SOP {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  content: string[];
}

export interface QuizQuestion {
  question: string;
  choices: string[];
  correct_index: number;
  explanation: string;
  rationale: string;
}

export interface Module {
  id: string;
  title: string;
  content: string;
  mentor_note: string;
  quiz?: {
    questions: QuizQuestion[];
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  required_for_roles: string[];
  duration_minutes: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  modules: Module[];
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  author: string;
  status: 'Approved' | 'Draft';
  content: string;
  isAiDrafted: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issued_at: string;
  expires_at: string;
}

export interface UserProgress {
  completed_modules: string[];
  certifications: Certification[];
  in_progress_courses: string[];
}

export interface DrMentorActionResponse {
  lesson_summary: string;
  next_steps: {
    step: string;
    action: string;
    required: boolean;
  }[];
  score?: {
    points_earned: number;
    points_possible: number;
    percentage: number;
    passed: boolean;
  };
  certification_state_update?: {
    module_id: string;
    status: string;
    certification_issued: boolean;
    expires_at?: string;
  };
  feedback: string;
  suggested_review: string[];
}

// --- Trinity Integration Types ---

export type TrinityMode = 'lan' | 'whisper' | 'offline';

export interface ServiceRegistration {
  service_type: 'clinic_os' | 'aga_companion' | 'ghostvault';
  service_id: string;
  instance_id: string;
  network_info: {
    lan_address?: string;
    lan_port?: number;
    public_address?: string;
    whisper_peer_id?: string;
  };
  capabilities: string[];
  health_check_url: string;
  metadata: {
    version: string;
    tenant_id?: string;
  };
}

export interface WhisperMessage {
  type: string;
  payload: any;
  timestamp: number;
  signature?: string;
}
