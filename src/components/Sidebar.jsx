import React from "react";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Bot,
  Layers,
  FileCheck2,
  Cpu,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    id: "Dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & recent activity",
    matchPages: ["Dashboard"]
  },
  {
    id: "Sessions",
    label: "Research Sessions",
    icon: FolderOpen,
    description: "Entity workspaces & objectives",
    matchPages: ["Sessions", "Research Sessions", "Workspace Directory", "Session Details", "Create Session"]
  },
  {
    id: "Documents",
    label: "Documents",
    icon: FileText,
    description: "Filings, ingestion & vector search",
    matchPages: ["Documents", "Document Library", "Upload Document", "Knowledge Base"]
  },
  {
    id: "Research",
    label: "AI Research",
    icon: Bot,
    description: "Conversational query & citations",
    matchPages: ["Research", "AI Research", "Financial Query & Research"]
  },
  {
    id: "Analysis",
    label: "Financial Analysis",
    icon: Layers,
    description: "Extracted metrics & red flags",
    matchPages: ["Analysis", "Financial Analysis", "Research Workspace", "Extraction", "Red Flags", "Comparison"]
  },
  {
    id: "Reports",
    label: "Reports",
    icon: FileCheck2,
    description: "Executive dossiers & PDF export",
    matchPages: ["Reports", "Research Reports", "Analyst Report"]
  },
  {
    id: "Settings",
    label: "System & Agents",
    icon: Cpu,
    description: "Orchestration & runtime status",
    matchPages: ["Settings", "Multi-Agent Orchestrator", "Orchestration"]
  }
];

export default function Sidebar({
  activePage,
  setPage,
  collapsed,
  onToggleCollapse,
  onNewResearch
}) {
  return (
    <aside className={`fin-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Sleek Minimal Brand */}
      <div
        className="fin-brand"
        onClick={() => setPage("Research")}
        title={collapsed ? "FinResearch" : undefined}
      >
        <div className="fin-brand-icon">
          <TrendingUp size={19} color="#ffffff" />
        </div>
        {!collapsed && (
          <div className="fin-brand-text">
            <h2>FinResearch</h2>
            <p>AI Financial Analyst</p>
          </div>
        )}
      </div>

      {/* Primary 3-Section Navigation */}
      <div className="fin-sidebar-section">
        {!collapsed && <p className="fin-menu-heading">NAVIGATION</p>}
        <nav className="fin-nav">
          {NAVIGATION_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.matchPages.includes(activePage);

            return (
              <button
                key={item.id}
                type="button"
                className={`fin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setPage(item.id)}
                title={collapsed ? `${item.label} — ${item.description}` : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="fin-nav-icon">
                  <IconComponent size={18} />
                </span>
                {!collapsed && (
                  <div className="flex flex-col text-left">
                    <span className="fin-nav-label font-medium">{item.label}</span>
                    <span className="text-[10px] text-muted leading-tight">{item.description}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="fin-sidebar-footer">
        <button
          type="button"
          className="fin-collapse-toggle-btn"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span className="text-xs ml-1.5">Collapse Menu</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
