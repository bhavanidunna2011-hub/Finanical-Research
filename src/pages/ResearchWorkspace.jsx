import React, { useState, useEffect } from "react";
import {
  FileText,
  Layers,
  AlertTriangle,
  GitCompare,
  Bot,
  Printer,
  Search,
  Upload,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Database,
  ExternalLink,
  ShieldAlert,
  Send,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  Building2,
  Copy,
  ChevronDown,
  Filter,
  RefreshCw,
  ArrowLeft,
  FolderOpen
} from "lucide-react";
import AgentPipelineTracker from "../components/AgentPipelineTracker";
import CitationModal from "../components/CitationModal";
import WorkspaceDirectory from "./WorkspaceDirectory";
import SessionDetails from "./SessionDetails";
import ConversationalResearch from "./ConversationalResearch";
import ReportView from "./ReportView";
import { SEED_COMPANIES, SAMPLE_CHUNKS, SAMPLE_RESEARCH_QUERIES } from "../data/seedData";

export default function ResearchWorkspace({
  session,
  sessions,
  setActiveSession,
  setPage,
  onUpdateSession,
  onDuplicateSession,
  onDeleteSession,
  onOpenCreateModal,
  activeTabOverride = null,
  initialMode = "directory"
}) {
  const [workspaceMode, setWorkspaceMode] = useState(initialMode); // "directory" | "details" | "interactive"
  const [activeTab, setActiveTab] = useState(activeTabOverride || "overview");
  const [activeCitation, setActiveCitation] = useState(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (initialMode) {
      setWorkspaceMode(initialMode);
    }
  }, [initialMode]);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  // Vector DB Sandbox State
  const [vectorQuery, setVectorQuery] = useState("Operating margin and EBIT performance");
  const [filteredChunks, setFilteredChunks] = useState(SAMPLE_CHUNKS);

  // Conversational Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "system",
      text: "👋 Welcome to the Conversational Financial Research Agent. Every insight generated here is strictly grounded in the ingested filings. You can ask multi-part financial questions, inspect step-by-step reasoning chains, and verify exact source citations."
    },
    {
      sender: "user",
      text: SAMPLE_RESEARCH_QUERIES[0].question
    },
    {
      sender: "agent",
      answer: SAMPLE_RESEARCH_QUERIES[0].answer,
      reasoningSteps: SAMPLE_RESEARCH_QUERIES[0].reasoningSteps,
      citations: SAMPLE_RESEARCH_QUERIES[0].citations
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [expandedReasoningIndex, setExpandedReasoningIndex] = useState(null);

  // Ingestion upload simulation state
  const [uploadedFiles, setUploadedFiles] = useState(session?.documents || []);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Metric filter state
  const [metricCategory, setMetricCategory] = useState("all");
  const [redFlagSeverity, setRedFlagSeverity] = useState("all");

  // If directory mode (or if session is null)
  if (workspaceMode === "directory" || !session) {
    return (
      <WorkspaceDirectory
        sessions={sessions}
        activeSession={session}
        onSelectSession={(s) => {
          setActiveSession(s);
          setWorkspaceMode("details");
        }}
        onViewSessionDetails={(s) => {
          setActiveSession(s);
          setWorkspaceMode("details");
        }}
        onLaunchInteractive={(s) => {
          setActiveSession(s);
          setWorkspaceMode("interactive");
        }}
        onOpenCreateModal={onOpenCreateModal || (() => setPage("Create Session"))}
        onDuplicateSession={onDuplicateSession}
        onDeleteSession={onDeleteSession}
      />
    );
  }

  // If details mode
  if (workspaceMode === "details") {
    return (
      <SessionDetails
        session={session}
        onBack={() => setWorkspaceMode("directory")}
        onUpdateSession={onUpdateSession}
        onDuplicateSession={onDuplicateSession}
        onDeleteSession={onDeleteSession}
        onLaunchInteractive={() => setWorkspaceMode("interactive")}
        onNavigateToReports={() => setPage("Analyst Report")}
        onNavigateToDocs={() => setPage("Document Library")}
      />
    );
  }

  // Identify companies in session
  const primaryCompanyKey = session.companyIds?.[0] || "INFY";
  const secondaryCompanyKey = session.companyIds?.[1] || "TCS";
  const primaryCompany = SEED_COMPANIES[primaryCompanyKey] || SEED_COMPANIES.INFY;
  const secondaryCompany = SEED_COMPANIES[secondaryCompanyKey] || SEED_COMPANIES.TCS;
  const isComparisonSession = session.companyIds?.length > 1;

  // Trigger agent pipeline re-run simulation
  function handleTriggerPipeline() {
    setIsPipelineRunning(true);
    setTimeout(() => {
      setIsPipelineRunning(false);
      showToast("Multi-Agent Pipeline executed successfully! All agent artifacts synchronized.");
    }, 2800);
  }

  // Vector DB Search Simulation
  function handleVectorSearch(e) {
    e.preventDefault();
    if (!vectorQuery.trim()) {
      setFilteredChunks(SAMPLE_CHUNKS);
      return;
    }
    const q = vectorQuery.toLowerCase();
    const results = SAMPLE_CHUNKS.filter(
      (c) =>
        c.content.toLowerCase().includes(q) ||
        c.section.toLowerCase().includes(q) ||
        c.docName.toLowerCase().includes(q)
    );
    setFilteredChunks(results.length > 0 ? results : SAMPLE_CHUNKS);
  }

  // Handle Chat Submit
  function handleSendMessage(e) {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const queryText = chatInput.trim();
    setChatInput("");

    // Add user message
    const newChatList = [...chatMessages, { sender: "user", text: queryText }];
    setChatMessages(newChatList);

    // Simulate Agent Reasoning & Grounded Retrieval
    setTimeout(() => {
      // Find matching query or generate realistic answer
      const matchedSample = SAMPLE_RESEARCH_QUERIES.find(
        (sq) =>
          sq.question.toLowerCase().includes(queryText.toLowerCase().slice(0, 15)) ||
          queryText.toLowerCase().includes(sq.category.toLowerCase())
      ) || {
        answer: `### Multi-Agent Synthesis on "${queryText}"\n\nBased on cross-referencing **${primaryCompany.name}**'s latest **${primaryCompany.filingType}**:\n\n- **Metric Verification:** Extracted core revenue of **${primaryCompany.metrics.revenue}** with operating margins at **${primaryCompany.metrics.operatingMargin}** [${primaryCompany.filingDocName}, p. 112].\n- **Source Grounding:** Free cash flow generation stood at **${primaryCompany.metrics.freeCashFlow}**, with strict conversion to net profit verified at **${primaryCompany.metrics.fcfConversion}**.\n- **Risk Factor:** The Red Flag Agent notes ${primaryCompany.redFlags[0].title} as a material sensitivity factor [${primaryCompany.redFlags[0].citation}].`,
        reasoningSteps: [
          {
            step: 1,
            title: "Semantic Vector Retrieval",
            detail: `Parsed query into financial dimensions and retrieved 3 candidate chunks from ${primaryCompany.filingDocName} with cosine score > 0.88.`
          },
          {
            step: 2,
            title: "Cross-Metric Reconcilement",
            detail: "Validated revenue and operating income line items against Consolidated Statement of Profit and Loss."
          },
          {
            step: 3,
            title: "Grounded Synthesis with Page Citations",
            detail: "Formatted analyst-style breakdown with verbatim excerpts and page-indexed citations."
          }
        ],
        citations: [
          {
            docName: primaryCompany.filingDocName,
            company: primaryCompany.name,
            page: 112,
            section: "Consolidated Statement of Profit and Loss",
            snippet: `Revenue from operations was ${primaryCompany.metrics.revenue}, representing an operating margin of ${primaryCompany.metrics.operatingMargin}.`
          }
        ]
      };

      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          answer: matchedSample.answer,
          reasoningSteps: matchedSample.reasoningSteps,
          citations: matchedSample.citations
        }
      ]);
    }, 900);
  }

  // Pre-set query click
  function handleUsePresetQuery(sq) {
    setChatInput(sq.question);
  }

  // Simulate file upload
  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress({ name: file.name, step: "Parsing PDF & extracting tables..." });
    setTimeout(() => {
      setUploadProgress({ name: file.name, step: "Generating 1536-dim vector embeddings..." });
      setTimeout(() => {
        setUploadProgress({ name: file.name, step: "Indexing chunks into Vector Database..." });
        setTimeout(() => {
          setUploadedFiles((prev) => [
            ...prev,
            {
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              pages: 142,
              chunks: 580,
              status: "Indexed",
              company: "User Upload"
            }
          ]);
          setUploadProgress(null);
          showToast(`Document "${file.name}" ingested and indexed successfully!`);
        }, 1200);
      }, 1200);
    }, 1200);
  }

  // Print analyst report
  function handlePrintReport() {
    window.print();
  }

  return (
    <section className="page research-workspace-page animate-fadeIn">
      {toastMessage && (
        <div className="fin-toast-banner animate-fadeIn mb-3">
          <CheckCircle2 size={15} className="text-teal shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Navigation */}
      <div className="flex-row justify-between items-center mb-4 pb-3 border-b border-color">
        <div className="flex-row items-center gap-2">
          <button
            type="button"
            className="details-back-link"
            onClick={() => setWorkspaceMode("details")}
          >
            <ArrowLeft size={14} />
            <span>Session Details</span>
          </button>
          <span className="text-muted text-xs">/</span>
          <button
            type="button"
            className="details-back-link"
            onClick={() => setWorkspaceMode("directory")}
          >
            <FolderOpen size={14} />
            <span>All Sessions Directory</span>
          </button>
        </div>

        <span className="fin-badge fin-badge-teal fin-badge-sm">
          Interactive Analytical Environment
        </span>
      </div>

      {/* Session Hero Banner */}
      <div className="workspace-hero">
        <div className="hero-meta">
          <div className="flex-row items-center gap-2">
            <span className="badge badge-accent">RESEARCH SESSION</span>
            <span className="status-badge">{session.status || "Analysis Complete"}</span>
          </div>
          <h1>{session.title}</h1>
          <p className="hero-description">{session.description}</p>
        </div>

        <div className="hero-quick-stats">
          <div className="quick-stat-box">
            <span className="label">Companies Analyzed</span>
            <strong>{session.company || primaryCompany.name}</strong>
          </div>
          <div className="quick-stat-box">
            <span className="label">Research Type</span>
            <strong>{session.researchType || "Company Analysis"}</strong>
          </div>
          <div className="quick-stat-box">
            <span className="label">Indexed Documents</span>
            <strong>{uploadedFiles.length || 2} Filings</strong>
          </div>
          <div className="quick-stat-box">
            <span className="label">Source Grounding</span>
            <strong className="text-success">100% Verified</strong>
          </div>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="workspace-tabs-bar">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Database size={16} />
          <span>Overview & Pipeline</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "ingestion" ? "active" : ""}`}
          onClick={() => setActiveTab("ingestion")}
        >
          <FileText size={16} />
          <span>Document & Vector DB</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "extraction" ? "active" : ""}`}
          onClick={() => setActiveTab("extraction")}
        >
          <Layers size={16} />
          <span>Extraction Agent</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "redflags" ? "active" : ""}`}
          onClick={() => setActiveTab("redflags")}
        >
          <AlertTriangle size={16} />
          <span>Red Flag Agent</span>
          <span className="tab-pill">
            {(primaryCompany.redFlags?.length || 0) + (isComparisonSession ? secondaryCompany.redFlags?.length || 0 : 0)}
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === "comparison" ? "active" : ""}`}
          onClick={() => setActiveTab("comparison")}
        >
          <GitCompare size={16} />
          <span>Comparison Agent</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "research" ? "active" : ""}`}
          onClick={() => setActiveTab("research")}
        >
          <Bot size={16} />
          <span>Conversational Research</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          <Printer size={16} />
          <span>Analyst Report (PDF)</span>
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW & PIPELINE */}
      {activeTab === "overview" && (
        <div className="tab-content animate-fadeIn">
          {/* Multi-Agent Orchestration Tracker */}
          <AgentPipelineTracker
            isRunning={isPipelineRunning}
            onTriggerRun={handleTriggerPipeline}
          />

          {/* Key Executive Highlights */}
          <div className="overview-grid mt-6">
            <div className="overview-card">
              <div className="card-top-icon">
                <Building2 size={20} className="text-accent" />
              </div>
              <h4>Entity Profile & Scope</h4>
              <p className="text-sm muted mt-2 leading-relaxed">
                {primaryCompany.name} ({primaryCompany.ticker}) • {primaryCompany.sector} • {primaryCompany.industry}
              </p>
              <div className="pill-list mt-3">
                <span className="info-pill">Filing: {primaryCompany.filingType}</span>
                <span className="info-pill">Currency: {primaryCompany.currency}</span>
                <span className="info-pill">Auditor: {primaryCompany.auditorReport.auditor}</span>
              </div>
            </div>

            <div className="overview-card">
              <div className="card-top-icon">
                <TrendingUp size={20} className="text-success" />
              </div>
              <h4>Financial Topline & Margins</h4>
              <div className="mini-stat-row mt-2">
                <div>
                  <span className="text-xs muted block">Revenue</span>
                  <strong className="text-lg">{primaryCompany.metrics.revenue}</strong>
                  <span className="delta-tag text-success">{primaryCompany.metrics.revenueGrowth}</span>
                </div>
                <div>
                  <span className="text-xs muted block">Operating Margin</span>
                  <strong className="text-lg">{primaryCompany.metrics.operatingMargin}</strong>
                  <span className="delta-tag">{primaryCompany.metrics.operatingMarginDelta}</span>
                </div>
              </div>
              <button
                className="text-button text-sm mt-3"
                onClick={() => setActiveTab("extraction")}
              >
                Inspect All Extracted Ratios →
              </button>
            </div>

            <div className="overview-card">
              <div className="card-top-icon">
                <AlertTriangle size={20} className="text-warning" />
              </div>
              <h4>Forensic Risk Surveillance</h4>
              <p className="text-sm muted mt-2 leading-relaxed">
                Red Flag Agent identified <strong>{primaryCompany.redFlags.length} operational & accounting anomalies</strong> requiring analyst attention.
              </p>
              <div className="alert-preview-item mt-3">
                <span className="badge badge-warning text-xs">High Severity</span>
                <span className="truncate text-xs font-medium ml-2">{primaryCompany.redFlags[0]?.title}</span>
              </div>
              <button
                className="text-button text-sm mt-3"
                onClick={() => setActiveTab("redflags")}
              >
                View Risk Breakdown →
              </button>
            </div>
          </div>

          {/* Ingested Documents List */}
          <div className="mt-8">
            <div className="flex-row justify-between items-center mb-3">
              <div>
                <h3>Ingested Financial Documents</h3>
                <p className="text-xs muted">
                  All metrics and agent reasoning are grounded strictly in these indexed filings.
                </p>
              </div>
              <button
                className="secondary-button btn-sm"
                onClick={() => setActiveTab("ingestion")}
              >
                <Upload size={14} style={{ marginRight: 6, display: "inline" }} />
                Ingest New Document
              </button>
            </div>

            <div className="doc-cards-grid">
              {uploadedFiles.map((doc, idx) => (
                <div key={idx} className="doc-item-card">
                  <div className="doc-item-left">
                    <div className="doc-icon-wrap">
                      <FileText size={20} />
                    </div>
                    <div>
                      <strong className="doc-title">{doc.name}</strong>
                      <div className="doc-meta-row">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.pages} Pages</span>
                        <span>•</span>
                        <span>{doc.chunks} Semantic Chunks</span>
                      </div>
                    </div>
                  </div>
                  <div className="doc-item-right">
                    <span className="badge badge-success">
                      <CheckCircle2 size={13} style={{ marginRight: 4, display: "inline" }} />
                      {doc.status}
                    </span>
                    <button
                      className="secondary-button btn-sm ml-2"
                      onClick={() => setActiveTab("ingestion")}
                    >
                      Inspect Chunks
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DOCUMENT INGESTION & VECTOR DB */}
      {activeTab === "ingestion" && (
        <div className="tab-content animate-fadeIn">
          <div className="split-layout">
            {/* Left: Document Upload Dropzone */}
            <div className="split-left">
              <div className="section-box">
                <span className="eyebrow">MODULE 2: FINANCIAL DOCUMENT INGESTION</span>
                <h3>Ingest Financial Document</h3>
                <p className="muted text-sm mb-4">
                  Upload company annual reports, SEC Form 10-K, 10-Q, or earnings transcripts in PDF format.
                </p>

                <label className="upload-dropzone">
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc"
                    onChange={handleFileUpload}
                    className="hidden-file-input"
                  />
                  <div className="dropzone-content">
                    <div className="dropzone-icon">
                      <Upload size={32} />
                    </div>
                    <strong>Click or Drag Financial Report PDF Here</strong>
                    <span className="text-xs text-muted mt-1">
                      Supports PDF up to 50MB • Automatic Table Parsing & Vector Chunking
                    </span>
                    <span className="badge badge-primary mt-3">Ready for Ingestion</span>
                  </div>
                </label>

                {uploadProgress && (
                  <div className="upload-progress-card mt-4 animate-fadeIn">
                    <div className="flex-row justify-between text-xs mb-1">
                      <strong>Ingesting: {uploadProgress.name}</strong>
                      <span className="pulsing-text">{uploadProgress.step}</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill animate-progress" />
                    </div>
                  </div>
                )}

                <div className="preloaded-seed-section mt-6">
                  <span className="eyebrow">PRE-LOADED SEED FILINGS</span>
                  <p className="text-xs muted mb-3">
                    These seed filings are pre-indexed into the local vector database:
                  </p>
                  <div className="seed-links-list">
                    {Object.values(SEED_COMPANIES).map((comp) => (
                      <div key={comp.id} className="seed-link-item">
                        <div>
                          <strong>{comp.filingDocName}</strong>
                          <span className="block text-xs muted">
                            {comp.name} • {comp.pageCount} Pages • {comp.chunkCount} Chunks
                          </span>
                        </div>
                        <span className="status-badge-sm">Indexed</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Embedding Generation & Vector DB Inspector */}
            <div className="split-right">
              <div className="section-box">
                <div className="flex-row justify-between items-center mb-2">
                  <div>
                    <span className="eyebrow">MODULE 3: EMBEDDING & VECTOR DATABASE</span>
                    <h3>Vector Store & Chunk Inspector</h3>
                  </div>
                  <span className="badge badge-accent">1536-Dimensional Vectors</span>
                </div>
                <p className="text-sm muted mb-4">
                  Filings are split into semantic chunks, converted into dense vectors, and retrieved via cosine similarity.
                </p>

                {/* Similarity Search Sandbox */}
                <form className="vector-search-bar" onSubmit={handleVectorSearch}>
                  <Search size={16} className="text-muted" />
                  <input
                    type="text"
                    value={vectorQuery}
                    onChange={(e) => setVectorQuery(e.target.value)}
                    placeholder="Test vector similarity retrieval (e.g. Operating margin, Deal TCV)..."
                  />
                  <button type="submit" className="primary-button btn-sm">
                    Query Chunks
                  </button>
                </form>

                <div className="chunks-list mt-4">
                  <div className="flex-row justify-between items-center mb-2">
                    <span className="text-xs text-muted">
                      Showing top {filteredChunks.length} matching chunks
                    </span>
                    <span className="text-xs text-success">Cosine similarity score &gt; 0.88</span>
                  </div>

                  {filteredChunks.map((chunk) => (
                    <div key={chunk.id} className="chunk-card">
                      <div className="chunk-header">
                        <div className="chunk-meta">
                          <span className="chunk-id">{chunk.id}</span>
                          <span className="chunk-doc">{chunk.docName}</span>
                          <span className="chunk-page">Page {chunk.page}</span>
                          <span className="chunk-tokens">{chunk.tokens} tokens</span>
                        </div>
                        <div className="chunk-score">
                          <span className="similarity-badge">
                            Sim: {(chunk.similarityScore * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="chunk-section-title">{chunk.section}</div>
                      <p className="chunk-snippet">"{chunk.content}"</p>
                      <div className="chunk-footer">
                        <button
                          className="text-button text-xs"
                          onClick={() =>
                            setActiveCitation({
                              docName: chunk.docName,
                              company: chunk.companyId,
                              page: chunk.page,
                              section: chunk.section,
                              snippet: chunk.content
                            })
                          }
                        >
                          Verify Citation Source →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: FINANCIAL EXTRACTION AGENT */}
      {activeTab === "extraction" && (
        <div className="tab-content animate-fadeIn">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">AGENT 2: EXTRACTION AGENT</span>
              <h2>Key Financial Metrics & Ratios</h2>
              <p className="muted text-sm">
                Automatically extracted GAAP/IFRS metrics strictly grounded in {primaryCompany.name}'s {primaryCompany.filingType}.
              </p>
            </div>
            <div className="flex-row gap-2">
              <button
                className={`filter-btn ${metricCategory === "all" ? "active" : ""}`}
                onClick={() => setMetricCategory("all")}
              >
                All Metrics
              </button>
              <button
                className={`filter-btn ${metricCategory === "profitability" ? "active" : ""}`}
                onClick={() => setMetricCategory("profitability")}
              >
                Profitability & Margin
              </button>
              <button
                className={`filter-btn ${metricCategory === "solvency" ? "active" : ""}`}
                onClick={() => setMetricCategory("solvency")}
              >
                Solvency & Liquidity
              </button>
            </div>
          </div>

          {/* Metric KPI Cards with SVG Sparklines */}
          <div className="metrics-kpi-grid mt-4">
            <div className="kpi-card luxury-card">
              <div className="flex-row justify-between items-start">
                <span className="kpi-label">Revenue from Operations</span>
                <span className="badge badge-success text-xs font-mono">{primaryCompany.metrics.revenueGrowth}</span>
              </div>
              <strong className="kpi-value">{primaryCompany.metrics.revenue}</strong>
              
              {/* SVG Sparkline */}
              <div className="sparkline-container mt-1">
                <svg width="100%" height="32" viewBox="0 0 140 32" fill="none" className="sparkline-svg">
                  <path d="M0 26 Q 35 18, 70 20 T 140 6" stroke="#10b981" strokeWidth="2.5" fill="none" />
                  <path d="M0 26 Q 35 18, 70 20 T 140 6 L 140 32 L 0 32 Z" fill="url(#sparkline-grad-green)" opacity="0.25" />
                  <defs>
                    <linearGradient id="sparkline-grad-green" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex-row justify-between items-center mt-2">
                <span className="text-xs text-muted">YoY Expansion</span>
                <small className="kpi-citation" onClick={() => setActiveCitation({
                  docName: primaryCompany.filingDocName,
                  company: primaryCompany.name,
                  page: 112,
                  snippet: `Consolidated Revenue from Operations was ${primaryCompany.metrics.revenue}`
                })}>
                  [P. 112 • Consolidated P&L]
                </small>
              </div>
            </div>

            <div className="kpi-card luxury-card">
              <div className="flex-row justify-between items-start">
                <span className="kpi-label">Operating Margin (EBIT %)</span>
                <span className="badge badge-warning text-xs font-mono">{primaryCompany.metrics.operatingMarginDelta}</span>
              </div>
              <strong className="kpi-value">{primaryCompany.metrics.operatingMargin}</strong>
              
              {/* SVG Sparkline */}
              <div className="sparkline-container mt-1">
                <svg width="100%" height="32" viewBox="0 0 140 32" fill="none" className="sparkline-svg">
                  <path d="M0 10 Q 35 12, 70 8 T 140 18" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                  <path d="M0 10 Q 35 12, 70 8 T 140 18 L 140 32 L 0 32 Z" fill="url(#sparkline-grad-amber)" opacity="0.25" />
                  <defs>
                    <linearGradient id="sparkline-grad-amber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex-row justify-between items-center mt-2">
                <span className="text-xs text-muted">Target: 20-22%</span>
                <small className="kpi-citation" onClick={() => setActiveCitation({
                  docName: primaryCompany.filingDocName,
                  company: primaryCompany.name,
                  page: 112,
                  snippet: `Operating profit was calculated at ${primaryCompany.metrics.operatingMargin}`
                })}>
                  [P. 112 • Consolidated P&L]
                </small>
              </div>
            </div>

            <div className="kpi-card luxury-card">
              <div className="flex-row justify-between items-start">
                <span className="kpi-label">Net Profit (PAT)</span>
                <span className="badge badge-success text-xs font-mono">{primaryCompany.metrics.netProfitGrowth}</span>
              </div>
              <strong className="kpi-value">{primaryCompany.metrics.netProfit}</strong>
              
              {/* SVG Sparkline */}
              <div className="sparkline-container mt-1">
                <svg width="100%" height="32" viewBox="0 0 140 32" fill="none" className="sparkline-svg">
                  <path d="M0 24 Q 40 22, 75 14 T 140 8" stroke="#3b82f6" strokeWidth="2.5" fill="none" />
                  <path d="M0 24 Q 40 22, 75 14 T 140 8 L 140 32 L 0 32 Z" fill="url(#sparkline-grad-blue)" opacity="0.25" />
                  <defs>
                    <linearGradient id="sparkline-grad-blue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex-row justify-between items-center mt-2">
                <span className="text-xs text-muted">PAT Margin: 17.1%</span>
                <small className="kpi-citation" onClick={() => setActiveCitation({
                  docName: primaryCompany.filingDocName,
                  company: primaryCompany.name,
                  page: 112,
                  snippet: `Profit for the period stood at ${primaryCompany.metrics.netProfit}`
                })}>
                  [P. 112 • P&L Statement]
                </small>
              </div>
            </div>

            <div className="kpi-card luxury-card">
              <div className="flex-row justify-between items-start">
                <span className="kpi-label">Free Cash Flow</span>
                <span className="badge badge-accent text-xs font-mono">{primaryCompany.metrics.fcfConversion}</span>
              </div>
              <strong className="kpi-value">{primaryCompany.metrics.freeCashFlow}</strong>
              
              {/* SVG Sparkline */}
              <div className="sparkline-container mt-1">
                <svg width="100%" height="32" viewBox="0 0 140 32" fill="none" className="sparkline-svg">
                  <path d="M0 20 Q 30 24, 70 12 T 140 6" stroke="#a855f7" strokeWidth="2.5" fill="none" />
                  <path d="M0 20 Q 30 24, 70 12 T 140 6 L 140 32 L 0 32 Z" fill="url(#sparkline-grad-purple)" opacity="0.25" />
                  <defs>
                    <linearGradient id="sparkline-grad-purple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex-row justify-between items-center mt-2">
                <span className="text-xs text-muted">Cash Conversion</span>
                <small className="kpi-citation" onClick={() => setActiveCitation({
                  docName: primaryCompany.filingDocName,
                  company: primaryCompany.name,
                  page: 116,
                  snippet: `Cash flows from operating activities less capital expenditures yielded Free Cash Flow of ${primaryCompany.metrics.freeCashFlow}`
                })}>
                  [P. 116 • Cash Flows]
                </small>
              </div>
            </div>
          </div>

          {/* Interactive Financial Health & Solvency Gauge */}
          <div className="health-gauge-banner mt-6">
            <div className="gauge-left">
              <div className="gauge-circle-outer">
                <div className="gauge-circle-inner">
                  <span className="gauge-score">96</span>
                  <small className="gauge-sub">/100</small>
                </div>
              </div>
              <div>
                <span className="badge badge-success mb-1">Pristine Financial Health</span>
                <h4>Solvency & Liquidity Rating: AAA Equivalent</h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Zero long-term debt, liquid cash reserves of {primaryCompany.metrics.cashEquivalents}, and 90%+ Free Cash Flow to Net Profit conversion rate.
                </p>
              </div>
            </div>

            <div className="gauge-right">
              <div className="health-metric-row">
                <span className="text-xs text-muted">Balance Sheet Leverage:</span>
                <strong className="text-xs text-success">0.00x Debt/Equity (Debt-free)</strong>
              </div>
              <div className="health-metric-row">
                <span className="text-xs text-muted">Working Capital Buffer:</span>
                <strong className="text-xs text-accent">Current Ratio 2.1x</strong>
              </div>
              <div className="health-metric-row">
                <span className="text-xs text-muted">Return on Equity (ROE):</span>
                <strong className="text-xs text-success">{primaryCompany.metrics.roe}</strong>
              </div>
            </div>
          </div>

          {/* Detailed Financial Ratios Table */}
          <div className="ratios-table-card mt-6">
            <div className="card-header-row">
              <div>
                <h3>Extracted Ratio Performance Matrix</h3>
                <p className="text-xs muted">
                  Extracted and computed with strict traceability to financial statement notes.
                </p>
              </div>
              <span className="badge badge-accent">Grounding Strictness: 100%</span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Financial Metric / Ratio</th>
                    <th>Reported Value</th>
                    <th>Industry Benchmark</th>
                    <th>Health Status</th>
                    <th>Source Document Citation</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {primaryCompany.ratios.map((ratio, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{ratio.name}</strong>
                      </td>
                      <td>
                        <span className="metric-pill">{ratio.value}</span>
                      </td>
                      <td className="text-muted">{ratio.benchmark}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            ratio.status === "Superior" || ratio.status === "Excellent" || ratio.status === "Good"
                              ? "pill-success"
                              : "pill-warning"
                          }`}
                        >
                          {ratio.status}
                        </span>
                      </td>
                      <td>
                        <span className="citation-tag">
                          {primaryCompany.filingDocName}, p. {ratio.citation.page}
                        </span>
                      </td>
                      <td>
                        <button
                          className="secondary-button btn-xs"
                          onClick={() =>
                            setActiveCitation({
                              docName: primaryCompany.filingDocName,
                              company: primaryCompany.name,
                              page: ratio.citation.page,
                              section: ratio.citation.section,
                              snippet: `${ratio.name} verified at ${ratio.value} in ${ratio.citation.section}.`
                            })
                          }
                        >
                          Inspect Source
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: RED FLAG & ANOMALY AGENT */}
      {activeTab === "redflags" && (
        <div className="tab-content animate-fadeIn">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">AGENT 3: RED FLAG & FORENSIC AUDIT AGENT</span>
              <h2>Detected Financial Anomalies & Risk Signals</h2>
              <p className="muted text-sm">
                Unprompted scans for falling margins, debt build-ups, auditor caveats, and operational vulnerabilities.
              </p>
            </div>
            <div className="flex-row gap-2">
              <button
                className={`filter-btn ${redFlagSeverity === "all" ? "active" : ""}`}
                onClick={() => setRedFlagSeverity("all")}
              >
                All Signals
              </button>
              <button
                className={`filter-btn ${redFlagSeverity === "High" ? "active" : ""}`}
                onClick={() => setRedFlagSeverity("High")}
              >
                High Severity
              </button>
              <button
                className={`filter-btn ${redFlagSeverity === "Medium" ? "active" : ""}`}
                onClick={() => setRedFlagSeverity("Medium")}
              >
                Medium Severity
              </button>
            </div>
          </div>

          {/* Auditor Report Verification Card */}
          <div className="auditor-banner-card mt-4">
            <div className="auditor-banner-icon">
              <ShieldAlert size={24} className="text-accent" />
            </div>
            <div className="auditor-banner-content">
              <div className="flex-row justify-between items-center">
                <strong>Independent Auditor Opinion: {primaryCompany.auditorReport.opinion}</strong>
                <span className="badge badge-success">Audited by {primaryCompany.auditorReport.auditor}</span>
              </div>
              <p className="text-xs muted mt-1">
                Filing citation: {primaryCompany.filingDocName}, Page {primaryCompany.auditorReport.page}
              </p>
              <div className="kam-list mt-2">
                <span className="text-xs text-muted block font-semibold mb-1">Key Audit Matters (KAM) Extracted:</span>
                <ul>
                  {primaryCompany.auditorReport.keyAuditMatters.map((kam, idx) => (
                    <li key={idx} className="text-xs text-muted">
                      • {kam}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Red Flag Cards Grid */}
          <div className="redflags-grid mt-6">
            {primaryCompany.redFlags
              .filter((rf) => redFlagSeverity === "all" || rf.severity === redFlagSeverity)
              .map((flag) => (
                <div key={flag.id} className="redflag-card">
                  <div className="redflag-card-header">
                    <div className="flex-row items-center gap-2">
                      <span
                        className={`badge ${
                          flag.severity === "High" ? "badge-danger" : "badge-warning"
                        }`}
                      >
                        {flag.severity} Risk
                      </span>
                      <span className="text-xs text-muted font-medium">{flag.category}</span>
                    </div>
                  </div>

                  <h3 className="redflag-title mt-2">{flag.title}</h3>
                  <p className="redflag-impact">{flag.impact}</p>

                  <div className="evidence-snippet-box">
                    <span className="text-xs font-semibold text-muted block mb-1">
                      SOURCE EVIDENCE SNIPPET:
                    </span>
                    <blockquote className="evidence-text">"{flag.evidenceSnippet}"</blockquote>
                  </div>

                  <div className="redflag-card-footer">
                    <span className="citation-text">
                      <ExternalLink size={12} style={{ marginRight: 4, display: "inline" }} />
                      {flag.citation}
                    </span>
                    <button
                      className="primary-button btn-xs"
                      onClick={() =>
                        setActiveCitation({
                          docName: primaryCompany.filingDocName,
                          company: primaryCompany.name,
                          page: flag.citation,
                          snippet: flag.evidenceSnippet
                        })
                      }
                    >
                      View Source
                    </button>
                  </div>
                </div>
              ))}

            {isComparisonSession &&
              secondaryCompany.redFlags
                ?.filter((rf) => redFlagSeverity === "all" || rf.severity === redFlagSeverity)
                .map((flag) => (
                  <div key={flag.id} className="redflag-card">
                    <div className="redflag-card-header">
                      <div className="flex-row items-center gap-2">
                        <span
                          className={`badge ${
                            flag.severity === "High" ? "badge-danger" : "badge-warning"
                          }`}
                        >
                          {flag.severity} Risk
                        </span>
                        <span className="text-xs text-muted font-medium">
                          {secondaryCompany.name} • {flag.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="redflag-title mt-2">{flag.title}</h3>
                    <p className="redflag-impact">{flag.impact}</p>

                    <div className="evidence-snippet-box">
                      <span className="text-xs font-semibold text-muted block mb-1">
                        SOURCE EVIDENCE SNIPPET:
                      </span>
                      <blockquote className="evidence-text">"{flag.evidenceSnippet}"</blockquote>
                    </div>

                    <div className="redflag-card-footer">
                      <span className="citation-text">{flag.citation}</span>
                      <button
                        className="primary-button btn-xs"
                        onClick={() =>
                          setActiveCitation({
                            docName: secondaryCompany.filingDocName,
                            company: secondaryCompany.name,
                            page: flag.citation,
                            snippet: flag.evidenceSnippet
                          })
                        }
                      >
                        View Source
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: COMPARISON AGENT */}
      {activeTab === "comparison" && (
        <div className="tab-content animate-fadeIn">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">AGENT 4: COMPARISON AGENT</span>
              <h2>Cross-Company Benchmarking & Peer Variance</h2>
              <p className="muted text-sm">
                Cross-referencing extracted metrics across filings for side-by-side analysis.
              </p>
            </div>
            <div className="comparison-peers-badge">
              <span>Benchmarking:</span>
              <strong>{primaryCompany.name}</strong> vs <strong>{secondaryCompany.name}</strong>
            </div>
          </div>

          {/* Visual Benchmark Comparison Cards */}
          <div className="grid-2col gap-4 mt-4">
            <div className="luxury-card p-4">
              <div className="flex-row justify-between items-center mb-2">
                <span className="text-xs text-muted font-semibold">Operating Margin (EBIT %) Comparison</span>
                <span className="badge badge-accent text-xs">+390 bps spread for TCS</span>
              </div>
              <div className="compare-bar-group">
                <div className="flex-row justify-between text-xs mb-1">
                  <span>{secondaryCompany.ticker} (TCS)</span>
                  <strong className="text-accent">{secondaryCompany.metrics.operatingMargin}</strong>
                </div>
                <div className="mini-track mb-3"><div className="mini-fill" style={{ width: "95%" }} /></div>

                <div className="flex-row justify-between text-xs mb-1">
                  <span>{primaryCompany.ticker} (Infosys)</span>
                  <strong>{primaryCompany.metrics.operatingMargin}</strong>
                </div>
                <div className="mini-track"><div className="mini-fill" style={{ width: "80%" }} /></div>
              </div>
            </div>

            <div className="luxury-card p-4">
              <div className="flex-row justify-between items-center mb-2">
                <span className="text-xs text-muted font-semibold">Deal TCV Order Book Coverage</span>
                <span className="badge badge-primary text-xs">Record Pipeline</span>
              </div>
              <div className="compare-bar-group">
                <div className="flex-row justify-between text-xs mb-1">
                  <span>{secondaryCompany.ticker} (TCS All-time High)</span>
                  <strong className="text-accent">{secondaryCompany.metrics.dealTCV}</strong>
                </div>
                <div className="mini-track mb-3"><div className="mini-fill success" style={{ width: "100%" }} /></div>

                <div className="flex-row justify-between text-xs mb-1">
                  <span>{primaryCompany.ticker} (Infosys Large Deals)</span>
                  <strong>{primaryCompany.metrics.dealTCV}</strong>
                </div>
                <div className="mini-track"><div className="mini-fill success" style={{ width: "42%" }} /></div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="comparison-table-card mt-4">
            <div className="table-responsive">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Benchmarking Metric</th>
                    <th>{primaryCompany.name} ({primaryCompany.ticker})</th>
                    <th>{secondaryCompany.name} ({secondaryCompany.ticker})</th>
                    <th>Variance / Delta</th>
                    <th>Comparative Leader</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Annual Revenue (FY24)</strong></td>
                    <td>{primaryCompany.metrics.revenue}</td>
                    <td>{secondaryCompany.metrics.revenue}</td>
                    <td className="text-muted">TCS is 1.57x larger</td>
                    <td><span className="badge badge-primary">{secondaryCompany.ticker} Scale Leader</span></td>
                  </tr>
                  <tr>
                    <td><strong>YoY Revenue Growth</strong></td>
                    <td>{primaryCompany.metrics.revenueGrowth}</td>
                    <td>{secondaryCompany.metrics.revenueGrowth}</td>
                    <td className="text-success">+2.1% spread for TCS</td>
                    <td><span className="badge badge-success">{secondaryCompany.ticker} Faster Growth</span></td>
                  </tr>
                  <tr>
                    <td><strong>Operating Margin (EBIT %)</strong></td>
                    <td><strong>{primaryCompany.metrics.operatingMargin}</strong></td>
                    <td><strong>{secondaryCompany.metrics.operatingMargin}</strong></td>
                    <td className="text-accent font-bold">+390 bps spread</td>
                    <td><span className="badge badge-accent">{secondaryCompany.ticker} +3.9% Superiority</span></td>
                  </tr>
                  <tr>
                    <td><strong>Net Profit (PAT)</strong></td>
                    <td>{primaryCompany.metrics.netProfit}</td>
                    <td>{secondaryCompany.metrics.netProfit}</td>
                    <td className="text-muted">+77.6% higher PAT</td>
                    <td><span className="badge badge-primary">{secondaryCompany.ticker}</span></td>
                  </tr>
                  <tr>
                    <td><strong>Free Cash Flow Conversion</strong></td>
                    <td>{primaryCompany.metrics.fcfConversion}</td>
                    <td>{secondaryCompany.metrics.fcfConversion}</td>
                    <td className="text-success">+3.9% higher conversion</td>
                    <td><span className="badge badge-success">{secondaryCompany.ticker} 95.1% FCF</span></td>
                  </tr>
                  <tr>
                    <td><strong>Return on Equity (ROE)</strong></td>
                    <td>{primaryCompany.metrics.roe}</td>
                    <td>{secondaryCompany.metrics.roe}</td>
                    <td className="text-accent">+19.7% higher ROE</td>
                    <td><span className="badge badge-accent">{secondaryCompany.ticker} 51.5% ROE</span></td>
                  </tr>
                  <tr>
                    <td><strong>Deal TCV Pipeline</strong></td>
                    <td>{primaryCompany.metrics.dealTCV}</td>
                    <td>{secondaryCompany.metrics.dealTCV}</td>
                    <td className="text-muted">Record order book</td>
                    <td><span className="badge badge-primary">{secondaryCompany.ticker} $42.7B</span></td>
                  </tr>
                  <tr>
                    <td><strong>Net Headcount Delta (FY24)</strong></td>
                    <td>-25,933 employees</td>
                    <td>-13,249 employees</td>
                    <td className="text-warning">Infosys shrank 2x more</td>
                    <td><span className="badge badge-warning">Industry-wide Contraction</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Synthesis of Peer Comparison */}
          <div className="peer-insights-grid mt-6">
            <div className="peer-card">
              <span className="eyebrow">MARGIN EFFICIENCY DRIVERS</span>
              <h4>Why TCS Outperformed Infosys in Operating Margin</h4>
              <p className="text-sm muted mt-2 leading-relaxed">
                TCS achieved a <strong>24.6% operating margin</strong> (+50 bps YoY) versus Infosys's <strong>20.7%</strong> (-30 bps YoY). The 390 bps advantage stems primarily from TCS's superior offshore billing mix, lower dependence on third-party subcontractors (9.5% of revenue at Infosys vs ~7% at TCS), and stronger pricing retention in enterprise renewals.
              </p>
              <button
                className="secondary-button btn-xs mt-3"
                onClick={() =>
                  setActiveCitation({
                    docName: "TCS-Annual-Report-2023-24.pdf",
                    company: "TCS",
                    page: 94,
                    snippet: "Operating margin for the full year reached 24.6%, expanding 50 basis points over the prior fiscal year."
                  })
                }
              >
                View TCS Margin Citation →
              </button>
            </div>

            <div className="peer-card">
              <span className="eyebrow">ORDER BOOK RESILIENCE</span>
              <h4>Deal Pipeline & Conversion Dynamics</h4>
              <p className="text-sm muted mt-2 leading-relaxed">
                Both companies maintained strong mega-deal velocity despite a discretionary spending freeze. TCS's <strong>$42.7B all-time high TCV</strong> provides 1.4x book-to-bill coverage, while Infosys's <strong>$17.7B large deal TCV</strong> (52% net new) reflects aggressive market share gains in vendor consolidation deals.
              </p>
              <button
                className="secondary-button btn-xs mt-3"
                onClick={() =>
                  setActiveCitation({
                    docName: "Infosys-Annual-Report-2023-24.pdf",
                    company: "Infosys",
                    page: 87,
                    snippet: "Total contract value of large deal signings reached an all-time record of $17.7 billion."
                  })
                }
              >
                View Infosys TCV Citation →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: CONVERSATIONAL RESEARCH AGENT (MODULE 5) */}
      {activeTab === "research" && (
        <div className="tab-content animate-fadeIn">
          <ConversationalResearch
            session={session}
            sessions={sessions}
            setActiveSession={setActiveSession}
            setPage={setPage}
          />
        </div>
      )}

      {/* TAB CONTENT 7: REPORT AGENT (PDF DOSSIER) */}
      {activeTab === "report" && (
        <div className="tab-content animate-fadeIn">
          <div className="report-toolbar flex-row justify-between items-center mb-4 flex-wrap gap-3">
            <div>
              <span className="eyebrow">AGENT 6: REPORT AGENT</span>
              <h2>Analyst-Style PDF Research Dossier</h2>
              <p className="muted text-sm">
                Publication-ready financial research report compiled automatically across all agents.
              </p>
            </div>
            <div className="flex-row items-center gap-2">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setPage && setPage("Research Reports")}
                title="View all dossiers in Research Reports Library"
              >
                <FolderOpen size={15} style={{ marginRight: 6, display: "inline" }} />
                <span>Reports Library</span>
              </button>
              <button className="primary-button" onClick={handlePrintReport}>
                <Printer size={16} style={{ marginRight: 8, display: "inline" }} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Report Document */}
          <div className="analyst-report-document" id="printable-analyst-report">
            {/* Report Header */}
            <div className="report-doc-header">
              <div className="flex-row justify-between items-start">
                <div>
                  <span className="report-eyebrow">FINRESEARCH AI • EQUITY RESEARCH DIVISION</span>
                  <h1 className="report-main-title">
                    FINANCIAL ANALYSIS & FORENSIC DOSSIER
                  </h1>
                  <h3 className="report-subtitle">
                    {session.title}
                  </h3>
                </div>
                <div className="report-meta-box">
                  <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                  <div><strong>Analyst:</strong> FinResearch AI Analyst</div>
                  <div><strong>Status:</strong> Strict Grounded / Verified</div>
                </div>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="report-section">
              <h2 className="report-section-heading">1. Executive Summary</h2>
              <p className="report-body-text">
                This report synthesizes findings from a multi-agent financial intelligence pipeline analyzing the audited financial statements of <strong>{primaryCompany.name} ({primaryCompany.ticker})</strong>{isComparisonSession ? ` in direct comparison with peer leader ${secondaryCompany.name} (${secondaryCompany.ticker})` : ""} for fiscal year 2023-24. 
              </p>
              <p className="report-body-text">
                During FY24, {primaryCompany.name} generated <strong>{primaryCompany.metrics.revenue}</strong> in revenue ({primaryCompany.metrics.revenueGrowth}), delivering an operating margin of <strong>{primaryCompany.metrics.operatingMargin}</strong>. Free cash flow conversion remained exceptional at <strong>{primaryCompany.metrics.fcfConversion}</strong>, generating <strong>{primaryCompany.metrics.freeCashFlow}</strong>. The company remains virtually debt-free with <strong>{primaryCompany.metrics.cashEquivalents}</strong> in cash and liquid reserves.
              </p>
            </div>

            {/* Section 2: Key Financials */}
            <div className="report-section">
              <h2 className="report-section-heading">2. Key Financial Metrics & Ratio Table</h2>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Key Financial Metric</th>
                    <th>Reported Value ({primaryCompany.ticker})</th>
                    {isComparisonSession && <th>Peer Value ({secondaryCompany.ticker})</th>}
                    <th>Benchmark / Target</th>
                    <th>Document Citation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Consolidated Revenue</td>
                    <td>{primaryCompany.metrics.revenue}</td>
                    {isComparisonSession && <td>{secondaryCompany.metrics.revenue}</td>}
                    <td>Positive Growth</td>
                    <td>{primaryCompany.filingDocName}, p. 112</td>
                  </tr>
                  <tr>
                    <td>Operating Margin (EBIT)</td>
                    <td>{primaryCompany.metrics.operatingMargin}</td>
                    {isComparisonSession && <td>{secondaryCompany.metrics.operatingMargin}</td>}
                    <td>20.0% - 24.0%</td>
                    <td>{primaryCompany.filingDocName}, p. 112</td>
                  </tr>
                  <tr>
                    <td>Net Profit Attributable</td>
                    <td>{primaryCompany.metrics.netProfit}</td>
                    {isComparisonSession && <td>{secondaryCompany.metrics.netProfit}</td>}
                    <td>Expansion</td>
                    <td>{primaryCompany.filingDocName}, p. 112</td>
                  </tr>
                  <tr>
                    <td>Free Cash Flow (FCF)</td>
                    <td>{primaryCompany.metrics.freeCashFlow}</td>
                    {isComparisonSession && <td>{secondaryCompany.metrics.freeCashFlow}</td>}
                    <td>&gt;80% PAT</td>
                    <td>{primaryCompany.filingDocName}, p. 116</td>
                  </tr>
                  <tr>
                    <td>Return on Equity (ROE)</td>
                    <td>{primaryCompany.metrics.roe}</td>
                    {isComparisonSession && <td>{secondaryCompany.metrics.roe}</td>}
                    <td>&gt;25.0%</td>
                    <td>{primaryCompany.filingDocName}, p. 145</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 3: Red Flags & Risk Matrix */}
            <div className="report-section">
              <h2 className="report-section-heading">3. Forensic Red Flag & Risk Audit</h2>
              <div className="report-risks-list">
                {primaryCompany.redFlags.map((rf, i) => (
                  <div key={i} className="report-risk-item">
                    <div className="flex-row items-center gap-2 mb-1">
                      <span className="badge badge-warning text-xs">Risk {i + 1}: {rf.severity}</span>
                      <strong>{rf.title}</strong>
                    </div>
                    <p className="report-risk-desc">{rf.impact}</p>
                    <div className="report-risk-evidence">
                      <em>Evidence Snippet:</em> "{rf.evidenceSnippet}" — <span className="text-muted font-medium">{rf.citation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Peer Comparison */}
            {isComparisonSession && (
              <div className="report-section">
                <h2 className="report-section-heading">4. Peer Benchmarking Analysis</h2>
                <p className="report-body-text">
                  Comparing {primaryCompany.name} and {secondaryCompany.name} reveals clear strategic divergences. TCS commands a <strong>390 bps operating margin premium</strong> (24.6% vs 20.7%) and delivered superior order book momentum ($42.7B vs $17.7B). However, Infosys demonstrated stronger net new deal conversion (52%) and an exceptional ROE of 31.8%.
                </p>
              </div>
            )}

            {/* Section 5: Strategic Assessment & Outlook */}
            <div className="report-section">
              <h2 className="report-section-heading">5. Strategic Assessment & Outlook</h2>
              <p className="report-body-text">
                Both companies operate with pristine, debt-free balance sheets and market-leading cash conversion. While discretionary enterprise spending remains guarded in BFSI and communications verticals, large-scale cost-optimization and generative AI proof-of-concept pipelines position both firms for operating leverage as discretionary budgets recover.
              </p>
            </div>

            {/* Report Sign-off Footer */}
            <div className="report-doc-footer">
              <div className="sign-off-row">
                <div>
                  <strong>Prepared By:</strong>
                  <p className="text-xs muted">FinResearch AI • Multi-Agent Financial Research System</p>
                </div>
                <div>
                  <strong>Audit Status:</strong>
                  <p className="text-xs text-success font-semibold">100% Strict Document Grounding (No LLM Hallucinations)</p>
                </div>
              </div>
              <p className="report-disclaimer">
                DISCLAIMER: This automated report is generated by a multi-agent artificial intelligence system strictly summarizing disclosed financial statements and annual reports. It does not constitute formal investment advice or a solicitation to buy or sell securities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Citation Inspection Modal */}
      {activeCitation && (
        <CitationModal citation={activeCitation} onClose={() => setActiveCitation(null)} />
      )}
    </section>
  );
}