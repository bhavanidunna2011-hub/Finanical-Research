import React, { useState, useMemo } from "react";
import {
  Search,
  PlusCircle,
  LayoutGrid,
  List,
  Filter,
  Calendar,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
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
import { SEED_COMPANIES } from "../data/seedData";

export default function WorkspaceDirectory({
  sessions,
  activeSession,
  onSelectSession,
  onViewSessionDetails,
  onLaunchInteractive,
  onOpenCreateModal,
  onDuplicateSession,
  onDeleteSession
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Extract unique companies from sessions
  const companyOptions = useMemo(() => {
    const set = new Set();
    sessions.forEach((s) => {
      if (s.company) set.add(s.company);
    });
    return Array.from(set);
  }, [sessions]);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title?.toLowerCase().includes(q) ||
        s.company?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.researchType?.toLowerCase().includes(q) ||
        s.companyIds?.some((id) => id.toLowerCase().includes(q));

      // Status
      const matchesStatus =
        statusFilter === "all" ||
        s.status?.toLowerCase() === statusFilter.toLowerCase();

      // Company
      const matchesCompany =
        companyFilter === "all" || s.company === companyFilter;

      // Date filter (mock logic)
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = s.createdAt?.includes("Today") || s.createdAt === new Date().toLocaleDateString();
      }

      return matchesSearch && matchesStatus && matchesCompany && matchesDate;
    });
  }, [sessions, searchQuery, statusFilter, companyFilter, dateFilter]);

  // Recent 3 sessions for quick access
  const recentSessions = useMemo(() => {
    return sessions.slice(0, 3);
  }, [sessions]);

  function handleConfirmDelete() {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete.id);
      setSessionToDelete(null);
    }
  }

  return (
    <div className="fin-workspace-directory animate-fadeIn">
      {/* Page Header */}
      <div className="fin-workspace-hero">
        <div className="hero-left">
          <span className="fin-eyebrow">MODULE 1 • WORKSPACE DIRECTORY</span>
          <h1 className="hero-page-title">Research Workspace</h1>
          <p className="hero-page-desc">
            Collaborative multi-agent financial workspace for automated filing extraction, peer benchmarking, forensic risk audits, and institutional session management.
          </p>
        </div>

        <div className="hero-right">
          <Button
            variant="teal"
            size="md"
            icon={PlusCircle}
            onClick={onOpenCreateModal}
          >
            New Research Session
          </Button>
        </div>
      </div>

      {/* Demo storage disclosure badge */}
      <div className="fin-storage-notice mt-4">
        <ShieldCheck size={14} className="text-teal" />
        <span className="text-xs">
          <strong>Session Management:</strong> Research sessions are persisted locally in your browser workspace. All financial insights cite audited SEC Form 10-K and Annual Reports.
        </span>
      </div>

      {/* Recently Accessed Sessions Bar */}
      {recentSessions.length > 0 && (
        <div className="recent-sessions-bar mt-6">
          <div className="recent-bar-header">
            <Clock size={14} className="text-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Recently Accessed Sessions
            </span>
          </div>

          <div className="recent-chips-grid mt-2">
            {recentSessions.map((s) => {
              const isCurrent = activeSession?.id === s.id;
              return (
                <div
                  key={s.id}
                  className={`recent-session-chip ${isCurrent ? "active" : ""}`}
                  onClick={() => onViewSessionDetails(s)}
                  title="Open session details"
                >
                  <div className="chip-badge">
                    {s.companyIds?.[0] || "RES"}
                  </div>
                  <div className="chip-content">
                    <strong className="chip-title truncate">{s.title}</strong>
                    <span className="chip-sub">
                      {s.company || "General"} • {s.documents?.length || 1} Doc(s)
                    </span>
                  </div>
                  <ChevronRight size={14} className="chip-arrow text-muted" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Filter Control Bar */}
      <div className="fin-filter-controls-card mt-6">
        <div className="filter-controls-row">
          {/* Search Box */}
          <div className="filter-search-box">
            <Search size={15} className="filter-search-icon" />
            <input
              type="text"
              className="filter-search-input"
              placeholder="Search sessions by title, company, or objective..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="filter-search-clear"
                onClick={() => setSearchQuery("")}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filters: Status, Company, Date */}
          <div className="filter-dropdowns-group">
            <div className="filter-select-wrap">
              <label className="filter-label">Status:</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Analysis Complete">Analysis Complete</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="filter-select-wrap">
              <label className="filter-label">Company:</label>
              <select
                className="filter-select"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                <option value="all">All Companies</option>
                {companyOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrap">
              <label className="filter-label">Date:</label>
              <select
                className="filter-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="view-mode-toggle-group">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filters Display */}
        <div className="filter-summary-row mt-3">
          <span className="text-xs text-muted">
            Showing <strong>{filteredSessions.length}</strong> of <strong>{sessions.length}</strong> research sessions
          </span>

          {(searchQuery || statusFilter !== "all" || companyFilter !== "all" || dateFilter !== "all") && (
            <button
              type="button"
              className="clear-all-filters-btn"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCompanyFilter("all");
                setDateFilter("all");
              }}
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Sessions Display: Grid View or List View */}
      <div className="mt-6">
        {filteredSessions.length > 0 ? (
          viewMode === "grid" ? (
            /* Grid View */
            <div className="sessions-directory-grid">
              {filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className="directory-session-card"
                  hover
                >
                  <CardContent>
                    {/* Top Row: Type and Status */}
                    <div className="card-top-row">
                      <div className="flex-row items-center gap-1.5">
                        <Building2 size={16} className="text-accent" />
                        <Badge variant="teal" size="sm">
                          {session.companyIds?.[0] || "Target"}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {session.researchType || "Analysis"}
                        </Badge>
                      </div>

                      <Badge
                        variant={session.status === "Analysis Complete" ? "success" : "primary"}
                        size="sm"
                        dot
                      >
                        {session.status || "Ready"}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3
                      className="session-name-title mt-3"
                      onClick={() => onViewSessionDetails(session)}
                      title="Click to view session details"
                    >
                      {session.title}
                    </h3>

                    {/* Company */}
                    <p className="session-entity-text mt-1">
                      <strong>Entity:</strong> {session.company || "Not specified"}
                    </p>

                    {/* Description / Objective */}
                    <p className="session-desc-text mt-2">
                      {session.description || "Comprehensive multi-agent financial filing evaluation."}
                    </p>

                    {/* Document count & Last updated date */}
                    <div className="session-card-meta-row mt-4">
                      <span className="meta-pill">
                        <FileText size={12} className="text-accent mr-1" />
                        {session.documents?.length || 1} Document(s)
                      </span>
                      <span className="meta-pill text-muted">
                        <Calendar size={12} className="mr-1" />
                        {session.createdAt || "Recently"}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="session-card-actions-row mt-4">
                      <div className="flex-row items-center gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onViewSessionDetails(session)}
                        >
                          Session Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={ArrowRight}
                          iconPosition="right"
                          onClick={() => {
                            onSelectSession(session);
                            if (onLaunchInteractive) onLaunchInteractive(session);
                          }}
                        >
                          Workspace
                        </Button>
                      </div>

                      <div className="flex-row items-center gap-1">
                        <button
                          type="button"
                          className="fin-icon-tool-btn"
                          title="Duplicate session"
                          onClick={() => onDuplicateSession(session.id)}
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          type="button"
                          className="fin-icon-tool-btn delete"
                          title="Delete session"
                          onClick={() => setSessionToDelete(session)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow isHeader>
                      <TableHead>Session Name & Objective</TableHead>
                      <TableHead>Target Entity</TableHead>
                      <TableHead>Research Scope</TableHead>
                      <TableHead align="center">Documents</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead align="right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div
                            className="cursor-pointer"
                            onClick={() => onViewSessionDetails(session)}
                          >
                            <strong className="block text-sm font-semibold hover:text-accent">
                              {session.title}
                            </strong>
                            <span className="text-xs text-muted block truncate max-w-[320px]">
                              {session.description || "No objective provided."}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex-row items-center gap-1.5">
                            <Building2 size={14} className="text-accent" />
                            <span className="text-xs font-semibold">{session.company || "General"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" size="sm">
                            {session.researchType || "Analysis"}
                          </Badge>
                        </TableCell>
                        <TableCell align="center" numeric>
                          <span className="text-xs font-mono font-semibold">
                            {session.documents?.length || 1}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted">{session.createdAt || "Recently"}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={session.status === "Analysis Complete" ? "success" : "primary"}
                            size="sm"
                            dot
                          >
                            {session.status || "Ready"}
                          </Badge>
                        </TableCell>
                        <TableCell align="right">
                          <div className="flex-row justify-end items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewSessionDetails(session)}
                            >
                              Details
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                onSelectSession(session);
                                if (onLaunchInteractive) onLaunchInteractive(session);
                              }}
                            >
                              Open
                            </Button>
                            <button
                              type="button"
                              className="fin-icon-tool-btn"
                              title="Duplicate session"
                              onClick={() => onDuplicateSession(session.id)}
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              type="button"
                              className="fin-icon-tool-btn delete"
                              title="Delete session"
                              onClick={() => setSessionToDelete(session)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        ) : (
          /* Empty State */
          <Card>
            <CardContent>
              {searchQuery || statusFilter !== "all" || companyFilter !== "all" || dateFilter !== "all" ? (
                <EmptyState
                  icon={Search}
                  title="No Matching Research Sessions Found"
                  description="No sessions match your search query or filter criteria. Try adjusting or clearing your filters."
                  actionLabel="Reset Filters"
                  onAction={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCompanyFilter("all");
                    setDateFilter("all");
                  }}
                />
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No Research Sessions Available"
                  description="You have not created any research sessions yet. Launch your first session to begin multi-agent financial extraction and audit."
                  actionLabel="Create New Session"
                  onAction={onOpenCreateModal}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(sessionToDelete)}
        onClose={() => setSessionToDelete(null)}
        title="Delete Research Session"
        description="Are you sure you want to delete this research session? All associated local analysis metadata, citations, and conversation history will be permanently removed."
        size="sm"
        footer={
          <div className="flex-row justify-end gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSessionToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </Button>
          </div>
        }
      >
        {sessionToDelete && (
          <div className="fin-delete-dialog-content">
            <div className="delete-target-box">
              <strong className="block text-sm text-main">{sessionToDelete.title}</strong>
              <span className="text-xs text-muted block mt-1">
                Target Entity: <strong>{sessionToDelete.company || "General"}</strong> • Created: {sessionToDelete.createdAt}
              </span>
            </div>
            <p className="text-xs text-muted mt-3">
              Note: This action only modifies local demo storage and does not alter audited corporate filings.
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
