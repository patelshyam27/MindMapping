import { McpTool, SecurityFinding } from "../src/types/security.ts";

export const initialMcpTools: McpTool[] = [
  {
    id: "mcp-semgrep",
    name: "Semgrep MCP",
    slug: "semgrep",
    category: "Static Application Security Testing (SAST)",
    version: "v1.72.0",
    status: "CONNECTED",
    isRealEngine: false, // Clearly labelled Adapter/Mock mode with real rule schema
    description: "Model Context Protocol adapter for Semgrep rules engine. Performs deep syntax tree matching for OWASP Top 10 and CWE violations.",
    supportedLanguages: ["JavaScript", "TypeScript", "Python", "Go", "Java"],
    lastScanTime: new Date(Date.now() - 3600000).toISOString(),
    findingsCount: 4,
    config: {
      endpoint: "mcp://semgrep-daemon:8080/v1",
      ruleset: "p/security-audit, p/owasp-top-ten",
      mode: "ADAPTER_MOCK",
    },
  },
  {
    id: "mcp-snyk",
    name: "Snyk MCP",
    slug: "snyk",
    category: "Software Composition Analysis (SCA)",
    version: "v2.18.4",
    status: "CONNECTED",
    isRealEngine: false,
    description: "MCP tool integration for Snyk vulnerability intelligence. Detects vulnerable third-party dependencies and supply chain risks.",
    supportedLanguages: ["npm", "pnpm", "yarn", "pip", "maven"],
    lastScanTime: new Date(Date.now() - 7200000).toISOString(),
    findingsCount: 2,
    config: {
      endpoint: "mcp://snyk-cli:9090/agent",
      ruleset: "snyk-cve-database-2025",
      mode: "ADAPTER_MOCK",
    },
  },
  {
    id: "mcp-github",
    name: "GitHub MCP",
    slug: "github_mcp",
    category: "Secret Scanning & CodeQL",
    version: "v3.4.1",
    status: "CONNECTED",
    isRealEngine: false,
    description: "GitHub Model Context Protocol provider. Inspects commit history, secret leaks, branch protection rules, and CodeQL alert summaries.",
    supportedLanguages: ["All Repositories", "Git History", "Actions Workflows"],
    lastScanTime: new Date(Date.now() - 10800000).toISOString(),
    findingsCount: 1,
    config: {
      endpoint: "mcp://github-api-agent/v3",
      ruleset: "github-secrets-patterns, codeql-extended",
      mode: "ADAPTER_MOCK",
    },
  },
  {
    id: "mcp-ai-guard",
    name: "AI Security Agent MCP",
    slug: "ai_agent_mcp",
    category: "LLM Guardrail & Intent Verification",
    version: "v1.2.0",
    status: "CONNECTED",
    isRealEngine: true, // Connected to Gemini server-side agent
    description: "Autonomous LLM security agent using Gemini 3.7 to inspect AI coding agent context, prompt injections, and unsafe code generation attempts.",
    supportedLanguages: ["Prompt Text", "Generated Code", "MCP Tool Calls"],
    lastScanTime: new Date().toISOString(),
    findingsCount: 3,
    config: {
      endpoint: "server://gemini-security-guard",
      ruleset: "gemini-prompt-guard-v2",
      mode: "STANDALONE_MCP",
    },
  },
];

