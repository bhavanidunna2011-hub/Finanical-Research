import React, { useState, useMemo, useEffect } from "react";
import {
  Database,
  Search,
  Filter,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Eye,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  Play,
  FileText
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
import EmptyState from "../components/ui/EmptyState";
import {
  getStoredIndexingRecords,
  saveStoredIndexingRecords,
  INDEXING_STATUSES,
  WORKFLOW_STAGES
} from "../data/knowledgeBaseData";
import DocumentIndexingDrawer from "../components/DocumentIndexingDrawer";
import IndexingWorkflowView from "../components/IndexingWorkflowView";
import RetrievalPreview from "./RetrievalPreview";

export default function KnowledgeBase({
  sessions = [],
  activeSession,
  setActiveSession,
  setPage,
  initialTab = "indexing"
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // "indexing" | "workflow" | "retrieval"
  const [records, setRecords] = useState(() => getStoredIndexingRecords());
  const [selectedRecordId, setSelectedRecordId] = useState(records[0]?.id || null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [preselectedRetrievalTarget, setPreselectedRetrievalTarget] = useState("all");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // LocalStorage Persistence
  useEffect(() => {
    saveStoredIndexingRecords(records);
  }, [records]);

  const selectedRecord = useMemo(() => {
    return records.find((r) => r.id === selectedRecordId) || records[0];
  }, [records, selectedRecordId]);

  // Unique Company Options
  const companyOptions = useMemo(() => {
    const map = new Map();
    records.forEach((r) => {
      if (r.company) map.set(r.company, r.ticker || r.company);
    });
    return Array.from(map.entries()).map(([name, ticker]) => ({ name, ticker }));
  }, [records]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Search query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesDoc = r.docName.toLowerCase().includes(q);
        const matchesComp = r.company.toLowerCase().includes(q);
        const matchesTicker = r.ticker?.toLowerCase().includes(q);
        if (!matchesDoc && !matchesComp && !matchesTicker) return false;
      }

      // 2. Company filter
      if (companyFilter !== "all" && r.company !== companyFilter && r.ticker !== companyFilter) {
        return false;
      }

      // 3. Status filter
      if (statusFilter !== "all" && r.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [records, searchQuery, companyFilter, statusFilter]);

  // Overview Metrics
  const totalIndexedDocs = records.filter((r) => r.status === "Indexed").length;
  const totalChunksCount = records.reduce((acc, r) => acc + (r.chunkCount || 0), 0);
  const totalErrorsCount = records.filter((r) => r.status === "Failed").length;
  const totalProcessingCount = records.filter((r) => r.status === "Processing" || r.status === "Pending").length;

  // Handlers
  function handleUpdateRecord(id, updatedFields) {
    const updated = records.map((r) => (r.id === id ? { ...r, ...updatedFields } : r));
    setRecords(updated);
  }

  function handleOpenDrawer(record) {
    setSelectedRecordId(record.id);
    setDrawerOpen(true);
  }

  function handleOpenWorkflow(record) {
    setSelectedRecordId(record.id);
    setActiveTab("workflow");
  }

  function handleOpenRetrieval(record) {
    setSelectedRecordId(record.id);
    setPreselectedRetrievalTarget(record.ticker || "all");
    setActiveTab("retrieval");
  }

  function handleRetryRecord(id) {
    const target = records.find((r) => r.id === id);
    if (!target) return;

    // Simulate progressive recovery
    const updated = {
      ...target,
      status: "Processing",
      workflow: WORKFLOW_STAGES.map((s, idx) => ({
        step: s.step,
        name: s.title,
        status: idx <= 2 ? "completed" : idx === 3 ? "in-progress" : "pending",
        timestamp: new Date().toLocaleTimeString(),
        duration: "Active",
        message: idx === 3 ? "Retrying embeddings generation..." : s.description
      }))
    };
    handleUpdateRecord(id, updated);

    setTimeout(() => {
      const recovered = {
        ...target,
        status: "Indexed",
        chunkCount: target.chunkCount > 0 ? target.chunkCount : 840,
        lastIndexedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + new Date().toLocaleTimeString(),
        errorMessage: null,
        workflow: WORKFLOW_STAGES.map((s) => ({
          step: s.step,
          name: s.title,
          status: "completed",
          timestamp: new Date().toLocaleTimeString(),
          duration: "1.2s",
          message: `${s.description} Successfully verified.`
        }))
      };
      handleUpdateRecord(id, recovered);
    }, 1500);
  }

  return (
    <section className="page fin-knowledge-base-page animate-fadeIn space-y-6">
      {/* Page Title & Main Header */}
      <div className="flex-row items-center justify-between pb-4 border-b border-subtle">
        <div>
          <span className="eyebrow text-accent font-mono text-[10px]">
            MODULE 3: EMBEDDING GENERATION & VECTOR DATABASE
          </span>
          <h1 className="text-2xl font-bold text-main mt-0.5">Knowledge Base</h1>
          <p className="text-xs text-muted max-w-2xl mt-1 leading-relaxed">
            1536-dimensional OpenAI vector embeddings and HNSW graph index management.
            Provides dense semantic indexing, visual workflow tracking, and grounded retrieval preview.
          </p>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex-row items-center gap-1.5 p-1 bg-card-subtle border border-border-color rounded-lg">
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "indexing"
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-main"
            }`}
            onClick={() => setActiveTab("indexing")}
          >
            Document Indexing
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "workflow"
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-main"
            }`}
            onClick={() => setActiveTab("workflow")}
          >
            Indexing Workflow
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === "retrieval"
                ? "bg-accent text-white shadow-sm"
                : "text-muted hover:text-main"
            }`}
            onClick={() => setActiveTab("retrieval")}
          >
            Retrieval Preview
          </button>
        </div>
      </div>

      {/* Overview Cards (Indexed documents, processed chunks, embedding status, indexing errors) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Indexed Documents */}
        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Indexed Documents</span>
          <strong className="text-2xl font-bold font-mono text-main block mt-1">
            {totalIndexedDocs} <span className="text-xs font-normal text-muted">/ {records.length} Filings</span>
          </strong>
          <span className="text-[11px] text-success flex-row items-center gap-1 mt-1 font-semibold">
            <CheckCircle2 size={12} /> HNSW Graph Ready
          </span>
        </div>

        {/* Card 2: Processed Chunks */}
        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Processed Chunks</span>
          <strong className="text-2xl font-bold font-mono text-accent block mt-1">
            {totalChunksCount.toLocaleString()}
          </strong>
          <span className="text-[11px] text-muted block mt-1">
            Mean length ~418 tokens
          </span>
        </div>

        {/* Card 3: Embedding Status */}
        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Embedding Status</span>
          <strong className="text-sm font-bold text-main block mt-1 truncate">
            text-embedding-3-small
          </strong>
          <span className="text-[11px] text-teal flex-row items-center gap-1 mt-1 font-semibold">
            <Sparkles size={12} /> 1536-Dim L2 Normalized
          </span>
        </div>

        {/* Card 4: Indexing Errors */}
        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Indexing Errors</span>
          <strong className={`text-2xl font-bold font-mono block mt-1 ${totalErrorsCount > 0 ? "text-danger" : "text-main"}`}>
            {totalErrorsCount}
          </strong>
          {totalErrorsCount > 0 ? (
            <button
              type="button"
              className="text-[11px] text-warning hover:underline flex-row items-center gap-1 mt-1"
              onClick={() => setStatusFilter("Failed")}
            >
              <AlertTriangle size={12} /> Filter Failed Documents
            </button>
          ) : (
            <span className="text-[11px] text-muted block mt-1">
              Zero active OCR or chunk errors
            </span>
          )}
        </div>
      </div>

      {/* Main Tab 1: Document Indexing Table */}
      {activeTab === "indexing" && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="fin-filter-panel p-4 border rounded-lg bg-card space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search by Document Name or Company */}
              <div className="md:col-span-6 relative">
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

              {/* Filter by Company */}
              <div className="md:col-span-3">
                <select
                  className="fin-select w-full text-xs"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <option value="all">All Companies</option>
                  {companyOptions.map((c) => (
                    <option key={c.ticker} value={c.ticker}>
                      {c.ticker} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Status: Pending, Processing, Indexed, and Failed */}
              <div className="md:col-span-3">
                <select
                  className="fin-select w-full text-xs"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Indexing Statuses</option>
                  {INDEXING_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Summary */}
            {(searchQuery || companyFilter !== "all" || statusFilter !== "all") && (
              <div className="flex-row items-center justify-between text-xs pt-2 border-t border-subtle">
                <span className="text-muted">
                  Showing <strong className="text-main">{filteredRecords.length}</strong> of {records.length} records
                </span>
                <button
                  type="button"
                  className="text-accent hover:underline text-xs"
                  onClick={() => {
                    setSearchQuery("");
                    setCompanyFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Document Indexing Table */}
          <div className="fin-card border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow isHeader>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead numeric>Chunk Count</TableHead>
                  <TableHead>Indexing Status</TableHead>
                  <TableHead>Last Indexed Date</TableHead>
                  <TableHead align="right">Available Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((r) => {
                    const isIndexed = r.status === "Indexed";
                    const isFailed = r.status === "Failed";
                    const isProcessing = r.status === "Processing";
                    const isPending = r.status === "Pending";

                    return (
                      <TableRow key={r.id} className="hover:bg-hover transition-colors">
                        {/* 1. Document Name */}
                        <TableCell>
                          <div className="flex-row items-center gap-2.5">
                            <div className="p-2 rounded bg-accent/10 text-accent shrink-0">
                              <FileText size={16} />
                            </div>
                            <div>
                              <strong
                                className="text-xs text-main hover:text-accent cursor-pointer block truncate max-w-xs"
                                title={r.docName}
                                onClick={() => handleOpenDrawer(r)}
                              >
                                {r.docName}
                              </strong>
                              <span className="text-[11px] text-muted">
                                {r.docType} • {r.fileSize}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* 2. Company */}
                        <TableCell>
                          <div className="flex-row items-center gap-1.5">
                            <Badge variant="default" size="xs">
                              {r.ticker}
                            </Badge>
                            <span className="text-xs font-semibold text-main truncate max-w-[130px]" title={r.company}>
                              {r.company}
                            </span>
                          </div>
                        </TableCell>

                        {/* 3. Chunk Count */}
                        <TableCell numeric>
                          <span className="font-mono text-xs text-accent font-bold">
                            {r.chunkCount > 0 ? r.chunkCount.toLocaleString() : "--"}
                          </span>
                        </TableCell>

                        {/* 4. Indexing Status (Pending, Processing, Indexed, Failed) */}
                        <TableCell>
                          {isIndexed && (
                            <Badge variant="success" size="sm" icon={CheckCircle2}>
                              Indexed
                            </Badge>
                          )}
                          {isFailed && (
                            <Badge variant="danger" size="sm" icon={AlertTriangle}>
                              Failed
                            </Badge>
                          )}
                          {isProcessing && (
                            <Badge variant="warning" size="sm" icon={RefreshCw} className="animate-pulse">
                              Processing
                            </Badge>
                          )}
                          {isPending && (
                            <Badge variant="default" size="sm" icon={Clock}>
                              Pending
                            </Badge>
                          )}
                        </TableCell>

                        {/* 5. Last Indexed Date */}
                        <TableCell>
                          <div className="flex-row items-center gap-1 text-xs text-muted">
                            <Calendar size={12} className="text-dim" />
                            <span>{r.lastIndexedDate}</span>
                          </div>
                        </TableCell>

                        {/* 6. Actions */}
                        <TableCell align="right">
                          <div className="flex-row items-center justify-end gap-1.5">
                            <button
                              type="button"
                              className="fin-btn fin-btn-ghost fin-btn-xs text-accent"
                              onClick={() => handleOpenDrawer(r)}
                              title="Open Indexing Information Drawer"
                            >
                              <Eye size={13} />
                              <span>Details</span>
                            </button>

                            <button
                              type="button"
                              className="fin-btn fin-btn-ghost fin-btn-xs"
                              onClick={() => handleOpenWorkflow(r)}
                              title="View 6-Stage Visual Workflow"
                            >
                              <Play size={13} />
                              <span>Workflow</span>
                            </button>

                            <button
                              type="button"
                              className="fin-btn fin-btn-ghost fin-btn-xs text-teal"
                              onClick={() => handleOpenRetrieval(r)}
                              title="Test Semantic Retrieval Preview"
                            >
                              <Search size={13} />
                              <span>Test Retrieval</span>
                            </button>

                            {isFailed && (
                              <button
                                type="button"
                                className="fin-btn fin-btn-ghost fin-btn-xs text-warning"
                                onClick={() => handleRetryRecord(r.id)}
                                title="Retry Failed Indexing"
                              >
                                <RefreshCw size={13} />
                                <span>Retry</span>
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <EmptyState
                        title="No Knowledge Base Records Found"
                        description="No documents match your filter criteria. Adjust your query or clear the status filter."
                        actionLabel="Reset Filters"
                        onAction={() => {
                          setSearchQuery("");
                          setCompanyFilter("all");
                          setStatusFilter("all");
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Main Tab 2: Visual Workflow (6 Stages) */}
      {activeTab === "workflow" && (
        <IndexingWorkflowView
          record={selectedRecord}
          records={records}
          onSelectRecord={(r) => setSelectedRecordId(r.id)}
          onUpdateRecord={handleUpdateRecord}
          onOpenRetrieval={handleOpenRetrieval}
        />
      )}

      {/* Main Tab 3: Retrieval Preview */}
      {activeTab === "retrieval" && (
        <RetrievalPreview
          initialTarget={preselectedRetrievalTarget}
          records={records}
          setPage={setPage}
        />
      )}

      {/* Document Details Drawer */}
      <DocumentIndexingDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        record={selectedRecord}
        onOpenWorkflow={handleOpenWorkflow}
        onOpenRetrieval={handleOpenRetrieval}
        onRetryIndexing={handleRetryRecord}
      />
    </section>
  );
}
