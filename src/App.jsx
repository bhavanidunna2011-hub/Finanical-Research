import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import WorkspaceDirectory from "./pages/WorkspaceDirectory";
import SessionDetails from "./pages/SessionDetails";
import CreateSession from "./pages/CreateSession";
import DocumentLibrary from "./pages/DocumentLibrary";
import ConversationalResearch from "./pages/ConversationalResearch";
import ResearchWorkspace from "./pages/ResearchWorkspace";
import ReportView from "./pages/ReportView";
import OrchestrationView from "./pages/OrchestrationView";
import UploadDocumentModal from "./components/UploadDocumentModal";
import CreateSessionModal from "./components/CreateSessionModal";
import { INITIAL_SESSIONS } from "./data/seedData";
import { INITIAL_DOCUMENTS } from "./data/documentData";
import "./index.css";

function normalizePageName(page) {
  if (!page) return "Dashboard";
  const p = page.toLowerCase();
  if (p === "dashboard") return "Dashboard";
  if (p.includes("session") || p.includes("workspace") || p.includes("directory")) return "Sessions";
  if (p.includes("doc") || p.includes("upload") || p.includes("knowledge")) return "Documents";
  if (p.includes("research") || p.includes("query") || p.includes("chat")) return "Research";
  if (p.includes("analysis") || p.includes("extract") || p.includes("flag") || p.includes("compare")) return "Analysis";
  if (p.includes("report")) return "Reports";
  if (p.includes("setting") || p.includes("orchestrat") || p.includes("agent") || p.includes("system")) return "Settings";
  return "Dashboard";
}

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("finresearch_theme") || "dark"
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Active top-level page
  const [activePage, setActivePage] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qPage = urlParams.get("page");
      if (qPage) return normalizePageName(qPage);
      const stored = localStorage.getItem("finresearch_active_page");
      if (stored) return normalizePageName(stored);
    } catch {}
    return "Dashboard";
  });

  // Subview states for multi-view pages
  const [sessionSubView, setSessionSubView] = useState("directory"); // "directory" | "details" | "create"
  const [documentSubView, setDocumentSubView] = useState("library"); // "library" | "upload" | "details"

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem("finresearch_theme", nextTheme);
      return nextTheme;
    });
  }

  function toggleSidebar() {
    setSidebarCollapsed((prev) => !prev);
  }

  // Sessions state
  const [sessions, setSessions] = useState(() => {
    try {
      const stored = localStorage.getItem("finresearch_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SESSIONS;
  });

  // Active session
  const [activeSession, setActiveSession] = useState(() => {
    try {
      const savedId = localStorage.getItem("finresearch_active_session_id");
      if (savedId) {
        const found = sessions.find((s) => s.id === savedId);
        if (found) return found;
      }
    } catch {}
    return sessions.length > 0 ? sessions[0] : INITIAL_SESSIONS[0];
  });

  // Documents state
  const [documents, setDocuments] = useState(() => {
    try {
      const raw = localStorage.getItem("finresearch_documents_v2");
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_DOCUMENTS;
  });

  function saveDocuments(newDocs) {
    setDocuments(newDocs);
    try {
      localStorage.setItem("finresearch_documents_v2", JSON.stringify(newDocs));
    } catch {}
  }

  function saveSessions(updatedSessions) {
    setSessions(updatedSessions);
    try {
      localStorage.setItem("finresearch_sessions", JSON.stringify(updatedSessions));
    } catch {}
  }

  useEffect(() => {
    if (activeSession?.id) {
      try {
        localStorage.setItem("finresearch_active_session_id", activeSession.id);
      } catch {}
    }
  }, [activeSession?.id]);

  useEffect(() => {
    function handlePopState() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const qPage = urlParams.get("page");
        if (qPage) {
          setActivePage(normalizePageName(qPage));
        }
      } catch {}
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateTo(page, subview) {
    const target = normalizePageName(page);
    setActivePage(target);

    // Track subviews
    if (page === "Create Session" || subview === "create") {
      setSessionSubView("create");
    } else if (page === "Session Details" || subview === "details") {
      setSessionSubView("details");
    } else if (target === "Sessions") {
      if (subview) setSessionSubView(subview);
      else setSessionSubView("directory");
    }

    if (page === "Upload Document" || subview === "upload") {
      setDocumentSubView("upload");
    } else if (target === "Documents") {
      if (subview) setDocumentSubView(subview);
      else setDocumentSubView("library");
    }

    try {
      localStorage.setItem("finresearch_active_page", target);
      const url = new URL(window.location.href);
      url.searchParams.set("page", target);
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }

  // Session CRUD Handlers
  function handleCreateSession(newSession) {
    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setActiveSession(newSession);
    setSessionSubView("details");
  }

  function handleUpdateSession(updatedSession) {
    const updated = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    saveSessions(updated);
    if (activeSession?.id === updatedSession.id) {
      setActiveSession(updatedSession);
    }
  }

  function handleDuplicateSession(sessionToDup) {
    const duplicated = {
      ...sessionToDup,
      id: crypto.randomUUID(),
      title: `${sessionToDup.title} (Copy)`,
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [duplicated, ...sessions];
    saveSessions(updated);
    setActiveSession(duplicated);
    setSessionSubView("details");
  }

  function handleDeleteSession(sessionId) {
    const updated = sessions.filter((s) => s.id !== sessionId);
    saveSessions(updated);
    if (activeSession?.id === sessionId) {
      setActiveSession(updated[0] || null);
    }
    setSessionSubView("directory");
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`} data-theme={theme}>
      {/* Sleek Minimal 7-Item Sidebar */}
      <Sidebar
        activePage={activePage}
        setPage={navigateTo}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <main className="main-content">
        {/* Clean, Disciplined Top Header */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          activePage={activePage}
          sessions={sessions}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          setPage={navigateTo}
          onToggleMobileSidebar={toggleSidebar}
        />

        <div className="page-container">
          {/* Module 1: Dashboard */}
          {activePage === "Dashboard" && (
            <Dashboard
              sessions={sessions}
              documents={documents}
              setPage={navigateTo}
              setActiveSession={setActiveSession}
              onDeleteSession={handleDeleteSession}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onOpenCreateModal={() => setCreateModalOpen(true)}
            />
          )}

          {/* Module 2: Research Sessions (Directory, Details, Create) */}
          {activePage === "Sessions" && (
            <>
              {sessionSubView === "create" ? (
                <CreateSession
                  onCreateSession={handleCreateSession}
                  onCancel={() => setSessionSubView("directory")}
                />
              ) : sessionSubView === "details" && activeSession ? (
                <SessionDetails
                  session={activeSession}
                  onBack={() => setSessionSubView("directory")}
                  onUpdateSession={handleUpdateSession}
                  onDuplicateSession={handleDuplicateSession}
                  onDeleteSession={handleDeleteSession}
                  onLaunchInteractive={() => navigateTo("Research")}
                  onNavigateToReports={() => navigateTo("Reports")}
                  onNavigateToDocs={() => navigateTo("Documents")}
                />
              ) : (
                <WorkspaceDirectory
                  sessions={sessions}
                  activeSession={activeSession}
                  onSelectSession={(s) => {
                    setActiveSession(s);
                    setSessionSubView("details");
                  }}
                  onViewSessionDetails={(s) => {
                    setActiveSession(s);
                    setSessionSubView("details");
                  }}
                  onLaunchInteractive={(s) => {
                    setActiveSession(s);
                    navigateTo("Research");
                  }}
                  onOpenCreateModal={() => setCreateModalOpen(true)}
                  onDuplicateSession={handleDuplicateSession}
                  onDeleteSession={handleDeleteSession}
                />
              )}
            </>
          )}

          {/* Module 3: Financial Documents (Library, Upload, Search) */}
          {activePage === "Documents" && (
            <DocumentLibrary
              documents={documents}
              onUpdateDocuments={saveDocuments}
              sessions={sessions}
              activeSession={activeSession}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
              initialSubView={documentSubView}
              onOpenDocumentSession={(companyKey) => {
                const s = sessions.find((ses) => ses.companyIds?.includes(companyKey));
                if (s) {
                  setActiveSession(s);
                }
                navigateTo("Research");
              }}
            />
          )}

          {/* Module 4: AI Research (Conversational Query & Grounded Citations) */}
          {activePage === "Research" && (
            <ConversationalResearch
              documents={documents}
              session={activeSession}
              sessions={sessions}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
            />
          )}

          {/* Module 5: Financial Analysis (Extraction, Red Flags, Peer Comparison) */}
          {activePage === "Analysis" && (
            <ResearchWorkspace
              documents={documents}
              session={activeSession}
              sessions={sessions}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
              initialMode="interactive"
              onUpdateSession={handleUpdateSession}
              onDuplicateSession={handleDuplicateSession}
              onDeleteSession={handleDeleteSession}
              onOpenCreateModal={() => setCreateModalOpen(true)}
            />
          )}

          {/* Module 6: Executive Reports (Library, Preview, PDF Export) */}
          {activePage === "Reports" && (
            <ReportView
              session={activeSession}
              sessions={sessions}
              initialView="preview"
              onBack={() => navigateTo("Research")}
            />
          )}

          {/* Module 7: Multi-Agent System & Orchestration Diagnostics */}
          {activePage === "Settings" && (
            <OrchestrationView
              sessions={sessions}
              activeSession={activeSession}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
            />
          )}
        </div>
      </main>

      {/* Lightweight Upload Filing Modal */}
      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={(doc) => {
          saveDocuments([doc, ...documents]);
        }}
      />

      {/* Lightweight Create Session Modal */}
      <CreateSessionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateSession={(newSession) => {
          handleCreateSession(newSession);
          setCreateModalOpen(false);
        }}
      />
    </div>
  );
}
