import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  analyzePromptSecurity,
  scanCodeForVulnerabilities,
  generateAIFixPatch,
} from "./server/securityEngine.ts";
import {
  initialMcpTools,
  runMcpToolScan,
} from "./server/mcpEngine.ts";
import {
  ApprovalRequest,
  AuditLogEntry,
  GatewayActionRule,
  McpTool,
  SecurityFinding,
  PromptSecurityCheckResult,
} from "./src/types/security.ts";

// Sample initial vulnerable code for Demo Mode
export const DEMO_VULNERABLE_CODE = `// Vibe-Coded Node.js Express Authentication & Data Handler
const express = require('express');
const crypto = require('crypto');
const db = require('./database');
const app = express();
app.use(express.json());

// CRITICAL RISK: Hardcoded API Secret for payment & JWT
const JWT_SECRET = "super_secret_jwt_key_12345_never_share";
const STRIPE_KEY = "sk_live_51M0000000000000000000000000000";

// Vulnerable Login Route: Insecure SQL String Concatenation & MD5 Hashing
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // VULNERABILITY 1: SQL Injection (Direct string interpolation)
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  const user = await db.query(query);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // VULNERABILITY 2: Broken Authentication / Legacy MD5 Hash
  const hash = crypto.createHash('md5').update(password).digest('hex');
  if (user.password === password) {
    return res.json({ token: "token_123", role: user.role });
  }
});

// Vulnerable Admin Route: Unsafe Code Execution (eval)
app.post('/api/admin/calc', (req, res) => {
  const { expression } = req.body;
  // VULNERABILITY 3: Remote Code Execution via eval()
  const result = eval(expression);
  res.json({ result });
});

// Vulnerable Greeting Route: Reflected XSS
app.get('/api/welcome', (req, res) => {
  const { name } = req.query;
  // VULNERABILITY 4: Cross-Site Scripting (Unescaped output)
  res.send(\`<h1>Welcome \${name}!</h1>\`);
});

app.listen(8080);`;

// In-Memory State
let activeCode = DEMO_VULNERABLE_CODE;
let promptHistory: PromptSecurityCheckResult[] = [];
let findings: SecurityFinding[] = [];
let mcpTools: McpTool[] = [...initialMcpTools];

let gatewayRules: GatewayActionRule[] = [
  {
    id: "gw-1",
    actionKey: "ENV_ACCESS",
    actionName: "Accessing Environment Variables",
    category: "ENVIRONMENT",
    defaultPolicy: "REQUIRE_APPROVAL",
    currentPolicy: "REQUIRE_APPROVAL",
    riskLevel: "HIGH",
    description: "Read server environment variables containing API secrets and DB credentials.",
    requiresReason: true,
  },
  {
    id: "gw-2",
    actionKey: "SECRET_READ",
    actionName: "Accessing Secret Vault / AWS Credentials",
    category: "CREDENTIALS",
    defaultPolicy: "REQUIRE_APPROVAL",
    currentPolicy: "REQUIRE_APPROVAL",
    riskLevel: "CRITICAL",
    description: "Reading sensitive secrets stored in ~/.aws, ~/.ssh, or external cloud secret managers.",
    requiresReason: true,
  },
  {
    id: "gw-3",
    actionKey: "DB_MIGRATION",
    actionName: "Executing Database Schema Changes / DDL",
    category: "DATABASE",
    defaultPolicy: "REQUIRE_APPROVAL",
    currentPolicy: "REQUIRE_APPROVAL",
    riskLevel: "HIGH",
    description: "Altering database tables, dropping indexes, or running destructive migration queries.",
    requiresReason: true,
  },
  {
    id: "gw-4",
    actionKey: "NPM_INSTALL",
    actionName: "Installing External NPM Packages",
    category: "PACKAGES",
    defaultPolicy: "ALLOW",
    currentPolicy: "ALLOW",
    riskLevel: "MEDIUM",
    description: "Adding new third-party dependencies from npm registry into project manifests.",
    requiresReason: false,
  },
  {
    id: "gw-5",
    actionKey: "SEC_CONFIG_CHANGE",
    actionName: "Modifying Security & CORS Settings",
    category: "SYSTEM",
    defaultPolicy: "REQUIRE_APPROVAL",
    currentPolicy: "REQUIRE_APPROVAL",
    riskLevel: "HIGH",
    description: "Changing CORS origins, disabling CSRF tokens, or weakening rate-limit thresholds.",
    requiresReason: true,
  },
  {
    id: "gw-6",
    actionKey: "PROD_DEPLOY",
    actionName: "Deploying Code to Production Container",
    category: "DEPLOYMENT",
    defaultPolicy: "REQUIRE_APPROVAL",
    currentPolicy: "REQUIRE_APPROVAL",
    riskLevel: "CRITICAL",
    description: "Triggering live production deployments or pushing commits directly to main branch.",
    requiresReason: true,
  },
];

