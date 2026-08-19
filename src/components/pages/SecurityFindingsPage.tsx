import React, { useState } from "react";
import {
  Bug,
  Filter,
  Search,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  EyeOff,
  Wrench,
  FileCode,
  Tag
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { RiskLevel, SecurityFinding } from "../../types/security";

export const SecurityFindingsPage: React.FC = () => {
  const { state, setSelectedFindingForFix, setActiveTab, updateFindingStatus, theme } = useSecurity();
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [toolFilter, setToolFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFindings = state.findings.filter((f) => {
    if (severityFilter !== "ALL" && f.severity !== severityFilter) return false;
    if (statusFilter !== "ALL" && f.status !== statusFilter) return false;
    if (toolFilter !== "ALL" && f.detectedBy !== toolFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.cwe.toLowerCase().includes(q) ||
        f.file.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 font-mono text-[11px] border border-rose-500/30 font-bold">
            Pipeline Stage 8
          </span>
          <span className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Vulnerability Triage & Registry
          </span>
        </div>
        <h2 className={`text-xl font-bold tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
          Central Security Findings Ledger
        </h2>
        <p className={`text-xs leading-relaxed max-w-3xl ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
          Unified vulnerability ledger consolidating alerts from AST SAST scanners, Semgrep, Snyk SCA, and GitHub MCP Secret scans.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className={`p-4 rounded-xl border space-y-3 shadow-lg ${
        theme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-slate-900/90 border-slate-800"
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, CWE-89, file, description..."
              className={`w-full pl-9 pr-4 py-2 rounded-lg border text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                theme === "light"
                  ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  : "bg-slate-950 border-slate-700 text-slate-200 placeholder-slate-500"
              }`}
            />
          </div>

          {/* Severity Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-lg border text-xs shrink-0 ${
            theme === "light" ? "bg-slate-100 border-slate-200" : "bg-slate-950 border-slate-800"
          }`}>
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                id={`filter-sev-${sev}`}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  severityFilter === sev
                    ? theme === "light"
                      ? "bg-white text-emerald-700 shadow-sm font-bold border border-slate-200"
                      : "bg-slate-800 text-emerald-400 shadow-sm"
                    : theme === "light"
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Row: Status & Tool */}
        <div className={`flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-xs ${
          theme === "light" ? "border-slate-200" : "border-slate-800/80"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-medium ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-2 py-1 rounded border text-xs focus:outline-none cursor-pointer ${
                theme === "light" ? "bg-slate-50 border-slate-300 text-slate-800" : "bg-slate-950 border-slate-800 text-slate-200"
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="open">Open Issues</option>
              <option value="fixed">Fixed</option>
              <option value="ignored">Ignored</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-medium ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>Source Tool:</span>
            <select
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className={`px-2 py-1 rounded border text-xs focus:outline-none cursor-pointer ${
                theme === "light" ? "bg-slate-50 border-slate-300 text-slate-800" : "bg-slate-950 border-slate-800 text-slate-200"
              }`}
            >
              <option value="ALL">All Sources</option>
              <option value="AI_SCANNER">Gemini AI Scanner</option>
              <option value="SEMGREP">Semgrep MCP</option>
              <option value="SNYK">Snyk SCA</option>
              <option value="GITHUB_MCP">GitHub MCP</option>
              <option value="STATIC_RULES">Static AST Rules</option>
            </select>
          </div>

          <span className={`text-[11px] font-mono ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Showing {filteredFindings.length} of {state.findings.length} findings
          </span>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3.5">
        {filteredFindings.length === 0 ? (
          <div className={`p-8 text-center rounded-xl border text-xs ${
            theme === "light" ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-900/60 border-slate-800 text-slate-400"
          }`}>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <span>No findings match the selected filters.</span>
          </div>
        ) : (
          filteredFindings.map((f) => (
            <div
              key={f.id}
              className={`p-5 rounded-xl border transition-all space-y-3 ${
                f.status === "fixed"
                  ? theme === "light"
                    ? "bg-slate-50/80 border-slate-200 opacity-75"
                    : "bg-slate-950/60 border-slate-800/80 opacity-75"
                  : f.severity === "CRITICAL"
                  ? theme === "light"
                    ? "bg-white border-rose-300 shadow-sm"
                    : "bg-slate-900/90 border-rose-900/40 shadow-lg shadow-rose-950/10"
                  : f.severity === "HIGH"
                  ? theme === "light"
                    ? "bg-white border-amber-300 shadow-sm"
                    : "bg-slate-900/90 border-amber-900/40 shadow-lg shadow-amber-950/10"
                  : theme === "light"
                  ? "bg-white border-slate-200 shadow-sm"
                  : "bg-slate-900/90 border-slate-800"
              }`}
            >
              {/* Finding Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    f.severity === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                      : f.severity === "HIGH"
                      ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                      : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                  }`}>
                    {f.severity}
                  </span>
                  <h3 className={`text-sm font-bold ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
                    {f.title}
                  </h3>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    theme === "light" ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}>
                    {f.cwe}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    f.status === "fixed"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                      : f.status === "ignored"
                      ? theme === "light" ? "bg-slate-200 text-slate-700" : "bg-slate-800 text-slate-400"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30"
                  }`}>
                    STATUS: {f.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Description & Exploit Scenario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-lg border space-y-1 ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800/80"
                }`}>
                  <span className={`text-[10px] uppercase font-semibold tracking-wider block ${
                    theme === "light" ? "text-slate-500" : "text-slate-400"
                  }`}>
                    Vulnerability Description
                  </span>
                  <p className={`leading-relaxed ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                    {f.description}
                  </p>
                </div>

                <div className={`p-3 rounded-lg border space-y-1 ${
                  theme === "light" ? "bg-emerald-50 border-emerald-200" : "bg-slate-950 border-slate-800/80"
                }`}>
                  <span className={`text-[10px] uppercase font-semibold tracking-wider block ${
                    theme === "light" ? "text-emerald-700 font-bold" : "text-emerald-400"
                  }`}>
                    Recommended Remediation
                  </span>
                  <p className={`leading-relaxed ${theme === "light" ? "text-emerald-900" : "text-emerald-300/90"}`}>
                    {f.suggestedRemediation}
                  </p>
                </div>
              </div>

              {/* Code Snippet if present */}
              {f.codeSnippet && (
                <div className={`p-2.5 rounded border text-xs font-mono flex items-center justify-between ${
                  theme === "light" ? "bg-rose-50 border-rose-200 text-rose-900" : "bg-slate-950 border-slate-800 text-rose-300"
                }`}>
                  <div className="truncate">
                    <span className="text-slate-400 mr-2">Line {f.line}:</span>
                    <span>{f.codeSnippet}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-sans">{f.file}</span>
                </div>
              )}

              {/* Action Bar */}
              <div className={`pt-2 border-t flex items-center justify-between text-xs ${
                theme === "light" ? "border-slate-200" : "border-slate-800"
              }`}>
                <div className={`text-[11px] font-mono flex items-center gap-2 ${
                  theme === "light" ? "text-slate-600" : "text-slate-400"
                }`}>
                  <span>Detected by: <strong className={theme === "light" ? "text-slate-800" : "text-slate-300"}>{f.detectedBy}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Toggle buttons */}
                  {f.status === "open" ? (
                    <button
                      onClick={() => updateFindingStatus(f.id, "ignored")}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        theme === "light"
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      Mark Ignored
                    </button>
                  ) : (
                    <button
                      onClick={() => updateFindingStatus(f.id, "open")}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        theme === "light"
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      Reopen
                    </button>
                  )}

                  {/* AI Fix button */}
                  <button
                    id={`btn-findings-fix-${f.id}`}
                    onClick={() => {
                      setSelectedFindingForFix(f);
                      setActiveTab("ai-fix");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Open in AI Security Fix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
