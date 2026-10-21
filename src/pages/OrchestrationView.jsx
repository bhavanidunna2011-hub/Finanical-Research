import React, { useState, useEffect } from "react";
import {
  Cpu,
  Workflow,
  Activity,
  FileText,
  Play,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Info,
  Clock,
  Layers,
  GitCompare,
  Bot,
  Printer
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import AgentOverviewGrid from "../components/orchestration/AgentOverviewGrid";
import WorkflowDiagram from "../components/orchestration/WorkflowDiagram";
import ExecutionDetailsView from "../components/orchestration/ExecutionDetailsView";
import ActivityTimelineFeed from "../components/orchestration/ActivityTimelineFeed";
import {
  getStoredOrchestrationState,
  saveStoredOrchestrationState,
  AGENT_ROLES,
  WORKFLOW_PRESETS,
  INITIAL_TIMELINE_EVENTS
} from "../data/orchestrationData";

export default function OrchestrationView({
  sessions = [],
  activeSession,
  setActiveSession,
  setPage,
  initialTab = "overview"
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // "overview" | "diagram" | "details" | "timeline"
  const [orchestrationState, setOrchestrationState] = useState(() => getStoredOrchestrationState());
  const [selectedAgentId, setSelectedAgentId] = useState(AGENT_ROLES[0]?.id);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(WORKFLOW_PRESETS[0]?.id);

  // Live Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedStageIndex, setSimulatedStageIndex] = useState(null);
  const [simulationBanner, setSimulationBanner] = useState("");

  // LocalStorage Persistence
  useEffect(() => {
    saveStoredOrchestrationState(orchestrationState);
  }, [orchestrationState]);

  // Handlers for navigating between views
  function handleSelectAgent(agentId) {
    setSelectedAgentId(agentId);
    setActiveTab("details");
  }

  function handleOpenSession(sessionId) {
    const s = sessions.find((ses) => ses.id === sessionId) || activeSession || sessions[0];
    if (s && setActiveSession) {
      setActiveSession(s);
      if (setPage) setPage("Research Workspace");
    } else if (setPage) {
      setPage("Research Workspace");
    }
  }

  function handleOpenDocument() {
    if (setPage) setPage("Document Library");
  }

  // Live Pipeline Simulation (Stages 1 through 6)
  function handleRunPipelineSimulation() {
    setIsSimulating(true);
    setSimulatedStageIndex(0);
    setSimulationBanner("Stage 1/6: Document Agent extracting text & tables from ingested filings...");

    // Stage 1: Document Agent
    setTimeout(() => {
      setSimulatedStageIndex(1);
      setSimulationBanner("Stage 2/6: Extraction Agent harvesting GAAP metrics and normalizing ratios...");

      // Stage 2: Extraction Agent
      setTimeout(() => {
        setSimulatedStageIndex(2);
        setSimulationBanner("Stage 3/6: Red Flag Agent running forensic scans on falling margins & headcount...");

        // Stage 3: Red Flag Agent
        setTimeout(() => {
          setSimulatedStageIndex(3);
          setSimulationBanner("Stage 4/6: Comparison Agent decomposing cross-company EBIT spreads (387 bps)...");

          // Stage 4: Comparison Agent
          setTimeout(() => {
            setSimulatedStageIndex(4);
            setSimulationBanner("Stage 5/6: Research Agent constructing conversational reasoning chain with citations...");

            // Stage 5: Research Agent
            setTimeout(() => {
              setSimulatedStageIndex(5);
              setSimulationBanner("Stage 6/6: Report Agent compiling institutional analyst PDF research dossier...");

              // Stage 6: Report Agent
              setTimeout(() => {
                setIsSimulating(false);
                setSimulatedStageIndex(null);
                setSimulationBanner("");

                // Append new simulation event to timeline
                const newEvent = {
                  id: `evt-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString(),
                  relativeTime: "Just now",
                  agentId: "reportAgent",
                  agentName: "Report Agent",
                  status: "Completed",
                  title: "Pipeline Simulation Completed",
                  description: "Full 6-agent collaborative research cycle executed with verified citation grounding.",
                  sessionId: activeSession?.id || "session-1",
                  sessionTitle: activeSession?.title || "Infosys vs TCS Peer Benchmarking",
                  docRef: "Audited Annual Reports FY24",
                  evidence: "Extracted claims mapped to indexed chunks in vector store citations."
                };

                setOrchestrationState((prev) => ({
                  ...prev,
                  timeline: [newEvent, ...prev.timeline]
                }));
              }, 1200);
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1200);
    }, 1200);
  }

  // Simulate Error State on Red Flag Agent
  function handleSimulateError() {
    setOrchestrationState((prev) => {
      const updatedAgents = prev.agents.map((a) =>
        a.id === "redFlagAgent" ? { ...a, defaultStatus: "Failed" } : a
      );
      return {
        ...prev,
        agents: updatedAgents
      };
    });
    setSelectedAgentId("redFlagAgent");
    setActiveTab("details");
  }

  // Reset Pipeline to Clean State
  function handleResetPipeline() {
    setIsSimulating(false);
    setSimulatedStageIndex(null);
    setSimulationBanner("");
    setOrchestrationState({
      agents: AGENT_ROLES,
      workflows: WORKFLOW_PRESETS,
      timeline: INITIAL_TIMELINE_EVENTS
    });
  }

  return (
    <section className="page fin-orchestration-page animate-fadeIn space-y-6">
      {/* Page Title & Main Header */}
      <div className="flex items-center justify-between pb-4 border-b border-subtle flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-main">
            Multi-Agent Orchestrator & System Runtime
          </h1>
          <p className="text-xs text-muted max-w-2xl mt-0.5 leading-relaxed">
            Execution monitoring, pipeline timeline, and agent coordination across the 6 specialized financial research agents.
          </p>
        </div>

        {/* View Switcher Tabs & Simulation Action Controls */}
        <div className="flex-row items-center gap-2 flex-wrap">
          {/* 4 Page Tabs */}
          <div className="flex-row items-center gap-1 p-1 bg-card-subtle border border-border-color rounded-lg">
            <button
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "overview"
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted hover:text-main"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Agent Operations
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "diagram"
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted hover:text-main"
              }`}
              onClick={() => setActiveTab("diagram")}
            >
              Workflow Diagram
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "details"
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted hover:text-main"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Execution Details
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "timeline"
                  ? "bg-accent text-white shadow-sm"
                  : "text-muted hover:text-main"
              }`}
              onClick={() => setActiveTab("timeline")}
            >
              Activity Timeline
            </button>
          </div>

          {/* Live Pipeline Simulation Controls */}
          <Button
            variant="primary"
            size="sm"
            icon={Play}
            loading={isSimulating}
            onClick={handleRunPipelineSimulation}
          >
            {isSimulating ? "Simulating Pipeline..." : "Simulate Live Pipeline"}
          </Button>

          <button
            type="button"
            className="fin-btn fin-btn-ghost fin-btn-xs text-warning"
            onClick={handleSimulateError}
            disabled={isSimulating}
            title="Simulate error state on Red Flag Agent"
          >
            <AlertTriangle size={13} />
            <span>Simulate Error</span>
          </button>

          <button
            type="button"
            className="fin-btn fin-btn-ghost fin-btn-xs text-muted"
            onClick={handleResetPipeline}
            disabled={isSimulating}
            title="Reset pipeline state"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* Transparent Demonstration Disclaimer Banner */}
      <div className="fin-info-banner">
        <div className="flex-row items-start gap-2.5">
          <Info size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-muted leading-relaxed">
            <strong className="text-main block mb-0.5">
              SIMULATED ORCHESTRATION ENVIRONMENT
            </strong>
            Agent dispatches, execution durations, workflow dependencies, and timeline telemetry are simulated in-browser
            for visual monitoring and pipeline inspection. No backend AI logic, external LLM calls, or background workers
            are invoked.
          </div>
        </div>
      </div>

      {/* Live Pipeline Simulation Banner */}
      {isSimulating && (
        <div className="p-4 border rounded-lg bg-accent/10 border-accent/40 flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex-row items-center gap-3">
            <Cpu size={20} className="text-accent animate-pulse" />
            <div>
              <strong className="text-xs font-bold text-main block">
                {simulationBanner}
              </strong>
              <span className="text-[11px] text-muted">
                Executing collaborative agent handoffs with real-time telemetry.
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-accent">
            Stage {simulatedStageIndex !== null ? simulatedStageIndex + 1 : 1} / 6
          </span>
        </div>
      )}

      {/* Page 1: Agent Overview / Operations */}
      {activeTab === "overview" && (
        <AgentOverviewGrid
          agents={orchestrationState.agents}
          onSelectAgent={handleSelectAgent}
          onRunSimulation={handleRunPipelineSimulation}
          isSimulating={isSimulating}
        />
      )}

      {/* Page 2: Workflow Visualization Diagram */}
      {activeTab === "diagram" && (
        <WorkflowDiagram
          agents={orchestrationState.agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={handleSelectAgent}
        />
      )}

      {/* Page 3: Execution Details */}
      {activeTab === "details" && (
        <ExecutionDetailsView
          workflows={orchestrationState.workflows}
          selectedWorkflowId={selectedWorkflowId}
          selectedAgentId={selectedAgentId}
          activeSession={activeSession}
          onSelectWorkflow={(wfId) => setSelectedWorkflowId(wfId)}
          onOpenSession={handleOpenSession}
          onOpenDocument={handleOpenDocument}
          onUpdateWorkflow={(updatedWf) => {
            setOrchestrationState((prev) => ({
              ...prev,
              workflows: prev.workflows.map((w) => (w.id === updatedWf.id ? updatedWf : w))
            }));
          }}
        />
      )}

      {/* Page 4: Agent Activity Timeline */}
      {activeTab === "timeline" && (
        <ActivityTimelineFeed
          events={orchestrationState.timeline}
          onSelectAgent={handleSelectAgent}
          onSelectSession={handleOpenSession}
        />
      )}
    </section>
  );
}
