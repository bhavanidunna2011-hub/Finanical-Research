import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Cpu,
  Layers,
  Database,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Play
} from "lucide-react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { WORKFLOW_STAGES } from "../data/knowledgeBaseData";

export default function IndexingWorkflowView({
  record,
  records = [],
  onSelectRecord,
  onUpdateRecord,
  onOpenRetrieval,
  onBack
}) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(null);
  const [simulationMessage, setSimulationMessage] = useState("");

  if (!record) {
    return (
      <div className="p-8 text-center border rounded-lg bg-card">
        <p className="text-muted text-xs">No document selected for visual workflow inspection.</p>
      </div>
    );
  }

  // Fallback to standard 6 stages if record has none
  const currentWorkflow = record.workflow || WORKFLOW_STAGES.map((s, idx) => ({
    step: s.step,
    name: s.title,
    status: record.status === "Indexed" ? "completed" : idx === 0 ? "completed" : "pending",
    timestamp: "10:30 AM",
    duration: "1.0s",
    message: s.description
  }));

  const isFailed = record.status === "Failed";
  const isProcessing = record.status === "Processing";

  // Simulate Re-indexing Pipeline (Steps 1 to 6)
  function handleRunSimulation() {
    setIsSimulating(true);
    setActiveStepIndex(0);
    setSimulationMessage("Step 1: Document received & payload verified...");

    // Step 1: Received
    setTimeout(() => {
      setActiveStepIndex(1);
      setSimulationMessage("Step 2: OCR extracting text layers & balance sheet tables...");

      // Step 2: Extracted
      setTimeout(() => {
        setActiveStepIndex(2);
        setSimulationMessage("Step 3: Recursive token chunking (512 tokens / 64 overlap)...");

        // Step 3: Chunked
        setTimeout(() => {
          setActiveStepIndex(3);
          setSimulationMessage("Step 4: Computing 1536-dimensional embeddings...");

          // Step 4: Embedded
          setTimeout(() => {
            setActiveStepIndex(4);
            setSimulationMessage("Step 5: Structuring into HNSW vector index graph...");

            // Step 5: Indexed
            setTimeout(() => {
              setActiveStepIndex(5);
              setSimulationMessage("Step 6: Document verified for multi-agent retrieval!");

              // Step 6: Ready
              setTimeout(() => {
                setIsSimulating(false);
                setActiveStepIndex(null);
                setSimulationMessage("");

                const updatedWorkflow = WORKFLOW_STAGES.map((stage) => ({
                  step: stage.step,
                  name: stage.title,
                  status: "completed",
                  timestamp: new Date().toLocaleTimeString(),
                  duration: (0.5 + Math.random() * 2).toFixed(1) + "s",
                  message: `${stage.description} Successfully verified.`
                }));

                const updatedRecord = {
                  ...record,
                  status: "Indexed",
                  chunkCount: record.chunkCount > 0 ? record.chunkCount : 980,
                  lastIndexedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + new Date().toLocaleTimeString(),
                  workflow: updatedWorkflow,
                  errorMessage: null
                };

                if (onUpdateRecord) {
                  onUpdateRecord(record.id, updatedRecord);
                }
              }, 900);
            }, 900);
          }, 900);
        }, 900);
      }, 900);
    }, 800);
  }

  // Simulate Error in Stage 4 (Embeddings Generated)
  function handleSimulateFailure() {
    setIsSimulating(true);
    setActiveStepIndex(0);
    setSimulationMessage("Testing error simulation on embedding generation...");

    setTimeout(() => {
      setActiveStepIndex(3); // Stage 4: Embeddings generated
      setSimulationMessage("Simulating vector embedding timeout error...");

      setTimeout(() => {
        setIsSimulating(false);
        setActiveStepIndex(null);
        setSimulationMessage("");

        const updatedWorkflow = WORKFLOW_STAGES.map((stage, idx) => {
          if (idx < 3) {
            return {
              step: stage.step,
              name: stage.title,
              status: "completed",
              timestamp: new Date().toLocaleTimeString(),
              duration: "1.2s",
              message: stage.description
            };
          } else if (idx === 3) {
            return {
              step: stage.step,
              name: stage.title,
              status: "failed",
              timestamp: new Date().toLocaleTimeString(),
              duration: "Failed",
              message: "Embedding Generation Exception: API rate-limit exceeded (TPM quota on text-embedding-3-small). Pipeline halted."
            };
          } else {
            return {
              step: stage.step,
              name: stage.title,
              status: "pending",
              timestamp: "--",
              duration: "--",
              message: "Waiting for embedding resolution."
            };
          }
        });

        const failedRecord = {
          ...record,
          status: "Failed",
          errorMessage: "Embedding Generation Exception: API rate-limit exceeded (TPM quota on text-embedding-3-small). Vector chunking halted.",
          workflow: updatedWorkflow
        };

        if (onUpdateRecord) {
          onUpdateRecord(record.id, failedRecord);
        }
      }, 1000);
    }, 1000);
  }

  // Retry From Failed Stage
  function handleRetryFromFailed() {
    setIsSimulating(true);
    setActiveStepIndex(3);
    setSimulationMessage("Retrying embedding generation with exponential backoff...");

    setTimeout(() => {
      setActiveStepIndex(4);
      setSimulationMessage("Building HNSW graph index...");

      setTimeout(() => {
        setActiveStepIndex(5);
        setSimulationMessage("Document ready for retrieval!");

        setTimeout(() => {
          setIsSimulating(false);
          setActiveStepIndex(null);
          setSimulationMessage("");

          const recoveredWorkflow = WORKFLOW_STAGES.map((stage) => ({
            step: stage.step,
            name: stage.title,
            status: "completed",
            timestamp: new Date().toLocaleTimeString(),
            duration: "1.4s",
            message: `${stage.description} Successfully recovered and verified.`
          }));

          const recoveredRecord = {
            ...record,
            status: "Indexed",
            chunkCount: record.chunkCount > 0 ? record.chunkCount : 1240,
            lastIndexedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + new Date().toLocaleTimeString(),
            workflow: recoveredWorkflow,
            errorMessage: null
          };

          if (onUpdateRecord) {
            onUpdateRecord(record.id, recoveredRecord);
          }
        }, 900);
      }, 900);
    }, 1000);
  }

  return (
    <div className="fin-indexing-workflow-view space-y-6 animate-fadeIn">
      {/* Workflow Header & Document Switcher */}
      <div className="fin-card p-5 border rounded-lg bg-card">
        <div className="flex-row items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex-row items-center gap-2">
              <span className="eyebrow text-accent font-mono text-[10px]">
                VISUAL INDEXING WORKFLOW
              </span>
              <Badge
                variant={
                  isFailed
                    ? "danger"
                    : record.status === "Indexed"
                    ? "success"
                    : isProcessing
                    ? "warning"
                    : "default"
                }
                size="xs"
                dot
              >
                {record.status}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-main mt-0.5">
              {record.docName}
            </h2>
            <p className="text-xs text-muted">
              {record.company} ({record.ticker}) • {record.pages} Pages • {record.chunkCount} Chunks
            </p>
          </div>

          {/* Document Switcher Dropdown & Simulation Controls */}
          <div className="flex-row items-center gap-2 flex-wrap">
            {records.length > 0 && (
              <select
                className="fin-select text-xs"
                value={record.id}
                onChange={(e) => {
                  const target = records.find((r) => r.id === e.target.value);
                  if (target && onSelectRecord) onSelectRecord(target);
                }}
                disabled={isSimulating}
              >
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.docName} ({r.status})
                  </option>
                ))}
              </select>
            )}

            {isFailed ? (
              <Button
                variant="warning"
                size="sm"
                icon={RefreshCw}
                loading={isSimulating}
                onClick={handleRetryFromFailed}
              >
                Retry Indexing Pipeline
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={Play}
                loading={isSimulating}
                onClick={handleRunSimulation}
              >
                {isSimulating ? "Executing Workflow..." : "Simulate Re-index"}
              </Button>
            )}

            {!isFailed && (
              <button
                type="button"
                className="fin-btn fin-btn-ghost fin-btn-xs text-warning"
                onClick={handleSimulateFailure}
                disabled={isSimulating}
                title="Simulate error at Stage 4 (Embeddings generated)"
              >
                <AlertTriangle size={13} />
                <span>Simulate Error</span>
              </button>
            )}

            <Button
              variant="secondary"
              size="sm"
              icon={Search}
              onClick={() => onOpenRetrieval && onOpenRetrieval(record)}
            >
              Test Retrieval
            </Button>
          </div>
        </div>

        {/* Live Simulation Progress Banner */}
        {isSimulating && (
          <div className="mt-4 p-3 border rounded bg-accent/10 border-accent/30 flex-row items-center gap-2.5 animate-fadeIn">
            <RefreshCw size={14} className="text-accent animate-spin" />
            <span className="text-xs font-semibold text-accent">{simulationMessage}</span>
          </div>
        )}
      </div>

      {/* The 6-Stage Visual Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const recordedStage = currentWorkflow[idx] || {};
          const isCurrentActive = isSimulating && activeStepIndex === idx;
          const isStageCompleted = !isSimulating
            ? recordedStage.status === "completed"
            : (activeStepIndex !== null && activeStepIndex > idx);
          const isStageFailed = !isSimulating && recordedStage.status === "failed";
          const isStagePending = !isStageCompleted && !isStageFailed && !isCurrentActive;

          return (
            <div
              key={stage.id}
              className={`fin-workflow-node-card p-4 border rounded-lg transition-all relative flex flex-col justify-between ${
                isStageFailed
                  ? "border-danger bg-danger/10 shadow-sm"
                  : isCurrentActive
                  ? "border-accent bg-accent/10 shadow-glow ring-1 ring-accent"
                  : isStageCompleted
                  ? "border-success/30 bg-card hover:border-success/60"
                  : "border-border-color bg-card-subtle opacity-70"
              }`}
            >
              <div>
                {/* Node Top Header */}
                <div className="flex-row justify-between items-center mb-2">
                  <div className="flex-row items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-bg-deep border border-border-color text-muted">
                      STAGE 0{stage.step}
                    </span>
                    {idx < 5 && (
                      <ChevronRight size={13} className="text-dim hidden md:inline" />
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {isStageCompleted && (
                      <span className="text-success flex-row items-center gap-1 text-xs font-bold font-mono">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    )}
                    {isStageFailed && (
                      <span className="text-danger flex-row items-center gap-1 text-xs font-bold font-mono">
                        <AlertTriangle size={13} /> Failed
                      </span>
                    )}
                    {isCurrentActive && (
                      <span className="text-accent flex-row items-center gap-1 text-xs font-bold font-mono animate-pulse">
                        <RefreshCw size={13} className="animate-spin" /> In-Progress
                      </span>
                    )}
                    {isStagePending && (
                      <span className="text-dim flex-row items-center gap-1 text-xs font-mono">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Stage Title */}
                <h3 className={`text-sm font-bold mt-1 ${isStageFailed ? "text-danger" : "text-main"}`}>
                  {stage.title}
                </h3>

                {/* Explanatory Message */}
                <p className="text-xs text-muted mt-1.5 leading-relaxed">
                  {recordedStage.message || stage.description}
                </p>
              </div>

              {/* Node Footer: Timestamp & Duration */}
              <div className="pt-3 mt-3 border-t border-subtle flex-row justify-between items-center text-[10px] font-mono text-dim">
                <span>
                  {recordedStage.timestamp && recordedStage.timestamp !== "--"
                    ? `Time: ${recordedStage.timestamp}`
                    : "Awaiting stage trigger"}
                </span>
                {recordedStage.duration && (
                  <span className="text-muted font-bold">
                    {recordedStage.duration}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Grounding Protocol Note */}
      <div className="fin-info-banner">
        <div className="flex-row items-start gap-2.5">
          <ShieldCheck size={18} className="text-teal shrink-0 mt-0.5" />
          <div className="text-xs text-muted leading-relaxed">
            <strong className="text-main block mb-0.5">Vector Grounding Pipeline Verification</strong>
            All 6 stages guarantee that financial disclosures retain exact coordinate anchors back to the audited source PDF.
            Embeddings are normalized using cosine similarity, preventing vector drift and hallucinations.
          </div>
        </div>
      </div>
    </div>
  );
}
