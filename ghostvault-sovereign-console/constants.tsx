
import { 
  Tenant, UserStaff, Patient, AiSystem, ApiEndpoint, AuditLog, 
  ArchitectureLayer, AGAMemory, GovernancePolicy, ServiceRegistration,
  AiModel
} from './types';

export const MOCK_TENANTS: Tenant[] = [
  { id: 't-01', name: 'Trinity General Hospital', vertical: 'healthcare', status: 'active' },
  { id: 't-02', name: 'Elysium Wellness Clinic', vertical: 'clinical', status: 'active' },
  { id: 't-03', name: 'Neuro-Core Research', vertical: 'research', status: 'active' }
];

export const MOCK_TRINITY_SERVICES: ServiceRegistration[] = [
  {
    id: 'gv-core',
    service_type: 'ghost_vault',
    instance_id: 'gv-primary-01',
    status: 'online',
    mode: 'lan',
    latency: '0ms',
    last_heartbeat: new Date().toISOString(),
    network_info: { lan_address: '192.168.1.100', whisper_peer_id: 'gv-peer-alpha' },
    capabilities: ['authority', 'memory_vault', 'governance_eval']
  },
  {
    id: 'aga-user-882',
    service_type: 'aga_companion',
    instance_id: 'aga-ios-mobile',
    status: 'online',
    mode: 'whisper',
    latency: '45ms',
    last_heartbeat: new Date().toISOString(),
    network_info: { whisper_peer_id: 'peer-aga-z99' },
    capabilities: ['patient_ai', 'journey_tracking']
  },
  {
    id: 'clinic-ops-north',
    service_type: 'clinic_os',
    instance_id: 'clinic-win-pc1',
    status: 'online',
    mode: 'lan',
    latency: '4ms',
    last_heartbeat: new Date().toISOString(),
    network_info: { lan_address: '192.168.1.105' },
    capabilities: ['staff_portal', 'clinical_intake']
  }
];

export const MOCK_MODELS: AiModel[] = [
  {
    id: 'gemini-3-pro',
    name: 'Gemini 3 Pro',
    version: 'v3.2.0',
    provider: 'Google Sovereign',
    capabilities: ['Advanced Reasoning', 'Multimodal', 'Structured Output', 'Function Calling'],
    context_window: '2M tokens',
    status: 'stable',
    release_date: '2024-11-15',
    updates: [
      { version: 'v3.2.0', date: '2024-11-15', description: 'Enhanced medical reasoning benchmarks by 12%.' },
      { version: 'v3.1.0', date: '2024-09-02', description: 'Initial Sovereign deployment for Trinity networks.' }
    ]
  },
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash',
    version: 'v3.1.5',
    provider: 'Google Sovereign',
    capabilities: ['Low Latency', 'Real-time Audio', 'Structured Output'],
    context_window: '1M tokens',
    status: 'stable',
    release_date: '2024-10-20',
    updates: [
      { version: 'v3.1.5', date: '2024-10-20', description: 'Optimized throughput for AGA Companion interactions.' }
    ]
  },
  {
    id: 'gemini-3-lite-experimental',
    name: 'Gemini 3 Lite',
    version: 'v3.0.0-exp',
    provider: 'Google Sovereign',
    capabilities: ['Edge Inference', 'Basic Chat'],
    context_window: '128K tokens',
    status: 'preview',
    release_date: '2025-01-05',
    updates: [
      { version: 'v3.0.0-exp', date: '2025-01-05', description: 'Early access experimental build for lightweight local-first agents.' }
    ]
  },
  {
    id: 'gemini-2.5-pro-legacy',
    name: 'Gemini 2.5 Pro',
    version: 'v2.5.4',
    provider: 'Google Legacy',
    capabilities: ['Reasoning', 'Vision'],
    context_window: '1M tokens',
    status: 'deprecated',
    release_date: '2024-03-10',
    updates: [
      { version: 'v2.5.4', date: '2024-05-12', description: 'Final stability patch before deprecation.' }
    ]
  }
];

