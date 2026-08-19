import React, { useState, useEffect } from "react";
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
  Code2,
  Layers,
  FileCheck,
  Copy,
  Terminal,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { SecurityFinding, SecurityFixPatch } from "../../types/security";

export const AiFixPage: React.FC = () => {
  const { state, selectedFindingForFix, setSelectedFindingForFix, generateAiFix, applyFix, loading, setActiveTab, theme } = useSecurity();
  const [currentFinding, setCurrentFinding] = useState<SecurityFinding | null>(null);
  const [patchData, setPatchData] = useState<SecurityFixPatch | null>(null);
  const [showPrModal, setShowPrModal] = useState(false);
  const [fixAppliedSuccess, setFixAppliedSuccess] = useState(false);

  useEffect(() => {
    if (selectedFindingForFix) {
      setCurrentFinding(selectedFindingForFix);
    } else if (state.findings.length > 0) {
      const firstOpen = state.findings.find((f) => f.status === "open") || state.findings[0];
      setCurrentFinding(firstOpen);
    }
  }, [selectedFindingForFix, state.findings]);

  useEffect(() => {
    if (currentFinding) {
      handleGeneratePatch(currentFinding);
    }
  }, [currentFinding?.id]);

  const handleGeneratePatch = async (finding: SecurityFinding) => {
    setFixAppliedSuccess(false);
    const patch = await generateAiFix(finding.id, state.activeCode);
    setPatchData(patch);
  };

  const handleApplyFix = async () => {
    if (!patchData || !currentFinding) return;
    await applyFix(currentFinding.id, patchData.patchedCode);
    setFixAppliedSuccess(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-mono text-[11px] border border-emerald-500/30 font-bold">
            Pipeline Stage 9
          </span>
          <span className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            AI-Powered Automated Vulnerability Patching
          </span>
        </div>
        <h2 className={`text-xl font-bold tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
          AI Security Fix & Patch Studio
        </h2>
        <p className={`text-xs leading-relaxed max-w-3xl ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
          Three-tier automated remediation workflow: <strong>1. Detect Flaw</strong> → <strong>2. Deep AI Explanation & Exploit Vector</strong> → <strong>3. Minimal Secure Patch Generator</strong>.
        </p>
      </div>

      {/* Target Finding Selector Toolbar */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg ${
        theme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-slate-900/90 border-slate-800"
      }`}>
        <div className="flex items-center gap-2 text-xs">
          <span className={`font-medium ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>Select Finding to Remediate:</span>
          <select
            value={currentFinding?.id || ""}
            onChange={(e) => {
              const selected = state.findings.find((f) => f.id === e.target.value);
              if (selected) {
                setCurrentFinding(selected);
                setSelectedFindingForFix(selected);
              }
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:border-emerald-500 max-w-md font-sans cursor-pointer ${
              theme === "light" ? "bg-slate-50 border-slate-300 text-slate-800" : "bg-slate-950 border-slate-700 text-slate-100"
            }`}
          >
            {state.findings.map((f) => (
              <option key={f.id} value={f.id}>
                [{f.severity}] {f.title} (Line {f.line}) - {f.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {currentFinding && (
          <span className={`text-[11px] font-mono px-2.5 py-1 rounded font-bold ${
            currentFinding.severity === "CRITICAL"
              ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
              : "bg-amber-500/20 text-amber-500 border border-amber-500/30"
          }`}>
            {currentFinding.severity} • {currentFinding.cwe}
          </span>
        )}
      </div>

      {/* 3-Tier Workflow: 1. Detect & 2. Explain */}
      {currentFinding && patchData && (
        <div className="space-y-6">
          {/* Success Banner if fix applied */}
          {fixAppliedSuccess && (
            <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
              theme === "light"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
            }`}>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>
                  <strong>Patch successfully applied!</strong> Finding marked as <strong>FIXED</strong> and active source code updated.
                </span>
              </div>
              <button
                onClick={() => setActiveTab("scanner")}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center gap-1 hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <span>Verify in Code Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Section 1 & 2: Detect & Explain */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Detect */}
            <div className={`p-5 rounded-xl border space-y-3 flex flex-col justify-between ${
              theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/90 border-slate-800"
            }`}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center text-xs font-mono font-bold">
                    1
                  </span>
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                    Flaw Detection
                  </h3>
                </div>
                <h4 className={`text-sm font-bold ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
                  {patchData.vulnerabilityTitle}
                </h4>
                <p className={`text-xs leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                  {patchData.flawDescription}
                </p>
              </div>
              <div className={`p-2.5 rounded border text-[11px] font-mono ${
                theme === "light" ? "bg-slate-50 border-slate-200 text-rose-700" : "bg-slate-950 border-slate-800 text-rose-300"
              }`}>
                Target: {currentFinding.file}:{currentFinding.line}
              </div>
            </div>

            {/* Step 2: Why Dangerous & Exploit Vector */}
            <div className={`p-5 rounded-xl border md:col-span-2 space-y-3 ${
              theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/90 border-slate-800"
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-mono font-bold">
                  2
                </span>
                <h3 className={`font-bold text-xs uppercase tracking-wider ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                  AI Risk Explanation & Exploit Vector
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3.5 rounded-lg border space-y-1.5 ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                }`}>
                  <span className="text-[11px] font-bold text-amber-500 block">
                    Why is this dangerous?
                  </span>
                  <p className={`leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                    {patchData.whyDangerous}
                  </p>
                </div>

                <div className={`p-3.5 rounded-lg border space-y-1.5 ${
                  theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                }`}>
                  <span className="text-[11px] font-bold text-rose-500 block">
                    Exploitation Mechanism (High-Level)
                  </span>
                  <p className={`leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                    {patchData.exploitVector}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Secure Fix & Patch Code Preview */}
          <div className={`rounded-xl border p-5 space-y-4 shadow-xl ${
            theme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-slate-900/90 border-slate-800"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
                  3
                </span>
                <div>
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                    Generated Minimal Secure Patch
                  </h3>
                  <span className={`text-[11px] ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                    Defense-in-depth validated by AI Security Agent
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-fix-review-manual"
                  onClick={() => setActiveTab("scanner")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    theme === "light"
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Review in Editor</span>
                </button>

                <button
                  id="btn-fix-create-pr"
                  onClick={() => setShowPrModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>Simulate PR</span>
                </button>

                <button
                  id="btn-fix-apply"
                  disabled={loading}
                  onClick={handleApplyFix}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/20 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Apply Fix to Codebase</span>
                </button>
              </div>
            </div>

            {/* Improvements Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-lg border space-y-1.5 ${
                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
              }`}>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                  Security Defense Improvements Applied:
                </span>
                <ul className={`space-y-1 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                  {patchData.securityImprovements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-3 rounded-lg border space-y-1.5 ${
                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
              }`}>
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 block">
                  Preventative CI/CD Recommendations:
                </span>
                <ul className={`space-y-1 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                  {patchData.preventativeMeasures.map((prev, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Patched Code Block Preview */}
            <div className={`rounded-lg border overflow-hidden text-xs ${
              theme === "light" ? "bg-slate-900 border-slate-700" : "bg-slate-950 border-slate-800"
            }`}>
              <div className="h-8 bg-slate-900 border-b border-slate-800 px-3.5 flex items-center justify-between font-mono text-[11px] text-slate-400">
                <span>Hardened Source Preview: {currentFinding.file}</span>
                <span className="text-emerald-400 font-semibold">Security Patched State</span>
              </div>
              <pre className="p-4 font-mono text-emerald-300/90 text-xs overflow-x-auto leading-relaxed max-h-80 bg-slate-950">
                {patchData.patchedCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Simulated GitHub Pull Request Modal */}
      {showPrModal && currentFinding && patchData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-lg border rounded-xl shadow-2xl overflow-hidden text-xs ${
            theme === "light" ? "bg-white border-indigo-300" : "bg-slate-900 border-indigo-500/40"
          }`}>
            <div className={`p-4 border-b flex items-center justify-between ${
              theme === "light" ? "bg-indigo-50 border-indigo-200" : "bg-slate-950 border-slate-800"
            }`}>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                <GitPullRequest className="w-4 h-4" />
                <span>Simulated GitHub Security Pull Request</span>
              </div>
              <button
                onClick={() => setShowPrModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div className={`p-3 rounded-lg border space-y-1 ${
                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
              }`}>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">PR Title</span>
                <div className={`font-mono font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                  fix(security): remediate {currentFinding.title} ({currentFinding.cwe})
                </div>
              </div>

              <div className={`p-3 rounded-lg border space-y-2 ${
                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
              }`}>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Automated Security Checklist</span>
                <div className={`space-y-1 ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Replaced raw queries with parameterized statements</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Isolated secrets in server environment variables</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified with AST SAST and MCP Semgrep rules</span>
                  </div>
                </div>
              </div>

              <p className={`text-[11px] leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                In a CI/CD pipeline, this pull request is automatically generated with branch protection rules requiring security officer sign-off before merging into main.
              </p>
            </div>

            <div className={`p-3.5 border-t flex items-center justify-end gap-2 ${
              theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
            }`}>
              <button
                onClick={() => setShowPrModal(false)}
                className={`px-3.5 py-1.5 rounded-lg font-medium cursor-pointer ${
                  theme === "light" ? "bg-slate-200 text-slate-700" : "bg-slate-800 text-slate-300"
                }`}
              >
                Close Preview
              </button>
              <button
                onClick={async () => {
                  await handleApplyFix();
                  setShowPrModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
              >
                Merge & Apply Fix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
