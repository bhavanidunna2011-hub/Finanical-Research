import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Search,
  Bookmark,
  Hash,
  Database,
  Cpu,
  Clock,
  Trash2,
  FolderOpen,
  ArrowRight
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import DocumentViewer from "../components/DocumentViewer";
import CitationModal from "../components/CitationModal";
import { SAMPLE_CHUNKS, SEED_COMPANIES } from "../data/seedData";

export default function DocumentDetails({
  document: doc,
  sessions = [],
  onBack,
  onOpenSession,
  onUpdateDocument,
  onDeleteDocument
}) {
  const [activeTab, setActiveTab] = useState("sections"); // "sections" | "chunks" | "session" | "metadata"
  const [activeCitation, setActiveCitation] = useState(null);
  const [searchChunkTerm, setSearchChunkTerm] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryStage, setRetryStage] = useState(null);

  if (!doc) {
    return (
      <div className="fin-doc-details-page p-8 text-center">
        <p className="text-muted">No document selected.</p>
        <Button variant="secondary" size="sm" onClick={onBack} className="mt-4">
          Back to Financial Documents
        </Button>
      </div>
    );
  }

  // Linked research session
  const linkedSession = sessions.find((s) => s.id === doc.sessionId) ||
    sessions.find((s) => s.companyIds?.includes(doc.ticker)) ||
    sessions[0];

  // Document chunks
  const docChunks = SAMPLE_CHUNKS.filter(
    (c) =>
      c.companyId === doc.ticker ||
      c.docName === doc.name
  );

  const filteredChunks = docChunks.filter((c) => {
    if (!searchChunkTerm.trim()) return true;
    const term = searchChunkTerm.toLowerCase();
    return (
      c.content.toLowerCase().includes(term) ||
      c.section.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term)
    );
  });

  // Simulated Retry Workflow
  function handleRetryProcessing() {
    setIsRetrying(true);
    setRetryStage("Parsing text layer & tables...");

    setTimeout(() => {
      setRetryStage("Re-generating semantic chunks (400 tokens)...");

      setTimeout(() => {
        setRetryStage("Building 1536-dim vector index...");

        setTimeout(() => {
          setIsRetrying(false);
          setRetryStage(null);

          const updated = {
            ...doc,
            status: "Ready",
            pipelineStages: [
              { name: "Uploaded", status: "completed", timestamp: "09:00:01 AM", duration: "0.5s", detail: "PDF binary verified" },
              { name: "Parsing", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "2.1s", detail: "OCR repaired with Fallback Type-1 Font Parser" },
              { name: "Chunking", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "1.8s", detail: `Re-indexed into ${doc.chunksCount || 1200} semantic chunks` },
              { name: "Indexing", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "2.4s", detail: "Vector graph rebuilt with zero drift" },
              { name: "Ready", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "0.2s", detail: "Verified for multi-agent reasoning" }
            ]
          };

          if (onUpdateDocument) {
            onUpdateDocument(doc.id, updated);
          }
        }, 1000);
      }, 1000);
    }, 1000);
  }

  // Simulate Error State for Demonstration
  function handleTriggerError() {
    const errorDoc = {
      ...doc,
      status: "Error",
      pipelineStages: [
        { name: "Uploaded", status: "completed", timestamp: "09:00:01 AM", duration: "0.5s", detail: "PDF binary verified" },
        { name: "Parsing", status: "error", timestamp: new Date().toLocaleTimeString(), duration: "Failed", detail: "OCR Error: Incomplete embedded font table in footnote on Page 42" },
        { name: "Chunking", status: "waiting", timestamp: "--", duration: "--", detail: "Halted due to OCR extraction failure" },
        { name: "Indexing", status: "waiting", timestamp: "--", duration: "--", detail: "Halted" },
        { name: "Ready", status: "waiting", timestamp: "--", duration: "--", detail: "Pending error resolution" }
      ]
    };

    if (onUpdateDocument) {
      onUpdateDocument(doc.id, errorDoc);
    }
  }

  const isErrorState = doc.status === "Error";

  return (
    <div className="fin-doc-details-page animate-fadeIn space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex-row items-center justify-between pb-4 border-b border-subtle">
        <div className="flex-row items-center gap-3">
          <button
            type="button"
            className="fin-btn fin-btn-ghost fin-btn-sm"
            onClick={onBack}
            title="Return to Financial Documents"
          >
            <ArrowLeft size={16} />
            <span>Back to Financial Documents</span>
          </button>
          <div className="h-4 w-px bg-border-color" />
          <div>
            <div className="flex-row items-center gap-2">
              <h1 className="text-xl font-bold text-main truncate max-w-lg" title={doc.name}>
                {doc.name}
              </h1>
              {doc.isSeed ? (
                <Badge variant="teal" size="xs" icon={Sparkles}>
                  Seed Document
                </Badge>
              ) : (
                <Badge variant="primary" size="xs">
                  User Ingested
                </Badge>
              )}
              <Badge
                variant={
                  isErrorState
                    ? "danger"
                    : doc.status === "Ready"
                    ? "success"
                    : "warning"
                }
                size="xs"
                dot
              >
                {doc.status}
              </Badge>
            </div>
            <p className="text-xs text-muted mt-0.5">
              {doc.company} ({doc.ticker}) • {doc.docType} • Ingested on {doc.uploadDate}
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex-row items-center gap-2">
          {isErrorState ? (
            <Button
              variant="warning"
              size="sm"
              icon={RefreshCw}
              loading={isRetrying}
              onClick={handleRetryProcessing}
            >
              {isRetrying ? retryStage || "Retrying OCR..." : "Retry Parsing & Chunking"}
            </Button>
          ) : (
            <button
              type="button"
              className="fin-btn fin-btn-ghost fin-btn-xs text-warning"
              onClick={handleTriggerError}
              title="Test simulated parsing error & retry state"
            >
              <AlertTriangle size={13} />
              <span>Simulate OCR Error</span>
            </button>
          )}

          {linkedSession && (
            <Button
              variant="primary"
              size="sm"
              icon={FolderOpen}
              onClick={() => onOpenSession && onOpenSession(linkedSession)}
            >
              Open in Research Workspace
            </Button>
          )}

          {!doc.isSeed && (
            <Button
              variant="ghost"
              size="sm"
              className="text-danger"
              icon={Trash2}
              onClick={() => onDeleteDocument && onDeleteDocument(doc.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert Box when in Error State */}
      {isErrorState && (
        <div className="fin-error-banner p-4 border rounded-lg bg-danger/10 border-danger/30 flex-row items-start justify-between gap-4 animate-fadeIn">
          <div className="flex-row items-start gap-3">
            <AlertTriangle size={20} className="text-danger shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm text-danger block">
                OCR Parsing Error Detected on Page 42
              </strong>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Incomplete embedded font table encountered in Note 14 (Consolidated Liabilities footnote).
                The document pipeline halted prior to chunking and vector embedding.
              </p>
              <div className="flex-row items-center gap-2 mt-3">
                <Button
                  variant="teal"
                  size="xs"
                  icon={RefreshCw}
                  loading={isRetrying}
                  onClick={handleRetryProcessing}
                >
                  {isRetrying ? retryStage || "Recovering..." : "Execute Fallback OCR & Resume Ingestion"}
                </Button>
                <span className="text-[11px] text-muted">
                  Fallback OCR bypasses malformed glyphs using rasterized neural vision.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Document Length</span>
          <strong className="text-xl font-bold font-mono text-main block mt-1">
            {doc.pages} Pages
          </strong>
          <span className="text-[11px] text-accent flex-row items-center gap-1 mt-1">
            <CheckCircle2 size={12} /> Full OCR Extraction
          </span>
        </div>

        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Semantic Vector Chunks</span>
          <strong className="text-xl font-bold font-mono text-accent block mt-1">
            {doc.chunksCount} Chunks
          </strong>
          <span className="text-[11px] text-muted block mt-1">
            Avg ~418 tokens / chunk
          </span>
        </div>

        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Embedding Dimensions</span>
          <strong className="text-xl font-bold font-mono text-main block mt-1">
            1,536 Dims
          </strong>
          <span className="text-[11px] text-muted block mt-1">
            text-embedding-3-small
          </span>
        </div>

        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">File Size & Checksum</span>
          <strong className="text-xl font-bold font-mono text-main block mt-1">
            {doc.fileSize}
          </strong>
          <span className="text-[11px] font-mono text-dim block mt-1 truncate" title={doc.checksum}>
            {doc.checksum ? doc.checksum.substring(0, 16) + "..." : "sha256 verified"}
          </span>
        </div>
      </div>

      {/* Ingestion Pipeline Stepper (The 5 Required Stages) */}
      <div className="fin-card p-5 border rounded-lg bg-card">
        <div className="flex-row items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-main flex-row items-center gap-2">
              <Cpu size={16} className="text-accent" />
              Document Ingestion & Parsing Pipeline Stages
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Five-stage verification pipeline powering strict citation grounding and multi-agent retrieval.
            </p>
          </div>
          <Badge variant="teal" size="xs">
            {isRetrying ? "Pipeline Retrying" : isErrorState ? "Stage 2 Halted" : "5 / 5 Stages Completed"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(doc.pipelineStages || [
            { name: "Uploaded", status: "completed", timestamp: "10:30 AM", duration: "0.8s", detail: "Binary PDF validated" },
            { name: "Parsing", status: "completed", timestamp: "10:30 AM", duration: "3.2s", detail: "OCR & table grid extraction" },
            { name: "Chunking", status: "completed", timestamp: "10:30 AM", duration: "2.5s", detail: "Semantic token segmenting" },
            { name: "Indexing", status: "completed", timestamp: "10:30 AM", duration: "4.1s", detail: "1536-dim vector embedding" },
            { name: "Ready", status: "completed", timestamp: "10:30 AM", duration: "0.3s", detail: "Verified for multi-agent reasoning" }
          ]).map((stage, idx) => {
            const isCompleted = stage.status === "completed";
            const isError = stage.status === "error";
            const isInProgress = stage.status === "in-progress" || (isRetrying && idx === 1);
            const isWaiting = stage.status === "waiting";

            return (
              <div
                key={stage.name}
                className={`p-3.5 border rounded-lg transition-all ${
                  isError
                    ? "border-danger/40 bg-danger/10"
                    : isCompleted
                    ? "border-success/30 bg-card-subtle"
                    : isInProgress
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-border-color bg-card-subtle opacity-60"
                }`}
              >
                <div className="flex-row justify-between items-center mb-2">
                  <span className="text-[11px] font-mono text-muted">STAGE 0{idx + 1}</span>
                  {isCompleted && (
                    <span className="text-success flex-row items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 size={13} /> {stage.duration}
                    </span>
                  )}
                  {isError && (
                    <span className="text-danger flex-row items-center gap-1 text-[11px] font-bold">
                      <AlertTriangle size={13} /> Failed
                    </span>
                  )}
                  {isInProgress && (
                    <span className="text-accent flex-row items-center gap-1 text-[11px] font-bold">
                      <RefreshCw size={13} className="animate-spin" /> Active
                    </span>
                  )}
                  {isWaiting && (
                    <span className="text-dim text-[11px]">Waiting</span>
                  )}
                </div>

                <strong className={`text-sm block ${isError ? "text-danger" : "text-main"}`}>
                  {stage.name}
                </strong>
                <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2" title={stage.detail}>
                  {stage.detail}
                </p>

                <div className="mt-3 pt-2 border-t border-subtle flex-row justify-between text-[10px] text-dim">
                  <span>Timestamp:</span>
                  <span className="font-mono text-muted">{stage.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: PDF Viewer & Document Inspection Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Document Preview & PDF Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="fin-card border rounded-lg bg-card overflow-hidden">
            <div className="p-3.5 border-b border-subtle flex-row justify-between items-center">
              <div className="flex-row items-center gap-2">
                <FileText size={16} className="text-accent" />
                <h3 className="text-sm font-bold text-main">Institutional Document Preview</h3>
                <Badge variant="teal" size="xs">Audited View</Badge>
              </div>
              <span className="text-xs text-muted">
                {doc.pages} Pages Indexed
              </span>
            </div>

            <DocumentViewer
              document={doc}
              onCitationClick={(citation) => setActiveCitation(citation)}
            />
          </div>
        </div>

        {/* Right Column: Tabbed Sections, Chunks & Session Linkage */}
        <div className="lg:col-span-5 space-y-4">
          <div className="fin-card border rounded-lg bg-card overflow-hidden">
            {/* Tab Buttons */}
            <div className="flex-row border-b border-subtle bg-card-subtle">
              <button
                type="button"
                className={`flex-1 py-3 px-3 text-xs font-semibold text-center transition-all ${
                  activeTab === "sections"
                    ? "border-b-2 border-accent text-accent bg-card font-bold"
                    : "text-muted hover:text-main"
                }`}
                onClick={() => setActiveTab("sections")}
              >
                Sections ({doc.sections?.length || 0})
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-3 text-xs font-semibold text-center transition-all ${
                  activeTab === "chunks"
                    ? "border-b-2 border-accent text-accent bg-card font-bold"
                    : "text-muted hover:text-main"
                }`}
                onClick={() => setActiveTab("chunks")}
              >
                Chunks ({docChunks.length})
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-3 text-xs font-semibold text-center transition-all ${
                  activeTab === "session"
                    ? "border-b-2 border-accent text-accent bg-card font-bold"
                    : "text-muted hover:text-main"
                }`}
                onClick={() => setActiveTab("session")}
              >
                Research Session
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-3 text-xs font-semibold text-center transition-all ${
                  activeTab === "metadata"
                    ? "border-b-2 border-accent text-accent bg-card font-bold"
                    : "text-muted hover:text-main"
                }`}
                onClick={() => setActiveTab("metadata")}
              >
                Metadata
              </button>
            </div>

            <div className="p-4 max-h-[580px] overflow-y-auto">
              {/* Tab 1: Extracted Sections (Table of Contents) */}
              {activeTab === "sections" && (
                <div className="space-y-3">
                  <div className="flex-row justify-between items-center mb-2">
                    <span className="text-xs font-bold text-main">Identified Structural Sections</span>
                    <span className="text-[11px] text-muted">Financial Table & Text Segments</span>
                  </div>

                  {doc.sections && doc.sections.length > 0 ? (
                    doc.sections.map((sec) => (
                      <div
                        key={sec.id}
                        className="p-3 border rounded-lg bg-card-subtle hover:border-accent transition-all cursor-pointer"
                      >
                        <div className="flex-row justify-between items-start gap-2">
                          <strong className="text-xs text-main block">{sec.title}</strong>
                          <span className="text-[11px] font-mono font-bold text-accent shrink-0">
                            Page {sec.page}
                          </span>
                        </div>
                        <div className="flex-row items-center gap-2 mt-1.5 text-[11px] text-muted">
                          <Badge variant="primary" size="xs">{sec.category}</Badge>
                          <span>•</span>
                          <span>{sec.chunks} Chunks Indexed</span>
                        </div>
                        {sec.previewSnippet && (
                          <p className="text-[11px] text-dim mt-2 italic leading-relaxed">
                            "{sec.previewSnippet}"
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted text-center py-6">
                      No structural sections recorded for this document.
                    </p>
                  )}
                </div>
              )}

              {/* Tab 2: Semantic Chunks & Vector Inspect */}
              {activeTab === "chunks" && (
                <div className="space-y-3">
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-3 text-muted" />
                    <input
                      type="text"
                      className="fin-input w-full pl-9 text-xs"
                      placeholder="Filter semantic chunks by text or section..."
                      value={searchChunkTerm}
                      onChange={(e) => setSearchChunkTerm(e.target.value)}
                    />
                  </div>

                  {filteredChunks.length > 0 ? (
                    filteredChunks.map((chunk) => (
                      <div key={chunk.id} className="p-3 border rounded-lg bg-card-subtle space-y-2">
                        <div className="flex-row justify-between items-center text-xs">
                          <span className="font-mono text-purple-400 font-bold">{chunk.id}</span>
                          <span className="text-accent font-semibold">Page {chunk.page}</span>
                          <span className="text-success font-mono font-bold">
                            Sim: {(chunk.similarityScore * 100).toFixed(1)}%
                          </span>
                        </div>
                        <strong className="text-xs text-main block">{chunk.section}</strong>
                        <p className="text-xs text-muted leading-relaxed line-clamp-3">
                          "{chunk.content}"
                        </p>
                        <div className="pt-2 flex-row justify-end">
                          <button
                            type="button"
                            className="fin-btn fin-btn-ghost fin-btn-xs text-accent"
                            onClick={() =>
                              setActiveCitation({
                                docName: chunk.docName,
                                company: doc.company,
                                page: chunk.page,
                                section: chunk.section,
                                snippet: chunk.content
                              })
                            }
                          >
                            View Source Citation
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted text-xs">
                      No matching chunks found. Chunks are generated during the chunking stage.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Related Research Session (Module 1 Integration) */}
              {activeTab === "session" && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-main block">
                    Linked Research Session (Module 1)
                  </span>

                  {linkedSession ? (
                    <div className="p-4 border rounded-lg bg-card-subtle space-y-3">
                      <div className="flex-row justify-between items-start">
                        <div>
                          <Badge variant="teal" size="xs">Active Session</Badge>
                          <h4 className="text-sm font-bold text-main mt-1.5">
                            {linkedSession.title}
                          </h4>
                        </div>
                        <Badge variant="success" size="xs">
                          {linkedSession.status || "Ready"}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted leading-relaxed">
                        {linkedSession.description}
                      </p>

                      <div className="p-2.5 border rounded bg-card text-xs space-y-1">
                        <div className="flex-row justify-between">
                          <span className="text-muted">Research Type:</span>
                          <strong className="text-main">{linkedSession.researchType}</strong>
                        </div>
                        <div className="flex-row justify-between">
                          <span className="text-muted">Target Entity:</span>
                          <strong className="text-main">{linkedSession.company}</strong>
                        </div>
                        <div className="flex-row justify-between">
                          <span className="text-muted">Created Date:</span>
                          <span className="text-muted">{linkedSession.createdAt}</span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        icon={ArrowRight}
                        iconPosition="right"
                        onClick={() => onOpenSession && onOpenSession(linkedSession)}
                      >
                        Launch Interactive Workspace
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 border rounded text-center text-xs text-muted">
                      No research session currently linked to this document.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Technical Ingestion Metadata */}
              {activeTab === "metadata" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 border rounded bg-card-subtle space-y-2">
                    <div className="flex-row justify-between py-1 border-b border-subtle">
                      <span className="text-muted">Original Filename:</span>
                      <strong className="text-main font-mono">{doc.name}</strong>
                    </div>
                    <div className="flex-row justify-between py-1 border-b border-subtle">
                      <span className="text-muted">Document Type:</span>
                      <strong className="text-main">{doc.docType}</strong>
                    </div>
                    <div className="flex-row justify-between py-1 border-b border-subtle">
                      <span className="text-muted">File Size:</span>
                      <span className="text-main font-mono">{doc.fileSize} ({doc.fileSizeBytes || "N/A"} bytes)</span>
                    </div>
                    <div className="flex-row justify-between py-1 border-b border-subtle">
                      <span className="text-muted">SHA-256 Checksum:</span>
                      <span className="text-main font-mono">{doc.checksum}</span>
                    </div>
                    <div className="flex-row justify-between py-1 border-b border-subtle">
                      <span className="text-muted">OCR Ingestion Engine:</span>
                      <strong className="text-accent">{doc.ocrEngine || "Financial-OCR-TableNet v2.4"}</strong>
                    </div>
                    <div className="flex-row justify-between py-1 border-b border-subtle">
                      <span className="text-muted">Embedding Model:</span>
                      <strong className="text-accent">{doc.embeddingModel || "text-embedding-3-small (1536-dim)"}</strong>
                    </div>
                    <div className="flex-row justify-between py-1 border-b border-subtle">
                      <span className="text-muted">Chunking Strategy:</span>
                      <span className="text-main">RecursiveTokenChunker (512 tokens / 64 overlap)</span>
                    </div>
                    <div className="flex-row justify-between py-1">
                      <span className="text-muted">Vector Storage Namespace:</span>
                      <span className="text-main font-mono">finresearch-{doc.ticker?.toLowerCase()}-vectors</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Citation Modal */}
      {activeCitation && (
        <CitationModal citation={activeCitation} onClose={() => setActiveCitation(null)} />
      )}
    </div>
  );
}
