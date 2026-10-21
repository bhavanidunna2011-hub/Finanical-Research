import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ConversationalResearch from "./pages/ConversationalResearch";
import DocumentLibrary from "./pages/DocumentLibrary";
import ReportView from "./pages/ReportView";
import UploadDocumentModal from "./components/UploadDocumentModal";
import { INITIAL_SESSIONS } from "./data/seedData";
import { INITIAL_DOCUMENTS } from "./data/documentData";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("finresearch_theme") || "light"
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Active page: "Research" | "Documents" | "Reports"
  const [activePage, setActivePage] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qPage = urlParams.get("page");
      if (qPage) {
        if (qPage === "Documents" || qPage === "Document Library" || qPage === "Upload Document") return "Documents";
        if (qPage === "Reports" || qPage === "Research Reports" || qPage === "Analyst Report") return "Reports";
        return "Research";
      }
      const stored = localStorage.getItem("finresearch_active_page");
      if (stored) {
        if (stored === "Documents" || stored === "Document Library" || stored === "Upload Document") return "Documents";
        if (stored === "Reports" || stored === "Research Reports" || stored === "Analyst Report") return "Reports";
        return "Research";
      }
    } catch {}
    return "Research";
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

  // Sessions state (default to INITIAL_SESSIONS so user immediately has research targets)
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

  // Documents state (default to INITIAL_DOCUMENTS so user has files to query)
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
          if (qPage === "Documents" || qPage === "Document Library") setActivePage("Documents");
          else if (qPage === "Reports" || qPage === "Research Reports") setActivePage("Reports");
          else setActivePage("Research");
        }
      } catch {}
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigateTo(page) {
    let target = "Research";
    if (page === "Documents" || page === "Document Library" || page === "Upload Document") {
      target = "Documents";
    } else if (page === "Reports" || page === "Research Reports" || page === "Analyst Report") {
      target = "Reports";
    } else {
      target = "Research";
    }

    setActivePage(target);
    try {
      localStorage.setItem("finresearch_active_page", target);
      const url = new URL(window.location.href);
      url.searchParams.set("page", target);
      window.history.replaceState({}, "", url.toString());
    } catch {}
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`} data-theme={theme}>
      {/* Sleek Minimal 3-Section Sidebar */}
      <Sidebar
        activePage={activePage}
        setPage={navigateTo}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <main className="main-content">
        {/* Clean, Serene Top Header */}
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
          {/* Section 1: AI Conversational Research */}
          {activePage === "Research" && (
            <ConversationalResearch
              session={activeSession}
              sessions={sessions}
              setActiveSession={setActiveSession}
              setPage={navigateTo}
            />
          )}

          {/* Section 2: Financial Documents */}
          {activePage === "Documents" && (
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
                }
                navigateTo("Research");
              }}
            />
          )}

          {/* Section 3: Executive Reports */}
          {activePage === "Reports" && (
            <ReportView
              session={activeSession}
              sessions={sessions}
              initialView="preview"
              onBack={() => navigateTo("Research")}
            />
          )}
        </div>
      </main>

      {/* Lightweight Upload Modal */}
      <UploadDocumentModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={(doc) => {
          saveDocuments([doc, ...documents]);
        }}
      />
    </div>
  );
}
