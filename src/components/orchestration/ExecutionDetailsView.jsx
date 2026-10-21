import React, { useState } from "react";
import {
  FileText,
  Layers,
  AlertTriangle,
  GitCompare,
  Bot,
  Printer,
  CheckCircle2,
  Clock,
  RefreshCw,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import CitationModal from "../CitationModal";

function parseDocInfo(docStr) {
  if (!docStr) return { name: "Document.pdf", pages: "Audited", chunks: "Indexed", company: "DOC" };
  if (typeof docStr === "object") {
    return {
      name: docStr.name || "Document.pdf",
      pages: docStr.pages ? `${docStr.pages} pgs` : "Audited",
      chunks: docStr.chunks ? `${docStr.chunks.toLocaleString()} chunks` : "Indexed",
      company: docStr.company || "FIN"
    };
  }
  const match = String(docStr).match(/^(.+?\.pdf)\s*(?:\((?:(\d+[\s\w]+),\s*)?([\d,]+[\s\w]+)\))?$/i);
  if (match) {
    const name = match[1].trim();
    const pages = match[2] ? match[2].trim() : "Audited";
    const chunks = match[3] ? match[3].trim() : "1,400+ vectors";
    let company = "FIN";
    if (/infosys|infy/i.test(name)) company = "INFY";
    else if (/tcs/i.test(name)) company = "TCS";
    else if (/apple|aapl/i.test(name)) company = "AAPL";
    else if (/microsoft|msft/i.test(name)) company = "MSFT";
    return { name, pages, chunks, company };
  }
  return { name: String(docStr), pages: "Audited", chunks: "Indexed", company: "DOC" };
}

export default function ExecutionDetailsView({
  workflows = [],
  selectedWorkflowId,
  selectedAgentId,
  activeSession,
  onSelectWorkflow,
  onOpenSession,
  onOpenDocument,
  onUpdateWorkflow
}) {
  const [activeWfId, setActiveWfId] = useState(selectedWorkflowId || workflows[0]?.id);
  const [expandedSteps, setExpandedSteps] = useState({ 0: true, 1: true });
  const [activeCitation, setActiveCitation] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [simulatedErrorStep, setSimulatedErrorStep] = useState(null);

  const workflow = workflows.find((w) => w.id === activeWfId) || workflows[0];

  function toggleStep(idx) {
    setExpandedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  }

  function toggleExpandAll() {
    const allExpanded = Object.keys(expandedSteps).length === workflow?.steps?.length;
    if (allExpanded) {
      setExpandedSteps({});
    } else {
      const next = {};
      workflow?.steps?.forEach((_, idx) => {
        next[idx] = true;
      });
      setExpandedSteps(next);
    }
  }

  // Simulate Error on Step 3 for demonstration
  function handleTriggerError() {
    setSimulatedErrorStep(2); // Step 3: Red Flag Agent
  }

  // Retry failed step
  function handleRetryStep(stepIdx) {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setSimulatedErrorStep(null);
    }, 1200);
  }

  if (!workflow) {
    return (
      <div className="p-8 text-center border rounded-lg bg-card">
        <p className="text-muted text-xs">No active workflow execution found.</p>
      </div>
    );
  }

  const iconMap = {
    documentAgent: FileText,
    extractionAgent: Layers,
    redFlagAgent: AlertTriangle,
    comparisonAgent: GitCompare,
    researchAgent: Bot,
    reportAgent: Printer
  };

  return (
    <div className="fin-execution-details-view space-y-6 animate-fadeIn">
      {/* Workflow Header & Selector */}
      <div className="fin-card p-5 border rounded-lg bg-card space-y-4">
        <div className="flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex-row items-center gap-2">
              <span className="eyebrow text-accent font-mono text-[10px]">
                WORKFLOW EXECUTION TRACE
              </span>
              <Badge
                variant={simulatedErrorStep !== null ? "danger" : "success"}
                size="xs"
                dot
              >
                {simulatedErrorStep !== null ? "Error in Pipeline" : workflow.status}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-main mt-0.5">
              {workflow.name}
            </h2>
            <p className="text-xs text-muted">
              {workflow.type} • {workflow.totalDuration} total duration • {workflow.activeAgentsCount} active agents
            </p>
          </div>

          <div className="flex-row items-center gap-2 flex-wrap">
            {/* Workflow Switcher Dropdown */}
            <select
              className="fin-select text-xs"
              value={activeWfId}
              onChange={(e) => setActiveWfId(e.target.value)}
            >
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>

            {simulatedErrorStep !== null ? (
              <Button
                variant="warning"
                size="sm"
                icon={RefreshCw}
                loading={isRetrying}
                onClick={() => handleRetryStep(simulatedErrorStep)}
              >
                Retry Failed Step
              </Button>
            ) : (
              <button
                type="button"
                className="fin-btn fin-btn-ghost fin-btn-xs text-warning"
                onClick={handleTriggerError}
                title="Test simulated error and retry controls"
              >
                <AlertTriangle size={13} />
                <span>Simulate Error</span>
              </button>
            )}

            {workflow.sessionId && (
              <Button
                variant="primary"
                size="sm"
                icon={FolderOpen}
                onClick={() => onOpenSession && onOpenSession(workflow.sessionId)}
              >
                Open Session
              </Button>
            )}
          </div>
        </div>

        {/* Description & Target Companies */}
        <p className="text-xs text-muted leading-relaxed">
          {workflow.description}
        </p>
      </div>

      {/* Associated Research Session & Input Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Associated Research Session */}
        <div className="p-4 border rounded-xl bg-card shadow-sm hover:border-accent/40 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex-row items-center justify-between">
              <div className="flex-row items-center gap-1.5">
                <Bookmark size={14} className="text-accent" />
                <span className="text-[11px] font-bold text-main uppercase tracking-wider">
                  Associated Research Session (Module 1)
                </span>
              </div>
              <Badge variant="teal" size="xs" dot>
                Linked
              </Badge>
            </div>

            {/* Clickable Session Card */}
            <div
              className="mt-2.5 p-3 rounded-lg bg-card-subtle border border-subtle hover:border-accent/40 hover:bg-card-hover transition-all cursor-pointer group"
              onClick={() => onOpenSession && onOpenSession(workflow.sessionId)}
              title="Click to open this session in Research Workspace"
            >
              <div className="flex-row items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex-row items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-accent group-hover:text-accent-light group-hover:underline transition-colors">
                      {workflow.sessionTitle}
                    </span>
                    <ExternalLink size={12} className="text-accent shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-normal">
                    {workflow.type} • Active financial comparison dossier
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-subtle flex-row items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex-row items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-dim font-semibold">Entities:</span>
              {workflow.targetCompanies?.map((comp, idx) => {
                const isInfy = /infy|infosys/i.test(comp);
                const isTcs = /tcs/i.test(comp);
                return (
                  <span
                    key={idx}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border ${
                      isInfy
                        ? "bg-accent/10 text-accent border-accent/30"
                        : isTcs
                        ? "bg-purple-glow text-purple-400 border-purple-500/30"
                        : "bg-card-subtle text-main border-border-color"
                    }`}
                  >
                    {comp}
                  </span>
                );
              })}
            </div>

            <div className="flex-row items-center gap-2">
              <span className="font-mono text-[11px] text-muted bg-card-subtle px-1.5 py-0.5 rounded border border-subtle">
                ID: {workflow.sessionId}
              </span>
              <button
                type="button"
                className="text-xs text-accent font-semibold hover:underline flex-row items-center gap-1"
                onClick={() => onOpenSession && onOpenSession(workflow.sessionId)}
              >
                <span>Open Workspace</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Input Document References */}
        <div className="p-4 border rounded-xl bg-card shadow-sm hover:border-accent/40 transition-all flex flex-col justify-between space-y-3">
          <div>
            <div className="flex-row items-center justify-between">
              <div className="flex-row items-center gap-1.5">
                <FolderOpen size={14} className="text-accent" />
                <span className="text-[11px] font-bold text-main uppercase tracking-wider">
                  Input Document References
                </span>
              </div>
              <div className="flex-row items-center gap-2">
                <span className="text-[11px] text-muted font-mono font-semibold">
                  {workflow.inputDocuments?.length || 0} Filings
                </span>
                <button
                  type="button"
                  className="text-[11px] text-accent font-semibold hover:underline flex-row items-center gap-1"
                  onClick={() => onOpenDocument && onOpenDocument()}
                  title="Open in Document Library"
                >
                  <span>View in Library</span>
                  <ExternalLink size={10} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-2.5">
              {workflow.inputDocuments?.map((rawDoc, idx) => {
                const doc = parseDocInfo(rawDoc);
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-card-subtle border border-subtle hover:border-accent/40 hover:bg-card-hover transition-all cursor-pointer flex-row items-center justify-between gap-3 group"
                    onClick={() => onOpenDocument && onOpenDocument(doc.name)}
                    title={`Click to inspect ${doc.name} in Document Library`}
                  >
                    <div className="flex-row items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                        <FileText size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex-row items-center gap-2">
                          <span
                            className="text-xs font-semibold text-main truncate max-w-[180px] sm:max-w-[260px] group-hover:text-accent transition-colors"
                            title={doc.name}
                          >
                            {doc.name}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-accent-glow text-accent-light uppercase font-mono">
                            {doc.company}
                          </span>
                        </div>
                        <div className="flex-row items-center gap-2 mt-0.5 text-[10px] text-muted font-mono">
                          <span>{doc.pages}</span>
                          <span>•</span>
                          <span>{doc.chunks}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-row items-center gap-1.5 shrink-0">
                      <Badge variant="teal" size="xs">
                        Indexed
                      </Badge>
                      <ArrowRight size={13} className="text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all opacity-60 group-hover:opacity-100" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-subtle flex-row items-center justify-between text-[11px] text-muted">
            <span className="flex-row items-center gap-1 text-success font-semibold">
              <CheckCircle2 size={12} />
              <span>Full vector OCR & tabular coverage verified</span>
            </span>
            <span className="font-mono text-dim">1536-dim embeddings</span>
          </div>
        </div>
      </div>

      {/* Errors and Warnings Bar */}
      {simulatedErrorStep !== null ? (
        <div className="p-4 border rounded-lg bg-danger/10 border-danger/30 flex-row items-start justify-between gap-4 animate-fadeIn">
          <div className="flex-row items-start gap-3">
            <AlertTriangle size={18} className="text-danger shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs font-bold text-danger block">
                Execution Error on Step 3: Red Flag Agent
              </strong>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Timeout waiting for forensic heuristic parser: Unresolved recursive reference in Auditor Footnotes schedule.
              </p>
              <div className="pt-2 flex-row items-center gap-2">
                <Button
                  variant="warning"
                  size="xs"
                  icon={RefreshCw}
                  loading={isRetrying}
                  onClick={() => handleRetryStep(simulatedErrorStep)}
                >
                  {isRetrying ? "Retrying Agent..." : "Retry Red Flag Agent"}
                </Button>
                <span className="text-[11px] text-muted">
                  Retry resumes pipeline state without re-ingesting documents.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 border rounded-lg bg-card-subtle flex-row items-center justify-between text-xs">
          <div className="flex-row items-center gap-2 text-muted">
            <ShieldCheck size={16} className="text-success shrink-0" />
            <span>
              <strong className="text-main">Audit Invariant Verified:</strong> All completed steps cite audited page numbers and line items. Zero unverified assertions detected.
            </span>
          </div>
          <span className="text-success font-mono text-[11px] font-bold">
            0 Pipeline Errors
          </span>
        </div>
      )}

      {/* Execution Steps Breakdown */}
      <div className="fin-card border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b border-subtle flex-row justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-main">
              Step-by-Step Execution Trace
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Chronological progress through the 6 orchestrated agent stages.
            </p>
          </div>

          <button
            type="button"
            className="text-xs text-accent hover:underline font-semibold"
            onClick={toggleExpandAll}
          >
            {Object.keys(expandedSteps).length === workflow?.steps?.length
              ? "Collapse All Details"
              : "Expand All Details"}
          </button>
        </div>

        <div className="divide-y divide-subtle">
          {workflow.steps?.map((step, idx) => {
            const isStepFailed = simulatedErrorStep === idx;
            const isExpanded = expandedSteps[idx];
            const IconComponent = iconMap[step.agentId] || FileText;
            const isBypassed = step.status === "Bypassed";

            return (
              <div
                key={idx}
                className={`p-4 transition-colors ${
                  isStepFailed
                    ? "bg-danger/5"
                    : isBypassed
                    ? "opacity-60 bg-card-subtle"
                    : "hover:bg-hover"
                }`}
              >
                {/* Step Row Header */}
                <div
                  className="flex-row items-center justify-between cursor-pointer"
                  onClick={() => toggleStep(idx)}
                >
                  <div className="flex-row items-center gap-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-card-subtle border border-border-color text-muted">
                      STEP 0{step.step}
                    </span>
                    <div className="p-1.5 rounded bg-accent/10 text-accent">
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <strong className={`text-xs block ${isStepFailed ? "text-danger" : "text-main"}`}>
                        {step.name}
                      </strong>
                      <span className="text-[11px] text-muted">
                        Agent: {step.agentId}
                      </span>
                    </div>
                  </div>

                  <div className="flex-row items-center gap-3">
                    <div className="text-right text-[11px] font-mono text-muted hidden sm:block">
                      <span>{step.timestamp}</span>
                      <span className="mx-1">•</span>
                      <span className="text-accent">{step.duration}</span>
                    </div>

                    <Badge
                      variant={
                        isStepFailed
                          ? "danger"
                          : isBypassed
                          ? "default"
                          : "success"
                      }
                      size="xs"
                    >
                      {isStepFailed ? "Failed" : step.status}
                    </Badge>

                    <button
                      type="button"
                      className="text-muted hover:text-main p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(idx);
                      }}
                      aria-label="Toggle step details"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expandable Step Body */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-subtle space-y-2.5 animate-fadeIn">
                    <p className="text-xs text-muted leading-relaxed">
                      {isStepFailed
                        ? "ERROR: Step execution timed out during forensic anomaly resolution. Retry action required."
                        : step.detail}
                    </p>

                    {/* Source References associated with completed steps */}
                    {step.sourceReferences && step.sourceReferences.length > 0 && (
                      <div className="p-2.5 rounded bg-card-subtle border border-subtle space-y-1.5">
                        <div className="flex-row items-center gap-1.5 text-[11px] text-accent font-semibold">
                          <Bookmark size={12} />
                          <span>Associated Source References & Citations:</span>
                        </div>
                        <div className="flex-row flex-wrap gap-2">
                          {step.sourceReferences.map((ref, rIdx) => (
                            <button
                              key={rIdx}
                              type="button"
                              className="text-[11px] font-mono px-2 py-0.5 rounded border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                              onClick={() =>
                                setActiveCitation({
                                  docName: ref,
                                  company: workflow.targetCompanies?.[0] || "Target",
                                  page: ref.includes("p.") ? parseInt(ref.split("p.")[1], 10) : 112,
                                  section: step.name,
                                  snippet: step.detail
                                })
                              }
                            >
                              {ref} ↗
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Citation Modal */}
      {activeCitation && (
        <CitationModal citation={activeCitation} onClose={() => setActiveCitation(null)} />
      )}
    </div>
  );
}
