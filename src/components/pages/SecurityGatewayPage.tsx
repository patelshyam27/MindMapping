import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  Lock,
  Terminal,
  Layers,
  Settings2,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  ArrowRight
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { GatewayActionRule, GatewayPolicyDecision } from "../../types/security";

export const SecurityGatewayPage: React.FC = () => {
  const { state, updateGatewayPolicy, testGatewayAction, setActiveApprovalModal, resolveApproval, loading, theme } = useSecurity();
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  const handleSimulate = async (actionKey: string, desc: string) => {
    setSimulationStatus(`Simulating AI action: ${actionKey}...`);
    const result = await testGatewayAction(
      actionKey,
      `AI Assistant requested: ${desc}`,
      { timestamp: new Date().toISOString(), simulated: true }
    );
    setSimulationStatus(`Gateway Intercept Result: ${result.decision} - ${result.message}`);
  };

  const pendingRequests = state.approvalRequests.filter((r) => r.status === "PENDING");

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-mono text-[11px] border border-cyan-500/30 font-bold">
            Pipeline Stage 4
          </span>
          <span className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Zero-Trust Policy Enforcement
          </span>
        </div>
        <h2 className={`text-xl font-bold tracking-tight ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
          Security Gateway & Policy Interceptor
        </h2>
        <p className={`text-xs leading-relaxed max-w-3xl ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
          Acts as an active zero-trust perimeter between the AI Coding Agent and sensitive operations. Enforces <strong>ALLOW</strong>, <strong>DENY</strong>, or <strong>REQUIRE APPROVAL</strong> policies before dangerous commands execute.
        </p>
      </div>

      {/* Held Requests Queue Banner if any pending */}
      {pendingRequests.length > 0 && (
        <div className={`p-4 rounded-xl border space-y-3 animate-pulse ${
          theme === "light"
            ? "bg-amber-50 border-amber-300 shadow-sm"
            : "bg-amber-950/30 border-amber-500/40"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className={`text-sm font-bold ${theme === "light" ? "text-amber-900" : "text-amber-200"}`}>
                {pendingRequests.length} Sensitive Action(s) Held in Gateway
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
              Awaiting Authorization
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className={`p-3 rounded-lg border space-y-2 text-xs ${
                  theme === "light" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                    {req.actionName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 border border-rose-500/30 font-bold">
                    {req.riskLevel}
                  </span>
                </div>
                <p className={`text-[11px] ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
                  {req.reason}
                </p>
                <div className={`flex items-center justify-end gap-2 pt-1 border-t ${
                  theme === "light" ? "border-slate-200" : "border-slate-800"
                }`}>
                  <button
                    onClick={() => resolveApproval(req.id, "DENIED")}
                    className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-600 dark:text-rose-300 border border-rose-600/30 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3 h-3" />
                    <span>Deny</span>
                  </button>
                  <button
                    onClick={() => resolveApproval(req.id, "APPROVED")}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Allow Action</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Simulation Sandbox */}
      <div className={`rounded-xl border p-5 space-y-4 shadow-xl ${
        theme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-slate-900/90 border-slate-800"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
              <Terminal className="w-4 h-4 text-cyan-500" />
              <span>Interactive Gateway Simulation Sandbox</span>
            </h3>
            <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
              Trigger simulated AI action requests to test gateway policies
            </p>
          </div>
          <span className={`text-[11px] font-mono ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
            Real-time Interception Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            id="btn-sim-env"
            onClick={() => handleSimulate("ENV_ACCESS", "Read GEMINI_API_KEY and DATABASE_URL from .env")}
            className={`p-3 rounded-lg border text-left transition-all space-y-1 cursor-pointer ${
              theme === "light"
                ? "bg-slate-50 hover:bg-cyan-50/50 border-slate-200 hover:border-cyan-400"
                : "bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-cyan-500/40"
            }`}
          >
            <div className={`flex items-center justify-between text-xs font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
              <span>Access Env Vars</span>
              <Play className="w-3 h-3 text-cyan-500" />
            </div>
            <p className="text-[11px] text-slate-400">AI wants to read server secrets</p>
          </button>

          <button
            id="btn-sim-db"
            onClick={() => handleSimulate("DB_MIGRATION", "Execute DROP TABLE / ALTER TABLE schema migration")}
            className={`p-3 rounded-lg border text-left transition-all space-y-1 cursor-pointer ${
              theme === "light"
                ? "bg-slate-50 hover:bg-amber-50/50 border-slate-200 hover:border-amber-400"
                : "bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-amber-500/40"
            }`}
          >
            <div className={`flex items-center justify-between text-xs font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
              <span>Database DDL</span>
              <Play className="w-3 h-3 text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-400">AI executes destructive query</p>
          </button>

          <button
            id="btn-sim-secret"
            onClick={() => handleSimulate("SECRET_READ", "Read ~/.aws/credentials and private SSH keys")}
            className={`p-3 rounded-lg border text-left transition-all space-y-1 cursor-pointer ${
              theme === "light"
                ? "bg-slate-50 hover:bg-rose-50/50 border-slate-200 hover:border-rose-400"
                : "bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-rose-500/40"
            }`}
          >
            <div className={`flex items-center justify-between text-xs font-semibold ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
              <span>Cloud Secrets</span>
              <Play className="w-3 h-3 text-rose-500" />
            </div>
            <p className="text-[11px] text-slate-400">AI reads host credential vault</p>
          </button>
        </div>

        {simulationStatus && (
          <div className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between animate-in fade-in ${
            theme === "light"
              ? "bg-cyan-50 border-cyan-300 text-cyan-900 font-semibold"
              : "bg-slate-950 border-cyan-500/30 text-cyan-300"
          }`}>
            <span>{simulationStatus}</span>
          </div>
        )}
      </div>

      {/* Gateway Policies Configuration Table */}
      <div className={`rounded-xl border p-5 space-y-4 shadow-xl ${
        theme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-slate-900/90 border-slate-800"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
              <Settings2 className="w-4 h-4 text-emerald-500" />
              <span>Configured Security Policy Rules</span>
            </h3>
            <p className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
              Change rule thresholds to dynamically control AI agent permissions
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {state.gatewayRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-xs ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
                    {rule.actionName}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    rule.riskLevel === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                      : rule.riskLevel === "HIGH"
                      ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                      : "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                  }`}>
                    {rule.riskLevel} RISK
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">[{rule.actionKey}]</span>
                </div>
                <p className={`text-xs ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>{rule.description}</p>
              </div>

              {/* Policy Selector Buttons */}
              <div className={`flex items-center gap-1.5 p-1 rounded-lg border shrink-0 ${
                theme === "light" ? "bg-slate-200/80 border-slate-300" : "bg-slate-900 border-slate-800"
              }`}>
                {(["ALLOW", "REQUIRE_APPROVAL", "DENY"] as GatewayPolicyDecision[]).map((policy) => {
                  const isActive = rule.currentPolicy === policy;
                  return (
                    <button
                      key={policy}
                      id={`btn-policy-${rule.actionKey}-${policy}`}
                      onClick={() => updateGatewayPolicy(rule.actionKey, policy)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? policy === "ALLOW"
                            ? "bg-emerald-600 text-slate-950 shadow-sm font-bold"
                            : policy === "REQUIRE_APPROVAL"
                            ? "bg-amber-500 text-slate-950 shadow-sm font-bold"
                            : "bg-rose-600 text-white shadow-sm font-bold"
                          : theme === "light"
                          ? "text-slate-600 hover:text-slate-900"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {policy === "REQUIRE_APPROVAL" ? "Require Approval" : policy}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
