import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  ExternalLink,
  Info
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { McpTool } from "../../types/security";

export const McpToolsPage: React.FC = () => {
  const { state, runMcpScan, loading, setActiveTab, theme } = useSecurity();
  const [activeLogs, setActiveLogs] = useState<{ toolName: string; logs: string[] } | null>(null);
  const [activeScanningTool, setActiveScanningTool] = useState<string | null>(null);

  const handleExecuteScan = async (tool: McpTool) => {
    setActiveScanningTool(tool.slug);
    try {
      const result = await runMcpScan(tool.slug);
      setActiveLogs({ toolName: tool.name, logs: result.logs });
    } finally {
      setActiveScanningTool(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] border border-indigo-500/30 font-bold">
            Pipeline Stage 7
          </span>
          <span className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Model Context Protocol Integration
          </span>
        </div>
        <h2 className={`text-xl font-bold tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
          MCP Security Tools Ecosystem
        </h2>
        <p className={`text-xs leading-relaxed max-w-3xl ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
          Standardized Model Context Protocol (MCP) servers connecting external security intelligence (Semgrep, Snyk, GitHub Secret Scanner, and Gemini AI Guard) via JSON-RPC protocol interfaces.
        </p>
      </div>

      {/* College Project Architecture Clarification Callout */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
        theme === "light"
          ? "bg-indigo-50/70 border-indigo-200 text-slate-700"
          : "bg-slate-900/90 border-slate-800 text-slate-300"
      }`}>
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className={`font-semibold block ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
            Model Context Protocol (MCP) Transparency Notice:
          </strong>
          <p className={`leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
            In production environments, MCP connects via JSON-RPC to live Semgrep, Snyk, and GitHub daemon processes. In this college demonstration, real Gemini AI scanning runs alongside high-fidelity MCP protocol adapters with realistic rule schemas.
          </p>
        </div>
      </div>

      {/* MCP Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.mcpTools.map((tool) => {
          const isScanning = activeScanningTool === tool.slug;
          return (
            <div
              key={tool.id}
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 shadow-xl transition-all ${
                theme === "light"
                  ? "bg-white border-slate-200 hover:border-slate-300 shadow-slate-200/50"
                  : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-2.5">
                {/* Tool Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
                        {tool.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">{tool.category}</span>
                    </div>
                  </div>

                  {/* Mode & Connection Status Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{tool.status}</span>
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      theme === "light" ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}>
                      {tool.isRealEngine ? "REAL GEMINI MCP" : "DEMO ADAPTER"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                  {tool.description}
                </p>

                {/* Specs / Metadata */}
                <div className={`p-2.5 rounded-lg border space-y-1.5 text-[11px] font-mono ${
                  theme === "light" ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-slate-950 border-slate-800/80 text-slate-400"
                }`}>
                  <div className="flex items-center justify-between">
                    <span>Protocol Endpoint:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">{tool.config.endpoint}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ruleset Config:</span>
                    <span className={theme === "light" ? "text-slate-800" : "text-slate-300"}>{tool.config.ruleset}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Findings:</span>
                    <span className="text-rose-500 font-bold">{tool.findingsCount} alerts</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className={`pt-2 border-t flex items-center justify-between ${
                theme === "light" ? "border-slate-200" : "border-slate-800"
              }`}>
                <span className="text-[10px] text-slate-400 font-mono">
                  Last Scanned: {tool.lastScanTime ? new Date(tool.lastScanTime).toLocaleTimeString() : "Never"}
                </span>

                <button
                  id={`btn-run-mcp-${tool.slug}`}
                  disabled={loading || isScanning}
                  onClick={() => handleExecuteScan(tool)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-950/20 disabled:opacity-50 cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Running MCP Scan...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run Scan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live MCP JSON-RPC Logs Terminal */}
      {activeLogs && (
        <div className={`rounded-xl border overflow-hidden shadow-2xl animate-in fade-in ${
          theme === "light" ? "bg-slate-900 border-slate-700" : "bg-slate-950 border-slate-800"
        }`}>
          <div className="h-9 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-slate-200 font-semibold">
                MCP Terminal Session: {activeLogs.toolName}
              </span>
            </div>
            <button
              onClick={() => setActiveLogs(null)}
              className="text-slate-400 hover:text-slate-200 text-xs font-mono cursor-pointer"
            >
              Close Log
            </button>
          </div>

          <div className="p-4 font-mono text-xs text-emerald-400 space-y-1 max-h-56 overflow-y-auto bg-slate-950">
            {activeLogs.logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
