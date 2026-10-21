import React from "react";
import {
  Sun,
  Moon,
  Menu,
  Building2,
  ChevronDown
} from "lucide-react";

export default function Header({
  theme,
  toggleTheme,
  activePage,
  sessions = [],
  activeSession,
  setActiveSession,
  setPage,
  onToggleMobileSidebar
}) {
  const pageMeta = {
    "Dashboard": {
      title: "Dashboard",
      subtitle: "Research activity, active sessions, and document processing pipeline"
    },
    "Sessions": {
      title: "Research Sessions",
      subtitle: "Manage target entity workspaces, objectives, and assigned filings"
    },
    "Research Sessions": {
      title: "Research Sessions",
      subtitle: "Manage target entity workspaces, objectives, and assigned filings"
    },
    "Documents": {
      title: "Financial Documents",
      subtitle: "Institutional filings, parsing lifecycle, and vector search index"
    },
    "Document Library": {
      title: "Financial Documents",
      subtitle: "Institutional filings, parsing lifecycle, and vector search index"
    },
    "Upload Document": {
      title: "Upload Filing",
      subtitle: "Add annual reports or 10-K filings for AI analysis"
    },
    "Research": {
      title: "AI Research",
      subtitle: "Research financial documents with source-backed answers"
    },
    "Financial Query & Research": {
      title: "AI Research",
      subtitle: "Research financial documents with source-backed answers"
    },
    "Analysis": {
      title: "Financial Analysis",
      subtitle: "Extracted statement line items, forensic red flags, and peer benchmarks"
    },
    "Financial Analysis": {
      title: "Financial Analysis",
      subtitle: "Extracted statement line items, forensic red flags, and peer benchmarks"
    },
    "Reports": {
      title: "Reports",
      subtitle: "Structured financial dossiers and executive publication-ready PDF exports"
    },
    "Research Reports": {
      title: "Reports",
      subtitle: "Structured financial dossiers and executive publication-ready PDF exports"
    },
    "Analyst Report": {
      title: "Reports",
      subtitle: "Structured financial dossiers and executive publication-ready PDF exports"
    },
    "Settings": {
      title: "System & Multi-Agent Orchestration",
      subtitle: "Execution timeline, agent states, and runtime diagnostic status"
    }
  };

  const meta = pageMeta[activePage] || {
    title: activePage,
    subtitle: "Multi-agent financial intelligence"
  };

  return (
    <header className="fin-header-wrapper fin-header-minimal">
      <div className="fin-navbar">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="fin-navbar-left">
          {onToggleMobileSidebar && (
            <button
              type="button"
              className="fin-mobile-toggle-btn"
              onClick={onToggleMobileSidebar}
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
          )}

          <div className="fin-title-block">
            <h1 className="fin-page-title text-base sm:text-lg font-bold">{meta.title}</h1>
            <p className="text-xs text-muted hidden sm:block">{meta.subtitle}</p>
          </div>
        </div>

        {/* Right: Clean Company Indicator & Theme Toggle */}
        <div className="fin-navbar-right flex items-center gap-3">
          {/* Active Company Selector Pill if sessions exist (shown on secondary pages) */}
          {sessions && sessions.length > 0 && activePage !== "Research" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-subtle border border-subtle text-xs">
              <Building2 size={13} className="text-teal" />
              <span className="text-muted hidden md:inline font-medium">Focus:</span>
              <select
                aria-label="Current research company"
                className="fin-header-select text-xs font-semibold cursor-pointer"
                value={activeSession?.id || (sessions[0] && sessions[0].id) || ""}
                onChange={(e) => {
                  const s = sessions.find((item) => item.id === e.target.value);
                  if (s && setActiveSession) {
                    setActiveSession(s);
                  }
                }}
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company || s.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Theme Switcher Button */}
          <button
            type="button"
            className="fin-icon-btn p-2 rounded-lg border border-subtle hover:bg-hover transition-colors"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-warning" />
            ) : (
              <Moon size={16} className="text-muted" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
