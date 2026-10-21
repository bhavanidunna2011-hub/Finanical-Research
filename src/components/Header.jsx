import React, { useState, useRef, useEffect } from "react";
import {
  Sun,
  Moon,
  Search,
  Bell,
  ChevronDown,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Printer,
  Sparkles,
  ShieldCheck,
  Menu,
  Activity,
  Layers,
  X
} from "lucide-react";
import { SEED_COMPANIES } from "../data/seedData";

export default function Header({
  theme,
  toggleTheme,
  activePage,
  sessions,
  activeSession,
  setActiveSession,
  setPage,
  onExportReport,
  onToggleMobileSidebar
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sessionDropdownOpen, setSessionDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(3);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const pageTitles = {
    "Dashboard": "Financial Research Dashboard",
    "Financial Query & Research": "Financial Query & Conversational Research Interface",
    "Research Workspace": "Interactive Research Workspace",
    "Create Session": "Create Research Session",
    "Multi-Agent Orchestrator": "Multi-Agent Orchestrator & Execution Pipeline",
    "Document Library": "Financial Documents",
    "Upload Document": "Upload Financial Document",
    "Knowledge Base": "Knowledge Base & Vector Index",
    "Research Reports": "Research Reports & PDF Export",
    "Analyst Report": "Research Reports & PDF Export"
  };

  const notifications = [
    {
      id: "n1",
      title: "Red Flag Disclosed: Apple Inc.",
      desc: "Forensic agent flagged $10.2B European State Aid tax charge in SEC Form 10-K.",
      time: "8m ago",
      type: "warning",
      unread: true
    },
    {
      id: "n2",
      title: "Document Ingestion Completed",
      desc: "Infosys Integrated Annual Report 2023-24 indexed into 1,420 dense vector chunks.",
      time: "24m ago",
      type: "success",
      unread: true
    },
    {
      id: "n3",
      title: "Peer Benchmarking Matrix Ready",
      desc: "Comparison Agent harmonized EBIT margins and deal TCV for INFY vs TCS.",
      time: "1h ago",
      type: "info",
      unread: true
    }
  ];

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter search results from user's active sessions and documents
  const searchResults = searchQuery.trim()
    ? (sessions || []).filter(
        (s) =>
          s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.company?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="fin-header-wrapper">
      {/* Top Disclosure Banner */}
      <div className="fin-ticker-bar">
        <div className="fin-ticker-label">
          <Activity size={12} className="fin-pulse-icon" />
          <span>WORKSPACE STATUS</span>
        </div>
        <div className="fin-ticker-track">
          <div className="fin-ticker-item">
            <span>Fresh Analytical Environment</span>
          </div>
          <span className="fin-ticker-sep">•</span>
          <div className="fin-ticker-item">
            <span>Upload Filings to Ingest & Index Chunks</span>
          </div>
          <span className="fin-ticker-sep">•</span>
          <div className="fin-ticker-item">
            <span>Autonomous Multi-Agent Pipeline Standby</span>
          </div>
        </div>
        <div className="fin-ticker-compliance">
          <ShieldCheck size={12} className="text-teal" />
          <span>Strict SEC / IFRS Grounding</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
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
            <span className="fin-breadcrumb-tag">
              FINRESEARCH AI <span>/</span> {activePage.toUpperCase()}
              {activeSession ? (
                <>
                  <span>/</span> {activeSession.company || activeSession.title}
                </>
              ) : null}
            </span>
            <h1 className="fin-page-title">{pageTitles[activePage] || activePage}</h1>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="fin-navbar-center" ref={searchRef}>
          <div className="fin-search-container">
            <Search size={15} className="fin-search-icon" />
            <input
              type="text"
              className="fin-search-input"
              placeholder="Search companies, filings, or ratios... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
            {searchQuery && (
              <button
                type="button"
                className="fin-search-clear"
                onClick={() => setSearchQuery("")}
              >
                <X size={13} />
              </button>
            )}
            <kbd className="fin-kbd">⌘K</kbd>

            {/* Instant Search Results Dropdown */}
            {searchOpen && searchQuery.trim() && (
              <div className="fin-search-dropdown animate-fadeIn">
                <div className="dropdown-section-header">MATCHING ENTITIES & FILINGS</div>
                {searchResults.length > 0 ? (
                  searchResults.map((c) => (
                    <div
                      key={c.id}
                      className="fin-search-result-row"
                      onClick={() => {
                        const targetSession = sessions.find((s) => s.companyIds?.includes(c.id));
                        if (targetSession) {
                          setActiveSession(targetSession);
                          setPage("Research Workspace");
                        } else {
                          setPage("Document Library");
                        }
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className="result-ticker-tag">{c.id}</div>
                      <div className="result-info">
                        <strong>{c.name}</strong>
                        <span className="text-xs text-muted block">{c.filingType} • {c.fiscalYear}</span>
                      </div>
                      <ExternalLink size={13} className="text-muted ml-auto" />
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-muted">
                    No matching filings found for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="fin-navbar-right">
          {/* Active Workspace / Session Switcher */}
          {sessions && sessions.length > 0 && (
            <div className="fin-session-switcher">
              <span className="switcher-label">Session:</span>
              <button
                type="button"
                className="switcher-btn"
                onClick={() => setSessionDropdownOpen(!sessionDropdownOpen)}
                title="Switch research session"
              >
                <span className="truncate max-w-[140px] font-semibold">
                  {activeSession ? activeSession.title : "Select Session"}
                </span>
                <ChevronDown size={13} className="ml-1 opacity-70" />
              </button>

              {sessionDropdownOpen && (
                <div className="fin-switcher-dropdown animate-fadeIn">
                  <div className="dropdown-section-header">ACTIVE SESSIONS ({sessions.length})</div>
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`switcher-item ${activeSession?.id === s.id ? "active" : ""}`}
                      onClick={() => {
                        setActiveSession(s);
                        setSessionDropdownOpen(false);
                        setPage("Research Workspace", "interactive");
                      }}
                    >
                      <div className="truncate text-left">
                        <strong className="block text-xs truncate">{s.title}</strong>
                        <span className="text-[11px] text-muted">{s.company || "General"}</span>
                      </div>
                      <span className="status-pill-sm">{s.status}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className="switcher-new-btn"
                    onClick={() => {
                      setSessionDropdownOpen(false);
                      setPage("Create Session");
                    }}
                  >
                    + New Session
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Export PDF Dossier button */}
          {activeSession && (
            <button
              type="button"
              className="fin-btn fin-btn-outline fin-btn-sm fin-export-btn"
              onClick={onExportReport}
              title="Export Institutional PDF Dossier"
            >
              <Printer size={13} className="mr-1.5" />
              <span>Export Dossier</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="fin-icon-btn"
              onClick={() => {
                setNotifOpen(!notifOpen);
                if (!notifOpen) setUnreadCount(0);
              }}
              title="System Alerts & Notifications"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="fin-notif-badge">{unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div className="fin-notif-menu animate-fadeIn">
                <div className="fin-notif-header">
                  <strong>Agent Audit Alerts</strong>
                  <span className="text-[11px] text-muted">Real-time Stream</span>
                </div>
                <div className="fin-notif-list">
                  {notifications.map((n) => (
                    <div key={n.id} className="fin-notif-item">
                      <div className="notif-dot-wrap">
                        {n.type === "warning" ? (
                          <AlertTriangle size={14} className="text-warning" />
                        ) : n.type === "success" ? (
                          <CheckCircle2 size={14} className="text-teal" />
                        ) : (
                          <Sparkles size={14} className="text-accent" />
                        )}
                      </div>
                      <div className="notif-content">
                        <strong>{n.title}</strong>
                        <p>{n.desc}</p>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="fin-notif-footer">
                  <span className="text-xs text-muted">All alerts strictly verified</span>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            className="fin-icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="fin-profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
              title="Analyst Profile & System Details"
            >
              <div className="fin-avatar">
                <span>FA</span>
              </div>
              <div className="fin-profile-labels">
                <strong className="analyst-name">FinResearch Analyst</strong>
                <span className="analyst-role">Equity Research</span>
              </div>
              <ChevronDown size={12} className="opacity-60 ml-0.5" />
            </button>

            {profileOpen && (
              <div className="fin-profile-menu animate-fadeIn">
                <div className="fin-profile-menu-header">
                  <strong>FinResearch AI Platform</strong>
                  <p className="text-xs text-muted">analyst@finresearch.ai</p>
                </div>
                <div className="fin-profile-menu-body">
                  <div className="profile-row">
                    <span>Role</span>
                    <strong>Senior Research Analyst</strong>
                  </div>
                  <div className="profile-row">
                    <span>Grounding Policy</span>
                    <span className="text-teal font-semibold">100% SEC/IFRS Strict</span>
                  </div>
                  <div className="profile-row">
                    <span>Active Modules</span>
                    <strong>6 Collaborative Agents</strong>
                  </div>
                  <div className="profile-row">
                    <span>Indexed Entities</span>
                    <strong>INFY, TCS, AAPL, MSFT</strong>
                  </div>
                </div>
                <div className="fin-profile-menu-footer">
                  <button
                    type="button"
                    className="fin-btn fin-btn-secondary fin-btn-sm w-full"
                    onClick={() => setProfileOpen(false)}
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
