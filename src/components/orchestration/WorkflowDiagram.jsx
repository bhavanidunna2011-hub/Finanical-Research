import React, { useState } from "react";
import {
  FileText,
  Layers,
  AlertTriangle,
  GitCompare,
  Bot,
  Printer,
  UploadCloud,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Split,
  Workflow,
  Sparkles,
  Info,
  ChevronRight
} from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function WorkflowDiagram({
  agents = [],
  selectedAgentId,
  onSelectAgent
}) {
  const [pipelineMode, setPipelineMode] = useState("multi"); // "multi" | "single" | "forensic" | "chat"

  const iconMap = {
    FileText: FileText,
    Layers: Layers,
    AlertTriangle: AlertTriangle,
    GitCompare: GitCompare,
    Bot: Bot,
    Printer: Printer
  };

  // Determine active state for each agent based on conditional pipeline mode
  function getAgentStateInMode(agentId) {
    if (pipelineMode === "single") {
      if (agentId === "comparisonAgent") {
        return { active: false, status: "Bypassed", note: "Bypassed (Single-company analysis)" };
      }
    } else if (pipelineMode === "forensic") {
      if (["comparisonAgent", "researchAgent", "reportAgent"].includes(agentId)) {
        return { active: false, status: "Idle", note: "Not invoked in Forensic Scan" };
      }
    } else if (pipelineMode === "chat") {
      if (["comparisonAgent", "reportAgent"].includes(agentId)) {
        return { active: false, status: "Optional", note: "Bypassed for rapid Q&A dialog" };
      }
    }
    return { active: true, status: "Completed", note: "Active in pipeline" };
  }

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  return (
    <div className="fin-workflow-diagram-view space-y-6 animate-fadeIn">
      {/* Workflow Mode & Conditional Branch Presets */}
      <div className="fin-card p-5 border rounded-lg bg-card space-y-4">
        <div className="flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex-row items-center gap-2">
              <Workflow size={16} className="text-accent" />
              <h3 className="text-sm font-bold text-main">
                Interactive Orchestration Flow & Conditional Branches
              </h3>
            </div>
            <p className="text-xs text-muted mt-0.5">
              Visualizes agent dependencies, data handoffs, and conditional execution branching based on research scope.
            </p>
          </div>

          {/* Conditional Branch Mode Switcher */}
          <div className="fin-dag-mode-group">
            <button
              type="button"
              className={`fin-dag-mode-btn ${pipelineMode === "multi" ? "active" : ""}`}
              onClick={() => setPipelineMode("multi")}
            >
              Multi-Company Benchmark (6 Agents)
            </button>
            <button
              type="button"
              className={`fin-dag-mode-btn ${pipelineMode === "single" ? "active" : ""}`}
              onClick={() => setPipelineMode("single")}
            >
              Single Company (Bypasses Comparison)
            </button>
            <button
              type="button"
              className={`fin-dag-mode-btn ${pipelineMode === "forensic" ? "active" : ""}`}
              onClick={() => setPipelineMode("forensic")}
            >
              Forensic Anomaly Scan
            </button>
          </div>
        </div>

        {/* Conditional Mode Explanation Banner */}
        <div className="fin-dag-mode-banner">
          <div className="flex-row items-center gap-2 text-muted">
            <Split size={14} className="text-accent shrink-0" />
            <span>
              {pipelineMode === "multi" && (
                <>
                  <strong className="text-main font-semibold">Multi-Company Benchmark Mode: </strong>
                  All 6 agents run sequentially with Comparison Agent decomposing cross-company EBIT spreads and order books.
                </>
              )}
              {pipelineMode === "single" && (
                <>
                  <strong className="text-main font-semibold">Single Company Branch: </strong>
                  Comparison Agent is automatically bypassed because no peer targets are defined. Pipeline branches directly from Red Flag Agent to Research Agent.
                </>
              )}
              {pipelineMode === "forensic" && (
                <>
                  <strong className="text-main font-semibold">Targeted Forensic Scan: </strong>
                  Executes Document Agent ➔ Extraction Agent ➔ Red Flag Agent to surface accounting anomalies without compiling a full report.
                </>
              )}
            </span>
          </div>

          <Badge variant="teal" size="xs">
            Dynamic DAG Execution
          </Badge>
        </div>
      </div>

      {/* Visual Workflow Diagram Nodes Container */}
      <div className="fin-diagram-canvas">
        <div className="fin-pipeline-dag-track">
          {/* Starting Node: Document Upload */}
          <div className="fin-dag-start-node">
            <div className="fin-dag-start-icon-box">
              <UploadCloud size={24} />
            </div>
            <strong className="fin-dag-start-title">Document Upload</strong>
            <span className="fin-dag-start-sub">PDF Filings Ingested</span>
          </div>

          {/* Connector Arrow */}
          <div className="fin-dag-connector">
            <div className="fin-dag-connector-line">
              <ArrowRight size={14} className="fin-dag-connector-arrow" />
            </div>
          </div>

          {/* Six Documented Agents */}
          {agents.map((agent, index) => {
            const IconComponent = iconMap[agent.icon] || FileText;
            const state = getAgentStateInMode(agent.id);
            const isSelected = selectedAgentId === agent.id;
            const isBypassed = !state.active;

            return (
              <React.Fragment key={agent.id}>
                {/* Node Box */}
                <div
                  className={`fin-dag-agent-node ${
                    isSelected ? "selected" : isBypassed ? "bypassed" : ""
                  }`}
                  onClick={() => onSelectAgent && onSelectAgent(agent.id)}
                  title={`${agent.name} - Click to inspect`}
                >
                  {/* Step Sequence Badge */}
                  <div className="fin-dag-agent-top">
                    <span>STAGE 0{index + 1}</span>
                    <Badge
                      variant={isBypassed ? "default" : "success"}
                      size="xs"
                    >
                      {state.status}
                    </Badge>
                  </div>

                  {/* Agent Icon */}
                  <div
                    className="fin-dag-agent-icon-box"
                    style={{
                      backgroundColor: `${agent.color}20`,
                      color: isBypassed ? "#64748b" : agent.color,
                      border: `1px solid ${isBypassed ? "transparent" : agent.color + "50"}`
                    }}
                  >
                    <IconComponent size={20} />
                  </div>

                  <strong className={`fin-dag-agent-name ${isBypassed ? "text-muted" : "text-main"}`}>
                    {agent.shortName || agent.name}
                  </strong>
                  <span className="fin-dag-agent-category">
                    {agent.category}
                  </span>

                  {/* Conditional Branch Tag for Comparison Agent */}
                  {agent.id === "comparisonAgent" && (
                    <span className="fin-dag-conditional-tag">
                      [Conditional Node]
                    </span>
                  )}
                </div>

                {/* Connector Arrow between nodes */}
                {index < agents.length - 1 && (
                  <div className="fin-dag-connector">
                    <div className={`fin-dag-connector-line ${isBypassed ? "bypassed" : ""}`}>
                      <ArrowRight
                        size={14}
                        className={`fin-dag-connector-arrow ${isBypassed ? "bypassed" : ""}`}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Panel */}
      {selectedAgent && (
        <div className="fin-card p-5 border rounded-lg bg-card animate-fadeIn space-y-4">
          <div className="flex-row items-center justify-between border-b border-subtle pb-3">
            <div className="flex-row items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: selectedAgent.color }}
              >
                {React.createElement(iconMap[selectedAgent.icon] || FileText, { size: 18 })}
              </div>
              <div>
                <h4 className="text-sm font-bold text-main">
                  {selectedAgent.name} • Stage Specification
                </h4>
                <p className="text-xs text-muted">
                  {selectedAgent.category} • {selectedAgent.duration ? `${selectedAgent.duration} execution time` : "Live reasoning"}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="xs"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => onSelectAgent && onSelectAgent(selectedAgent.id)}
            >
              View Full Execution Details
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Responsibilities */}
            <div className="p-3 border rounded bg-card-subtle space-y-1.5">
              <span className="text-[11px] font-bold text-main block uppercase tracking-wider">
                Responsibility
              </span>
              <p className="text-muted leading-relaxed">
                {selectedAgent.responsibility}
              </p>
            </div>

            {/* Input & Output Contracts */}
            <div className="p-3 border rounded bg-card-subtle space-y-1.5">
              <span className="text-[11px] font-bold text-main block uppercase tracking-wider">
                Data Contracts
              </span>
              <div className="space-y-1 text-muted">
                <div>
                  <strong className="text-dim">Inputs:</strong> {selectedAgent.inputs?.join(", ")}
                </div>
                <div>
                  <strong className="text-dim">Outputs:</strong> {selectedAgent.outputs?.join(", ")}
                </div>
              </div>
            </div>

            {/* Dependencies & Conditions */}
            <div className="p-3 border rounded bg-card-subtle space-y-1.5">
              <span className="text-[11px] font-bold text-main block uppercase tracking-wider">
                Dependency Rules
              </span>
              <div className="space-y-1 text-muted">
                <div>
                  <strong className="text-dim">Prerequisites:</strong> {selectedAgent.dependencies?.join(" → ")}
                </div>
                <div className="text-accent">
                  <strong className="text-dim">Condition:</strong> {selectedAgent.conditionalNote}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