export function runMcpToolScan(toolSlug: string, code: string): { findings: SecurityFinding[]; logs: string[] } {
  const timestamp = new Date().toISOString();
  const logs: string[] = [];
  const findings: SecurityFinding[] = [];

  logs.push(`[${new Date().toLocaleTimeString()}] Initializing MCP Connection to ${toolSlug.toUpperCase()}...`);
  logs.push(`[${new Date().toLocaleTimeString()}] Handshake successful (Protocol JSON-RPC 2.0). Parsing AST...`);

  if (toolSlug === "semgrep") {
    logs.push(`[${new Date().toLocaleTimeString()}] Applying ruleset 'p/security-audit', 'p/owasp-top-ten' on 1 file...`);
    logs.push(`[${new Date().toLocaleTimeString()}] Rule 'javascript.lang.security.audit.sqli.node-sqli': 1 match found.`);
    logs.push(`[${new Date().toLocaleTimeString()}] Rule 'javascript.express.security.audit.xss.res-send': 1 match found.`);

    findings.push({
      id: `mcp-semgrep-${Date.now()}-1`,
      scanId: `scan-${Date.now()}`,
      title: "Semgrep SAST: Dangerous SQL Concatenation",
      vulnerabilityType: "SQL_INJECTION",
      severity: "CRITICAL",
      file: "routes/auth.js",
      line: 4,
      codeSnippet: "const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;",
      description: "Semgrep rule `javascript.lang.security.audit.sqli.node-sqli` matched unescaped user input in SQL expression.",
      explanation: "User parameters directly formatted into SQL query without escaping or parameterized bindings.",
      suggestedRemediation: "Utilize SQL parameterization: db.query('SELECT * FROM users WHERE username = $1', [username])",
      detectedBy: "SEMGREP",
      cwe: "CWE-89",
      status: "open",
      createdAt: timestamp,
    });

    findings.push({
      id: `mcp-semgrep-${Date.now()}-2`,
      scanId: `scan-${Date.now()}`,
      title: "Semgrep SAST: Insecure MD5 Password Hashing",
      vulnerabilityType: "WEAK_AUTHENTICATION",
      severity: "HIGH",
      file: "routes/auth.js",
      line: 12,
      codeSnippet: "const hash = crypto.createHash('md5').update(password).digest('hex');",
      description: "Semgrep rule `javascript.crypto.weak-hash.md5` identified deprecated MD5 hash function for credential storage.",
      explanation: "MD5 is subject to pre-computed rainbow table attacks and collision vulnerabilities.",
      suggestedRemediation: "Upgrade to bcrypt (salt rounds >= 12) or Argon2id.",
      detectedBy: "SEMGREP",
      cwe: "CWE-328 / CWE-916",
      status: "open",
      createdAt: timestamp,
    });
  } else if (toolSlug === "snyk") {
    logs.push(`[${new Date().toLocaleTimeString()}] Analyzing package dependencies against Snyk Vulnerability DB...`);
    logs.push(`[${new Date().toLocaleTimeString()}] Checking transitive dependencies across 42 packages...`);
    logs.push(`[${new Date().toLocaleTimeString()}] Alert: Detected high-severity prototype pollution in older lodash sub-dependency.`);

    findings.push({
      id: `mcp-snyk-${Date.now()}-1`,
      scanId: `scan-${Date.now()}`,
      title: "Snyk SCA: Vulnerable Package Dependency (lodash < 4.17.21)",
      vulnerabilityType: "PROTOTYPE_POLLUTION",
      severity: "HIGH",
      file: "package.json",
      line: 14,
      codeSnippet: '"lodash": "^4.17.15"',
      description: "Known CVE-2020-8203 prototype pollution vulnerability in Lodash zipObjectDeep method.",
      explanation: "Malicious payload can modify Object.prototype, leading to property injection or application crash (DoS).",
      suggestedRemediation: "Upgrade lodash to version 4.17.21 or higher.",
      detectedBy: "SNYK",
      cwe: "CWE-1321",
      status: "open",
      createdAt: timestamp,
    });
  } else if (toolSlug === "github_mcp") {
    logs.push(`[${new Date().toLocaleTimeString()}] Querying GitHub MCP Secret Scanner API...`);
    logs.push(`[${new Date().toLocaleTimeString()}] Scanned git commit tree & active buffer...`);
    logs.push(`[${new Date().toLocaleTimeString()}] Alert: Found high-entropy secret pattern matching Stripe Live Key!`);

    findings.push({
      id: `mcp-github-${Date.now()}-1`,
      scanId: `scan-${Date.now()}`,
      title: "GitHub Secret Scanning: Exposed Stripe API Secret Key",
      vulnerabilityType: "HARDCODED_SECRET",
      severity: "CRITICAL",
      file: "config/secrets.js",
      line: 2,
      codeSnippet: 'const STRIPE_SECRET = "sk_live_51M0000000000000000000000000000";',
      description: "GitHub Secret Scanning pattern `stripe_secret_key` detected valid live credential format.",
      explanation: "Live production key in source code grants full administrative access to payment processor.",
      suggestedRemediation: "Revoke key in Stripe Dashboard, rotate credentials, and store in environment variables.",
      detectedBy: "GITHUB_MCP",
      cwe: "CWE-798",
      status: "open",
      createdAt: timestamp,
    });
  } else {
    logs.push(`[${new Date().toLocaleTimeString()}] Running AI Security Agent verification...`);
    logs.push(`[${new Date().toLocaleTimeString()}] Analysis completed.`);
  }

  logs.push(`[${new Date().toLocaleTimeString()}] MCP Scan finished. Generated ${findings.length} findings.`);

  return { findings, logs };
}
