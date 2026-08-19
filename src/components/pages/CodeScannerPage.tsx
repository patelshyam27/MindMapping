import React, { useState, useEffect } from "react";
import {
  Code2,
  ShieldAlert,
  Bug,
  Sparkles,
  Play,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Layers,
  FileCode,
  Check,
  Copy
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { SecurityFinding } from "../../types/security";

const DEMO_PRESETS = [
  {
    name: "Full Vulnerable Stack (Demo Baseline)",
    desc: "Contains SQLi, Hardcoded Stripe Key, MD5 Auth, Eval, and XSS",
    filename: "routes/auth.js",
    code: `// Vibe-Coded Node.js Express Authentication & Data Handler
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

app.listen(8080);`,
  },
  {
    name: "Hardened Clean Code",
    desc: "Secure version using parameterized SQL, bcrypt, and process.env",
    filename: "routes/auth_secure.js",
    code: `// Secure Node.js Express Authentication Handler
const express = require('express');
const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
const db = require('./database');
const app = express();
app.use(express.json());

// SECURE: Secrets loaded from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

// Secure Login: Parameterized Prepared Statements & Bcrypt Verification
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // SECURE: Parameterized Query avoids SQL Injection
  const query = 'SELECT id, username, password_hash, role FROM users WHERE username = $1';
  const user = await db.query(query, [username]);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // SECURE: Constant-time Bcrypt Password Comparison
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (isValid) {
    return res.json({ token: "jwt_signed_token", role: user.role });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

// SECURE: Safe JSON Calculation without eval()
app.post('/api/admin/calc', (req, res) => {
  const { a, b, op } = req.body;
  const numA = Number(a);
  const numB = Number(b);
  if (isNaN(numA) || isNaN(numB)) {
    return res.status(400).json({ error: "Invalid numbers" });
  }
  let result = 0;
  if (op === "add") result = numA + numB;
  else if (op === "multiply") result = numA * numB;
  res.json({ result });
});

// SECURE: Output Sanitization to prevent XSS
app.get('/api/welcome', (req, res) => {
  const name = sanitizeHtml(String(req.query.name || ""));
  res.json({ message: "Welcome", name });
});

app.listen(8080);`,
  },
];

export const CodeScannerPage: React.FC = () => {
  const { state, scanCode, loading, setSelectedFindingForFix, setActiveTab, theme } = useSecurity();
  const [code, setCode] = useState(state.activeCode || DEMO_PRESETS[0].code);
  const [filename, setFilename] = useState("routes/auth.js");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.activeCode) {
      setCode(state.activeCode);
    }
  }, [state.activeCode]);

  const handleRunScan = async () => {
    await scanCode(code, filename);
  };

  const handleLoadPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setCode(preset.code);
    setFilename(preset.filename);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openFindings = state.findings.filter((f) => f.status === "open");

  // Map line numbers to open findings for direct in-editor highlighting
  const lineFindingMap: Record<number, SecurityFinding> = {};
  openFindings.forEach((f) => {
    lineFindingMap[f.line] = f;
  });

  const lines = code.split("\n");

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-mono text-[11px] border border-emerald-500/30 font-bold">
              Pipeline Stage 6
            </span>
            <span className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
              AST & Real-Time SAST Code Analysis
            </span>
          </div>
          <h2 className={`text-xl font-bold tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
            Real-Time SAST Code Scanner & AST Inspector
          </h2>
          <p className={`text-xs leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
            Inspect source code dynamically for SQL Injection, exposed API secrets, weak cryptography (MD5), and unescaped payloads with line-by-line vulnerability decorations.
          </p>
        </div>

        {/* Scan Actions */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-trigger-code-scan"
            disabled={loading}
            onClick={handleRunScan}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Scanning Code AST...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-slate-950" />
                <span>Scan Code for Vulnerabilities</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Snippet Selector */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border text-xs ${
        theme === "light"
          ? "bg-white border-slate-200 text-slate-700 shadow-sm"
          : "bg-slate-900/90 border-slate-800 text-slate-300"
      }`}>
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold">Quick Demo Samples:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              id={`btn-preset-code-${idx}`}
              onClick={() => handleLoadPreset(preset)}
              className={`px-2.5 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
                theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
                  : "bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-slate-100"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Container */}
      <div className={`rounded-xl border overflow-hidden shadow-2xl ${
        theme === "light"
          ? "bg-white border-slate-200 shadow-slate-200/50"
          : "bg-slate-950 border-slate-800"
      }`}>
        {/* Editor Title Bar */}
        <div className={`h-10 border-b px-4 flex items-center justify-between text-xs ${
          theme === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-slate-800"
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className={`font-mono font-medium ml-2 ${theme === "light" ? "text-slate-800" : "text-slate-300"}`}>
              {filename}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 p-0.5 rounded border text-[11px] ${
              theme === "light" ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800"
            }`}>
              <button
                onClick={() => setIsEditing(false)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  !isEditing
                    ? "bg-emerald-600 text-slate-950 font-bold"
                    : theme === "light" ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Annotated View
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  isEditing
                    ? "bg-emerald-600 text-slate-950 font-bold"
                    : theme === "light" ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Raw Edit
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className={`text-xs flex items-center gap-1 cursor-pointer ${
                theme === "light" ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <span className="text-[11px] font-mono font-bold text-rose-500">
              {openFindings.length} open vulnerabilities
            </span>
          </div>
        </div>

        {/* Editor Body */}
        {isEditing ? (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={18}
            className={`w-full p-4 font-mono text-xs leading-relaxed focus:outline-none resize-y border-none ${
              theme === "light"
                ? "bg-slate-50 text-slate-900"
                : "bg-slate-950 text-slate-200"
            }`}
            spellCheck={false}
          />
        ) : (
          <div className={`max-h-[420px] overflow-y-auto font-mono text-xs p-2 select-text ${
            theme === "light" ? "bg-slate-50 text-slate-800" : "bg-slate-950 text-slate-200"
          }`}>
            {lines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const finding = lineFindingMap[lineNum];
              const isVulnerable = !!finding;

              return (
                <div
                  key={lineNum}
                  className={`flex items-start py-0.5 px-2 rounded group transition-colors ${
                    isVulnerable
                      ? finding.severity === "CRITICAL"
                        ? theme === "light"
                          ? "bg-rose-100/70 border-l-2 border-rose-600 text-rose-950 font-medium"
                          : "bg-rose-950/40 border-l-2 border-rose-500 text-rose-200"
                        : theme === "light"
                        ? "bg-amber-100/70 border-l-2 border-amber-600 text-amber-950 font-medium"
                        : "bg-amber-950/30 border-l-2 border-amber-500 text-amber-200"
                      : theme === "light"
                      ? "hover:bg-slate-200/60 text-slate-800"
                      : "hover:bg-slate-900/60 text-slate-300"
                  }`}
                >
                  {/* Line Number */}
                  <span className={`w-9 shrink-0 text-right pr-3 select-none text-[11px] ${
                    theme === "light" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {lineNum}
                  </span>

                  {/* Code Line Text */}
                  <div className="flex-1 whitespace-pre overflow-x-auto leading-relaxed">
                    {lineText || " "}
                  </div>

                  {/* Vulnerability Marker Pill if line is vulnerable */}
                  {finding && (
                    <button
                      onClick={() => {
                        setSelectedFindingForFix(finding);
                        setActiveTab("ai-fix");
                      }}
                      className={`ml-2 text-[10px] font-mono px-2 py-0.2 rounded font-bold shrink-0 flex items-center gap-1 shadow-sm cursor-pointer ${
                        finding.severity === "CRITICAL"
                          ? "bg-rose-500 text-white hover:bg-rose-600"
                          : "bg-amber-500 text-slate-950 hover:bg-amber-600"
                      }`}
                    >
                      <ShieldAlert className="w-3 h-3" />
                      <span>{finding.cwe}: {finding.title}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detected Vulnerabilities Line-by-Line Drawer */}
      <div className={`rounded-xl border p-5 space-y-4 shadow-xl ${
        theme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-slate-900/90 border-slate-800"
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
            <Bug className="w-4 h-4 text-rose-500" />
            <span>SAST Findings on Current Code ({openFindings.length})</span>
          </h3>
          <span className={`text-xs font-mono ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Click finding to launch automated AI fix
          </span>
        </div>

        {openFindings.length === 0 ? (
          <div className={`p-6 text-center text-xs rounded-lg border ${
            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-800 text-slate-400"
          }`}>
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <span>No vulnerabilities detected on this file! All static and AI security rules passed.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {openFindings.map((f) => (
              <div
                key={f.id}
                className={`p-4 rounded-lg border space-y-2.5 flex flex-col justify-between ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        f.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                      }`}>
                        {f.severity}
                      </span>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        Line {f.line}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{f.cwe}</span>
                  </div>

                  <h4 className={`text-xs font-bold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                    {f.title}
                  </h4>
                  <p className={`text-xs leading-snug ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                    {f.description}
                  </p>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between ${
                  theme === "light" ? "border-slate-200" : "border-slate-800"
                }`}>
                  <span className={`text-[11px] font-mono ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                    Source: {f.detectedBy}
                  </span>
                  <button
                    id={`btn-open-ai-fix-${f.id}`}
                    onClick={() => {
                      setSelectedFindingForFix(f);
                      setActiveTab("ai-fix");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Generate AI Fix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
