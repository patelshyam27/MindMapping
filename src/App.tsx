import React from "react";
import { useSecurity, SecurityProvider } from "./context/SecurityContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ApprovalModal } from "./components/ApprovalModal";
import { DemoWalkthroughModal } from "./components/DemoWalkthroughModal";

// Pages
import { DashboardPage } from "./components/pages/DashboardPage";
import { PreCodeCheckPage } from "./components/pages/PreCodeCheckPage";
import { SecurityGatewayPage } from "./components/pages/SecurityGatewayPage";
import { CodeScannerPage } from "./components/pages/CodeScannerPage";
import { McpToolsPage } from "./components/pages/McpToolsPage";
import { SecurityFindingsPage } from "./components/pages/SecurityFindingsPage";
import { AiFixPage } from "./components/pages/AiFixPage";
import { UserApprovalPage } from "./components/pages/UserApprovalPage";
import { SecurityReportPage } from "./components/pages/SecurityReportPage";

const MainContent: React.FC = () => {
  const { activeTab, theme } = useSecurity();

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "pre-code":
        return <PreCodeCheckPage />;
      case "gateway":
        return <SecurityGatewayPage />;
      case "scanner":
        return <CodeScannerPage />;
      case "mcp-tools":
        return <McpToolsPage />;
      case "findings":
        return <SecurityFindingsPage />;
      case "ai-fix":
        return <AiFixPage />;
      case "approvals":
        return <UserApprovalPage />;
      case "reports":
        return <SecurityReportPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden select-none transition-colors duration-200 ${
      theme === "light"
        ? "bg-slate-100 text-slate-900"
        : "bg-slate-950 text-slate-100"
    }`}>
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Container */}
        <main className={`flex-1 overflow-y-auto transition-colors duration-200 ${
          theme === "light"
            ? "bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-900"
            : "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100"
        }`}>
          {renderActivePage()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ApprovalModal />
      <DemoWalkthroughModal />
    </div>
  );
};

export default function App() {
  return (
    <SecurityProvider>
      <MainContent />
    </SecurityProvider>
  );
}
