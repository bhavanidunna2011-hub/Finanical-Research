import React from "react";
import {
  FileText,
  Building2,
  Bot,
  PlusCircle,
  Upload,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileCheck2,
  Trash2,
  ExternalLink,
  BarChart3
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
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
import { AGENT_PIPELINE_STAGES } from "../data/seedData";
import { getStoredReports } from "../data/reportData";

export default function Dashboard({
  sessions = [],
  documents = [],
  setPage,
  setActiveSession,
  onDeleteSession,
  onOpenUploadModal,
  onOpenCreateModal
}) {
  // Derive distinct companies from user's sessions & uploaded documents
  const entitiesSet = new Set();
  sessions.forEach((s) => {
    if (s.company && s.company !== "General") entitiesSet.add(s.company);
    if (s.companyIds && Array.isArray(s.companyIds)) {
      s.companyIds.forEach((id) => entitiesSet.add(id));
    }
  });
  documents.forEach((d) => {
    if (d.ticker) entitiesSet.add(d.ticker);
    else if (d.company) entitiesSet.add(d.company);
  });
  const entitiesList = Array.from(entitiesSet);

  const totalChunks = documents.reduce((acc, c) => acc + (c.chunksCount || c.chunks || 0), 0);
  const totalPages = documents.reduce((acc, c) => acc + (c.pages || 0), 0);

  // Recent Documents Data (computed from actual uploaded documents)
  const recentDocuments = documents.slice(0, 5);

  // Recent Reports Data from getStoredReports
  const storedReports = getStoredReports();
  const recentReports = storedReports.slice(0, 5);

  return (
    <div className="fin-dashboard-page animate-fadeIn p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-subtle">
        <div>
          <h1 className="text-xl font-bold text-main">Financial Research Workspace</h1>
          <p className="text-xs text-muted mt-1 leading-relaxed max-w-2xl">
            Multi-agent intelligence extracting audited statement disclosures, forensic risks, and peer benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={onOpenCreateModal || (() => setPage("Create Session"))}
          >
            New Research Session
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={Upload}
            onClick={onOpenUploadModal}
          >
            Upload Filing
          </Button>
        </div>
      </div>

      {/* 4 Core Financial Key Metrics Cards (Factual, No Fake Progress Bars) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-card border border-subtle">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Active Sessions</span>
            <FileText size={16} className="text-teal" />
          </div>
          <div className="text-2xl font-bold text-main">{sessions.length}</div>
          <div className="text-[11px] text-muted mt-1">
            {sessions.length === 0 ? "0 active workspaces" : `${sessions.length} workspaces configured`}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card border border-subtle">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Ingested Filings</span>
            <Building2 size={16} className="text-teal" />
          </div>
          <div className="text-2xl font-bold text-main">{documents.length}</div>
          <div className="text-[11px] text-muted mt-1">
            {documents.length === 0 ? "No filings loaded" : `${totalPages.toLocaleString()} pages • ${totalChunks.toLocaleString()} chunks`}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card border border-subtle">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Analyzed Entities</span>
            <BarChart3 size={16} className="text-teal" />
          </div>
          <div className="text-2xl font-bold text-main">{entitiesList.length}</div>
          <div className="text-[11px] text-muted mt-1">
            {entitiesList.length > 0 ? entitiesList.slice(0, 3).join(", ") : "None assigned"}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card border border-subtle">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Reports Generated</span>
            <FileCheck2 size={16} className="text-teal" />
          </div>
          <div className="text-2xl font-bold text-main">{recentReports.length}</div>
          <div className="text-[11px] text-muted mt-1">
            {recentReports.length === 0 ? "No reports exported" : "Cited & PDF ready"}
          </div>
        </div>
      </div>

      {/* Primary Workflow Actions (Clean, Non-Decorative) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-lg bg-card border border-subtle hover:border-teal/40 transition-colors cursor-pointer group"
          onClick={onOpenUploadModal}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-teal font-semibold">1. INGESTION</span>
            <Upload size={15} className="text-muted group-hover:text-teal transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-main">Upload Financial Filings</h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Upload Form 10-K, annual reports, or balance sheets in PDF format for table extraction and vector indexing.
          </p>
          <span className="text-xs text-teal font-medium flex items-center gap-1 mt-3">
            Upload filing <ArrowRight size={13} />
          </span>
        </div>

        <div
          className="p-4 rounded-lg bg-card border border-subtle hover:border-teal/40 transition-colors cursor-pointer group"
          onClick={onOpenCreateModal || (() => setPage("Create Session"))}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-teal font-semibold">2. WORKSPACE</span>
            <PlusCircle size={15} className="text-muted group-hover:text-teal transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-main">Create Research Session</h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Configure target entities, research scope, and assign relevant filings to begin source-grounded analysis.
          </p>
          <span className="text-xs text-teal font-medium flex items-center gap-1 mt-3">
            Initialize session <ArrowRight size={13} />
          </span>
        </div>

        <div
          className="p-4 rounded-lg bg-card border border-subtle hover:border-teal/40 transition-colors cursor-pointer group"
          onClick={() => setPage("AI Research")}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-teal font-semibold">3. REASONING</span>
            <Bot size={15} className="text-muted group-hover:text-teal transition-colors" />
          </div>
          <h3 className="text-sm font-semibold text-main">Ask in AI Research</h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Query financial statements with strict source citations, audited footnote inspections, and comparative ratios.
          </p>
          <span className="text-xs text-teal font-medium flex items-center gap-1 mt-3">
            Open AI research <ArrowRight size={13} />
          </span>
        </div>
      </div>

      {/* Two Column Section: Recent Research Sessions & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Research Sessions Table */}
        <div className="rounded-lg bg-card border border-subtle overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-subtle">
            <div>
              <h2 className="text-sm font-semibold text-main">Recent Research Sessions</h2>
              <p className="text-xs text-muted">Configured workspaces ({sessions.length})</p>
            </div>
            <Button
              variant="secondary"
              size="xs"
              icon={PlusCircle}
              onClick={onOpenCreateModal || (() => setPage("Create Session"))}
            >
              New
            </Button>
          </div>

          <div className="p-0">
            {sessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>Session</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead align="right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.slice(0, 5).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <strong className="block text-xs font-semibold text-main truncate max-w-[180px]">{s.title}</strong>
                        <span className="text-[11px] text-muted">{s.company || "General"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" size="xs">
                          {s.researchType || "Analysis"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success" size="xs" dot>
                          {s.status || "Ready"}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => {
                              setActiveSession(s);
                              setPage("AI Research");
                            }}
                          >
                            Open
                          </Button>
                          {onDeleteSession && (
                            <button
                              type="button"
                              className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                              title="Delete session"
                              onClick={() => {
                                if (window.confirm(`Delete "${s.title}"?`)) {
                                  onDeleteSession(s.id);
                                }
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 text-center text-xs text-muted">
                No sessions created yet. Click New to create your first session.
              </div>
            )}
          </div>
        </div>

        {/* Recent Uploaded Documents Table */}
        <div className="rounded-lg bg-card border border-subtle overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-subtle">
            <div>
              <h2 className="text-sm font-semibold text-main">Recent Ingested Filings</h2>
              <p className="text-xs text-muted">Available in research library ({documents.length})</p>
            </div>
            <Button
              variant="secondary"
              size="xs"
              icon={Upload}
              onClick={onOpenUploadModal}
            >
              Upload
            </Button>
          </div>

          <div className="p-0">
            {recentDocuments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>Filing</TableHead>
                    <TableHead>Ticker</TableHead>
                    <TableHead align="right">Chunks</TableHead>
                    <TableHead align="right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <strong className="block text-xs font-semibold text-main truncate max-w-[180px]" title={doc.name}>
                          {doc.name}
                        </strong>
                        <span className="text-[11px] text-muted">{doc.company || "Corporate Filing"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="teal" size="xs">
                          {doc.ticker || doc.docType || "FILING"}
                        </Badge>
                      </TableCell>
                      <TableCell align="right" numeric>
                        <span className="text-xs font-mono">
                          {(doc.chunksCount || doc.chunks || 0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => setPage("Documents")}
                        >
                          Inspect
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 text-center text-xs text-muted">
                No documents uploaded yet. Upload a Form 10-K or annual report to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specialized Financial Agents Status */}
      <div className="rounded-lg bg-card border border-subtle p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-main">Specialized Financial Agents</h2>
            <p className="text-xs text-muted">Autonomous multi-agent analytical pipeline</p>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setPage("Settings")}
          >
            System Diagnostics →
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {AGENT_PIPELINE_STAGES.map((agent) => (
            <div key={agent.id} className="p-3 rounded border border-subtle bg-bg-deep/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-main truncate">{agent.name}</span>
                <span className="w-2 h-2 rounded-full bg-success inline-block shrink-0" />
              </div>
              <p className="text-[11px] text-muted line-clamp-2 leading-tight">
                {agent.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
