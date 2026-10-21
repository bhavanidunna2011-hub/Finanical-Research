import React, { useState, useMemo, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FolderOpen,
  LayoutGrid,
  List,
  X,
  FileCheck2,
  Plus,
  Bot,
  Database
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "../components/ui/Table";
import { Dialog } from "../components/ui/Dialog";
import EmptyState from "../components/ui/EmptyState";
import {
  getStoredDocuments,
  saveStoredDocuments,
  DOCUMENT_TYPES,
  PROCESSING_STATUSES,
  formatFileSize
} from "../data/documentData";
import { SEED_COMPANIES } from "../data/seedData";
import UploadDocument from "./UploadDocument";
import DocumentDetails from "./DocumentDetails";
import KnowledgeBase from "./KnowledgeBase";
import DocumentViewer from "../components/DocumentViewer";

export default function DocumentLibrary({
  documents: initialDocumentsProp,
  onUpdateDocuments,
  sessions = [],
  activeSession,
  setActiveSession,
  setPage,
  onOpenDocumentSession,
  initialSubView = "library"
}) {
  const [subView, setSubView] = useState(initialSubView); // "library" | "upload" | "details"
  const [documents, setDocuments] = useState(() => {
    if (Array.isArray(initialDocumentsProp) && initialDocumentsProp.length > 0) {
      return initialDocumentsProp;
    }
    return getStoredDocuments();
  });
  const [selectedDocId, setSelectedDocId] = useState(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"

  // Quick Modal Previews & Deletions
  const [quickPreviewDoc, setQuickPreviewDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  // Sync state to parent and localStorage whenever documents change
  useEffect(() => {
    saveStoredDocuments(documents);
    if (onUpdateDocuments) {
      onUpdateDocuments(documents);
    }
  }, [documents]);

  // Sync from props if parent documents update
  useEffect(() => {
    if (Array.isArray(initialDocumentsProp) && initialDocumentsProp.length > 0) {
      setDocuments(initialDocumentsProp);
    }
  }, [initialDocumentsProp]);

  const selectedDocument = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  // Extract unique companies from documents for filter
  const companyOptions = useMemo(() => {
    const map = new Map();
    documents.forEach((d) => {
      if (d.company) map.set(d.company, d.ticker || d.company);
    });
    return Array.from(map.entries()).map(([name, ticker]) => ({ name, ticker }));
  }, [documents]);

  // Filtered documents list
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesCompany = doc.company.toLowerCase().includes(q);
        const matchesTicker = doc.ticker?.toLowerCase().includes(q);
        const matchesType = doc.docType.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesTicker && !matchesType) {
          return false;
        }
      }

      // 2. Document Type Filter
      if (typeFilter !== "all" && doc.docType !== typeFilter) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter !== "all" && doc.status !== statusFilter) {
        return false;
      }

      // 4. Company Filter
      if (companyFilter !== "all" && doc.company !== companyFilter && doc.ticker !== companyFilter) {
        return false;
      }

      // 5. Date Filter
      if (dateFilter !== "all") {
        if (dateFilter === "seed" && !doc.isSeed) return false;
        if (dateFilter === "user" && doc.isSeed) return false;
        if (dateFilter === "recent") {
          // If uploaded within last 7 days or Oct 2026
          const isRecent = doc.uploadedTimestamp && new Date(doc.uploadedTimestamp) > new Date("2026-10-01");
          if (!isRecent && !doc.uploadDate?.includes("2026")) return false;
        }
      }

      return true;
    });
  }, [documents, searchQuery, typeFilter, statusFilter, companyFilter, dateFilter]);

  // Summary Metrics
  const totalCount = documents.length;
  const readyCount = documents.filter((d) => d.status === "Ready").length;
  const inFlightCount = documents.filter((d) => ["Parsing", "Chunking", "Indexing", "Uploaded"].includes(d.status)).length;
  const seedCount = documents.filter((d) => d.isSeed).length;

  // Document Handlers
  function handleDocumentUploaded(newDoc) {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    setSelectedDocId(newDoc.id);
  }

  function handleUpdateDocument(id, updatedFields) {
    const updated = documents.map((d) => (d.id === id ? { ...d, ...updatedFields } : d));
    setDocuments(updated);
  }

  function handleDeleteDocument(id) {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    setDocToDelete(null);
    if (selectedDocId === id) {
      setSelectedDocId(updated.length > 0 ? updated[0].id : null);
      setSubView("library");
    }
  }

  function handleViewDetails(doc) {
    setSelectedDocId(doc.id);
    setSubView("details");
  }

  function handleOpenSession(targetSession) {
    if (setActiveSession) setActiveSession(targetSession);
    if (setPage) setPage("Research Workspace");
  }

  function handleResetFilters() {
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setCompanyFilter("all");
    setDateFilter("all");
  }

  // Subview 2: Upload Document Page
  if (subView === "upload") {
    return (
      <UploadDocument
        sessions={sessions}
        activeSession={activeSession}
        onUploadSuccess={(newDoc) => {
          handleDocumentUploaded(newDoc);
        }}
        onCancel={() => setSubView("library")}
        onViewDetails={(doc) => {
          setSelectedDocId(doc.id);
          setSubView("details");
        }}
      />
    );
  }

  // Subview 3: Document Details Page
  if (subView === "details" && selectedDocument) {
    return (
      <DocumentDetails
        document={selectedDocument}
        sessions={sessions}
        onBack={() => setSubView("library")}
        onOpenSession={handleOpenSession}
        onUpdateDocument={handleUpdateDocument}
        onDeleteDocument={handleDeleteDocument}
      />
    );
  }

  // Subview 4: Knowledge Base / Vector Search
  if (subView === "search" || subView === "knowledge_base") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-subtle">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="fin-btn fin-btn-secondary fin-btn-xs"
              onClick={() => setSubView("library")}
            >
              ← Back to Filing Library
            </button>
            <span className="text-xs text-muted">|</span>
            <span className="text-xs font-semibold text-main">Vector Search & Embedding Sandbox</span>
          </div>
        </div>
        <KnowledgeBase
          sessions={sessions}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          setPage={setPage}
        />
      </div>
    );
  }

  // Default: Page 1 — Document Library (Financial Documents)
  return (
    <section className="page fin-document-library-page animate-fadeIn space-y-6">
      {/* Clean Sub-navigation & Actions Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-subtle flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`fin-btn fin-btn-xs ${subView === "library" ? "fin-btn-primary" : "fin-btn-secondary"}`}
            onClick={() => setSubView("library")}
          >
            <FileText size={13} className="mr-1" />
            <span>Filing Library ({documents.length})</span>
          </button>
          <button
            type="button"
            className="fin-btn fin-btn-secondary fin-btn-xs"
            onClick={() => setSubView("upload")}
          >
            <UploadCloud size={13} className="mr-1 text-teal" />
            <span>Upload Filing</span>
          </button>
          <button
            type="button"
            className="fin-btn fin-btn-secondary fin-btn-xs"
            onClick={() => setSubView("search")}
          >
            <Database size={13} className="mr-1 text-muted" />
            <span>Vector Search Index</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {setPage && (
            <Button
              variant="secondary"
              size="xs"
              icon={Bot}
              onClick={() => setPage("AI Research")}
            >
              Ask in AI Research
            </Button>
          )}
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-kpi-box p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Total Financial Documents</span>
          <strong className="text-2xl font-bold font-mono text-main block mt-1">
            {totalCount}
          </strong>
          <span className="text-[11px] text-muted block mt-1">
            Multi-corporate filings catalog
          </span>
        </div>

        <div className="fin-kpi-box p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Vector Indexed & Ready</span>
          <strong className="text-2xl font-bold font-mono text-success block mt-1">
            {readyCount}
          </strong>
          <span className="text-[11px] text-success flex-row items-center gap-1 mt-1 font-semibold">
            <CheckCircle2 size={12} /> Grounded Citations Live
          </span>
        </div>

        <div className="fin-kpi-box p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Parsing In-Flight</span>
          <strong className="text-2xl font-bold font-mono text-warning block mt-1">
            {inFlightCount}
          </strong>
          <span className="text-[11px] text-muted block mt-1">
            OCR & chunk generation pipeline
          </span>
        </div>

        <div className="fin-kpi-box p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Preloaded Seed Filings</span>
          <strong className="text-2xl font-bold font-mono text-accent block mt-1">
            {seedCount}
          </strong>
          <span className="text-[11px] text-accent flex-row items-center gap-1 mt-1 font-semibold">
            <Sparkles size={12} /> Institutional Benchmarks
          </span>
        </div>
      </div>

      {/* Search & Multi-Filter Control Bar */}
      <div className="fin-filter-panel p-4 border rounded-lg bg-card space-y-3">
        <div className="flex-row items-center justify-between gap-3 flex-wrap">
          {/* Real-time Search by Document Name or Company */}
          <div className="relative flex-1 min-w-[260px]">
            <Search size={15} className="absolute left-3 top-2.5 text-muted" />
            <input
              type="text"
              className="fin-input w-full pl-9 pr-8 text-xs"
              placeholder="Search by document name, ticker, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-2.5 top-2.5 text-muted hover:text-main"
                onClick={() => setSearchQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View Mode Toggle (Table vs Grid) */}
          <div className="flex-row items-center gap-1 border border-border-color rounded p-1 bg-card-subtle">
            <button
              type="button"
              className={`p-1.5 rounded text-xs ${viewMode === "table" ? "bg-accent text-white" : "text-muted hover:text-main"}`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              className={`p-1.5 rounded text-xs ${viewMode === "grid" ? "bg-accent text-white" : "text-muted hover:text-main"}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        {/* 4 Dedicated Filters: Document Type, Processing Status, Company, and Date */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-subtle">
          {/* 1. Document Type Filter */}
          <div>
            <label className="text-[11px] text-muted font-semibold block mb-1">
              Document Type
            </label>
            <select
              className="fin-select w-full text-xs"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Document Types</option>
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Processing Status Filter */}
          <div>
            <label className="text-[11px] text-muted font-semibold block mb-1">
              Processing Status
            </label>
            <select
              className="fin-select w-full text-xs"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {PROCESSING_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Company Filter */}
          <div>
            <label className="text-[11px] text-muted font-semibold block mb-1">
              Company / Entity
            </label>
            <select
              className="fin-select w-full text-xs"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companyOptions.map((comp) => (
                <option key={comp.ticker} value={comp.ticker}>
                  {comp.ticker} — {comp.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Date Filter */}
          <div>
            <label className="text-[11px] text-muted font-semibold block mb-1">
              Upload Date
            </label>
            <select
              className="fin-select w-full text-xs"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="recent">Recent (Last 30 Days)</option>
              <option value="seed">Preloaded Seed Documents</option>
              <option value="user">User Uploaded Filings</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        {(searchQuery || typeFilter !== "all" || statusFilter !== "all" || companyFilter !== "all" || dateFilter !== "all") && (
          <div className="flex-row items-center justify-between text-xs pt-2 border-t border-subtle">
            <span className="text-muted">
              Showing <strong className="text-main">{filteredDocuments.length}</strong> of {totalCount} filings
            </span>
            <button
              type="button"
              className="text-accent hover:underline text-xs"
              onClick={handleResetFilters}
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Document Table View (Page 1 Table) */}
      {viewMode === "table" ? (
        <div className="fin-card border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow isHeader>
                <TableHead>Document Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead numeric>File Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Processing Status</TableHead>
                <TableHead align="right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => {
                  const isReady = doc.status === "Ready";
                  const isError = doc.status === "Error";
                  const isParsing = doc.status === "Parsing";

                  return (
                    <TableRow key={doc.id} className="hover:bg-hover transition-colors">
                      {/* 1. Document Name & Seed Indicator */}
                      <TableCell>
                        <div className="flex-row items-center gap-2.5">
                          <div className="p-2 rounded bg-accent/10 text-accent shrink-0">
                            <FileText size={16} />
                          </div>
                          <div>
                            <span
                              className="font-bold text-xs text-main hover:text-accent cursor-pointer block truncate max-w-xs"
                              title={doc.name}
                              onClick={() => handleViewDetails(doc)}
                            >
                              {doc.name}
                            </span>
                            <div className="flex-row items-center gap-1.5 mt-0.5">
                              {/* Seed-document indicator badge */}
                              {doc.isSeed ? (
                                <Badge variant="teal" size="xs" icon={Sparkles}>
                                  Seed Document
                                </Badge>
                              ) : (
                                <Badge variant="primary" size="xs">
                                  User Ingested
                                </Badge>
                              )}
                              <span className="text-[11px] text-muted">
                                {doc.pages} Pages • {doc.chunksCount} Chunks
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* 2. Company */}
                      <TableCell>
                        <div className="flex-row items-center gap-1.5">
                          <Badge variant="default" size="xs">
                            {doc.ticker}
                          </Badge>
                          <span className="text-xs font-semibold text-main truncate max-w-[140px]" title={doc.company}>
                            {doc.company}
                          </span>
                        </div>
                      </TableCell>

                      {/* 3. Document Type */}
                      <TableCell>
                        <span className="fin-doc-type-pill text-xs font-semibold">
                          {doc.docType}
                        </span>
                      </TableCell>

                      {/* 4. File Size */}
                      <TableCell numeric>
                        <span className="font-mono text-xs text-muted">
                          {doc.fileSize}
                        </span>
                      </TableCell>

                      {/* 5. Upload Date */}
                      <TableCell>
                        <div className="flex-row items-center gap-1 text-xs text-muted">
                          <Calendar size={12} className="text-dim" />
                          <span>{doc.uploadDate}</span>
                        </div>
                      </TableCell>

                      {/* 6. Processing Status */}
                      <TableCell>
                        {isReady ? (
                          <Badge variant="success" size="sm" icon={CheckCircle2}>
                            Ready
                          </Badge>
                        ) : isError ? (
                          <div className="flex-row items-center gap-1.5">
                            <Badge variant="danger" size="sm" icon={AlertTriangle}>
                              Error
                            </Badge>
                            <button
                              type="button"
                              className="text-xs text-warning hover:underline"
                              onClick={() => handleViewDetails(doc)}
                            >
                              Retry
                            </button>
                          </div>
                        ) : isParsing ? (
                          <Badge variant="warning" size="sm" icon={RefreshCw} className="animate-pulse">
                            Parsing
                          </Badge>
                        ) : (
                          <Badge variant="teal" size="sm">
                            {doc.status}
                          </Badge>
                        )}
                      </TableCell>

                      {/* 7. Actions */}
                      <TableCell align="right">
                        <div className="flex-row items-center justify-end gap-1.5">
                          <button
                            type="button"
                            className="fin-btn fin-btn-ghost fin-btn-xs text-accent"
                            onClick={() => handleViewDetails(doc)}
                            title="Inspect Document Details & Sections"
                          >
                            <Eye size={13} />
                            <span>Inspect</span>
                          </button>

                          <button
                            type="button"
                            className="fin-btn fin-btn-ghost fin-btn-xs"
                            onClick={() => setQuickPreviewDoc(doc)}
                            title="Quick Document Preview"
                          >
                            <ExternalLink size={13} />
                          </button>

                          <button
                            type="button"
                            className="fin-btn fin-btn-ghost fin-btn-xs text-teal font-medium"
                            onClick={() => {
                              const target = sessions.find(
                                (s) => s.id === doc.sessionId || s.companyIds?.includes(doc.ticker)
                              );
                              if (target && setActiveSession) setActiveSession(target);
                              if (setPage) setPage("Research");
                            }}
                            title="Research this document with AI"
                          >
                            <Bot size={13} className="mr-1" />
                            <span>Ask AI</span>
                          </button>

                          {!doc.isSeed && (
                            <button
                              type="button"
                              className="fin-btn fin-btn-ghost fin-btn-xs text-danger"
                              onClick={() => setDocToDelete(doc)}
                              title="Delete Document"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <EmptyState
                      icon={UploadCloud}
                      title={documents.length === 0 ? "Document Library is Empty" : "No Financial Documents Found"}
                      description={
                        documents.length === 0
                          ? "You haven't uploaded any financial documents yet. Upload annual reports or Form 10-K filings to begin vector indexing."
                          : "No documents match your current search and filter criteria. Try adjusting your query or upload a new filing."
                      }
                      actionLabel={documents.length === 0 ? "Upload Financial Document" : "Reset Filters"}
                      onAction={documents.length === 0 ? () => setSubView("upload") : handleResetFilters}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Grid View Alternative */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="fin-doc-grid-card p-4 border rounded-lg bg-card hover:border-accent transition-all cursor-pointer flex flex-col justify-between"
              onClick={() => handleViewDetails(doc)}
            >
              <div>
                <div className="flex-row justify-between items-start mb-2">
                  <Badge variant="primary" size="xs">
                    {doc.ticker}
                  </Badge>
                  {doc.isSeed ? (
                    <Badge variant="teal" size="xs" icon={Sparkles}>
                      Seed Document
                    </Badge>
                  ) : (
                    <Badge variant="success" size="xs">
                      User Ingested
                    </Badge>
                  )}
                </div>

                <div className="flex-row items-center gap-2 mb-2">
                  <FileText size={18} className="text-accent shrink-0" />
                  <strong className="text-xs text-main truncate block" title={doc.name}>
                    {doc.name}
                  </strong>
                </div>

                <p className="text-xs text-muted mb-3">{doc.company} • {doc.docType}</p>

                <div className="p-2.5 border rounded bg-card-subtle text-xs space-y-1 font-mono">
                  <div className="flex-row justify-between">
                    <span className="text-dim">Length:</span>
                    <span className="text-main">{doc.pages} Pages</span>
                  </div>
                  <div className="flex-row justify-between">
                    <span className="text-dim">Chunks:</span>
                    <span className="text-accent">{doc.chunksCount} Vectors</span>
                  </div>
                  <div className="flex-row justify-between">
                    <span className="text-dim">Size:</span>
                    <span className="text-main">{doc.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-subtle flex-row justify-between items-center">
                <Badge
                  variant={doc.status === "Ready" ? "success" : doc.status === "Error" ? "danger" : "warning"}
                  size="xs"
                >
                  {doc.status}
                </Badge>
                <Button variant="ghost" size="xs" icon={ChevronRight} iconPosition="right">
                  Inspect Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(docToDelete)}
        onClose={() => setDocToDelete(null)}
        title="Delete Financial Document"
        description="Are you sure you want to remove this document from the library? Ingested vector chunks will be de-indexed."
        size="sm"
        footer={
          <div className="flex-row justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={() => setDocToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => docToDelete && handleDeleteDocument(docToDelete.id)}
            >
              Confirm Delete
            </Button>
          </div>
        }
      >
        <div className="p-3 border rounded bg-card-subtle text-xs">
          <strong className="text-main block">{docToDelete?.name}</strong>
          <span className="text-muted block mt-1">
            {docToDelete?.company} • {docToDelete?.docType} • {docToDelete?.fileSize}
          </span>
        </div>
      </Dialog>

      {/* Quick Preview Modal */}
      {quickPreviewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
            <div className="p-4 border-b flex-row justify-between items-center">
              <div className="flex-row items-center gap-2">
                <FileText size={18} className="text-accent" />
                <strong className="text-sm text-main">{quickPreviewDoc.name}</strong>
                <Badge variant="teal" size="xs">
                  {quickPreviewDoc.isSeed ? "Seed Demo" : "User File"}
                </Badge>
              </div>
              <div className="flex-row items-center gap-2">
                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => {
                    handleViewDetails(quickPreviewDoc);
                    setQuickPreviewDoc(null);
                  }}
                >
                  Open Full Details
                </Button>
                <button
                  type="button"
                  className="text-muted hover:text-main"
                  onClick={() => setQuickPreviewDoc(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 h-[650px]">
              <DocumentViewer document={quickPreviewDoc} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
