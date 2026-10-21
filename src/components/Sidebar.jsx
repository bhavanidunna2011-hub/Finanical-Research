import React from "react";
import {
  LayoutDashboard,
  FlaskConical,
  FolderOpen,
  Database,
  Cpu,
  FileCheck2,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, badge: null, description: "Overview & metrics" },
  { label: "Financial Query & Research", icon: Bot, badge: null, description: "Conversational RAG" },
  { label: "Research Workspace", icon: FlaskConical, badge: null, description: "Interactive analysis" },
  { label: "Document Library", icon: FolderOpen, badge: null, description: "Financial documents" },
  { label: "Knowledge Base", icon: Database, badge: null, description: "Embeddings & retrieval" },
  { label: "Multi-Agent Orchestrator", icon: Cpu, badge: null, description: "Pipeline status" },
  { label: "Research Reports", icon: FileCheck2, badge: null, description: "Dossiers & PDF Export" },
  { label: "Create Session", icon: PlusCircle, badge: null, description: "New research run" }
];

export default function Sidebar({ activePage, setPage, collapsed, onToggleCollapse }) {
  return (
    <aside className={`fin-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand Header */}
      <div
        className="fin-brand"
        onClick={() => setPage("Dashboard")}
        title={collapsed ? "FinResearch AI" : undefined}
      >
        <div className="fin-brand-icon">
          <TrendingUp size={20} color="#ffffff" />
        </div>
        {!collapsed && (
          <div className="fin-brand-text">
            <h2>FinResearch AI</h2>
            <p>Multi-Agent Financial Core</p>
          </div>
        )}
      </div>

      {/* Navigation Group */}
      <div className="fin-sidebar-section">
        {!collapsed && <p className="fin-menu-heading">ANALYTICS MODULES</p>}
        <nav className="fin-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              activePage === item.label ||
              (item.label === "Research Reports" && activePage === "Analyst Report") ||
              (item.label === "Analyst Report" && activePage === "Research Reports");
            return (
              <button
                key={item.label}
                type="button"
                className={`fin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setPage(item.label)}
                title={collapsed ? `${item.label} - ${item.description}` : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="fin-nav-icon">
                  <IconComponent size={18} />
                </span>
                {!collapsed && (
                  <>
                    <span className="fin-nav-label">{item.label}</span>
                    {item.badge && (
                      <span className={`fin-nav-badge ${isActive ? "fin-nav-badge-active" : ""}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
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
          {collapsed ? <ChevronRight size={16} /> : (
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
