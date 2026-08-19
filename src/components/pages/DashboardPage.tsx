import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Cpu,
  Code2,
  Terminal,
  Activity,
  Play,
  FileText
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";

export const DashboardPage: React.FC = () => {
  const { state, setActiveTab, setShowDemoWalkthrough, setSelectedFindingForFix, theme } = useSecurity();

  const openFindings = state.findings.filter((f) => f.status === "open");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner with Prominent Scan Action */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl transition-colors ${
        theme === "light"
          ? "bg-white border-slate-200 text-slate-900 shadow-slate-200/50"
          : "bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-slate-800 text-slate-100"
      }`}>
        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] border border-emerald-500/20 font-bold">
              AI Security Guard Active
            </span>
            <span className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
              Zero-Trust Vibe Coding Architecture
            </span>
          </div>
          <h2 className={`text-xl font-bold tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
            Vibe Coding Security Operations Center
          </h2>
          <p className={`text-xs leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
            Continuous automated security interceptor safeguarding AI-assisted development across prompt analysis, code generation, MCP tool validation, and human-in-the-loop approvals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            id="btn-dash-new-scan"
            onClick={() => setActiveTab("scanner")}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/20 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-slate-950" />
            <span>New Security Scan</span>
          </button>

          <button
            id="btn-dash-demo-flow"
            onClick={() => setShowDemoWalkthrough(true)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 border transition-colors cursor-pointer ${
              theme === "light"
                ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-500" />
            <span>Demonstration Tour</span>
          </button>
        </div>

        {/* Subtle Background Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Overall Score */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"
        }`}>
          <div className={`flex items-center justify-between text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            <span className="font-medium">Security Score</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono ${
              state.score >= 80 ? "text-emerald-500" : state.score >= 60 ? "text-amber-500" : "text-rose-500"
            }`}>
              {state.score}%
            </span>
            <span className="text-[11px] text-slate-400">
              {state.score >= 80 ? "Hardened" : state.score >= 60 ? "Elevated Risk" : "Critical Risk"}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                state.score >= 80 ? "bg-emerald-500" : state.score >= 60 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${state.score}%` }}
            />
          </div>
        </div>

        {/* Critical Vulnerabilities */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-rose-900/30"
        }`}>
          <div className="flex items-center justify-between text-rose-500 text-xs">
            <span className="font-medium">Critical Flaws</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-rose-500">{state.stats.critical}</span>
            <span className="text-[11px] text-rose-500 font-medium">Immediate Patch Required</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">SQLi, Secrets, Eval</div>
        </div>

        {/* High Issues */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-amber-900/30"
        }`}>
          <div className="flex items-center justify-between text-amber-500 text-xs">
            <span className="font-medium">High Issues</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-amber-500">{state.stats.high}</span>
            <span className="text-[11px] text-amber-500 font-medium">Severe Flaws</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">MD5 Auth, XSS, Paths</div>
        </div>

        {/* Automated AI Fixes */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-emerald-900/30"
        }`}>
          <div className="flex items-center justify-between text-emerald-500 text-xs">
            <span className="font-medium">AI Patched Flaws</span>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-cyan-500">{state.stats.fixed}</span>
            <span className="text-[11px] text-emerald-500 font-medium">Verified Clean</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Gemini Patch Engine</div>
        </div>

        {/* Pending Approvals */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"
        }`}>
          <div className={`flex items-center justify-between text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            <span className="font-medium">Gateway Approvals</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-indigo-500">
              {state.approvalRequests.filter((r) => r.status === "PENDING").length}
            </span>
            <span className="text-[11px] text-indigo-500 font-medium">Pending Human Auth</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Zero-Trust Interceptor</div>
        </div>
      </div>

      {/* Vibe Coding Security Lifecycle Flowchart */}
      <div className={`rounded-xl border p-5 space-y-4 ${
        theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>10-Stage Vibe Coding Security Pipeline</span>
            </h3>
            <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
              Interactive stages enforcing security controls at every step
            </p>
          </div>
          <button
            onClick={() => setActiveTab("pre-code")}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Start Flow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pipeline Stage Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {[
            { step: "1", name: "User Prompt", tab: "pre-code", desc: "Intent Input" },
            { step: "2", name: "Pre-Code Check", tab: "pre-code", desc: "Domain Analysis" },
            { step: "3", name: "Risk Score", tab: "pre-code", desc: "0-100 Rating" },
            { step: "4", name: "Gateway Policy", tab: "gateway", desc: "Allow/Deny/Hold" },
            { step: "5", name: "Code Generator", tab: "scanner", desc: "AI Ingestion" },
            { step: "6", name: "Real-Time SAST", tab: "scanner", desc: "AST Vulnerability" },
            { step: "7", name: "MCP Tools", tab: "mcp-tools", desc: "Semgrep/Snyk/GH" },
            { step: "8", name: "Findings Ledger", tab: "findings", desc: "Central Triage" },
            { step: "9", name: "AI Security Fix", tab: "ai-fix", desc: "Patch & Diff" },
            { step: "10", name: "Approval & Report", tab: "reports", desc: "Final Verification" },
          ].map((stage) => (
            <button
              key={stage.step}
              id={`stage-card-${stage.step}`}
              onClick={() => setActiveTab(stage.tab)}
              className={`p-2.5 rounded-lg border text-left transition-all group ${
                theme === "light"
                  ? "bg-slate-50 border-slate-200 hover:border-emerald-500/60 hover:bg-emerald-50/50"
                  : "bg-slate-950 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mb-1 font-bold">
                <span>STAGE {stage.step}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className={`text-xs font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors ${
                theme === "light" ? "text-slate-800" : "text-slate-200"
              }`}>
                {stage.name}
              </div>
              <div className="text-[10px] text-slate-400">
                {stage.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Active Findings & Security Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Findings */}
        <div className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
              <Bug className="w-4 h-4 text-rose-500" />
              <span>Active Security Findings</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                theme === "light" ? "bg-slate-100 text-slate-700" : "bg-slate-800 text-slate-300"
              }`}>
                {openFindings.length}
              </span>
            </h3>
            <button
              onClick={() => setActiveTab("findings")}
              className={`text-xs flex items-center gap-1 font-medium ${
                theme === "light" ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {openFindings.length === 0 ? (
              <div className={`p-6 text-center text-xs rounded-lg border ${
                theme === "light" ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-800 text-slate-400"
              }`}>
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <span>No open vulnerabilities detected! Codebase is secure.</span>
              </div>
            ) : (
              openFindings.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                    theme === "light"
                      ? "bg-slate-50 border-slate-200 hover:border-slate-300"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        f.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                          : f.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                          : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                      }`}>
                        {f.severity}
                      </span>
                      <span className={`text-xs font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                        {f.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Line {f.line}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{f.cwe}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFindingForFix(f);
                      setActiveTab("ai-fix");
                    }}
                    className="px-2.5 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-xs font-medium shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Fix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security Activity Stream */}
        <div className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Real-Time Security Activity Stream</span>
            </h3>
            <button
              onClick={() => setActiveTab("approvals")}
              className={`text-xs flex items-center gap-1 font-medium ${
                theme === "light" ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Audit Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {state.auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border text-xs space-y-1 ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      log.userDecision === "APPROVED" || log.userDecision === "ALLOWED_AUTO"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                        : "bg-rose-500/20 text-rose-600 dark:text-rose-300"
                    }`}>
                      {log.userDecision}
                    </span>
                    <span className={`font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                      {log.actionName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className={`text-[11px] leading-snug ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                  {log.reason}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                  <span>Initiated by: {log.initiatedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
