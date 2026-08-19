import React from "react";
import {
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  Code2,
  Cpu,
  Bug,
  Wrench,
  UserCheck,
  FileText,
  Sparkles,
  RefreshCw,
  Terminal,
  PlayCircle
} from "lucide-react";
import { useSecurity } from "../context/SecurityContext";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, state, setShowDemoWalkthrough, resetDemo, theme, toggleTheme } = useSecurity();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "pre-code", label: "Pre-Code Check", icon: ShieldAlert, badge: state.promptHistory.length > 0 ? "Active" : null },
    { id: "gateway", label: "Security Gateway", icon: ShieldCheck, badge: state.approvalRequests.filter(r => r.status === "PENDING").length || null },
    { id: "scanner", label: "Code Scanner", icon: Code2, badge: null },
    { id: "mcp-tools", label: "MCP Security Tools", icon: Cpu, badge: "4 Tools" },
    { id: "findings", label: "Security Findings", icon: Bug, badge: state.stats.open > 0 ? state.stats.open : null },
    { id: "ai-fix", label: "AI Security Fix", icon: Wrench, badge: "AI Patch" },
    { id: "approvals", label: "User Approval", icon: UserCheck, badge: state.approvalRequests.filter(r => r.status === "PENDING").length ? `${state.approvalRequests.filter(r => r.status === "PENDING").length} Pending` : null },
    { id: "reports", label: "Security Report", icon: FileText, badge: `${state.score}%` },
  ];

  return (
    <aside
      id="app-sidebar"
      className={`w-64 flex flex-col shrink-0 select-none border-r transition-colors duration-200 ${
        theme === "light"
          ? "bg-slate-50 border-slate-200 text-slate-800"
          : "bg-slate-950 border-slate-800/80 text-slate-100"
      }`}
    >
      {/* Brand Header */}
      <div className={`p-4 border-b flex items-center gap-3 ${
        theme === "light" ? "border-slate-200" : "border-slate-800/80"
      }`}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-950/30">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold text-sm tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
              Vibe Guard
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono border border-emerald-500/20 font-bold">
              v1.0
            </span>
          </div>
          <p className={`text-[11px] font-medium ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Securing AI-Assisted Code
          </p>
        </div>
      </div>

      {/* Demo Guided Walkthrough Banner */}
      <div className="px-3 pt-3">
        <button
          id="btn-demo-walkthrough"
          onClick={() => setShowDemoWalkthrough(true)}
          className={`w-full py-2 px-3 rounded-lg border transition-all text-xs font-medium flex items-center justify-between group ${
            theme === "light"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 shadow-sm"
              : "bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
          }`}
        >
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">College Demo Mode</span>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
            theme === "light" ? "bg-emerald-200 text-emerald-900" : "bg-emerald-500/20 text-emerald-300"
          }`}>
            Guide
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className={`px-2 pb-1.5 text-[10px] font-semibold tracking-wider uppercase ${
          theme === "light" ? "text-slate-400" : "text-slate-400"
        }`}>
          Workflow Pipeline
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? theme === "light"
                    ? "bg-emerald-100/70 text-emerald-950 font-bold border border-emerald-300 shadow-sm"
                    : "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                  : theme === "light"
                  ? "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${
                  isActive
                    ? theme === "light" ? "text-emerald-700" : "text-emerald-400"
                    : theme === "light" ? "text-slate-500" : "text-slate-400"
                }`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                    typeof item.badge === "number" || item.badge.includes("Pending")
                      ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                      : theme === "light"
                      ? "bg-slate-200 text-slate-700"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pipeline Status Box */}
      <div className={`p-3 border-t ${
        theme === "light" ? "border-slate-200 bg-slate-100/70" : "border-slate-800/80 bg-slate-950/70"
      }`}>
        <div className={`p-2.5 rounded-lg border ${
          theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-900 border-slate-800"
        }`}>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className={`font-medium ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
              Posture Score
            </span>
            <span className={`font-mono font-bold ${state.score >= 80 ? "text-emerald-500" : state.score >= 60 ? "text-amber-500" : "text-rose-500"}`}>
              {state.score}/100
            </span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${
            theme === "light" ? "bg-slate-200" : "bg-slate-800"
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                state.score >= 80 ? "bg-emerald-500" : state.score >= 60 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${state.score}%` }}
            />
          </div>
          <div className={`flex items-center justify-between mt-2 pt-2 border-t text-[10px] ${
            theme === "light" ? "border-slate-100 text-slate-500" : "border-slate-800 text-slate-400"
          }`}>
            <span>Critical Issues: {state.stats.critical}</span>
            <button
              id="btn-reset-demo-sidebar"
              onClick={resetDemo}
              title="Reset Demo State"
              className="hover:text-emerald-500 flex items-center gap-1 transition-colors font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
