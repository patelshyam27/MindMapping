import React, { useState } from "react";
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Download,
  Terminal,
  Clock,
  Filter,
  Search,
  Lock,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { useSecurity } from "../../context/SecurityContext";
import { ApprovalRequest } from "../../types/security";

export const UserApprovalPage: React.FC = () => {
  const { state, resolveApproval, testGatewayAction, loading } = useSecurity();
  const [filterDecision, setFilterDecision] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [auditNotes, setAuditNotes] = useState<Record<string, string>>({});

  const pendingRequests = state.approvalRequests.filter((r) => r.status === "PENDING");

  const filteredLogs = state.auditLogs.filter((log) => {
    if (filterDecision !== "ALL" && log.userDecision !== filterDecision) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actionName.toLowerCase().includes(q) ||
        log.reason.toLowerCase().includes(q) ||
        log.initiatedBy.toLowerCase().includes(q) ||
        log.actionKey.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAuditLogs = () => {
    const jsonStr = JSON.stringify(state.auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vibe-guard-audit-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono text-[11px] border border-amber-500/30">
              Pipeline Stage 8
            </span>
            <span className="text-xs text-slate-400">Human-in-the-Loop Governance</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            User Authorization & Security Audit Ledger
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            Review pending AI agent permission requests and inspect the cryptographic tamper-evident audit ledger for compliance.
          </p>
        </div>

        <button
          id="btn-export-audit-log"
          onClick={handleExportAuditLogs}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Pending Approval Requests Queue */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Pending AI Action Authorization Requests ({pendingRequests.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Requires explicit user sign-off
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-950 rounded-lg border border-slate-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <span>No pending action requests. All AI agent operations are in authorized state.</span>
          </div>
        ) : (
          <div className="space-y-3.5">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      req.riskLevel === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {req.riskLevel} RISK
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">{req.actionName}</h4>
                    <span className="text-[10px] font-mono text-slate-400">[{req.actionKey}]</span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(req.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                      AI Justification / Intent
                    </span>
                    <p className="text-slate-300 leading-relaxed">{req.reason}</p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      Initiator: <strong className="text-slate-200">{req.initiatedBy}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                      Security Officer Review Notes
                    </span>
                    <input
                      type="text"
                      value={auditNotes[req.id] || ""}
                      onChange={(e) => setAuditNotes({ ...auditNotes, [req.id]: e.target.value })}
                      placeholder="e.g. Authorized for testing environment"
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    id={`btn-deny-action-${req.id}`}
                    disabled={loading}
                    onClick={() => resolveApproval(req.id, "DENIED", auditNotes[req.id])}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Deny Action</span>
                  </button>

                  <button
                    id={`btn-allow-action-${req.id}`}
                    disabled={loading}
                    onClick={() => resolveApproval(req.id, "APPROVED", auditNotes[req.id])}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize Action</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Log Ledger Table */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Immutable Security Audit Log</span>
            </h3>
            <p className="text-xs text-slate-400">Complete audit trail of all AI actions and authorization decisions</p>
          </div>

          {/* Filter & Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail..."
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Decisions</option>
              <option value="APPROVED">Approved</option>
              <option value="DENIED">Denied</option>
              <option value="ALLOWED_AUTO">Auto Allowed</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    log.userDecision === "APPROVED" || log.userDecision === "ALLOWED_AUTO"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}>
                    {log.userDecision}
                  </span>
                  <strong className="text-slate-200 font-semibold">{log.actionName}</strong>
                  <span className="text-[10px] font-mono text-slate-400">[{log.actionKey}]</span>
                </div>
                <p className="text-slate-300 leading-snug">{log.reason}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-0.5">
                  <span>Initiated by: <strong className="text-slate-300">{log.initiatedBy}</strong></span>
                  <span>•</span>
                  <span>IP: {log.ipAddress || "127.0.0.1"}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-slate-400 block">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
