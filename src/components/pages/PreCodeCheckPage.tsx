import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Database,
  Key,
  Layers,
  FileCode,
  RotateCcw
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { PromptSecurityCheckResult } from "../../types/security";

export const PreCodeCheckPage: React.FC = () => {
  const { checkPrompt, loading, setActiveTab, theme } = useSecurity();
  const [promptInput, setPromptInput] = useState(
    "Create a login system using username and password."
  );
  const [result, setResult] = useState<PromptSecurityCheckResult | null>(null);

  const presetPrompts = [
    {
      title: "Authentication & Login",
      prompt: "Create a login system using username and password with session cookies.",
      risk: "HIGH",
    },
    {
      title: "Stripe Payment & Secrets",
      prompt: "Add a payment checkout endpoint that uses the Stripe secret API key and updates user balances.",
      risk: "CRITICAL",
    },
    {
      title: "File Uploader & Storage",
      prompt: "Build an avatar upload endpoint that saves user images to the server filesystem and S3.",
      risk: "HIGH",
    },
    {
      title: "Admin Analytics SQL API",
      prompt: "Create an admin analytics dashboard API that queries transactions using raw SQL strings.",
      risk: "CRITICAL",
    },
    {
      title: "Simple Unit Converter",
      prompt: "Write a pure utility function that converts temperatures between Celsius and Fahrenheit.",
      risk: "LOW",
    },
  ];

  const handleScan = async () => {
    if (!promptInput.trim()) return;
    const res = await checkPrompt(promptInput);
    setResult(res);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 font-mono text-[11px] border border-amber-500/30 font-bold">
            Pipeline Stage 2
          </span>
          <span className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Pre-Code Vulnerability Prevention
          </span>
        </div>
        <h2 className={`text-xl font-bold tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
          Pre-Code Prompt Security Analysis
        </h2>
        <p className={`text-xs leading-relaxed max-w-3xl ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
          Evaluate user intentions and AI prompts for architectural risks (password storage, authentication, input validation, session management) <strong>before any code is written or generated</strong>.
        </p>
      </div>

      {/* Main Input Box */}
      <div className={`rounded-xl border p-5 space-y-4 shadow-xl ${
        theme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-slate-900/90 border-slate-800"
      }`}>
        <div className="flex items-center justify-between">
          <label className={`text-xs font-semibold flex items-center gap-2 ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Enter AI Coding Prompt to Analyze</span>
          </label>
          <span className={`text-[11px] font-mono ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Analyzed by AI Security Evaluator
          </span>
        </div>

        <textarea
          id="input-prompt-text"
          rows={3}
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="e.g. Create a user registration and login system with JWT tokens and PostgreSQL..."
          className={`w-full px-3.5 py-2.5 rounded-lg border text-xs focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed font-sans ${
            theme === "light"
              ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
              : "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500"
          }`}
        />

        {/* Preset Prompt Buttons */}
        <div className="space-y-2">
          <span className={`text-[11px] font-semibold uppercase tracking-wider block ${
            theme === "light" ? "text-slate-500" : "text-slate-400"
          }`}>
            Demo Preset Prompts:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetPrompts.map((p, idx) => (
              <button
                key={idx}
                id={`btn-preset-prompt-${idx}`}
                onClick={() => {
                  setPromptInput(p.prompt);
                  setResult(null);
                }}
                className={`px-2.5 py-1 rounded-md border text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                  theme === "light"
                    ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900"
                    : "bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-slate-100"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  p.risk === "CRITICAL" ? "bg-rose-500" : p.risk === "HIGH" ? "bg-amber-500" : "bg-emerald-500"
                }`} />
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scan Action */}
        <div className={`flex items-center justify-end gap-3 pt-2 border-t ${
          theme === "light" ? "border-slate-200" : "border-slate-800/80"
        }`}>
          <button
            id="btn-scan-prompt"
            disabled={loading || !promptInput.trim()}
            onClick={handleScan}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Security Intent...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-slate-950" />
                <span>Scan Prompt for Risks</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scan Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Risk Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Risk Gauge */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${
              result.riskLevel === "CRITICAL"
                ? theme === "light"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                : result.riskLevel === "HIGH"
                ? theme === "light"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-amber-950/20 border-amber-800/40 text-amber-300"
                : theme === "light"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
            }`}>
              <span className="text-xs uppercase tracking-wider font-semibold">
                Pre-Code Risk Rating
              </span>
              <div className="my-3 flex items-baseline gap-3">
                <span className="text-4xl font-black font-mono">
                  {result.riskScore}/100
                </span>
                <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded border ${
                  theme === "light" ? "bg-white border-slate-200" : "bg-slate-950/60 border-slate-800"
                }`}>
                  {result.riskLevel}
                </span>
              </div>
              <p className={`text-xs ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                {result.summary}
              </p>
            </div>

            {/* Recommended Suggested Libraries */}
            <div className={`p-5 rounded-xl border md:col-span-2 space-y-3 ${
              theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"
            }`}>
              <span className={`text-xs uppercase tracking-wider font-semibold block ${
                theme === "light" ? "text-slate-500" : "text-slate-400"
              }`}>
                Required Security Defense Libraries
              </span>
              <div className="flex flex-wrap gap-2">
                {result.suggestedLibraries.map((lib, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded border font-mono text-xs font-medium ${
                      theme === "light"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-slate-950 border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    npm install {lib}
                  </span>
                ))}
              </div>
              <p className={`text-[11px] ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                These guardrail packages enforce parameterized database drivers, constant-time password hashing, and payload validation.
              </p>
            </div>
          </div>

          {/* Detected Concerns List */}
          <div className={`rounded-xl border p-5 space-y-4 ${
            theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900/80 border-slate-800"
          }`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Detected Architectural Security Concerns ({result.detectedConcerns.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.detectedConcerns.map((concern, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border space-y-2 ${
                    theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-xs ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                      {concern.category}
                    </span>
                    {concern.cwe && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        theme === "light"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-slate-900 text-amber-400 border-slate-700"
                      }`}>
                        {concern.cwe}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs ${theme === "light" ? "text-slate-700" : "text-slate-300"}`}>
                    <strong className="text-rose-500 font-medium">Threat: </strong>
                    {concern.threat}
                  </div>
                  <div className={`text-[11px] p-2 rounded border ${
                    theme === "light"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                      : "bg-emerald-950/30 text-emerald-400 border-emerald-900/40"
                  }`}>
                    <strong className="text-emerald-600 dark:text-emerald-300 font-medium">Recommended Mitigation: </strong>
                    {concern.recommendedMitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Alternative Prompt & Action */}
          {result.safePromptAlternative && (
            <div className={`rounded-xl border p-5 space-y-3 ${
              theme === "light"
                ? "bg-emerald-50/60 border-emerald-300 text-slate-900"
                : "bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/30 text-slate-100"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Hardened Safe Prompt Alternative</span>
                </span>
                <span className={`text-[10px] font-mono ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                  Embeds Defensive Guardrails
                </span>
              </div>
              <div className={`p-3 rounded-lg border text-xs font-sans leading-relaxed ${
                theme === "light" ? "bg-white border-slate-200 text-slate-800" : "bg-slate-950 border-slate-800 text-slate-200"
              }`}>
                "{result.safePromptAlternative}"
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  id="btn-proceed-to-scanner"
                  onClick={() => setActiveTab("scanner")}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/20 cursor-pointer"
                >
                  <span>Proceed to Real-Time Code Scanner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