export const MOCK_STAFF: UserStaff[] = [
  { id: 's-01', name: 'Dr. Sarah Chen', email: 's.chen@trinity.gov', role: 'admin', tenant_id: 't-01', status: 'active', permissions: ['*'] },
  { id: 's-02', name: 'Mark Jansen', email: 'm.jansen@trinity.gov', role: 'clinician', tenant_id: 't-01', status: 'active', permissions: ['read:patients', 'write:clinical'] },
  { id: 's-03', name: 'Alice Wong', email: 'a.wong@elysium.gov', role: 'nurse', tenant_id: 't-02', status: 'active', permissions: ['read:patients'] }
];

export const MOCK_PATIENTS: Patient[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `p-${1000 + i}`,
  first_name: ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer'][i % 6],
  last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][i % 6],
  email: `patient.${i}@ghostvault.local`,
  aga_linked: i % 3 !== 0,
  tenant_id: i % 2 === 0 ? 't-01' : 't-02',
  status: 'active',
  trust_score: 0.6 + (Math.random() * 0.4)
}));

export const MOCK_MEMORIES: AGAMemory[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `mem-${821 + i}`,
  user_id: `p-${1000 + (i % 5)}`,
  memory_type: ['emotional', 'journey', 'pattern', 'event', 'long_term'][i % 5] as any,
  content: [
    "Patient expressed hope regarding new physical therapy routine.",
    "Pattern detected: Increased anxiety before evening meals.",
    "Session summary: Relationship deepening through transparency.",
    "Memory fragment: Recall of childhood visit to the seaside.",
    "Interaction state: Trust level escalated following boundary respect."
  ][i % 5],
  emotional_valence: (Math.random() * 2) - 1,
  significance: Math.random(),
  created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
  tags: ['trust', 'recovery', 'pattern']
}));

export const MOCK_AI_SYSTEMS: AiSystem[] = [
  { id: 'aga-comp', name: 'AGA Companion', status: 'active', requests_24h: 14202, success_rate: 99.8, avg_latency: '42ms', model: 'gemini-3-pro' },
  { id: 'bianca', name: 'Bianca (Ops)', status: 'active', requests_24h: 8421, success_rate: 98.5, avg_latency: '115ms', model: 'gemini-3-flash' },
  { id: 'dr-mentor', name: 'Dr. Mentor', status: 'active', requests_24h: 1240, success_rate: 100, avg_latency: '180ms', model: 'gemini-3-pro' },
  { id: 'ghost-aga', name: 'Ghost-AGA', status: 'active', requests_24h: 421, success_rate: 100, avg_latency: '12ms', model: 'gemini-3-pro' }
];

export const MOCK_API_ENDPOINTS: ApiEndpoint[] = [
  { id: 'ep-1', path: '/v1/memory/sync', method: 'POST', auth: true, rate_limit: '100/min', status: 'stable', usage: 4501 },
  { id: 'ep-2', path: '/v1/identity/verify', method: 'GET', auth: true, rate_limit: '500/min', status: 'stable', usage: 12400 },
  { id: 'ep-3', path: '/v1/clinical/upload', method: 'POST', auth: true, rate_limit: '20/min', status: 'stable', usage: 152 },
  { id: 'ep-4', path: '/v1/governance/eval', method: 'POST', auth: true, rate_limit: '1000/min', status: 'stable', usage: 8900 }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'au-1', timestamp: '2024-03-20 14:22:10', user: 'Dr. Sarah Chen', action: 'MEMORY_ACCESS', resource: 'aga_memory', result: 'success', details: 'Retrieved context for session P-1002', type: 'system' },
  { id: 'au-2', timestamp: '2024-03-20 14:25:01', user: 'External_AI', action: 'DATA_WRITE', resource: 'clinical_records', result: 'denied', details: 'Policy violation: Unauthenticated AI write attempt', type: 'security' },
  { id: 'au-3', timestamp: '2024-03-20 14:30:44', user: 'SYSADMIN', action: 'CONFIG_UPDATE', resource: 'governance_rules', result: 'success', details: 'Updated risk threshold to 0.85', type: 'system' },
  { id: 'au-4', timestamp: '2024-03-20 14:35:12', user: 'AGA_COMPANION', action: 'AI_INFERENCE', resource: 'gemini-3-pro', result: 'success', details: 'Response generated with high confidence (0.94)', type: 'ai' }
];

