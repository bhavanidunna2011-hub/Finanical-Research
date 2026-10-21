import React, { useState } from "react";
import {
  FileText,
  Building2,
  Bot,
  PlusCircle,
  Upload,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  FileCheck2,
  Trash2,
  Clock,
  Printer,
  UploadCloud,
  RotateCcw,
  Compass
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
import { SEED_COMPANIES, AGENT_PIPELINE_STAGES } from "../data/seedData";
import { getStoredReports } from "../data/reportData";

export default function Dashboard({
  sessions = [],
  documents = [],
  setPage,
  setActiveSession,
  onDeleteSession,
  onOpenUploadModal,
  onOpenCreateModal,
  onResetToFresh,
  onLoadSampleData
}) {
  const [showDemoBenchmarks, setShowDemoBenchmarks] = useState(false);

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

  const isWorkspaceFresh = sessions.length === 0 && documents.length === 0;

  function handleQuickStart(companyKey1, companyKey2) {
    let matchedSession;
    if (companyKey2) {
      matchedSession = sessions.find(
        (s) => s.companyIds?.includes(companyKey1) && s.companyIds?.includes(companyKey2)
      );
    } else {
      matchedSession = sessions.find((s) => s.companyIds?.includes(companyKey1));
    }

    if (matchedSession) {
      setActiveSession(matchedSession);
      setPage("Research Workspace", "interactive");
    } else {
      const comp = SEED_COMPANIES[companyKey1] || { name: companyKey1, id: companyKey1 };
      const newSession = {
        id: crypto.randomUUID(),
        title: companyKey2
          ? `${SEED_COMPANIES[companyKey1]?.name || companyKey1} vs ${SEED_COMPANIES[companyKey2]?.name || companyKey2} Benchmark`
          : `${comp?.name} Analysis`,
        company: comp?.name || "Target",
        companyIds: companyKey2 ? [companyKey1, companyKey2] : [companyKey1],
        researchType: companyKey2 ? "Peer Comparison" : "Company Analysis",
        status: "Analysis Complete",
        createdAt: new Date().toLocaleDateString(),
        documents: [
          { name: comp?.filingDocName || `${comp?.name}-Filing.pdf`, size: "18.4 MB", pages: comp?.pageCount || 240, chunks: comp?.chunkCount || 800, status: "Indexed" }
        ],
        agentStatus: {
          documentAgent: "Completed",
          extractionAgent: "Completed",
          redFlagAgent: "Completed",
          comparisonAgent: companyKey2 ? "Completed" : "N/A",
          researchAgent: "Ready",
          reportAgent: "Generated"
        }
      };
      setActiveSession(newSession);
      setPage("Research Workspace", "interactive");
    }
  }

  return (
    <div className="fin-dashboard-page animate-fadeIn">
      {/* Top Banner & Quick Actions Bar */}
      <div className="fin-dashboard-hero">
        <div className="hero-content">
          <div className="flex-row items-center gap-2 mb-1">
            <span className="fin-eyebrow">FINRESEARCH AI • ENTERPRISE ANALYTICS CORE</span>
            {isWorkspaceFresh && (
              <Badge variant="teal" size="sm">Fresh Workspace</Badge>
            )}
          </div>
          <h2 className="hero-title">Multi-Agent Financial Research System</h2>
          <p className="hero-desc">
            Collaborative AI analyst teams extracting GAAP/IFRS ratios, conducting forensic risk scans, and generating institutionally grounded research dossiers.
          </p>
        </div>

        <div className="hero-actions">
          <Button
            variant="teal"
            size="md"
            icon={PlusCircle}
            onClick={onOpenCreateModal || (() => setPage("Create Session"))}
          >
            Create Research Session
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={Upload}
            onClick={onOpenUploadModal}
          >
            Upload Document
          </Button>

          <Button
            variant="ghost"
            size="md"
            icon={Bot}
            onClick={() => setPage("Multi-Agent Orchestrator")}
          >
            View Orchestrator
          </Button>

          {!isWorkspaceFresh && (
            <Button
              variant="danger-outline"
              size="md"
              icon={Trash2}
              onClick={() => {
                if (window.confirm("Reset entire workspace to fresh state? All local sessions and documents will be cleared.")) {
                  onResetToFresh?.();
                }
              }}
              title="Reset all data to empty/fresh state"
            >
              Reset to Fresh
            </Button>
          )}
        </div>
      </div>

      {/* 4 Core Financial Key Metrics Cards (Dynamic based on user data) */}
      <div className="fin-metrics-grid mt-6">
        <Card className="metric-card">
          <CardContent>
            <div className="metric-header">
              <span className="metric-title">Total Research Sessions</span>
              <div className="metric-icon-wrap bg-blue-subtle text-accent">
                <FileText size={18} />
              </div>
            </div>
            <div className="metric-value">{sessions.length}</div>
            <div className="metric-subtext">
              <span className="text-teal font-semibold">
                {sessions.length === 0 ? "0 active workspaces" : `${sessions.length} active workspaces`}
              </span> • Saved locally
            </div>
            <div className="metric-progress-bar mt-3">
              <div
                className="metric-progress-fill bg-accent"
                style={{ width: sessions.length > 0 ? "100%" : "0%" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent>
            <div className="metric-header">
              <span className="metric-title">Uploaded Documents</span>
              <div className="metric-icon-wrap bg-teal-subtle text-teal">
                <Building2 size={18} />
              </div>
            </div>
            <div className="metric-value">{documents.length} Filings</div>
            <div className="metric-subtext">
              {documents.length === 0 ? (
                <span>No filings uploaded yet</span>
              ) : (
                <span>{totalPages.toLocaleString()} Pages • {totalChunks.toLocaleString()} Dense Vectors</span>
              )}
            </div>
            <div className="metric-progress-bar mt-3">
              <div
                className="metric-progress-fill bg-teal"
                style={{ width: documents.length > 0 ? "100%" : "0%" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent>
            <div className="metric-header">
              <span className="metric-title">Companies Under Analysis</span>
              <div className="metric-icon-wrap bg-purple-subtle text-purple">
                <BarChart3 size={18} />
              </div>
            </div>
            <div className="metric-value">{entitiesList.length} Entities</div>
            {entitiesList.length > 0 ? (
              <div className="metric-tickers mt-1">
                {entitiesList.slice(0, 4).map((ent) => (
                  <Badge key={ent} variant="outline" size="sm">{ent}</Badge>
                ))}
              </div>
            ) : (
              <div className="metric-subtext mt-1 text-muted">
                No corporate entities added yet
              </div>
            )}
            <div className="metric-progress-bar mt-3">
              <div
                className="metric-progress-fill bg-purple"
                style={{ width: entitiesList.length > 0 ? "100%" : "0%" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent>
            <div className="metric-header">
              <span className="metric-title">Reports Generated</span>
              <div className="metric-icon-wrap bg-success-subtle text-success">
                <FileCheck2 size={18} />
              </div>
            </div>
            <div className="metric-value">{recentReports.length} Dossiers</div>
            <div className="metric-subtext">
              {recentReports.length === 0 ? (
                <span>No reports generated yet</span>
              ) : (
                <span className="text-teal font-semibold">100% SEC/IFRS Grounded • PDF Ready</span>
              )}
            </div>
            <div className="metric-progress-bar mt-3">
              <div
                className="metric-progress-fill bg-success"
                style={{ width: recentReports.length > 0 ? "100%" : "0%" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fresh Workspace: Getting Started Guide */}
      <div className="fin-section-block mt-8">
        <div className="section-head-row">
          <div>
            <span className="fin-section-eyebrow">WORKFLOW GUIDE • FRESH ANALYTICS WORKSPACE</span>
            <h3 className="fin-section-heading">How to Start Your Financial Research</h3>
            <p className="fin-section-sub">
              Your application is ready for your data. Follow these three steps to begin multi-agent analysis:
            </p>
          </div>
        </div>

        <div className="fin-launchpad-grid mt-4">
          <Card className="fin-launchpad-card" hover onClick={onOpenUploadModal}>
            <CardContent>
              <div className="launchpad-top">
                <Badge variant="teal" size="sm">Step 1 • Ingestion</Badge>
                <span className="text-xs text-muted font-mono">Module 2</span>
              </div>
              <h4 className="launchpad-title mt-2">1. Upload Financial Filings</h4>
              <p className="launchpad-desc mt-1.5">
                Upload audited annual reports, SEC Form 10-K, or earnings transcripts in PDF format. The Document Agent extracts tables and creates vector chunks.
              </p>
              <div className="launchpad-action mt-4">
                <span className="text-xs font-semibold text-accent flex-row items-center gap-1">
                  Upload Filing Now <ArrowRight size={13} />
                </span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="fin-launchpad-card"
            hover
            onClick={onOpenCreateModal || (() => setPage("Create Session"))}
          >
            <CardContent>
              <div className="launchpad-top">
                <Badge variant="primary" size="sm">Step 2 • Configuration</Badge>
                <span className="text-xs text-muted font-mono">Module 1</span>
              </div>
              <h4 className="launchpad-title mt-2">2. Create Research Session</h4>
              <p className="launchpad-desc mt-1.5">
                Define target ticker/company, research objectives, and analytical scope (Single Company Forensic Audit or Cross-Company Peer Comparison).
              </p>
              <div className="launchpad-action mt-4">
                <span className="text-xs font-semibold text-accent flex-row items-center gap-1">
                  Initialize Session <ArrowRight size={13} />
                </span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="fin-launchpad-card"
            hover
            onClick={() => setPage("Multi-Agent Orchestrator")}
          >
            <CardContent>
              <div className="launchpad-top">
                <Badge variant="purple" size="sm">Step 3 • AI Synthesis</Badge>
                <span className="text-xs text-muted font-mono">Module 4</span>
              </div>
              <h4 className="launchpad-title mt-2">3. Multi-Agent Reasoning</h4>
              <p className="launchpad-desc mt-1.5">
                Autonomous agents extract GAAP/IFRS ratios, run forensic red flag scans, answer complex conversational queries, and generate exportable PDF dossiers.
              </p>
              <div className="launchpad-action mt-4">
                <span className="text-xs font-semibold text-accent flex-row items-center gap-1">
                  View Agent Matrix <ArrowRight size={13} />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Activity Overview (Module 4 Pipeline Health) */}
      <div className="fin-section-block mt-8">
        <div className="section-head-row">
          <div>
            <span className="fin-section-eyebrow">AI COLLABORATION PIPELINE</span>
            <h3 className="fin-section-heading">Multi-Agent Activity & Health</h3>
            <p className="fin-section-sub">
              Real-time execution status of specialized financial reasoning agents with verified page grounding.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={Bot}
            onClick={() => setPage("Multi-Agent Orchestrator")}
          >
            Open Execution Matrix
          </Button>
        </div>

        <div className="fin-agents-grid mt-4">
          {AGENT_PIPELINE_STAGES.map((agent) => (
            <Card key={agent.id} className="fin-agent-status-card" hover>
              <CardContent>
                <div className="flex-row justify-between items-center">
                  <div className="agent-badge-name">
                    <strong className="text-sm">{agent.name}</strong>
                  </div>
                  <Badge variant="success" size="sm" dot>
                    Online
                  </Badge>
                </div>
                <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
                  {agent.role}
                </p>
                <div className="agent-card-stat mt-3">
                  <span className="text-[11px] font-mono text-muted">
                    {sessions.length === 0 && documents.length === 0 ? "Standby" : agent.stats}
                  </span>
                  <span className="text-[11px] font-mono text-teal">
                    {sessions.length === 0 && documents.length === 0 ? "Ready" : agent.duration}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Two Column Section: Recent Research Sessions & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Research Sessions Table */}
        <Card>
          <CardHeader>
            <div className="flex-row justify-between items-center">
              <div>
                <CardTitle>Recent Research Sessions</CardTitle>
                <span className="text-xs text-muted">Active analytical workspaces ({sessions.length})</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={PlusCircle}
                onClick={onOpenCreateModal || (() => setPage("Create Session"))}
              >
                New Session
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>Session Title</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead align="right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <strong className="block text-sm">{s.title}</strong>
                        <span className="text-xs text-muted">{s.company || "General"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" size="sm">
                          {s.researchType || "Analysis"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success" size="sm" dot>
                          {s.status || "Ready"}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex-row justify-end items-center gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setActiveSession(s);
                              setPage("Research Workspace", "interactive");
                            }}
                          >
                            Open
                          </Button>
                          <button
                            type="button"
                            className="fin-table-delete-btn"
                            title="Delete session"
                            onClick={() => {
                              if (window.confirm(`Delete "${s.title}"?`)) {
                                onDeleteSession(s.id);
                              }
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                icon={FileText}
                title="No Research Sessions Available"
                description="You haven't created any research sessions yet. Click below to initialize your first session."
                actionLabel="Create Session"
                onAction={onOpenCreateModal || (() => setPage("Create Session"))}
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Uploaded Documents Table */}
        <Card>
          <CardHeader>
            <div className="flex-row justify-between items-center">
              <div>
                <CardTitle>Recent Documents & Filings</CardTitle>
                <span className="text-xs text-muted">Audited filings with dense vector index ({documents.length})</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Upload}
                onClick={onOpenUploadModal}
              >
                Upload
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentDocuments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>Filing Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead align="right">Chunks</TableHead>
                    <TableHead align="right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex-row items-center gap-2">
                          <FileText size={15} className="text-accent shrink-0" />
                          <div>
                            <strong className="block text-xs truncate max-w-[170px]" title={doc.name}>
                              {doc.name}
                            </strong>
                            <span className="text-[11px] text-muted">{doc.company || "Corporate Filing"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="teal" size="sm">
                          {doc.ticker || doc.docType || "Doc"}
                        </Badge>
                      </TableCell>
                      <TableCell align="right" numeric>
                        <span className="text-xs font-mono font-semibold">
                          {(doc.chunksCount || doc.chunks || 0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPage("Document Library")}
                        >
                          Inspect
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                icon={Upload}
                title="No Financial Documents Uploaded"
                description="Upload corporate PDF filings (10-K, Annual Reports) to generate vector embeddings and build your research library."
                actionLabel="Upload Document"
                onAction={onOpenUploadModal}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Institutional Reports & Dossiers Section */}
      <div className="fin-section-block mt-8 mb-6">
        <Card>
          <CardHeader>
            <div className="flex-row justify-between items-center">
              <div>
                <CardTitle>Recent Institutional Reports & Dossiers</CardTitle>
                <span className="text-xs text-muted">
                  Fully cited financial reports ready for institutional review and PDF export ({recentReports.length})
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Printer}
                onClick={() => setPage("Analyst Report")}
              >
                View Dossier View
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentReports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>Dossier Title</TableHead>
                    <TableHead>Target Entity</TableHead>
                    <TableHead>Grounding Verification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead align="right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReports.map((rep) => (
                    <TableRow key={rep.id}>
                      <TableCell>
                        <div className="flex-row items-center gap-2">
                          <FileCheck2 size={15} className="text-teal shrink-0" />
                          <div>
                            <strong className="block text-xs font-semibold">{rep.title}</strong>
                            <span className="text-[11px] text-muted">{rep.type}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold">{rep.company}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex-row items-center gap-1.5">
                          <ShieldCheck size={14} className="text-teal" />
                          <span className="text-xs text-teal font-semibold">{rep.grounding}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success" size="sm">
                          {rep.status}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={ExternalLink}
                          onClick={() => {
                            const s = sessions.find((item) => item.id === rep.sessionId);
                            if (s) setActiveSession(s);
                            setPage("Analyst Report");
                          }}
                        >
                          Read Dossier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                icon={FileCheck2}
                title="No Institutional Reports Generated"
                description="Run research sessions to extract audited metrics, detect red flags, and create downloadable PDF dossiers."
                actionLabel="Create Session"
                onAction={onOpenCreateModal || (() => setPage("Create Session"))}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
