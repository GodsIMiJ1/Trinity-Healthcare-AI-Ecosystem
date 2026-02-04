
-- Clinic OS | Enterprise Healthcare Database Schema
-- Multi-Tenant Isolation via Row-Level Security (RLS)

-- 1. CLINIC TENANTS (Multi-tenant Root)
CREATE TABLE clinic_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  vertical_config JSONB, -- Healthcare vertical configuration
  governance_rules JSONB, -- Clinic-specific governance rules
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. STAFF USERS
CREATE TABLE user_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES clinic_tenants(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'admin', 'nurse', 'clinician', 'support'
  permissions JSONB, -- Role-based permissions
  employment_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_staff_tenant ON user_staff(tenant_id);
CREATE INDEX idx_user_staff_role ON user_staff(role);

-- 3. PATIENTS
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES clinic_tenants(id),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  demographics JSONB, -- Store flexible demographic data
  consent_records JSONB, -- Consent tracking
  aga_companion_linked BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patients_tenant ON patients(tenant_id);

-- 4. VISITS
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  tenant_id UUID REFERENCES clinic_tenants(id),
  visit_date TIMESTAMP NOT NULL,
  visit_type VARCHAR(100), -- 'intake', 'follow-up', 'urgent'
  assigned_practitioner_id UUID REFERENCES user_staff(id),
  status VARCHAR(50), -- 'scheduled', 'in-progress', 'completed'
  outcome_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_visits_patient ON visits(patient_id);
CREATE INDEX idx_visits_date ON visits(visit_date);

-- 5. CLINICAL NOTES (Bianca AI Integration)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  visit_id UUID REFERENCES visits(id),
  tenant_id UUID REFERENCES clinic_tenants(id),
  author_id UUID REFERENCES user_staff(id),
  draft_author VARCHAR(50), -- 'human' or 'bianca'
  approver_id UUID REFERENCES user_staff(id),
  content TEXT NOT NULL,
  sections JSONB, -- Structured note sections
  status VARCHAR(50), -- 'draft', 'pending_review', 'approved'
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  audit_chain JSONB -- Track all edits and approvals
);

CREATE INDEX idx_notes_patient ON notes(patient_id);
CREATE INDEX idx_notes_status ON notes(status);

-- 6. TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES clinic_tenants(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES user_staff(id),
  created_by UUID REFERENCES user_staff(id),
  patient_id UUID REFERENCES patients(id), -- Optional
  due_date TIMESTAMP,
  priority VARCHAR(20), -- 'low', 'medium', 'high'
  status VARCHAR(50), -- 'pending', 'in_progress', 'completed'
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. STANDARD OPERATING PROCEDURES (SOP)
CREATE TABLE sops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES clinic_tenants(id),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  version_number VARCHAR(20),
  content TEXT NOT NULL,
  required_for_roles JSONB, -- Array of roles
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID REFERENCES user_staff(id),
  last_updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. DR.MENTOR TRAINING SYSTEM
CREATE TABLE training_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES clinic_tenants(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  role_targets JSONB,
  certification_issued VARCHAR(255),
  prerequisites JSONB,
  quiz_questions JSONB,
  duration_minutes INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_staff(id),
  module_id UUID REFERENCES training_modules(id),
  status VARCHAR(50), -- 'not_started', 'in_progress', 'completed', 'failed'
  sections_completed INT DEFAULT 0,
  total_sections INT,
  score DECIMAL(5,2),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  certification_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_staff(id),
  module_id UUID REFERENCES training_modules(id),
  certification_name VARCHAR(255),
  issued_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP,
  score DECIMAL(5,2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9. SAFETY & GOVERNANCE
CREATE TABLE safety_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES clinic_tenants(id),
  patient_id UUID REFERENCES patients(id),
  event_type VARCHAR(100), -- 'crisis_keyword', 'risk_flag', 'escalation'
  triggered_by VARCHAR(50),
  triggered_by_user_id UUID REFERENCES user_staff(id),
  context TEXT,
  response_actions TEXT,
  resolution_status VARCHAR(50),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 10. AUDIT LOGS (IMMUTABLE)
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_staff(id),
  action_type VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id UUID,
  result VARCHAR(20), -- 'success', 'denied'
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS RULES FOR IMMUTABILITY
CREATE RULE audit_events_immutable AS ON UPDATE TO audit_events DO INSTEAD NOTHING;
CREATE RULE audit_events_no_delete AS ON DELETE TO audit_events DO INSTEAD NOTHING;

-- 11. AI INTERACTION LOG (IMMUTABLE)
CREATE TABLE ai_interaction_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_system VARCHAR(50), -- 'bianca', 'drmentor'
  user_id UUID REFERENCES user_staff(id),
  patient_id UUID REFERENCES patients(id),
  module_id UUID REFERENCES training_modules(id),
  input TEXT,
  output JSONB,
  human_review_status VARCHAR(50), -- 'pending', 'reviewed', 'approved'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE RULE ai_interaction_immutable AS ON UPDATE TO ai_interaction_log DO INSTEAD NOTHING;
CREATE RULE ai_interaction_no_delete AS ON DELETE TO ai_interaction_log DO INSTEAD NOTHING;

-- ROW-LEVEL SECURITY POLICIES
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_patients ON patients
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_visits ON visits
  USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);

-- MOCK DATA GENERATION
INSERT INTO clinic_tenants (id, name) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Clinic OS Demo HQ');

INSERT INTO user_staff (tenant_id, email, name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'nurse@demo.clinic', 'Sarah Johnson', 'nurse'),
  ('00000000-0000-0000-0000-000000000001', 'dr@demo.clinic', 'Dr. Michael Chen', 'clinician'),
  ('00000000-0000-0000-0000-000000000001', 'admin@demo.clinic', 'Jessica Martinez', 'admin');
