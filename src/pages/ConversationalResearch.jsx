import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  FileText,
  X,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  FolderOpen
} from "lucide-react";
import ChatMessageItem from "../components/chat/ChatMessageItem";
import ContextSourcesPanel from "../components/chat/ContextSourcesPanel";
import ChatInputBar from "../components/chat/ChatInputBar";
import CitationDetailsModal from "../components/chat/CitationDetailsModal";
import DocumentViewer from "../components/DocumentViewer";
import {
  SUGGESTED_RESEARCH_QUESTIONS,
  generateMockAgentResponse,
  getStoredChatHistory,
  saveStoredChatHistory,
  clearStoredChatHistory
} from "../data/researchChatData";
import { INITIAL_DOCUMENTS, getStoredDocuments } from "../data/documentData";

export default function ConversationalResearch({
  documents: initialDocumentsProp,
  session,
  sessions = [],
  setActiveSession,
  setPage
}) {
  // Session determination
  const activeSession = session || sessions[0];
  const sessionId = activeSession?.id || "default";

  // Documents available in system library
  const [availableDocs, setAvailableDocs] = useState(() => {
    if (Array.isArray(initialDocumentsProp) && initialDocumentsProp.length > 0) {
      return initialDocumentsProp;
    }
    return getStoredDocuments();
  });

  // Sync availableDocs if parent documents update
  useEffect(() => {
    if (Array.isArray(initialDocumentsProp) && initialDocumentsProp.length > 0) {
      setAvailableDocs(initialDocumentsProp);
    }
  }, [initialDocumentsProp]);

  // Active documents in research scope for this session
  const [sessionScopeDocs, setSessionScopeDocs] = useState(() => {
    const relevant = availableDocs.filter((d) => {
      if (!activeSession?.companyIds || activeSession.companyIds.length === 0) return true;
      return activeSession.companyIds.includes(d.ticker);
    });
    return relevant.length > 0 ? relevant : availableDocs.slice(0, 4);
  });

  // Selected document IDs in active research scope
  const [selectedDocIds, setSelectedDocIds] = useState(() =>
    sessionScopeDocs.map((d) => d.id)
  );

  // Consolidated Right Panel State: isOpen and activeTab ('context' | 'sources' | 'citations')
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [panelTab, setPanelTab] = useState("sources");

  // Chat message stream state
  const [messages, setMessages] = useState(() => getStoredChatHistory(sessionId));
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStage, setTypingStage] = useState("");
  const [errorState, setErrorState] = useState(null);

  // Track previous session ID to cleanly handle session switching
  const prevSessionIdRef = useRef(sessionId);

  // Update scope documents and selected documents when session or availableDocs change
  useEffect(() => {
    const relevant = availableDocs.filter((d) => {
      if (!activeSession?.companyIds || activeSession.companyIds.length === 0) return true;
      return activeSession.companyIds.includes(d.ticker);
    });
    const updatedScope = relevant.length > 0 ? relevant : availableDocs.slice(0, 4);
    setSessionScopeDocs(updatedScope);
    setSelectedDocIds(updatedScope.map((d) => d.id));
  }, [activeSession?.id, availableDocs]);

  // Synchronize chat history when user switches research sessions
  useEffect(() => {
    if (prevSessionIdRef.current !== sessionId) {
      prevSessionIdRef.current = sessionId;
      const loaded = getStoredChatHistory(sessionId);
      setMessages(loaded);
      setErrorState(null);
      setIsTyping(false);
      setTypingStage("");
      const initialCite = loaded.find((m) => m.citations && m.citations.length > 0)?.citations?.[0];
      setActiveCitation(initialCite || null);
    }
  }, [sessionId]);

  // Save messages to localStorage for current session
  useEffect(() => {
    if (prevSessionIdRef.current === sessionId) {
      saveStoredChatHistory(sessionId, messages);
    }
  }, [sessionId, messages]);

  // Citation modal & inspector state
  const [activeCitation, setActiveCitation] = useState(() => {
    const initialCite = messages.find((m) => m.citations && m.citations.length > 0)?.citations?.[0];
    return initialCite || null;
  });
  const [citationModalOpen, setCitationModalOpen] = useState(false);

  // Document Viewer inline/overlay state
  const [viewerDoc, setViewerDoc] = useState(null); // { doc: Object, page: number }

  // Auto-scroll ref
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, errorState]);

  // Document Selection & Scope Handlers
  function handleToggleDocSelection(docId) {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  }

  function handleSelectAllDocs() {
    setSelectedDocIds(sessionScopeDocs.map((d) => d.id));
  }

  function handleDeselectAllDocs() {
    setSelectedDocIds([]);
  }

  // Handle User Sending a Message
  function handleSendMessage(e) {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    if (selectedDocIds.length === 0) {
      setErrorState({
        title: "No Documents Selected",
        message: "Please select at least one source filing in the Context & Sources panel to ground your query."
      });
      return;
    }

    const queryText = inputValue.trim();
    setInputValue("");
    setErrorState(null);

    // 1. Add User Message
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: queryText
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Factual typing stages for search & verification
    setTypingStage("Searching selected source documents...");

    setTimeout(() => {
      setTypingStage("Verifying financial line items and citations...");

      setTimeout(() => {
        setTypingStage("Synthesizing research response...");

        setTimeout(() => {
          const selectedDocs = sessionScopeDocs.filter((d) => selectedDocIds.includes(d.id));
          const mockResponse = generateMockAgentResponse(queryText, selectedDocs, activeSession);

          const assistantMsg = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            ...mockResponse
          };

          setMessages((prev) => [...prev, assistantMsg]);
          setIsTyping(false);
          setTypingStage("");

          // Update active citation to first emitted citation
          if (mockResponse.citations && mockResponse.citations.length > 0) {
            setActiveCitation(mockResponse.citations[0]);
          }
        }, 600);
      }, 600);
    }, 600);
  }

  // Handle Clicking a Suggested Question (populates composer without auto-submitting)
  function handleSelectSuggestedQuestion(questionText) {
    setInputValue(questionText);
  }

  // Handle Citation Click: opens panel and navigates directly to citation details tab
  function handleCitationClick(citation) {
    setActiveCitation(citation);
    setIsPanelOpen(true);
    setPanelTab("citations");
  }

  // Handle Launch Document Viewer
  function handleViewDocument(docName, page) {
    const targetDoc =
      availableDocs.find((d) => d.name === docName) ||
      sessionScopeDocs.find((d) => d.name === docName) ||
      availableDocs.find((d) => d.company === activeSession?.company) ||
      availableDocs[0];

    if (targetDoc) {
      setViewerDoc({
        doc: targetDoc,
        initialPage: page || 112
      });
    } else {
      setErrorState({
        title: "Document Unavailable",
        message: `Document "${docName}" is not loaded in current library.`
      });
    }
  }

  function handleClearChat() {
    if (window.confirm("Clear conversation history for this research session?")) {
      setMessages([]);
      clearStoredChatHistory(sessionId);
      setErrorState(null);
      setActiveCitation(null);
    }
  }

  // Collect all citations across current thread for quick reference
  const allCitations = messages
    .filter((m) => m.citations && Array.isArray(m.citations))
    .flatMap((m) => m.citations);

  return (
    <div className="fin-research-page animate-fadeIn">
      {/* =========================================================================
          COMPACT TOOLBAR: Research Session, Grounding Scope & Context Toggle
         ========================================================================= */}
      <div className="fin-research-toolbar">
        <div className="fin-toolbar-left">
          {/* Research Session Selector */}
          <div className="fin-session-picker">
            <span className="fin-toolbar-label">Session:</span>
            <select
              aria-label="Active research session"
              className="fin-toolbar-select"
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
                  {s.title} ({s.company || "General"})
                </option>
              ))}
            </select>
          </div>

          {/* Factual Scope Indicator */}
          <div className="fin-scope-pill" title={`${selectedDocIds.length} filings active in research scope`}>
            <ShieldCheck size={13} className="text-teal" />
            <span>
              {selectedDocIds.length} {selectedDocIds.length === 1 ? "source" : "sources"} active
            </span>
          </div>
        </div>

        <div className="fin-toolbar-right">
          {/* Toggle Context & Sources Panel */}
          <button
            type="button"
            className={`fin-btn fin-btn-xs fin-toolbar-panel-btn ${
              isPanelOpen ? "active" : ""
            }`}
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            title={isPanelOpen ? "Hide Context & Sources panel" : "Show Context & Sources panel"}
            aria-expanded={isPanelOpen}
          >
            <SlidersHorizontal size={13} className="text-teal" />
            <span className="hidden sm:inline">Context & Sources</span>
            <span className="fin-badge fin-badge-xs fin-badge-teal font-mono">
              {selectedDocIds.length}
            </span>
          </button>

          {/* Minimal Action: Clear Chat */}
          {messages.length > 0 && (
            <button
              type="button"
              className="fin-btn fin-btn-secondary fin-btn-xs text-muted hover:text-danger hover:border-danger/40 transition-colors"
              onClick={handleClearChat}
              title="Clear conversation history"
            >
              <Trash2 size={13} />
              <span className="hidden md:inline ml-1">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          WORKSPACE: CONVERSATION (PRIMARY) + COLLAPSIBLE CONTEXT & SOURCES PANEL
         ========================================================================= */}
      <div className={`fin-research-workspace ${!isPanelOpen ? "panel-collapsed" : ""}`}>
        {/* Main Conversation Column */}
        <main className="fin-conversation-column" role="region" aria-label="Conversation area">
          <div className="fin-conversation-stream">
            <div className="fin-messages-max-container">
              {/* Empty State */}
              {messages.length === 0 && (
                <div className="fin-chat-empty-state animate-fadeIn">
                  {selectedDocIds.length === 0 ? (
                    <div className="fin-empty-no-sources text-center py-8 px-4">
                      <div className="fin-empty-icon-box mb-3 text-warning">
                        <AlertTriangle size={24} />
                      </div>
                      <h2 className="text-base font-semibold text-main">
                        No financial documents selected
                      </h2>
                      <p className="text-xs text-muted max-w-md mx-auto mt-1 leading-relaxed">
                        Select indexed filings in the Sources panel or visit the Document Library to enable grounded financial research.
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <button
                          type="button"
                          className="fin-btn fin-btn-primary fin-btn-xs"
                          onClick={() => {
                            setIsPanelOpen(true);
                            setPanelTab("sources");
                          }}
                        >
                          <FileText size={13} className="mr-1" />
                          <span>Select Filings</span>
                        </button>
                        {setPage && (
                          <button
                            type="button"
                            className="fin-btn fin-btn-secondary fin-btn-xs"
                            onClick={() => setPage("Documents")}
                          >
                            <FolderOpen size={13} className="mr-1" />
                            <span>Document Library</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="fin-empty-inquiry-box py-6">
                      <div className="text-center mb-5">
                        <h2 className="text-base sm:text-lg font-semibold text-main">
                          What would you like to investigate?
                        </h2>
                        <p className="text-xs text-muted mt-1 max-w-md mx-auto leading-relaxed">
                          Select a suggested research question below or type your inquiry to retrieve evidence-backed disclosures from active filings.
                        </p>
                      </div>

                      <div className="fin-empty-suggestions-list">
                        {SUGGESTED_RESEARCH_QUESTIONS.map((sq) => (
                          <button
                            key={sq.id}
                            type="button"
                            className="fin-empty-suggestion-row"
                            onClick={() => handleSelectSuggestedQuestion(sq.question)}
                          >
                            <span className="fin-suggestion-text">{sq.question}</span>
                            <ChevronRight size={14} className="fin-suggestion-arrow shrink-0 text-muted" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Render Chat Messages */}
              {messages.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  message={msg}
                  onCitationClick={handleCitationClick}
                  onViewDocument={handleViewDocument}
                />
              ))}

              {/* Error State Banner */}
              {errorState && (
                <div className="fin-chat-error-card animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-danger shrink-0" />
                    <strong className="text-xs font-semibold text-danger">
                      {errorState.title || "Research Query Error"}
                    </strong>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {errorState.message}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="fin-btn fin-btn-secondary fin-btn-xs"
                      onClick={() => setErrorState(null)}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Factual Typing / Retrieval Indicator */}
              {isTyping && (
                <div className="fin-chat-typing-indicator-row animate-fadeIn">
                  <div className="typing-avatar">
                    <Bot size={15} className="text-teal" />
                  </div>
                  <div className="typing-bubble">
                    <div className="typing-dots-wave">
                      <span className="dot dot-1" />
                      <span className="dot dot-2" />
                      <span className="dot dot-3" />
                    </div>
                    <span className="typing-stage-text">{typingStage}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Message Composer (Centered and Anchored) */}
          <div className="fin-composer-anchor">
            <div className="fin-messages-max-container">
              <ChatInputBar
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmit={handleSendMessage}
                isLoading={isTyping}
                selectedDocCount={selectedDocIds.length}
                onOpenSources={() => {
                  setIsPanelOpen(true);
                  setPanelTab("sources");
                }}
              />
            </div>
          </div>
        </main>

        {/* =========================================================================
            CONSOLIDATED CONTEXT & SOURCES PANEL (COLLAPSIBLE)
           ========================================================================= */}
        <ContextSourcesPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          activeTab={panelTab}
          onTabChange={setPanelTab}
          activeSession={activeSession}
          sessions={sessions}
          onSelectSession={setActiveSession}
          availableDocuments={sessionScopeDocs}
          selectedDocIds={selectedDocIds}
          onToggleDocSelection={handleToggleDocSelection}
          onSelectAllDocs={handleSelectAllDocs}
          onDeselectAllDocs={handleDeselectAllDocs}
          onOpenDocumentLibrary={() => setPage && setPage("Documents")}
          onViewDocument={handleViewDocument}
          activeCitation={activeCitation}
          allCitations={allCitations}
          onCitationClick={handleCitationClick}
        />
      </div>

      {/* Citation Details Modal (Secondary popup if triggered from inline document viewer) */}
      {citationModalOpen && activeCitation && (
        <CitationDetailsModal
          citation={activeCitation}
          onClose={() => setCitationModalOpen(false)}
          onViewDocument={handleViewDocument}
        />
      )}

      {/* Full-Screen Document Viewer Overlay when View Document is triggered */}
      {viewerDoc && (
        <div className="fin-modal-overlay" onClick={() => setViewerDoc(null)}>
          <div className="fin-doc-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="viewer-modal-header">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-teal" />
                <div>
                  <h3 className="text-sm font-bold text-main">
                    Filing Viewer: {viewerDoc.doc.name}
                  </h3>
                  <span className="text-xs text-muted">
                    Navigated to cited Page {viewerDoc.initialPage}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewerDoc(null)}
                aria-label="Close viewer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="viewer-modal-body">
              <DocumentViewer
                document={viewerDoc.doc}
                initialPage={viewerDoc.initialPage}
                onCitationClick={(cite) => {
                  setActiveCitation(cite);
                  setIsPanelOpen(true);
                  setPanelTab("citations");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
