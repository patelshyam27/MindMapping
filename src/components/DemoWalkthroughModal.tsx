import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Code2,
  Cpu,
  Bug,
  Wrench,
  UserCheck,
  FileText,
  X,
  Play
} from "lucide-react";
import { useSecurity } from "../context/SecurityContext";

export const DemoWalkthroughModal: React.FC = () => {
  const { showDemoWalkthrough, setShowDemoWalkthrough, setActiveTab, resetDemo } = useSecurity();
  const [currentStep, setCurrentStep] = useState(0);

  if (!showDemoWalkthrough) return null;

  const steps = [
    {
      title: "1. Vibe Coding Security Problem",
      subtitle: "Why AI-Assisted / Vibe-Coding Needs Guardrails",
      pageId: "dashboard",
      icon: ShieldAlert,
      content: "When developers 'vibe code' rapidly with AI models, insecure patterns (like SQL injection, hard-coded API secrets, and broken auth) easily slip into production unchecked. Vibe Coding Security Guard creates a multi-layered automated security pipeline to protect every step of the development lifecycle.",
      actionLabel: "View Security Operations Dashboard",
    },
    {
      title: "2. Pre-Code Security Check",
      subtitle: "Analyzing User Prompts Before Code Generation",
      pageId: "pre-code",
      icon: ShieldAlert,
      content: "Before the AI writes any code, the prompt is evaluated for sensitive security domains (Password storage, Authentication, Session handling, Database access). It calculates a Pre-Code Risk Score (e.g. 72/100) and prescribes safe architectural guardrails.",
      actionLabel: "Try Pre-Code Prompt Scanner",
    },
    {
      title: "3. Security Policy Gateway",
      subtitle: "Zero-Trust Human-in-the-Loop Interceptor",
      pageId: "gateway",
      icon: ShieldCheck,
      content: "The Gateway enforces fine-grained policy control (ALLOW, DENY, REQUIRE APPROVAL) when the AI attempts sensitive actions like reading environment variables, accessing AWS credentials, or modifying database schemas.",
      actionLabel: "Inspect Security Gateway Rules",
    },
    {
      title: "4. Real-Time SAST Code Scanner",
      subtitle: "Monaco Editor with Instant Vulnerability Highlighting",
      pageId: "scanner",
      icon: Code2,
      content: "As code is generated or pasted, the scanner inspects the AST for SQL Injection, Hard-Coded API Keys, Weak MD5 Hashing, and XSS. Vulnerable lines are visually highlighted with line numbers and severity indicators in the Monaco editor.",
      actionLabel: "Open Monaco Code Scanner",
    },
    {
      title: "5. Model Context Protocol (MCP) Security Tools",
      subtitle: "Extensible Integration with Semgrep, Snyk & GitHub MCP",
      pageId: "mcp-tools",
      icon: Cpu,
      content: "Standardized Model Context Protocol (MCP) servers run SAST rule matching, dependency vulnerability checks, and secret scans via JSON-RPC protocol interfaces.",
      actionLabel: "View MCP Tools Dashboard",
    },
    {
      title: "6. Central Findings Ledger",
      subtitle: "Triage, Filter, and Manage Vulnerabilities",
      pageId: "findings",
      icon: Bug,
      content: "All issues detected across AI scans and MCP engines are normalized into a central ledger grouped by Critical, High, Medium, and Low severity with full CWE metadata.",
      actionLabel: "Examine Findings Ledger",
    },
    {
      title: "7. AI Security Fix (Detect → Explain → Fix)",
      subtitle: "Minimal Automated Patch Generator & Diff Viewer",
      pageId: "ai-fix",
      icon: Wrench,
      content: "The AI explains what is wrong, why it is dangerous, and how it can be exploited. Then it generates a clean secure patch with prepared statements, bcrypt hashing, and environment variable isolation.",
      actionLabel: "Launch AI Security Fix",
    },
    {
      title: "8. User Approval & Audit Trail",
      subtitle: "Guaranteed Review Before Applying Changes",
      pageId: "approvals",
      icon: UserCheck,
      content: "Important actions require human approval with detailed justification and an immutable audit log tracking every user decision, timestamp, and risk level.",
      actionLabel: "View User Approval Queue",
    },
    {
      title: "9. Final Security Posture Report",
      subtitle: "Before & After Transformation",
      pageId: "reports",
      icon: FileText,
      content: "Generates an executive before-and-after audit report demonstrating the security score jump from 42% to 94% with zero critical vulnerabilities remaining.",
      actionLabel: "View Final Security Report",
    },
  ];

  const stepData = steps[currentStep];
  const StepIcon = stepData.icon;

  const handleNavigate = () => {
    setActiveTab(stepData.pageId);
    setShowDemoWalkthrough(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  College Demo Guide
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">{stepData.title}</h2>
            </div>
          </div>
          <button
            onClick={() => setShowDemoWalkthrough(false)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex w-full bg-slate-950 h-1 border-b border-slate-800">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 transition-all duration-300 ${
                idx <= currentStep ? "bg-emerald-500" : "bg-slate-800"
              }`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 flex-1">
          <h3 className="text-sm font-semibold text-emerald-300 font-mono">
            {stepData.subtitle}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {stepData.content}
          </p>

          <div className="pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-center justify-between">
              <span className="text-xs text-slate-400">Jump directly to this module in the app:</span>
              <button
                id={`btn-jump-step-${currentStep}`}
                onClick={handleNavigate}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>{stepData.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium flex items-center gap-1.5 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < steps.length - 1 ? (
              <button
                id="btn-walkthrough-next"
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/50"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-walkthrough-finish"
                onClick={handleNavigate}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Walkthrough & Open Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
