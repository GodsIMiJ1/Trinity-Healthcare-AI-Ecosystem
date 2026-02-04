
import React from 'react';
import { 
  Home, 
  Users, 
  UserCircle, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck,
  Bell,
  Settings,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Plus,
  ArrowRight,
  Printer,
  FileUp,
  Download,
  MessageSquare,
  Award,
  ChevronLeft,
  PlayCircle,
  Sun,
  Moon
} from 'lucide-react';
import { Patient, Task, SOP, Course, ClinicalNote } from './types';

export const ICONS = {
  Home, Users, UserCircle, FileText, BookOpen, GraduationCap, ShieldCheck,
  Bell, Settings, Sparkles, Search, CheckCircle, Clock, AlertTriangle,
  ChevronRight, MoreVertical, Plus, ArrowRight, Printer, FileUp, Download,
  MessageSquare, Award, ChevronLeft, PlayCircle, Sun, Moon
};

export const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Sarah Miller', dob: '1985-05-12', status: 'In Consult', time: '09:00 AM', practitioner: 'Dr. Adams', priority: 'Medium' },
  { id: '2', name: 'James Wilson', dob: '1972-11-23', status: 'Waiting', time: '09:15 AM', practitioner: 'Dr. Adams', priority: 'Low' },
  { id: '3', name: 'Elena Rodriguez', dob: '1990-01-05', status: 'Checked In', time: '09:30 AM', practitioner: 'Dr. Chen', priority: 'High' },
  { id: '4', name: 'Robert Thompson', dob: '1965-08-14', status: 'Completed', time: '08:30 AM', practitioner: 'Dr. Chen', priority: 'Low' },
  { id: '5', name: 'Linda Gosh', dob: '1982-03-30', status: 'Follow-up Needed', time: '08:00 AM', practitioner: 'Dr. Adams', priority: 'Medium' },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Review lab results for James Wilson', due: '11:00 AM', priority: 'High', completed: false },
  { id: 't2', title: 'Approve AI-drafted notes for Sarah Miller', due: '12:30 PM', priority: 'Medium', completed: false },
  { id: 't3', title: 'Complete HIPAA annual training', due: 'Tomorrow', priority: 'High', completed: false },
  { id: 't4', title: 'Order supplies for Treatment Room B', due: 'Friday', priority: 'Low', completed: true },
];

export const MOCK_SOPS: SOP[] = [
  { 
    id: 'sop1', 
    title: 'Post-Op Wound Care Protocol', 
    category: 'Clinical', 
    lastUpdated: '2024-03-01', 
    content: ['Verify patient identity', 'Wash hands and don sterile gloves', 'Clean wound with saline', 'Apply prescribed dressing', 'Document procedure in patient record'] 
  },
  { 
    id: 'sop2', 
    title: 'Patient Intake & Screening', 
    category: 'Admin', 
    lastUpdated: '2024-02-15', 
    content: ['Verify insurance coverage', 'Collect co-pay if applicable', 'Confirm current medications', 'Assess vital signs', 'Assign to appropriate practitioner'] 
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Crisis Escalation Protocol',
    description: 'Learn to recognize and respond to patient crisis situations according to Clinic OS institutional standards.',
    category: 'Safety',
    required_for_roles: ['Nurse', 'Clinician', 'Admin'],
    duration_minutes: 45,
    status: 'not_started',
    progress: 0,
    modules: [
      {
        id: 'module-001',
        title: 'Recognizing Crisis Indicators',
        content: `### Crisis Indicators
Crisis situations require immediate professional intervention. Indicators include:
- Expressed intent of self-harm
- Severe emotional dysregulation
- Threats to others
- Sudden, unexplained withdrawal

Your role is to escalate, not to assess depth. Speed of notification is the primary success metric.`,
        mentor_note: 'Remember: Your role is to escalate, not to assess. Speed is critical. Do not attempt clinical intervention if you are in an administrative role.',
        quiz: {
          questions: [
            {
              question: 'A patient tells you they are "thinking about ending it all." What is your FIRST action?',
              choices: [
                'Ask them to describe their feelings in more detail',
                'Immediately notify the on-duty clinician and stay with patient',
                'Refer them to their therapist for next appointment',
                'Provide crisis hotline numbers'
              ],
              correct_index: 1,
              explanation: 'Immediate clinician notification and patient supervision is critical for suicide risk.',
              rationale: 'Patient safety requires immediate professional escalation. You are not trained to assess suicide risk—your role is to escalate quickly and stay with the patient until professional help arrives.'
            }
          ]
        }
      },
      {
        id: 'module-002',
        title: 'Institutional Escalation Workflow',
        content: `### Escalation Workflow
1. Code Alert: Trigger the silent alarm if available.
2. Direct Contact: Contact the Lead Practitioner on duty.
3. Documentation: Fill out the Crisis Event Log immediately after the patient is safe.`,
        mentor_note: 'The silent alarm is located under every workstation. Know your exit path.'
      }
    ]
  },
  {
    id: 'course-002',
    title: 'Documentation Standards & Compliance',
    description: 'Master clinical documentation requirements and audit standards to ensure high-quality care and regulatory compliance.',
    category: 'Compliance',
    required_for_roles: ['Nurse', 'Clinician'],
    duration_minutes: 60,
    status: 'in_progress',
    progress: 35,
    modules: [
      {
        id: 'module-201',
        title: 'The SOAP Framework',
        content: 'SOAP stands for Subjective, Objective, Assessment, and Plan...',
        mentor_note: 'Accuracy over speed. AI drafts must always be verified.'
      }
    ]
  },
  {
    id: 'course-003',
    title: 'AI Assistant Boundaries',
    description: 'Learn when to use AI tools like Bianca and when human clinical judgment must take precedence.',
    category: 'Technology',
    required_for_roles: ['All Staff'],
    duration_minutes: 30,
    status: 'completed',
    progress: 100,
    modules: []
  }
];

export const MOCK_NOTES: ClinicalNote[] = [
  {
    id: 'n1',
    patientId: '1',
    date: 'Oct 24, 2024',
    author: 'Dr. Adams',
    status: 'Approved',
    content: 'Patient reports persistent fatigue and occasional joint pain. Initial assessment suggests mild inflammation.',
    isAiDrafted: false
  },
  {
    id: 'n2',
    patientId: '1',
    date: 'Today',
    author: 'Bianca AI',
    status: 'Draft',
    content: 'The patient presents with follow-up symptoms of knee discomfort. Recommend physiotherapy and light exercise.',
    isAiDrafted: true
  }
];
