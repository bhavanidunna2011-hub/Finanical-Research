import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import CreateSession from "./pages/CreateSession";
import ResearchWorkspace from "./pages/ResearchWorkspace";
import OrchestrationView from "./pages/OrchestrationView";
import DocumentLibrary from "./pages/DocumentLibrary";
import KnowledgeBase from "./pages/KnowledgeBase";
import ReportView from "./pages/ReportView";
import ConversationalResearch from "./pages/ConversationalResearch";
import UploadDocumentModal from "./components/UploadDocumentModal";
import CreateSessionModal from "./components/CreateSessionModal";
import { INITIAL_SESSIONS } from "./data/seedData";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("finresearch_theme") || "light"
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState("directory");

  const [activePage, setActivePage] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qPage = urlParams.get("page");
      if (qPage) return qPage;
      const stored = localStorage.getItem("finresearch_active_page");
      if (stored) return stored;
    } catch {}
    return "Dashboard";
  });

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

  const [sessions, setSessions] = useState(() => {
    try {
      if (!localStorage.getItem("finresearch_fresh_clean_v2")) return [];
      const stored = localStorage.getItem("finresearch_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [activeSession, setActiveSession] = useState(() => {
    try {
      if (!localStorage.getItem("finresearch_fresh_clean_v2")) return null;
      const savedId = localStorage.getItem("finresearch_active_session_id");
      if (savedId) {
        const found = sessions.find((s) => s.id === savedId);
        if (found) return found;
      }
    } catch {}
    return sessions.length > 0 ? sessions[0] : null;
  });

  const [documents, setDocuments] = useState(() => {
    try {
      if (!localStorage.getItem("finresearch_fresh_clean_v2")) return [];
      const raw = localStorage.getItem("finresearch_documents_v2");
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  function saveDocuments(newDocs) {
    setDocuments(newDocs);
    try {
      localStorage.setItem("finresearch_documents_v2", JSON.stringify(newDocs));
    } catch {}
  }

  // Auto-clean any legacy demo cache so the application is immediately 100% fresh
  useEffect(() => {
    try {
      if (!localStorage.getItem("finresearch_fresh_clean_v2")) {
        localStorage.removeItem("finresearch_sessions");
        localStorage.removeItem("finresearch_active_session_id");
        localStorage.removeItem("finresearch_documents_v2");
        localStorage.removeItem("finresearch_kb_records_v3");
        localStorage.removeItem("finresearch_reports_v6");
        localStorage.removeItem("finresearch_orchestration_state_v4");
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith("finresearch_chat_history")) {
            localStorage.removeItem(k);
          }
        });
        localStorage.setItem("finresearch_fresh_clean_v2", "true");
        setSessions([]);
        setActiveSession(null);
        setDocuments([]);
      }
    } catch {}
  }, []);

  function resetToFreshState() {
    localStorage.removeItem("finresearch_sessions");
    localStorage.removeItem("finresearch_active_session_id");
    localStorage.removeItem("finresearch_documents_v2");
    localStorage.removeItem("finresearch_kb_records_v3");
    localStorage.removeItem("finresearch_reports_v6");
    localStorage.removeItem("finresearch_orchestration_state_v4");
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("finresearch_chat_history")) {
          localStorage.removeItem(k);
        }
      });
    } catch {}
    localStorage.setItem("finresearch_fresh_clean_v2", "true");
    setSessions([]);
    setActiveSession(null);
    setDocuments([]);
  }

  function loadSampleData() {
    setSessions(INITIAL_SESSIONS);
    setActiveSession(INITIAL_SESSIONS[0]);
    localStorage.setItem("finresearch_sessions", JSON.stringify(INITIAL_SESSIONS));
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
          setActivePage(qPage);
        }
      } catch {}
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function saveSessions(updatedSessions) {
    setSessions(updatedSessions);
    localStorage.setItem("finresearch_sessions", JSON.stringify(updatedSessions));
  }

  function createSession(formData) {
    const newSession = {
      id: crypto.randomUUID(),
      title: formData.title,
      company: formData.company || "General",
      companyIds: formData.companyIds || ["INFY"],
      description: formData.description || "",
      researchType: formData.researchType || "Company Analysis",
      status: "Analysis Complete",
      createdAt: new Date().toLocaleDateString(),
      documents: formData.documents || [
        { name: "Infosys-Annual-Report-2023-24.pdf", size: "18.4 MB", pages: 384, chunks: 1420, status: "Indexed", company: "INFY" }
      ],
      agentStatus: {
        documentAgent: "Completed",
        extractionAgent: "Completed",
        redFlagAgent: "Completed",
        comparisonAgent: formData.companyIds?.length > 1 ? "Completed" : "N/A",
        researchAgent: "Ready",
        reportAgent: "Generated"
      }
    };

    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setActiveSession(newSession);
    setActivePage("Research Workspace");
  }

  function updateSession(id, updatedFields) {
    const updated = sessions.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    saveSessions(updated);
    if (activeSession?.id === id) {
      setActiveSession((prev) => ({ ...prev, ...updatedFields }));
    }
  }

  function duplicateSession(id) {
    const target = sessions.find((s) => s.id === id);
    if (!target) return;
    const clone = {
      ...target,
      id: crypto.randomUUID(),
      title: `${target.title} (Copy)`,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
      status: target.status || "Analysis Complete"
    };
    const updated = [clone, ...sessions];
    saveSessions(updated);
    setActiveSession(clone);
  }

  function deleteSession(id) {
    const updated = sessions.filter((s) => s.id !== id);
    saveSessions(updated);

    if (activeSession?.id === id) {
      if (updated.length > 0) {
        setActiveSession(updated[0]);
      } else {
        setActiveSession(null);
        setActivePage("Dashboard");
      }
    }
  }

  function navigateTo(page, mode = null) {
    if (
      (page === "Research Workspace" ||
        page === "Financial Query & Research" ||
        page === "Analyst Report" ||
        page === "Research Reports") &&
      !activeSession
    ) {
      if (sessions.length > 0) {
        setActiveSession(sessions[0]);
      } else {
        setActivePage("Create Session");
        return;
      }
    }
    if (mode) {
      setWorkspaceMode(mode);
    } else if (page === "Research Workspace") {
      setWorkspaceMode("directory");
    }
    setActivePage(page);
    try {
      localStorage.setItem("finresearch_active_page", page);
      const url = new URL(window.location.href);
      url.searchParams.set("page", page);
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }

  function handleExportReport() {
    navigateTo("Analyst Report");
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`} data-theme={theme}>
      {/* Collapsible Left Sidebar */}
      <Sidebar
        activePage={activePage}
        setPage={navigateTo}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <main className="main-content">
        {/* Top Navigation Bar with Dynamic Title, Search, Notifications, Profile */}
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          activePage={activePage}
          sessions={sessions}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          setPage={navigateTo}
          onExportReport={handleExportReport}
          onToggleMobileSidebar={toggleSidebar}
        />

        <div className="page-container">
          {activePage === "Dashboard" && (
            <Dashboard
              sessions={sessions}
              documents={documents}
              setPage={navigateTo}
              setActiveSession={setActiveSession}
              onDeleteSession={deleteSession}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onOpenCreateModal={() => setCreateModalOpen(true)}
              onResetToFresh={resetToFreshState}
              onLoadSampleData={loadSampleData}
            />
          )}

          {activePage === "Create Session" && (
            <CreateSession
              onCreateSession={createSession}
              onCancel={() => navigateTo("Research Workspace")}
            />
          )}

          {activePage === "Financial Query & Research" && (
            <ConversationalResearch
              session={activeSession}
              sessions={sessions}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
            />
          )}

          {activePage === "Research Workspace" && (
            <ResearchWorkspace
              session={activeSession}
              sessions={sessions}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
              onUpdateSession={updateSession}
              onDuplicateSession={duplicateSession}
              onDeleteSession={deleteSession}
              onOpenCreateModal={() => setCreateModalOpen(true)}
              initialMode={workspaceMode}
            />
          )}

          {activePage === "Multi-Agent Orchestrator" && (
            <OrchestrationView
              sessions={sessions}
              activeSession={activeSession}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
            />
          )}

          {activePage === "Document Library" && (
            <DocumentLibrary
              sessions={sessions}
              activeSession={activeSession}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
              initialSubView="library"
              onOpenDocumentSession={(companyKey) => {
                const s = sessions.find((ses) => ses.companyIds?.includes(companyKey));
                if (s) {
                  setActiveSession(s);
                  navigateTo("Research Workspace", "interactive");
                }
              }}
            />
          )}

          {activePage === "Upload Document" && (
            <DocumentLibrary
              sessions={sessions}
              activeSession={activeSession}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
              initialSubView="upload"
              onOpenDocumentSession={(companyKey) => {
                const s = sessions.find((ses) => ses.companyIds?.includes(companyKey));
                if (s) {
                  setActiveSession(s);
                  navigateTo("Research Workspace", "interactive");
                }
              }}
            />
          )}

          {activePage === "Knowledge Base" && (
            <KnowledgeBase
              sessions={sessions}
              activeSession={activeSession}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
            />
          )}

          {(activePage === "Research Reports" || activePage === "Analyst Report") && (
            <ReportView
              session={activeSession}
              sessions={sessions}
              initialView={activePage === "Analyst Report" ? "preview" : "library"}
              onBack={() => navigateTo("Research Workspace")}
            />
          )}
        </div>
      </main>

      {/* Quick Action Modals */}
      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={(doc) => {
          saveDocuments([doc, ...documents]);
        }}
      />

      <CreateSessionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateSession={createSession}
      />
    </div>
  );
}
