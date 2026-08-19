import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  ApprovalRequest,
  AuditLogEntry,
  GatewayActionRule,
  McpTool,
  PromptSecurityCheckResult,
  SecurityFinding,
  SecurityFixPatch,
} from "../types/security";

interface SecurityState {
  activeCode: string;
  score: number;
  stats: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    fixed: number;
    total: number;
    open: number;
  };
  findings: SecurityFinding[];
  gatewayRules: GatewayActionRule[];
  approvalRequests: ApprovalRequest[];
  auditLogs: AuditLogEntry[];
  mcpTools: McpTool[];
  promptHistory: PromptSecurityCheckResult[];
}

interface SecurityContextType {
  state: SecurityState;
  loading: boolean;
  selectedFindingForFix: SecurityFinding | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedFindingForFix: (finding: SecurityFinding | null) => void;
  fetchState: () => Promise<void>;
  checkPrompt: (prompt: string) => Promise<PromptSecurityCheckResult>;
  scanCode: (code: string, filename?: string) => Promise<SecurityFinding[]>;
  generateAiFix: (findingId: string, code?: string) => Promise<SecurityFixPatch>;
  applyFix: (findingId: string, patchedCode: string) => Promise<void>;
  updateFindingStatus: (findingId: string, status: 'open' | 'fixed' | 'ignored') => Promise<void>;
  testGatewayAction: (actionKey: string, reason?: string, details?: any) => Promise<any>;
  updateGatewayPolicy: (actionKey: string, policy: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL') => Promise<void>;
  resolveApproval: (requestId: string, decision: 'APPROVED' | 'DENIED', notes?: string) => Promise<void>;
  runMcpScan: (toolSlug: string) => Promise<{ findings: SecurityFinding[]; logs: string[] }>;
  resetDemo: () => Promise<void>;
  activeApprovalModal: ApprovalRequest | null;
  setActiveApprovalModal: (req: ApprovalRequest | null) => void;
  showDemoWalkthrough: boolean;
  setShowDemoWalkthrough: (show: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const defaultState: SecurityState = {
  activeCode: "",
  score: 42,
  stats: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    fixed: 0,
    total: 0,
    open: 0,
  },
  findings: [],
  gatewayRules: [],
  approvalRequests: [],
  auditLogs: [],
  mcpTools: [],
  promptHistory: [],
};

const SecurityContext = createContext<SecurityContextType | null>(null);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SecurityState>(defaultState);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedFindingForFix, setSelectedFindingForFix] = useState<SecurityFinding | null>(null);
  const [activeApprovalModal, setActiveApprovalModal] = useState<ApprovalRequest | null>(null);
  const [showDemoWalkthrough, setShowDemoWalkthrough] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("vibe_guard_theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("vibe_guard_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/security/state");
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error("Failed to fetch security state:", err);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const checkPrompt = async (prompt: string): Promise<PromptSecurityCheckResult> => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/prompt-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to check prompt");
      const result = await res.json();
      await fetchState();
      return result;
    } finally {
      setLoading(false);
    }
  };

  const scanCode = async (code: string, filename = "routes/auth.js"): Promise<SecurityFinding[]> => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/code-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, filename }),
      });
      if (!res.ok) throw new Error("Failed to scan code");
      const data = await res.json();
      await fetchState();
      return data.findings;
    } finally {
      setLoading(false);
    }
  };

  const generateAiFix = async (findingId: string, code?: string): Promise<SecurityFixPatch> => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/ai-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ findingId, code }),
      });
      if (!res.ok) throw new Error("Failed to generate AI fix");
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  const applyFix = async (findingId: string, patchedCode: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/apply-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ findingId, patchedCode }),
      });
      if (!res.ok) throw new Error("Failed to apply fix");
      await fetchState();
    } finally {
      setLoading(false);
    }
  };

  const updateFindingStatus = async (findingId: string, status: 'open' | 'fixed' | 'ignored'): Promise<void> => {
    try {
      await fetch("/api/security/finding-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ findingId, status }),
      });
      await fetchState();
    } catch (err) {
      console.error("Failed to update finding status:", err);
    }
  };

  const testGatewayAction = async (actionKey: string, reason?: string, details?: any): Promise<any> => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/gateway-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionKey, reason, details }),
      });
      const data = await res.json();
      await fetchState();
      if (data.decision === "REQUIRE_APPROVAL" && data.request) {
        setActiveApprovalModal(data.request);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateGatewayPolicy = async (actionKey: string, policy: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL'): Promise<void> => {
    try {
      await fetch("/api/security/gateway-policy-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionKey, policy }),
      });
      await fetchState();
    } catch (err) {
      console.error("Failed to update gateway policy:", err);
    }
  };

  const resolveApproval = async (requestId: string, decision: 'APPROVED' | 'DENIED', notes?: string): Promise<void> => {
    setLoading(true);
    try {
      await fetch("/api/security/approval-resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, decision, notes }),
      });
      setActiveApprovalModal(null);
      await fetchState();
    } finally {
      setLoading(false);
    }
  };

  const runMcpScan = async (toolSlug: string): Promise<{ findings: SecurityFinding[]; logs: string[] }> => {
    setLoading(true);
    try {
      const res = await fetch("/api/mcp/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug }),
      });
      if (!res.ok) throw new Error("Failed to run MCP tool scan");
      const data = await res.json();
      await fetchState();
      return data;
    } finally {
      setLoading(false);
    }
  };

  const resetDemo = async (): Promise<void> => {
    setLoading(true);
    try {
      await fetch("/api/security/reset-demo", { method: "POST" });
      await fetchState();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SecurityContext.Provider
      value={{
        state,
        loading,
        selectedFindingForFix,
        activeTab,
        setActiveTab,
        setSelectedFindingForFix,
        fetchState,
        checkPrompt,
        scanCode,
        generateAiFix,
        applyFix,
        updateFindingStatus,
        testGatewayAction,
        updateGatewayPolicy,
        resolveApproval,
        runMcpScan,
        resetDemo,
        activeApprovalModal,
        setActiveApprovalModal,
        showDemoWalkthrough,
        setShowDemoWalkthrough,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const ctx = useContext(SecurityContext);
  if (!ctx) throw new Error("useSecurity must be used within a SecurityProvider");
  return ctx;
};
