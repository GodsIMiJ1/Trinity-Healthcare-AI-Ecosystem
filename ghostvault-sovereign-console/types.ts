
export enum ModuleID {
  DASHBOARD = 'DASHBOARD',
  MEMORY = 'MEMORY',
  IDENTITY = 'IDENTITY',
  AI = 'AI',
  API = 'API',
  DATA = 'DATA',
  AUDIT = 'AUDIT',
  CONFIG = 'CONFIG',
  INTEGRATION = 'INTEGRATION'
}

export type ArchitectureLayer = 'DATA' | 'MEMORY' | 'IDENTITY' | 'GOVERNANCE' | 'AI' | 'APPLICATION' | 'NETWORK';

export type CommunicationMode = 'lan' | 'whisper' | 'offline';

export interface ServiceRegistration {
  id: string;
  service_type: 'clinic_os' | 'aga_companion' | 'ghost_vault';
  instance_id: string;
  status: 'online' | 'offline' | 'syncing';
  mode: CommunicationMode;
  latency: string;
  last_heartbeat: string;
  network_info: {
    lan_address?: string;
    public_address?: string;
    whisper_peer_id?: string;
  };
  capabilities: string[];
}

export interface AiModel {
  id: string;
  name: string;
  version: string;
  provider: string;
  capabilities: string[];
  context_window: string;
  status: 'stable' | 'preview' | 'deprecated';
  release_date: string;
  updates: ModelUpdate[];
}

export interface ModelUpdate {
  version: string;
  date: string;
  description: string;
}

export interface SystemMetric {
  label: string;
  value: string;
  status: 'nominal' | 'warning' | 'critical';
}

export interface Tenant {
  id: string;
  name: string;
  vertical: 'healthcare' | 'clinical' | 'research';
  status: 'active' | 'suspended';
}

export interface SystemMessage {
  id: string;
  role: 'aga' | 'admin';
  content: string;
  timestamp: Date;
  metadata?: {
    governanceCheck?: string;
    securityLevel?: string;
  };
  structured_output?: {
    analysis: string;
    guidance_steps: string[];
    warnings: { text: string; severity: 'low' | 'medium' | 'critical' }[];
    governance_check: 'passed' | 'warning' | 'denied';
  };
}

export interface UserStaff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'nurse' | 'clinician' | 'support';
  tenant_id: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  aga_linked: boolean;
  aga_companion_linked?: boolean;
  date_of_birth?: string;
  tenant_id: string;
  status: 'active' | 'archived';
  trust_score: number;
}

export interface AGAMemory {
  id: string;
  user_id: string;
  memory_type: 'long_term' | 'short_term' | 'emotional' | 'event' | 'pattern' | 'journey';
  content: string;
  emotional_valence: number;
  significance: number;
  created_at: string;
  tags: string[];
}

export interface AiSystem {
  id: string;
  name: string;
  status: 'active' | 'offline';
  requests_24h: number;
  success_rate: number;
  avg_latency: string;
  model: string;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  auth: boolean;
  rate_limit: string;
  status: 'stable' | 'deprecated';
  usage: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  result: 'success' | 'denied';
  details: string;
  type: 'system' | 'ai' | 'security';
}

export interface AuditEvent extends AuditLog {}

export interface GovernancePolicy {
  id: string;
  name: string;
  description: string;
  status: 'enforced' | 'draft' | 'warning';
  category: 'sovereignty' | 'privacy' | 'clinical';
}