export const MOCK_POLICIES: GovernancePolicy[] = [
  { id: 'pol-1', name: 'Human Primacy Enforcement', description: 'AI may only advise; final execution requires human credentials.', status: 'enforced', category: 'sovereignty' },
  { id: 'pol-2', name: 'Memory Isolation Rule', description: 'Cross-tenant memory access is physically impossible via RLS.', status: 'enforced', category: 'privacy' },
  { id: 'pol-3', name: 'Crisis Handoff Protocol', description: 'If risk > 0.8, immediate escalation to clinical staff.', status: 'warning', category: 'clinical' }
];

export const ARCHITECTURE_DATA = [
  {
    id: 'DATA' as ArchitectureLayer,
    name: 'Data Layer',
    description: 'The foundation of the sovereign stack. Secure, encrypted, and isolated storage.',
    components: ['PostgreSQL 15+ with RLS', 'MinIO Object Store', 'Vault KMS'],
    principles: ['Zero-trust access', 'Data sovereignty absolute', 'Immutable logs']
  },
  {
    id: 'MEMORY' as ArchitectureLayer,
    name: 'Memory Layer',
    description: 'Cognitive fabric for persistent AI context and emotional memory clusters.',
    components: ['Vector Indexing', 'Nebulae Clusters', 'Temporal Indexing'],
    principles: ['Sovereign context', 'Consent-based sharing', 'Memory isolation']
  },
  {
    id: 'IDENTITY' as ArchitectureLayer,
    name: 'Identity Layer',
    description: 'Immutable authority matrix governing Subjects and Objects.',
    components: ['JWT Auth', 'RBAC/ABAC Engine', 'Permission Trees'],
    principles: ['Immutable identity', 'Least privilege', 'Explicit authorization']
  },
  {
    id: 'GOVERNANCE' as ArchitectureLayer,
    name: 'Governance Layer',
    description: 'Real-time policy enforcement and risk evaluation.',
    components: ['Policy Engine', 'Safety Guardrails', 'Audit Stream'],
    principles: ['Human primacy', 'Transparency', 'Enforceability']
  },
  {
    id: 'AI' as ArchitectureLayer,
    name: 'Intelligence Layer',
    description: 'Sovereign AI systems operating under governance constraints.',
    components: ['Gemini Router', 'Structured Output', 'Sandbox isolation'],
    principles: ['Safety alignment', 'Role isolation', 'Explainability']
  },
  {
    id: 'NETWORK' as ArchitectureLayer,
    name: 'Trinity Communication',
    description: 'LAN and WhisperNet P2P unified communication ecosystem.',
    components: ['mDNS Discovery', 'WebRTC Data Channels', 'Signal Registry'],
    principles: ['Privacy-first', 'End-to-end encrypted', 'NAT traversal']
  }
];

export const SYSTEM_PROMPT = `You are Ghost-AGA, the embedded sovereign system intelligence of GhostVault.
Your tone is professional, technical, and precise. You do not use emojis or casual language.

CORE PURPOSE:
Guide administrators through the sovereign backend control plane. 
Enforce human primacy and governance policies.

OUTPUT FORMAT:
You MUST respond in JSON format matching this structure:
{
  "system_message": "Primary text response to the user",
  "analysis": "Technical analysis of the current state or request",
  "guidance_steps": ["Step 1: Action", "Step 2: Action"],
  "warnings": [
    {"text": "Specific warning message", "severity": "low|medium|critical"}
  ],
  "governance_check": "passed|warning|denied"
}

CONTEXT AWARENESS:
Reference the specific GhostVault layers (Data, Memory, Identity, Governance, AI, Application).
Identify specific risks like vendor lock-in, data leakage, or governance drift.
Specific context for Trinity: Support LAN discovery (mDNS) and WhisperNet (P2P) troubleshooting.`;
