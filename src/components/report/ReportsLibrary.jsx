import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Edit2,
  Trash2,
  FileCheck2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building2,
  FolderOpen,
  Layers,
  Printer,
  Sparkles,
  RefreshCw,
  LayoutGrid,
  List
} from "lucide-react";
import { REPORT_STATUSES } from "../../data/reportData";

export default function ReportsLibrary({
  reports = [],
  onGenerateReportClick,
  onPreviewReport,
  onDownloadReport,
  onRenameReport,
  onDeleteReport,
  onRetryGeneration
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || report.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const totalReports = reports.length;
  const completedCount = reports.filter((r) => r.status === "Completed").length;
  const generatingCount = reports.filter((r) => r.status === "Generating").length;
  const draftCount = reports.filter((r) => r.status === "Draft").length;
  const failedCount = reports.filter((r) => r.status === "Failed").length;

  function getStatusBadge(status) {
    switch (status) {
      case "Completed":
        return (
          <span className="fin-badge fin-badge-teal fin-badge-xs flex-row items-center gap-1">
            <CheckCircle2 size={11} />
            <span>Completed</span>
          </span>
        );
      case "Generating":
        return (
          <span className="fin-badge fin-badge-purple fin-badge-xs flex-row items-center gap-1 animate-pulse">
            <RefreshCw size={11} className="spin-slow" />
            <span>Generating</span>
          </span>
        );
      case "Draft":
        return (
          <span className="fin-badge fin-badge-outline fin-badge-xs flex-row items-center gap-1 text-warning">
            <Clock size={11} />
            <span>Draft</span>
          </span>
        );
      case "Failed":
        return (
          <span className="fin-badge fin-badge-xs flex-row items-center gap-1 text-danger border border-danger/30 bg-danger/10">
            <AlertTriangle size={11} />
            <span>Failed</span>
          </span>
        );
      default:
        return <span className="fin-badge fin-badge-outline fin-badge-xs">{status}</span>;
    }
  }

  return (
    <div className="reports-library-container animate-fadeIn">
      {/* Top Header & Action Row */}
      <div className="reports-library-header">
        <div className="flex-row items-center gap-3">
          <div className="reports-header-icon-box">
            <FileCheck2 size={22} className="text-teal" />
          </div>
          <div>
            <div className="flex-row items-center gap-2">
              <h1 className="text-xl font-bold text-main leading-tight">Research Reports</h1>
              <span className="fin-badge fin-badge-teal fin-badge-xs">Module 6</span>
              <span className="fin-badge fin-badge-purple fin-badge-xs">Report Agent</span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Publication-ready equity research dossiers • Multi-agent synthesis • Client-side print & PDF export
            </p>
          </div>
        </div>

        {/* Generate Report Primary CTA */}
        <button
          type="button"
          className="fin-btn fin-btn-primary"
          onClick={onGenerateReportClick}
          id="generate-report-btn"
        >
          <Plus size={16} className="mr-1.5" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Metrics & Status Counter Strip */}
      <div className="reports-stats-strip">
        <div
          className={`stat-pill-card ${statusFilter === "All" ? "active" : ""}`}
          onClick={() => setStatusFilter("All")}
        >
          <span className="stat-pill-label">Total Reports</span>
          <strong className="stat-pill-value">{totalReports}</strong>
        </div>

        <div
          className={`stat-pill-card ${statusFilter === "Completed" ? "active" : ""}`}
          onClick={() => setStatusFilter("Completed")}
        >
          <div className="flex-row items-center gap-1">
            <CheckCircle2 size={13} className="text-teal" />
            <span className="stat-pill-label">Completed</span>
          </div>
          <strong className="stat-pill-value text-teal">{completedCount}</strong>
        </div>

        <div
          className={`stat-pill-card ${statusFilter === "Generating" ? "active" : ""}`}
          onClick={() => setStatusFilter("Generating")}
        >
          <div className="flex-row items-center gap-1">
            <RefreshCw size={13} className="text-purple-400" />
            <span className="stat-pill-label">Generating</span>
          </div>
          <strong className="stat-pill-value text-purple-400">{generatingCount}</strong>
        </div>

        <div
          className={`stat-pill-card ${statusFilter === "Draft" ? "active" : ""}`}
          onClick={() => setStatusFilter("Draft")}
        >
          <div className="flex-row items-center gap-1">
            <Clock size={13} className="text-warning" />
            <span className="stat-pill-label">Drafts</span>
          </div>
          <strong className="stat-pill-value text-warning">{draftCount}</strong>
        </div>

        <div
          className={`stat-pill-card ${statusFilter === "Failed" ? "active" : ""}`}
          onClick={() => setStatusFilter("Failed")}
        >
          <div className="flex-row items-center gap-1">
            <AlertTriangle size={13} className="text-danger" />
            <span className="stat-pill-label">Failed</span>
          </div>
          <strong className="stat-pill-value text-danger">{failedCount}</strong>
        </div>
      </div>

      {/* Search and Filters Controls Toolbar */}
      <div className="reports-filter-bar">
        {/* Search input */}
        <div className="reports-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="reports-search-input"
            placeholder="Search reports by title, company, or session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              ×
            </button>
          )}
        </div>

        {/* Status filter dropdown */}
        <div className="flex-row items-center gap-2">
          <Filter size={14} className="text-muted" />
          <select
            className="fin-select fin-select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses ({totalReports})</option>
            <option value="Completed">Completed ({completedCount})</option>
            <option value="Generating">Generating ({generatingCount})</option>
            <option value="Draft">Drafts ({draftCount})</option>
            <option value="Failed">Failed ({failedCount})</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="view-mode-toggle-group">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Table view"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Empty State when no reports match */}
      {filteredReports.length === 0 && (
        <div className="reports-empty-state">
          <div className="empty-icon-wrap">
            <FileText size={36} className="text-muted" />
          </div>
          <h3 className="text-base font-bold text-main mt-3">No Reports Found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1 leading-relaxed">
            {searchQuery || statusFilter !== "All"
              ? "No research reports matched your search or status filters. Try clearing your filters."
              : "No research reports generated yet. Click 'Generate Report' to create your first dossier."}
          </p>
          {(searchQuery || statusFilter !== "All") && (
            <button
              type="button"
              className="fin-btn fin-btn-secondary fin-btn-xs mt-3"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Grid Cards View */}
      {viewMode === "grid" && filteredReports.length > 0 && (
        <div className="reports-grid">
          {filteredReports.map((report) => {
            const isGenerating = report.status === "Generating";
            const isFailed = report.status === "Failed";
            const isCompleted = report.status === "Completed";

            return (
              <div key={report.id} className="report-card animate-fadeIn">
                {/* Card Header */}
                <div className="report-card-top">
                  <div className="flex-row items-center gap-1.5 flex-1 min-w-0">
                    <Building2 size={14} className="text-teal flex-shrink-0" />
                    <span className="company-tag truncate font-semibold text-xs text-main">
                      {report.company}
                    </span>
                    {report.companyIds && (
                      <div className="flex-row gap-1">
                        {report.companyIds.map((cid) => (
                          <span key={cid} className="ticker-pill text-[10px] font-mono">
                            {cid}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>{getStatusBadge(report.status)}</div>
                </div>

                {/* Report Title */}
                <h3 className="report-card-title mt-2" title={report.title}>
                  {report.title}
                </h3>

                {/* Summary or Failure snippet */}
                {isFailed ? (
                  <div className="report-failure-notice mt-2">
                    <AlertTriangle size={12} className="text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-danger leading-relaxed">
                      {report.failureReason || "Synthesis error during multi-agent extraction."}
                    </p>
                  </div>
                ) : (
                  <p className="report-card-desc mt-1.5">
                    {report.summarySnippet || "Multi-agent financial dossier compiled from audited filings."}
                  </p>
                )}

                {/* Progress bar if generating */}
                {isGenerating && (
                  <div className="report-generating-box mt-3">
                    <div className="flex-row justify-between items-center text-[11px] text-muted mb-1">
                      <span className="font-medium text-purple-400">Synthesis in progress</span>
                      <span className="font-mono">{report.generationProgress || 65}%</span>
                    </div>
                    <div className="fin-progress-track">
                      <div
                        className="fin-progress-bar-purple"
                        style={{ width: `${report.generationProgress || 65}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted italic mt-1 block truncate">
                      {report.generationStage || "Collating section disclosures..."}
                    </span>
                  </div>
                )}

                {/* Metadata details */}
                <div className="report-card-meta mt-3">
                  <div className="meta-line">
                    <span className="meta-lbl">Session:</span>
                    <span className="meta-val truncate" title={report.sessionTitle}>
                      {report.sessionTitle}
                    </span>
                  </div>
                  <div className="meta-line">
                    <span className="meta-lbl">Created:</span>
                    <span className="meta-val font-mono">{report.createdAt}</span>
                  </div>
                  <div className="meta-line">
                    <span className="meta-lbl">Sections:</span>
                    <span className="meta-val">{report.sections?.length || 5} sections</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="report-card-actions mt-4 pt-3 border-t border-subtle">
                  <div className="flex-row gap-2">
                    {isCompleted && (
                      <button
                        type="button"
                        className="fin-btn fin-btn-primary fin-btn-xs"
                        onClick={() => onPreviewReport(report)}
                        title="Preview Analyst Research Report"
                      >
                        <Eye size={12} className="mr-1" />
                        <span>Preview</span>
                      </button>
                    )}

                    {report.status === "Draft" && (
                      <button
                        type="button"
                        className="fin-btn fin-btn-secondary fin-btn-xs"
                        onClick={() => onPreviewReport(report)}
                        title="Preview or edit draft report"
                      >
                        <Eye size={12} className="mr-1" />
                        <span>View Draft</span>
                      </button>
                    )}

                    {isFailed && onRetryGeneration && (
                      <button
                        type="button"
                        className="fin-btn fin-btn-primary fin-btn-xs"
                        onClick={() => onRetryGeneration(report.id)}
                        title="Retry report generation pipeline"
                      >
                        <RefreshCw size={12} className="mr-1" />
                        <span>Retry</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="fin-btn fin-btn-secondary fin-btn-xs"
                      onClick={() => onDownloadReport(report)}
                      title="Download PDF or open print workflow"
                    >
                      <Download size={12} className="mr-1" />
                      <span>PDF</span>
                    </button>
                  </div>

                  <div className="flex-row gap-1">
                    <button
                      type="button"
                      className="card-icon-action"
                      onClick={() => onRenameReport(report)}
                      title="Rename report"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      className="card-icon-action text-danger hover:bg-danger/10"
                      onClick={() => onDeleteReport(report)}
                      title="Delete report"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && filteredReports.length > 0 && (
        <div className="reports-table-wrapper animate-fadeIn">
          <table className="reports-custom-table">
            <thead>
              <tr>
                <th>Report Title</th>
                <th>Company</th>
                <th>Associated Session</th>
                <th>Created Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="flex-row items-center gap-2">
                      <FileText size={15} className="text-teal flex-shrink-0" />
                      <div>
                        <strong className="text-sm text-main block">{report.title}</strong>
                        <span className="text-[11px] text-muted">
                          {report.sections?.length || 5} sections included
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-xs text-main">{report.company}</span>
                    <span className="block text-[10px] font-mono text-muted">
                      {report.companyIds?.join(", ")}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-muted max-w-[200px] truncate block" title={report.sessionTitle}>
                      {report.sessionTitle}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-muted">{report.createdAt}</span>
                  </td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td>
                    <div className="flex-row justify-end items-center gap-1.5">
                      <button
                        type="button"
                        className="fin-btn fin-btn-secondary fin-btn-xs"
                        onClick={() => onPreviewReport(report)}
                        title="Preview report"
                      >
                        <Eye size={12} className="mr-1" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        className="fin-btn fin-btn-secondary fin-btn-xs"
                        onClick={() => onDownloadReport(report)}
                        title="Download / Print PDF"
                      >
                        <Download size={12} />
                      </button>

                      <button
                        type="button"
                        className="card-icon-action"
                        onClick={() => onRenameReport(report)}
                        title="Rename"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        type="button"
                        className="card-icon-action text-danger"
                        onClick={() => onDeleteReport(report)}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
