import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Lock,
  ArrowRight,
  X
} from "lucide-react";
import { useSecurity } from "../context/SecurityContext";

export const ApprovalModal: React.FC = () => {
  const { activeApprovalModal, setActiveApprovalModal, resolveApproval, loading } = useSecurity();
  const [notes, setNotes] = useState("");
  const [confirmStep, setConfirmStep] = useState(false);

  if (!activeApprovalModal) return null;

  const handleDecision = async (decision: "APPROVED" | "DENIED") => {
    if (activeApprovalModal.riskLevel === "CRITICAL" && decision === "APPROVED" && !confirmStep) {
      setConfirmStep(true);
      return;
    }
    await resolveApproval(activeApprovalModal.id, decision, notes);
    setConfirmStep(false);
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`p-4 border-b ${
          activeApprovalModal.riskLevel === "CRITICAL"
            ? "bg-rose-950/40 border-rose-800/50"
            : "bg-amber-950/30 border-amber-800/40"
        } flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${
              activeApprovalModal.riskLevel === "CRITICAL" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-100 text-sm">SECURITY GATEWAY INTERCEPT</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  activeApprovalModal.riskLevel === "CRITICAL" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}>
                  {activeApprovalModal.riskLevel} RISK
                </span>
              </div>
              <p className="text-xs text-slate-300">Action held for mandatory human-in-the-loop authorization</p>
            </div>
          </div>
          <button
            onClick={() => setActiveApprovalModal(null)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-4 text-xs">
          {/* Action & Initiator */}
          <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-slate-400">Requested Action</span>
              <span className="font-mono text-slate-300">{activeApprovalModal.actionKey}</span>
            </div>
            <div className="font-medium text-slate-100 text-sm">
              {activeApprovalModal.actionName}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 pt-1 border-t border-slate-800/80">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Initiated by: <strong className="text-slate-200">{activeApprovalModal.initiatedBy}</strong></span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">
              AI Justification / Reason
            </label>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans">
              {activeApprovalModal.reason}
            </div>
          </div>

          {/* Payload details if present */}
          {activeApprovalModal.details && Object.keys(activeApprovalModal.details).length > 0 && (
            <div>
              <label className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">
                Action Payload Parameters
              </label>
              <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 font-mono overflow-x-auto">
                {JSON.stringify(activeApprovalModal.details, null, 2)}
              </pre>
            </div>
          )}

          {/* Security Officer Audit Note */}
          <div>
            <label className="text-[11px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">
              Audit Note / Approval Justification (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified necessary for staging database migration"
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Confirmation Warning for Critical actions */}
          {confirmStep && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-600/50 text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-[11px]">
                <strong className="block text-rose-300 font-semibold">Critical Security Confirmation Required:</strong>
                This action grants elevated privileges. Are you sure you want to allow this operation?
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            id="btn-modal-deny"
            disabled={loading}
            onClick={() => handleDecision("DENIED")}
            className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-600/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Deny Action</span>
          </button>

          <button
            id="btn-modal-allow"
            disabled={loading}
            onClick={() => handleDecision("APPROVED")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              confirmStep
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 animate-bounce"
                : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{confirmStep ? "Confirm & Allow Action" : "Allow Action"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