let approvalRequests: ApprovalRequest[] = [
  {
    id: "req-env-101",
    actionKey: "ENV_ACCESS",
    actionName: "Accessing Environment Variables",
    initiatedBy: "AI Coding Assistant (Gemini-3.7)",
    reason: "Required to read GEMINI_API_KEY and DATABASE_URL for runtime setup.",
    riskLevel: "HIGH",
    details: {
      requestedKeys: ["GEMINI_API_KEY", "DATABASE_URL", "STRIPE_SECRET_KEY"],
      scope: "read-only",
      origin: "VibeCodingAgent_Worker"
    },
    status: "PENDING",
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: "req-db-102",
    actionKey: "DB_MIGRATION",
    actionName: "Executing Database Schema Changes / DDL",
    initiatedBy: "Auto-Scaffold Agent",
    reason: "Create new 'users_audit_v2' table with encrypted bcrypt password_hash columns.",
    riskLevel: "HIGH",
    details: {
      migrationFile: "002_add_secure_auth.sql",
      targetDatabase: "production_db"
    },
    status: "PENDING",
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
];

let auditLogs: AuditLogEntry[] = [
  {
    id: "audit-1",
    actionKey: "SEC_CONFIG_CHANGE",
    actionName: "Modifying Security & CORS Settings",
    userDecision: "APPROVED",
    initiatedBy: "Security Gateway Admin",
    riskLevel: "HIGH",
    reason: "Enabled strict CSP and HSTS headers on Express application.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: "127.0.0.1",
  },
  {
    id: "audit-2",
    actionKey: "NPM_INSTALL",
    actionName: "Installing External NPM Packages",
    userDecision: "ALLOWED_AUTO",
    initiatedBy: "Vibe Coding Assistant",
    riskLevel: "MEDIUM",
    reason: "Installed 'bcrypt' and 'zod' for secure credential verification.",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    ipAddress: "127.0.0.1",
  },
  {
    id: "audit-3",
    actionKey: "SECRET_READ",
    actionName: "Accessing Secret Vault / AWS Credentials",
    userDecision: "DENIED",
    initiatedBy: "Third-party Extension Plugin",
    riskLevel: "CRITICAL",
    reason: "Attempted unauthorized read of ~/.aws/credentials without authorization token.",
    timestamp: new Date(Date.now() - 1500000).toISOString(),
    ipAddress: "127.0.0.1",
  },
];

// Initialize baseline scan findings
async function initDemoFindings() {
  findings = await scanCodeForVulnerabilities(activeCode, "routes/auth.js");
}
initDemoFindings();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Full Security State
  app.get("/api/security/state", (_req, res) => {
    const critical = findings.filter((f) => f.severity === "CRITICAL" && f.status === "open").length;
    const high = findings.filter((f) => f.severity === "HIGH" && f.status === "open").length;
    const medium = findings.filter((f) => f.severity === "MEDIUM" && f.status === "open").length;
    const low = findings.filter((f) => f.severity === "LOW" && f.status === "open").length;
    const fixed = findings.filter((f) => f.status === "fixed").length;
    const openTotal = critical + high + medium + low;

    // Calculate dynamic security score (100 is perfect)
    let penalty = critical * 25 + high * 15 + medium * 8 + low * 3;
    let score = Math.max(10, Math.min(100, 100 - penalty + fixed * 5));
    if (openTotal === 0) score = 98;

    res.json({
      activeCode,
      score,
      stats: {
        critical,
        high,
        medium,
        low,
        fixed,
        total: findings.length,
        open: openTotal,
      },
      findings,
      gatewayRules,
      approvalRequests,
      auditLogs,
      mcpTools,
      promptHistory,
    });
  });

  // Pre-Code Prompt Security Check
  app.post("/api/security/prompt-check", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt string is required" });
      }

      const result = await analyzePromptSecurity(prompt);
      promptHistory.unshift(result);
      if (promptHistory.length > 10) promptHistory.pop();

      res.json(result);
    } catch (err: any) {
      console.error("Prompt check error:", err);
      res.status(500).json({ error: err.message || "Failed to analyze prompt" });
    }
  });

  // Real-Time Code Scan
  app.post("/api/security/code-scan", async (req, res) => {
    try {
      const { code, filename } = req.body;
      if (typeof code !== "string") {
        return res.status(400).json({ error: "Code string is required" });
      }

      activeCode = code;
      const scanResults = await scanCodeForVulnerabilities(code, filename || "app.js");
      
      // Preserve fixed state if matching ID or replace with new findings
      findings = scanResults;

      // Log activity
      auditLogs.unshift({
        id: "audit-" + Date.now(),
        actionKey: "CODE_SCAN",
        actionName: "Real-Time SAST Security Scan",
        userDecision: "ALLOWED_AUTO",
        initiatedBy: "Security Scanner Engine",
        riskLevel: scanResults.some((f) => f.severity === "CRITICAL") ? "CRITICAL" : "LOW",
        reason: `Scanned ${filename || "app.js"} (${code.split("\n").length} lines) - Found ${scanResults.length} issues.`,
        timestamp: new Date().toISOString(),
        ipAddress: "127.0.0.1",
      });

      res.json({ findings, code: activeCode });
    } catch (err: any) {
      console.error("Code scan error:", err);
      res.status(500).json({ error: err.message || "Failed to scan code" });
    }
  });

  // Generate AI Security Fix
  app.post("/api/security/ai-fix", async (req, res) => {
    try {
      const { findingId, code } = req.body;
      const targetCode = code || activeCode;
      const targetFinding = findings.find((f) => f.id === findingId) || findings[0];

      if (!targetFinding) {
        return res.status(404).json({ error: "Finding not found to remediate" });
      }

      const patch = await generateAIFixPatch(targetCode, targetFinding);
      res.json(patch);
    } catch (err: any) {
      console.error("AI fix error:", err);
      res.status(500).json({ error: err.message || "Failed to generate fix patch" });
    }
  });

  // Apply Security Fix
  app.post("/api/security/apply-fix", (req, res) => {
    try {
      const { findingId, patchedCode } = req.body;
      if (typeof patchedCode !== "string") {
        return res.status(400).json({ error: "Patched code is required" });
      }

      activeCode = patchedCode;
      const targetFinding = findings.find((f) => f.id === findingId);
      if (targetFinding) {
        targetFinding.status = "fixed";
        targetFinding.fixedAt = new Date().toISOString();
      }

      // Add to audit log
      auditLogs.unshift({
        id: "audit-" + Date.now(),
        actionKey: "APPLY_SECURITY_PATCH",
        actionName: "Applied AI Security Patch",
        userDecision: "APPROVED",
        initiatedBy: "Security Guard AI + User Approval",
        riskLevel: targetFinding?.severity || "HIGH",
        reason: `Remediated ${targetFinding?.title || "vulnerability"} and verified clean source state.`,
        timestamp: new Date().toISOString(),
        ipAddress: "127.0.0.1",
      });

      res.json({ success: true, activeCode, finding: targetFinding });
    } catch (err: any) {
      console.error("Apply fix error:", err);
      res.status(500).json({ error: err.message || "Failed to apply fix" });
    }
  });

  // Update Finding Status (Open / Fixed / Ignored)
  app.post("/api/security/finding-status", (req, res) => {
    const { findingId, status } = req.body;
    const finding = findings.find((f) => f.id === findingId);
    if (!finding) {
      return res.status(404).json({ error: "Finding not found" });
    }
    finding.status = status;
    if (status === "fixed") finding.fixedAt = new Date().toISOString();
    res.json({ success: true, finding });
  });

  // Security Gateway Evaluation
  app.post("/api/security/gateway-check", (req, res) => {
    const { actionKey, initiatedBy, reason, details } = req.body;
    const rule = gatewayRules.find((r) => r.actionKey === actionKey);

    if (!rule) {
      return res.status(400).json({ error: "Unknown gateway action key" });
    }

    if (rule.currentPolicy === "ALLOW") {
      auditLogs.unshift({
        id: "audit-" + Date.now(),
        actionKey,
        actionName: rule.actionName,
        userDecision: "ALLOWED_AUTO",
        initiatedBy: initiatedBy || "AI Agent",
        riskLevel: rule.riskLevel,
        reason: reason || rule.description,
        timestamp: new Date().toISOString(),
      });
      return res.json({ decision: "ALLOW", message: "Action permitted under gateway policy rule." });
    }

    if (rule.currentPolicy === "DENY") {
      auditLogs.unshift({
        id: "audit-" + Date.now(),
        actionKey,
        actionName: rule.actionName,
        userDecision: "DENIED_AUTO",
        initiatedBy: initiatedBy || "AI Agent",
        riskLevel: rule.riskLevel,
        reason: `Blocked by Security Gateway Policy: ${rule.description}`,
        timestamp: new Date().toISOString(),
      });
      return res.json({ decision: "DENY", message: "Action blocked by Security Gateway Policy." });
    }

    // REQUIRE_APPROVAL
    const newReq: ApprovalRequest = {
      id: "req-" + Date.now(),
      actionKey,
      actionName: rule.actionName,
      initiatedBy: initiatedBy || "AI Code Agent (Gemini-3.7)",
      reason: reason || "Action requires explicit user authorization before execution.",
      riskLevel: rule.riskLevel,
      details: details || {},
      status: "PENDING",
      timestamp: new Date().toISOString(),
    };
    approvalRequests.unshift(newReq);

    res.json({
      decision: "REQUIRE_APPROVAL",
      message: "Action held in Security Gateway. Explicit user approval required.",
      request: newReq,
    });
  });

  // Update Gateway Rule Policy
  app.post("/api/security/gateway-policy-update", (req, res) => {
    const { actionKey, policy } = req.body;
    const rule = gatewayRules.find((r) => r.actionKey === actionKey);
    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }
    rule.currentPolicy = policy;
    res.json({ success: true, rule });
  });

  // Resolve User Approval Request
  app.post("/api/security/approval-resolve", (req, res) => {
    const { requestId, decision, notes } = req.body; // decision: "APPROVED" | "DENIED"
    const reqItem = approvalRequests.find((r) => r.id === requestId);
    if (!reqItem) {
      return res.status(404).json({ error: "Approval request not found" });
    }

    reqItem.status = decision;
    reqItem.resolvedAt = new Date().toISOString();
    reqItem.resolvedBy = "Security Officer (User)";
    reqItem.notes = notes;

    auditLogs.unshift({
      id: "audit-" + Date.now(),
      actionKey: reqItem.actionKey,
      actionName: reqItem.actionName,
      userDecision: decision === "APPROVED" ? "APPROVED" : "DENIED",
      initiatedBy: reqItem.initiatedBy,
      riskLevel: reqItem.riskLevel,
      reason: `${decision === "APPROVED" ? "Authorized" : "Rejected"} by User: ${reqItem.reason} ${notes ? `(${notes})` : ""}`,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1",
    });

    res.json({ success: true, request: reqItem });
  });

  // Run MCP Tool Scan
  app.post("/api/mcp/scan", (req, res) => {
    const { toolSlug } = req.body;
    const tool = mcpTools.find((t) => t.slug === toolSlug);
    if (!tool) {
      return res.status(404).json({ error: "MCP Tool not found" });
    }

    const { findings: mcpFindings, logs } = runMcpToolScan(toolSlug, activeCode);
    
    // Add unique findings
    mcpFindings.forEach((mf) => {
      if (!findings.some((existing) => existing.title === mf.title)) {
        findings.push(mf);
      }
    });

    tool.lastScanTime = new Date().toISOString();
    tool.findingsCount = mcpFindings.length;

    auditLogs.unshift({
      id: "audit-" + Date.now(),
      actionKey: "MCP_SCAN",
      actionName: `Executed ${tool.name} Protocol Scan`,
      userDecision: "ALLOWED_AUTO",
      initiatedBy: `MCP Client (${tool.name})`,
      riskLevel: "MEDIUM",
      reason: `Scan completed against active buffer. Reported ${mcpFindings.length} security alerts.`,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1",
    });

    res.json({ success: true, tool, findings: mcpFindings, logs });
  });

  // Reset Demo State
  app.post("/api/security/reset-demo", async (_req, res) => {
    activeCode = DEMO_VULNERABLE_CODE;
    findings = await scanCodeForVulnerabilities(activeCode, "routes/auth.js");
    approvalRequests = [
      {
        id: "req-env-101",
        actionKey: "ENV_ACCESS",
        actionName: "Accessing Environment Variables",
        initiatedBy: "AI Coding Assistant (Gemini-3.7)",
        reason: "Required to read GEMINI_API_KEY and DATABASE_URL for runtime setup.",
        riskLevel: "HIGH",
        details: {
          requestedKeys: ["GEMINI_API_KEY", "DATABASE_URL", "STRIPE_SECRET_KEY"],
          scope: "read-only",
        },
        status: "PENDING",
        timestamp: new Date().toISOString(),
      },
    ];
    res.json({ success: true, message: "Demo state reset to vulnerable baseline." });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Vibe Coding Security Guard] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
