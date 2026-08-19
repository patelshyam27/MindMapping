import React from "react";
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Bell,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sun,
  Moon
} from "lucide-react";
import { useSecurity } from "../context/SecurityContext";

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, state, resetDemo, setShowDemoWalkthrough, theme, toggleTheme } = useSecurity();

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Security Operations Dashboard";
      case "pre-code": return "Pre-Code Prompt Security Analysis";
      case "gateway": return "Security Gateway & Action Interceptor";
      case "scanner": return "Real-Time SAST Code Scanner";
      case "mcp-tools": return "Model Context Protocol (MCP) Security Tools";
      case "findings": return "Central Vulnerability Findings Ledger";
      case "ai-fix": return "AI Security Fix & Automated Patch Generator";
      case "approvals": return "User Approval & Authorization Requests";
      case "reports": return "Executive & Technical Security Report";
      default: return "Vibe Coding Security Guard";
    }
  };

  const pendingApprovals = state.approvalRequests.filter(r => r.status === "PENDING");

  return (
    <header
      id="app-header"
      className={`h-14 px-6 flex items-center justify-between z-10 border-b transition-colors duration-200 ${
        theme === "light"
          ? "bg-white/90 backdrop-blur border-slate-200 text-slate-800"
          : "bg-slate-950/80 backdrop-blur border-slate-800/80 text-slate-100"
      }`}
    >
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className={`text-sm font-semibold flex items-center gap-2 ${
            theme === "light" ? "text-slate-900" : "text-slate-100"
          }`}>
            <span>{getPageTitle()}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
              theme === "light"
                ? "bg-slate-100 text-slate-600 border-slate-300"
                : "bg-slate-800 text-slate-300 border-slate-700"
            }`}>
              Live Pipeline
            </span>
          </h1>
        </div>
      </div>

      {/* Action Controls & Indicators */}
      <div className="flex items-center gap-2.5">
        {/* Gemini Engine Status */}
        <div className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md text-xs border ${
          theme === "light"
            ? "bg-slate-100 border-slate-200 text-slate-700"
            : "bg-slate-900 border-slate-800 text-slate-300"
        }`}>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">AI SAST Guard</span>
          <span className="text-[10px] text-emerald-500 font-mono font-bold">ONLINE</span>
        </div>

        {/* Dark / Light Theme Toggle Button */}
        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            theme === "light"
              ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-sm"
              : "bg-slate-900 text-amber-300 border-slate-700 hover:bg-slate-800"
          }`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Pending Approval Badge Button */}
        {pendingApprovals.length > 0 && (
          <button
            id="btn-header-pending-approvals"
            onClick={() => setActiveTab("approvals")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/25 transition-colors animate-pulse"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{pendingApprovals.length} Approval Required</span>
          </button>
        )}

        {/* Quick Demo Walkthrough Trigger */}
        <button
          id="btn-header-demo"
          onClick={() => setShowDemoWalkthrough(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-all shadow-sm shadow-emerald-900/50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Demo Flow</span>
        </button>

        {/* Reset State */}
        <button
          id="btn-header-reset"
          onClick={resetDemo}
          title="Reset to initial vulnerable demo state"
          className={`p-1.5 rounded-md border transition-colors ${
            theme === "light"
              ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent hover:border-slate-800"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
