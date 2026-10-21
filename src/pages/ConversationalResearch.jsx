import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Play,
  FileText,
  Building2,
  Database,
  Layers,
  HelpCircle,
  X,
  RefreshCw,
  Sliders,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import ChatMessageItem from "../components/chat/ChatMessageItem";
import ChatSidePanel from "../components/chat/ChatSidePanel";
import ChatInputBar from "../components/chat/ChatInputBar";
import CitationDetailsModal from "../components/chat/CitationDetailsModal";
import DocumentViewer from "../components/DocumentViewer";
import {
  INITIAL_CHAT_MESSAGES,
  SUGGESTED_RESEARCH_QUESTIONS,
  generateMockAgentResponse,
  getStoredChatHistory,
  saveStoredChatHistory,
  clearStoredChatHistory
} from "../data/researchChatData";
import { INITIAL_DOCUMENTS } from "../data/documentData";
import { SEED_COMPANIES } from "../data/seedData";

export default function ConversationalResearch({
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
    try {
      const stored = localStorage.getItem("finresearch_documents_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return INITIAL_DOCUMENTS;
  });

  // Active documents in research scope for this session
  const [sessionScopeDocs, setSessionScopeDocs] = useState(() => {
    const relevant = availableDocs.filter((d) => {
      if (!activeSession?.companyIds) return true;
      return activeSession.companyIds.includes(d.ticker);
    });
    return relevant.length > 0 ? relevant : availableDocs.slice(0, 4);
  });

  // Selected document IDs in active research scope
  const [selectedDocIds, setSelectedDocIds] = useState(() =>
    sessionScopeDocs.map((d) => d.id)
  );

  // Demo mode state (default to true for deterministic mock research)
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Chat message stream state
  const [messages, setMessages] = useState(() => getStoredChatHistory(sessionId));
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingStage, setTypingStage] = useState("");
  const [errorState, setErrorState] = useState(null);

  // Track previous session ID to cleanly handle session switching
  const prevSessionIdRef = useRef(sessionId);

  // Update scope documents and selected documents when session changes
  useEffect(() => {
    const relevant = availableDocs.filter((d) => {
      if (!activeSession?.companyIds) return true;
      return activeSession.companyIds.includes(d.ticker);
    });
    const updatedScope = relevant.length > 0 ? relevant : availableDocs.slice(0, 4);
    setSessionScopeDocs(updatedScope);
    setSelectedDocIds(updatedScope.map((d) => d.id));
  }, [activeSession?.id]);

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

  function handleRemoveDocFromScope(docId) {
    setSessionScopeDocs((prev) => prev.filter((d) => d.id !== docId));
    setSelectedDocIds((prev) => prev.filter((id) => id !== docId));
  }

  function handleAddDocToScope(doc) {
    if (!sessionScopeDocs.some((d) => d.id === doc.id)) {
      setSessionScopeDocs((prev) => [...prev, doc]);
    }
    if (!selectedDocIds.includes(doc.id)) {
      setSelectedDocIds((prev) => [...prev, doc.id]);
    }
  }

  // Handle User Sending a Message
  function handleSendMessage(e) {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    if (selectedDocIds.length === 0) {
      setErrorState("Please select at least one source document in the side panel to query.");
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
      content: queryText,
      isDemo: isDemoMode
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Simulated Multi-Step Typing Indicator (shown in demo mode)
    if (isDemoMode) {
      setTypingStage("Retrieving 1536-dim semantic embeddings from vector index...");

      setTimeout(() => {
        setTypingStage("Reconciling financial line items against audited statements...");

        setTimeout(() => {
          setTypingStage("Verifying page citations and synthesizing response...");

          setTimeout(() => {
            const selectedDocs = sessionScopeDocs.filter((d) => selectedDocIds.includes(d.id));
            const mockResponse = generateMockAgentResponse(queryText, selectedDocs, activeSession);

            const assistantMsg = {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isDemo: true,
              ...mockResponse
            };

            setMessages((prev) => [...prev, assistantMsg]);
            setIsTyping(false);
            setTypingStage("");

            // Update active citation to first newly emitted citation
            if (mockResponse.citations && mockResponse.citations.length > 0) {
              setActiveCitation(mockResponse.citations[0]);
            }
          }, 800);
        }, 700);
      }, 700);
    } else {
      // Non-demo mode fallback for future API connectivity
      setTimeout(() => {
        const selectedDocs = sessionScopeDocs.filter((d) => selectedDocIds.includes(d.id));
        const mockResponse = generateMockAgentResponse(queryText, selectedDocs, activeSession);
        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isDemo: false,
          ...mockResponse
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 1000);
    }
  }

  // Handle Clicking a Suggested Question
  function handleSelectSuggestedQuestion(questionText) {
    setInputValue(questionText);
  }

  // Handle Citation Click
  function handleCitationClick(citation) {
    setActiveCitation(citation);
    setCitationModalOpen(true);
  }

  // Handle Launch Document Viewer
  function handleViewDocument(docName, page) {
    const targetDoc = availableDocs.find((d) => d.name === docName) ||
      sessionScopeDocs.find((d) => d.name === docName) ||
      availableDocs.find((d) => d.company === activeSession?.company) ||
      availableDocs[0];

    if (targetDoc) {
      setViewerDoc({
        doc: targetDoc,
        initialPage: page || 112
      });
    } else {
      setErrorState(`Document "${docName}" is not loaded in current library.`);
    }
  }

  // Simulation Actions
  function handleSimulateLiveReasoning() {
    const randomQuestion = SUGGESTED_RESEARCH_QUESTIONS[Math.floor(Math.random() * SUGGESTED_RESEARCH_QUESTIONS.length)];
    setInputValue(randomQuestion.question);
  }

  function handleSimulateError() {
    setIsTyping(true);
    setTypingStage("Querying vector database cluster...");
    setTimeout(() => {
      setIsTyping(false);
      setTypingStage("");
      setErrorState({
        title: "Vector Retrieval Timeout",
        message: "Failed to fetch dense embeddings for Note 18 due to simulated network partition. The research agent could not verify audited coordinates.",
        retryQuery: "Compare the available profitability metrics for two selected companies."
      });
    }, 1200);
  }

  function handleSimulateEmptyState() {
    setMessages([]);
    setErrorState(null);
  }

  function handleResetDemo() {
    setMessages(INITIAL_CHAT_MESSAGES);
    saveStoredChatHistory(sessionId, INITIAL_CHAT_MESSAGES);
    setErrorState(null);
    setActiveCitation(INITIAL_CHAT_MESSAGES[1]?.citations?.[0] || null);
  }

  function handleClearChat() {
    if (window.confirm("Clear all conversation history for this research session?")) {
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
    <div className="fin-research-chat-page animate-fadeIn">
      {/* Clean Minimal Header Bar */}
      <div className="fin-chat-top-toolbar flex items-center justify-between py-3 px-4 border-b border-subtle">
        <div className="flex items-center gap-3">
          <div className="chat-page-badge-icon w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center">
            <Bot size={20} className="text-teal" />
          </div>
          <div>
            <h1 className="text-base font-bold text-main leading-tight">
              Financial Research Assistant
            </h1>
            <p className="text-xs text-muted mt-0.5">
              Ask deep questions across balance sheets, P&L statements, and footnote disclosures.
            </p>
          </div>
        </div>

        {/* Minimal Action: Clear Chat */}
        {messages.length > 0 && (
          <button
            type="button"
            className="fin-btn fin-btn-secondary fin-btn-xs text-muted hover:text-danger hover:border-danger/40 transition-colors"
            onClick={handleClearChat}
            title="Clear conversation history"
          >
            <Trash2 size={13} className="mr-1" />
            <span>Clear Chat</span>
          </button>
        )}
      </div>

      {/* Main Two-Panel Workspace Grid */}
      <div className="fin-two-panel-workspace">
        {/* =========================================================================
            MAIN PANEL: CONVERSATIONAL RESEARCH STREAM & INPUT AREA
           ========================================================================= */}
        <main className="fin-chat-main-panel">
          {/* Subtle Grounding Scope Indicator */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-subtle bg-subtle/30 text-xs">
            <div className="flex items-center gap-2 text-muted">
              <ShieldCheck size={14} className="text-teal" />
              <span>Answers synthesized from <strong className="text-main font-semibold">{selectedDocIds.length} active filings</strong></span>
            </div>
            {selectedDocIds.length === 0 && (
              <span className="text-warning text-xs font-medium">Select a document in the side panel</span>
            )}
          </div>

          {/* Messages Stream Container */}
          <div className="fin-chat-stream-container">
            {/* Empty State */}
            {messages.length === 0 && (
              <div className="fin-chat-empty-state animate-fadeIn">
                <div className="empty-state-icon-box">
                  <Bot size={36} className="text-teal" />
                </div>
                <h3 className="text-base font-bold text-main mt-3">
                  Conversational Financial Research Agent
                </h3>
                <p className="text-xs text-muted max-w-md mx-auto mt-1 leading-relaxed">
                  Ask deep, multi-part questions across balance sheets, P&L statements, cash flows, and forensic footnotes. Click any suggested question below to start:
                </p>

                <div className="empty-state-questions-grid mt-6">
                  {SUGGESTED_RESEARCH_QUESTIONS.map((sq) => (
                    <button
                      key={sq.id}
                      type="button"
                      className="empty-question-card"
                      onClick={() => {
                        setInputValue(sq.question);
                        handleSendMessage();
                      }}
                    >
                      <span className="empty-cat">{sq.category}</span>
                      <strong className="empty-title">{sq.question}</strong>
                      <span className="empty-run">Run Analysis →</span>
                    </button>
                  ))}
                </div>
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
                <div className="flex-row items-center gap-2">
                  <AlertTriangle size={18} className="text-danger" />
                  <strong className="text-sm text-danger">{errorState.title}</strong>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {errorState.message}
                </p>
                <div className="mt-3 flex-row gap-2">
                  <button
                    type="button"
                    className="fin-btn fin-btn-primary fin-btn-xs"
                    onClick={() => {
                      setInputValue(errorState.retryQuery || "Retry financial query");
                      setErrorState(null);
                    }}
                  >
                    <RefreshCw size={11} className="mr-1" />
                    <span>Retry Query</span>
                  </button>
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

            {/* Simulated Multi-Step Typing Indicator (shown only in demo mode) */}
            {isTyping && isDemoMode && (
              <div className="fin-chat-typing-indicator-row animate-fadeIn">
                <div className="typing-avatar">
                  <Bot size={16} className="text-teal" />
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

            {/* Non-demo mode loader for real API connectivity */}
            {isTyping && !isDemoMode && (
              <div className="fin-chat-typing-indicator-row animate-fadeIn">
                <div className="typing-avatar">
                  <Bot size={16} className="text-teal" />
                </div>
                <div className="typing-bubble">
                  <span className="fin-spinner-sm" style={{ marginRight: 8 }} />
                  <span className="typing-stage-text">Awaiting Research Agent response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <ChatInputBar
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSendMessage}
            isLoading={isTyping}
            onSelectSuggestedQuestion={handleSelectSuggestedQuestion}
            selectedDocCount={selectedDocIds.length}
          />
        </main>

        {/* =========================================================================
            SIDE PANEL: SELECTED COMPANIES, SOURCE DOCUMENTS, AND CITATIONS
           ========================================================================= */}
        <ChatSidePanel
          sessions={sessions}
          activeSession={activeSession}
          onSelectSession={setActiveSession}
          availableDocuments={sessionScopeDocs}
          allLibraryDocs={availableDocs}
          selectedDocIds={selectedDocIds}
          onToggleDocSelection={handleToggleDocSelection}
          onSelectAllDocs={handleSelectAllDocs}
          onDeselectAllDocs={handleDeselectAllDocs}
          onRemoveDoc={handleRemoveDocFromScope}
          onAddDoc={handleAddDocToScope}
          onOpenDocumentLibrary={() => setPage && setPage("Document Library")}
          activeCitation={activeCitation}
          onViewDocument={handleViewDocument}
          allCitations={allCitations}
          onCitationClick={handleCitationClick}
        />
      </div>

      {/* Citation Details Modal */}
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
              <div className="flex-row items-center gap-2">
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
                  setCitationModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
