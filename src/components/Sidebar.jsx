import React from "react";
import {
  Bot,
  FileText,
  FileCheck2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    id: "Research",
    label: "Research",
    icon: Bot,
    description: "Financial AI query & citations",
    matchPages: ["Research", "Financial Query & Research", "Dashboard", "Research Workspace"]
  },
  {
    id: "Documents",
    label: "Documents",
    icon: FileText,
    description: "SEC filings & annual reports",
    matchPages: ["Documents", "Document Library", "Upload Document"]
  },
  {
    id: "Reports",
    label: "Reports",
    icon: FileCheck2,
    description: "Executive summaries & findings",
    matchPages: ["Reports", "Research Reports", "Analyst Report"]
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
