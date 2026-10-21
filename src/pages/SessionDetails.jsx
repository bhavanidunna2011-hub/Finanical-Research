import React, { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Copy,
  Trash2,
  Building2,
  FileText,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bot,
  Plus,
  HelpCircle,
  Sparkles,
  FileCheck2,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import Button from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
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
import { SEED_COMPANIES, AGENT_PIPELINE_STAGES } from "../data/seedData";

export default function SessionDetails({
  session,
  onBack,
  onUpdateSession,
  onDuplicateSession,
  onDeleteSession,
  onLaunchInteractive,
  onNavigateToReports,
  onNavigateToDocs
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(session?.title || "");
  const [editCompany, setEditCompany] = useState(session?.company || "");
  const [editType, setEditType] = useState(session?.researchType || "Company Analysis");
  const [editDescription, setEditDescription] = useState(session?.description || "");
  const [editStatus, setEditStatus] = useState(session?.status || "Analysis Complete");
  const [editError, setEditError] = useState("");

  // Research Questions state
  const [questions, setQuestions] = useState(() => {
    if (session?.researchQuestions && Array.isArray(session.researchQuestions)) {
      return session.researchQuestions;
    }
    // Default contextual questions
    if (session?.companyIds?.includes("INFY") && session?.companyIds?.includes("TCS")) {
      return [
        { id: "q1", text: "Evaluate the 390 bps operating margin spread between TCS (24.6%) and Infosys (20.7%).", status: "Analyzed" },
        { id: "q2", text: "Compare large deal TCV contract momentum ($42.7B vs $17.7B) and net new wins.", status: "Analyzed" },
        { id: "q3", text: "Assess headcount attrition trajectories and subcontractor utilization rates.", status: "Analyzed" }
      ];
    } else if (session?.companyIds?.includes("AAPL")) {
      return [
        { id: "q1", text: "Forensic audit of Greater China revenue contraction (-7.7% YoY).", status: "Analyzed" },
        { id: "q2", text: "Investigate material impact of $10.2B European State Aid tax payment.", status: "Analyzed" },
        { id: "q3", text: "Analyze Services gross margin resilience (74.0%) vs Products gross margin (36.9%).", status: "Analyzed" }
      ];
    } else if (session?.companyIds?.includes("MSFT")) {
      return [
        { id: "q1", text: "Evaluate ROI on $55.7B CapEx buildout (+75% YoY surge).", status: "Analyzed" },
        { id: "q2", text: "Measure Intelligent Cloud ($105.36B) and Azure AI run-rate growth.", status: "Analyzed" },
        { id: "q3", text: "Cross-reference commercial remaining performance obligations (RPO) growth.", status: "Analyzed" }
      ];
    }
    return [
      { id: "q1", text: `Analyze key GAAP/IFRS line items and margins for ${session?.company || "target entity"}.`, status: "Analyzed" },
      { id: "q2", text: "Scan notes to financial statements for legal contingencies and auditor disclosures.", status: "Analyzed" }
    ];
  });

  const [newQuestionText, setNewQuestionText] = useState("");

  if (!session) {
    return (
      <div className="p-8 text-center">
        <h3>Session not found</h3>
        <Button variant="primary" size="sm" onClick={onBack} className="mt-4">
          Back to Research Workspace
        </Button>
      </div>
    );
  }

  const primaryCompany =
    SEED_COMPANIES[session.companyIds?.[0]] || SEED_COMPANIES.INFY;

  function handleOpenEdit() {
    setEditTitle(session.title || "");
    setEditCompany(session.company || "");
    setEditType(session.researchType || "Company Analysis");
    setEditDescription(session.description || "");
    setEditStatus(session.status || "Analysis Complete");
    setEditError("");
    setEditModalOpen(true);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError("Session name is required.");
      return;
    }
    if (!editCompany.trim()) {
      setEditError("Company name is required.");
      return;
    }

    onUpdateSession(session.id, {
      title: editTitle.trim(),
      company: editCompany.trim(),
      researchType: editType,
      description: editDescription.trim(),
      status: editStatus,
      updatedAt: new Date().toLocaleDateString()
    });

    setEditModalOpen(false);
  }

  function handleAddQuestion(e) {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ = {
      id: `q-${Date.now()}`,
      text: newQuestionText.trim(),
      status: "In Progress"
    };

    const updated = [...questions, newQ];
    setQuestions(updated);
    setNewQuestionText("");

    onUpdateSession(session.id, {
      researchQuestions: updated
    });
  }

  function handleDeleteConfirmed() {
    setDeleteModalOpen(false);
    onDeleteSession(session.id);
    onBack();
  }

  return (
    <div className="fin-session-details-page animate-fadeIn">
      {/* Top Navigation & Breadcrumb */}
      <div className="details-header-nav">
        <button
          type="button"
          className="details-back-link"
          onClick={onBack}
        >
          <ArrowLeft size={15} />
          <span>Back to Research Workspace</span>
        </button>

        <div className="flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={handleOpenEdit}
          >
            Edit Metadata
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Copy}
            onClick={() => onDuplicateSession(session.id)}
          >
            Duplicate
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </Button>

          <Button
            variant="teal"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => onLaunchInteractive(session)}
          >
            Launch Interactive Workspace
          </Button>
        </div>
      </div>

      {/* Main Details Banner */}
      <div className="fin-details-hero mt-4">
        <div className="flex-row justify-between items-start gap-4">
          <div>
            <div className="flex-row items-center gap-2">
              <Badge variant="teal" size="sm">
                {session.companyIds?.[0] || "Target"}
              </Badge>
              <Badge variant="outline" size="sm">
                {session.researchType || "Analysis"}
              </Badge>
              <Badge
                variant={session.status === "Analysis Complete" ? "success" : "primary"}
                size="sm"
                dot
              >
                {session.status || "Ready"}
              </Badge>
            </div>

            <h1 className="details-title mt-2">{session.title}</h1>

            <p className="details-objective-desc mt-2">
              {session.description || "Comprehensive multi-agent financial filing evaluation."}
            </p>
          </div>

          <div className="details-quick-meta">
            <div className="meta-item">
              <span className="text-xs text-muted">Primary Target</span>
              <strong className="text-sm block">{session.company || "General"}</strong>
            </div>
            <div className="meta-item mt-2">
              <span className="text-xs text-muted">Last Updated</span>
              <span className="text-xs font-mono block text-main">{session.updatedAt || session.createdAt || "Recently"}</span>
            </div>
            <div className="meta-item mt-2">
              <span className="text-xs text-muted">Grounding Standard</span>
              <span className="text-xs text-teal font-semibold flex-row items-center gap-1">
                <ShieldCheck size={12} /> 100% SEC/IFRS Strict
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns for Metadata & Associated Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Card: Associated Documents */}
        <Card>
          <CardHeader>
            <div className="flex-row justify-between items-center">
              <div>
                <CardTitle>Associated Financial Documents</CardTitle>
                <span className="text-xs text-muted">Audited filings loaded into vector index</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={ExternalLink}
                onClick={onNavigateToDocs}
              >
                Document Library
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {session.documents && session.documents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow isHeader>
                    <TableHead>Document Filing</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead align="right">Chunks</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {session.documents.map((doc, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex-row items-center gap-2">
                          <FileText size={15} className="text-accent shrink-0" />
                          <div>
                            <strong className="block text-xs truncate max-w-[210px]" title={doc.name}>
                              {doc.name}
                            </strong>
                            <span className="text-[11px] text-muted">{doc.size || "18.4 MB"} • {doc.company || primaryCompany.ticker}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono">{doc.pages || primaryCompany.pageCount}</span>
                      </TableCell>
                      <TableCell align="right" numeric>
                        <span className="text-xs font-mono font-semibold">
                          {(doc.chunks || primaryCompany.chunkCount).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="success" size="sm" dot>
                          {doc.status || "Indexed"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-xs text-muted">No documents attached yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Card: Research Questions & Hypotheses */}
        <Card>
          <CardHeader>
            <div className="flex-row justify-between items-center">
              <div>
                <CardTitle>Research Objectives & Questions</CardTitle>
                <span className="text-xs text-muted">Key analytical hypotheses evaluated by agents</span>
              </div>
              <Badge variant="teal" size="sm">
                {questions.length} Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="questions-list space-y-2.5">
              {questions.map((q) => (
                <div key={q.id} className="question-item-row">
                  <div className="question-dot" />
                  <span className="question-text text-xs leading-relaxed flex-1">
                    {q.text}
                  </span>
                  <Badge variant="outline" size="sm">
                    {q.status}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Add New Question Form */}
            <form onSubmit={handleAddQuestion} className="add-question-box mt-4">
              <input
                type="text"
                className="fin-input text-xs"
                placeholder="Add custom hypothesis, e.g. Audit R&D capitalization rates..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={Plus}
                disabled={!newQuestionText.trim()}
              >
                Add
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Agent Activity Summary for this Session */}
      <div className="fin-section-block mt-8">
        <div className="section-head-row">
          <div>
            <span className="fin-section-eyebrow">SESSION ORCHESTRATION</span>
            <h3 className="fin-section-heading">Multi-Agent Execution Pipeline</h3>
            <p className="fin-section-sub">
              Operational status of specialized AI agents assigned to {session.company || "this entity"}.
            </p>
          </div>
        </div>

        <div className="fin-agents-grid mt-4">
          {AGENT_PIPELINE_STAGES.map((agent) => {
            const isCompleted = true;
            return (
              <Card key={agent.id} className="fin-agent-status-card" hover>
                <CardContent>
                  <div className="flex-row justify-between items-center">
                    <strong className="text-sm">{agent.name}</strong>
                    <Badge variant="success" size="sm" dot>
                      Completed
                    </Badge>
                  </div>
                  <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
                    {agent.role}
                  </p>
                  <div className="agent-card-stat mt-3">
                    <span className="text-[11px] font-mono text-muted">{agent.stats}</span>
                    <span className="text-[11px] font-mono text-teal">{agent.duration}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Generated Reports & Dossiers */}
      <div className="fin-section-block mt-8 mb-6">
        <Card>
          <CardHeader>
            <div className="flex-row justify-between items-center">
              <div>
                <CardTitle>Institutional Dossier & Reports</CardTitle>
                <span className="text-xs text-muted">
                  Fully compiled executive report with forensic tables, ratios, and citations
                </span>
              </div>
              <Button
                variant="teal"
                size="sm"
                icon={FileCheck2}
                onClick={onNavigateToReports}
              >
                Open Full Report View
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="report-preview-box">
              <div className="flex-row items-center gap-3">
                <div className="report-icon-badge">
                  <FileCheck2 size={24} className="text-teal" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-main">
                    {session.company || session.title} Institutional Analyst Dossier (FY24)
                  </h4>
                  <p className="text-xs text-muted mt-0.5">
                    Includes Executive Synthesis, 7 Key Financial Ratios, Forensic Red Flags Audit, and Peer Comparison Matrix.
                  </p>
                </div>
              </div>

              <div className="flex-row items-center gap-2 mt-3 sm:mt-0">
                <Badge variant="success" size="sm">PDF Ready</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={onNavigateToReports}
                >
                  Read Dossier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Metadata Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Session Metadata"
        description="Update session title, target company, research scope, and status."
        size="md"
        footer={
          <div className="flex-row justify-end gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={handleSaveEdit}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          {editError && (
            <div className="fin-form-error-alert">
              <AlertTriangle size={14} className="text-danger mr-1.5" />
              <span>{editError}</span>
            </div>
          )}

          <div>
            <label className="fin-form-label">Research Session Title *</label>
            <input
              type="text"
              className="fin-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fin-form-label">Target Entity / Company *</label>
              <input
                type="text"
                className="fin-input"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
              />
            </div>
            <div>
              <label className="fin-form-label">Research Scope</label>
              <select
                className="fin-select"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
              >
                <option value="Company Analysis">Company Analysis (Deep Dive)</option>
                <option value="Peer Comparison & Benchmarking">Peer Comparison & Benchmarking</option>
                <option value="Forensic Financial Analysis">Forensic Financial Analysis</option>
                <option value="Investment Research">Investment Research</option>
              </select>
            </div>
          </div>

          <div>
            <label className="fin-form-label">Session Status</label>
            <select
              className="fin-select"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="Analysis Complete">Analysis Complete</option>
              <option value="In Progress">In Progress</option>
              <option value="Ready">Ready</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="fin-form-label">Research Objective / Description</label>
            <textarea
              className="fin-textarea"
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Research Session"
        description="Are you sure you want to delete this session? This action will remove all local metadata, notes, and citations. This cannot be undone."
        size="sm"
        footer={
          <div className="flex-row justify-end gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleDeleteConfirmed}
            >
              Confirm Delete
            </Button>
          </div>
        }
      >
        <div className="fin-delete-dialog-content">
          <div className="delete-target-box">
            <strong className="block text-sm text-main">{session.title}</strong>
            <span className="text-xs text-muted block mt-1">
              Entity: <strong>{session.company}</strong> • Created: {session.createdAt}
            </span>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
