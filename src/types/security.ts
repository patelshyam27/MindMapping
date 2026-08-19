export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type FindingStatus = 'open' | 'fixed' | 'ignored';

export type GatewayPolicyDecision = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';

export interface PromptConcern {
  category: string;
  threat: string;
  impact: string;
  recommendedMitigation: string;
  cwe?: string;
}

export interface PromptSecurityCheckResult {
  id: string;
  prompt: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  summary: string;
  detectedConcerns: PromptConcern[];
  recommendedArchitecture: string[];
  safePromptAlternative?: string;
  suggestedLibraries: string[];
}

export interface SecurityFinding {
  id: string;
  scanId: string;
  title: string;
  vulnerabilityType: string;
  severity: RiskLevel;
  file: string;
  line: number;
  endLine?: number;
  codeSnippet?: string;
  description: string;
  explanation: string;
  exploitScenario?: string;
  suggestedRemediation: string;
  detectedBy: 'AI_SCANNER' | 'SEMGREP' | 'SNYK' | 'GITHUB_MCP' | 'STATIC_RULES';
  cwe: string;
  status: FindingStatus;
  createdAt: string;
  fixedAt?: string;
}

export interface GatewayActionRule {
  id: string;
  actionName: string;
  actionKey: string;
  category: 'ENVIRONMENT' | 'DATABASE' | 'PACKAGES' | 'SYSTEM' | 'DEPLOYMENT' | 'CREDENTIALS';
  defaultPolicy: GatewayPolicyDecision;
  currentPolicy: GatewayPolicyDecision;
  riskLevel: RiskLevel;
  description: string;
  requiresReason: boolean;
}

export interface ApprovalRequest {
  id: string;
  actionKey: string;
  actionName: string;
  initiatedBy: string; // e.g. "AI Code Agent (Gemini-3.7)", "CLI Script"
  reason: string;
  riskLevel: RiskLevel;
  details: Record<string, any>;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  timestamp: string;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  actionKey: string;
  actionName: string;
  userDecision: 'APPROVED' | 'DENIED' | 'ALLOWED_AUTO' | 'DENIED_AUTO';
  initiatedBy: string;
  riskLevel: RiskLevel;
  reason: string;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export interface McpTool {
  id: string;
  name: string;
  slug: 'semgrep' | 'snyk' | 'github_mcp' | 'ai_agent_mcp';
  category: string;
  version: string;
  status: 'CONNECTED' | 'STANDBY' | 'SCANNING' | 'ERROR';
  isRealEngine: boolean; // false for demo/mock adapter
  description: string;
  supportedLanguages: string[];
  lastScanTime?: string;
  findingsCount: number;
  config: {
    endpoint?: string;
    ruleset?: string;
    mode: 'STANDALONE_MCP' | 'ADAPTER_MOCK';
  };
}

export interface SecurityFixPatch {
  findingId: string;
  vulnerabilityTitle: string;
  flawDescription: string;
  whyDangerous: string;
  exploitVector: string;
  originalCode: string;
  patchedCode: string;
  diffSummary: string[];
  securityImprovements: string[];
  preventativeMeasures: string[];
}

export interface SecurityReportData {
  scanId: string;
  projectName: string;
  targetFile: string;
  generatedAt: string;
  beforeStats: {
    score: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  afterStats: {
    score: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  fixedCount: number;
  falsePositivesCount: number;
  avgTimeToFixSeconds: number;
  toolsUsed: string[];
  owaspTop10Coverage: { category: string; count: number; status: 'RESOLVED' | 'WARNING' | 'CLEAN' }[];
  complianceNotes: string;
}
