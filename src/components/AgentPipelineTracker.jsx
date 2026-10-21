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
  Play,
  RotateCw,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sparkles,
  Zap,
  Terminal,
  Copy
} from "lucide-react";
import { AGENT_PIPELINE_STAGES } from "../data/seedData";

export default function AgentPipelineTracker({ isRunning, onTriggerRun }) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [copiedLogs, setCopiedLogs] = useState(false);

  const iconMap = {
    FileText: <FileText size={18} />,
    Layers: <Layers size={18} />,
    AlertTriangle: <AlertTriangle size={18} />,
    GitCompare: <GitCompare size={18} />,
    Bot: <Bot size={18} />,
    Printer: <Printer size={18} />
  };

  const agentLogs = {
    documentAgent: [
      "[00:01.02] Ingestion trigger received for 2 annual reports (Infosys & TCS).",
      "[00:02.14] PDF parsed into 804 total pages and 68 tabular financial statements.",
      "[00:03.45] Chunking completed: 3,000 semantic chunks created (avg 420 tokens/chunk).",
      "[00:04.20] Embeddings generated via 1536-dim model. Vector DB index updated."
    ],
    extractionAgent: [
      "[00:00.32] Querying vector index for Consolidated P&L, Balance Sheet, and Cash Flow tables.",
      "[00:01.12] Extracted INFY: Revenue ₹153,670 Cr (+4.7%), EBIT Margin 20.7%, FCF ₹23,982 Cr.",
      "[00:01.95] Extracted TCS: Revenue ₹240,893 Cr (+6.8%), EBIT Margin 24.6%, FCF ₹44,289 Cr.",
      "[00:02.80] Financial ratios normalized and reconciliations validated."
    ],
    redFlagAgent: [
      "[00:00.41] Scanning for 8 distress heuristics: Margin compression, debt surge, employee attrition.",
      "[00:01.20] Flagged INFY: BFSI vertical contraction (-1.0% CC) and 25,933 headcount decrease.",
      "[00:02.15] Flagged TCS: Continental Europe slowdown (-1.2% CC) and Epic litigation charge.",
      "[00:03.10] Auditor reports parsed: Both received Unmodified (Clean) opinions with Key Audit Matters."
    ],
    comparisonAgent: [
      "[00:00.22] Cross-referencing INFY vs TCS peer metrics.",
      "[00:00.95] Computed EBIT spread: TCS leads by 387 bps (24.6% vs 20.7%).",
      "[00:01.40] Computed Order Book variance: TCS TCV $42.7B vs INFY TCV $17.7B.",
      "[00:01.90] Side-by-side benchmark matrix assembled."
    ],
    researchAgent: [
      "[00:00.10] Multi-part query reasoning engine initialized.",
      "[00:00.50] Strict citation verification hook attached: all answers require page-level references.",
      "[00:00.80] Conversational state ready for multi-step financial inquiries."
    ],
    reportAgent: [
      "[00:00.20] Synthesizing outputs from Document, Extraction, Red Flag, and Comparison agents.",
      "[00:00.85] Formatted Executive Summary, Key Financials, Risk Matrix, and Outlook.",
      "[00:01.40] Analyst PDF research report compiled and ready for export."
    ]
  };

  return (
    <div className="agent-orchestration-card">
      <div className="orchestration-header">
        <div>
          <div className="flex-row items-center gap-2 mb-1">
            <span className="badge badge-ai-glow">
              <Cpu size={13} style={{ marginRight: 5, display: "inline" }} />
              AUTONOMOUS MULTI-AGENT ORCHESTRATOR
            </span>
            <span className="live-status-pill">
              <span className="pulsing-dot" />
              Pipeline Online • 6 Agents Active
            </span>
          </div>
          <h3 className="orchestrator-main-title">Continuous Multi-Agent Financial Research Pipeline</h3>
          <p className="muted text-sm">
            Specialized agents collaborate asynchronously: Ingest filings → Extract GAAP metrics → Flag forensic anomalies → Benchmark peers → Generate publication dossiers.
          </p>
        </div>

        <div className="orchestration-actions">
          <button
            className="secondary-button btn-sm"
            onClick={() => setShowLogs(!showLogs)}
          >
            <Terminal size={14} style={{ marginRight: 6, display: "inline" }} />
            {showLogs ? "Hide Terminal" : "Inspect Agent Bus"}
          </button>

          <button
            className="luminous-run-button"
            onClick={onTriggerRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <RotateCw size={14} className="spin-icon" style={{ marginRight: 6, display: "inline" }} />
                Synchronizing Pipeline...
              </>
            ) : (
              <>
                <Zap size={14} style={{ marginRight: 6, display: "inline" }} />
                Execute Multi-Agent Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stepper with visual connection flow line */}
      <div className="pipeline-stepper-container">
        <div className="pipeline-track-line" />
        <div className="pipeline-stepper">
          {AGENT_PIPELINE_STAGES.map((agent, index) => {
            const isSelected = selectedAgent === agent.id;
            return (
              <div
                key={agent.id}
                className={`stepper-node ${isRunning ? "node-running" : "node-complete"} ${
                  isSelected ? "node-selected" : ""
                }`}
                onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
              >
                <div className="stepper-badge">
                  <span className="node-icon">{iconMap[agent.icon]}</span>
                  <span className="node-num">0{index + 1}</span>
                </div>
                <div className="stepper-content">
                  <div className="stepper-title-row">
                    <strong>{agent.name}</strong>
                    <span className="duration-tag">{agent.duration}</span>
                  </div>
                  <span className="stepper-role">{agent.role}</span>
                  <p className="stepper-stats">{agent.stats}</p>
                </div>
                <div className="stepper-status">
                  <span className="verified-halo">
                    <CheckCircle2 size={15} className="text-success" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedAgent && (
        <div className="agent-detail-drawer animate-fadeIn">
          <div className="drawer-header">
            <div>
              <span className="eyebrow-glow">DEEP AGENT INSPECTION</span>
              <h4>{AGENT_PIPELINE_STAGES.find((a) => a.id === selectedAgent)?.name}</h4>
              <p className="muted text-sm">
                {AGENT_PIPELINE_STAGES.find((a) => a.id === selectedAgent)?.description}
              </p>
            </div>
            <button className="text-button" onClick={() => setSelectedAgent(null)}>
              Close ✕
            </button>
          </div>

          <div className="drawer-logs mt-3">
            <div className="flex-row justify-between items-center mb-1">
              <span className="log-title">AGENT RUNTIME LOGS:</span>
              <button
                className="text-button text-xs"
                onClick={() => {
                  navigator.clipboard?.writeText(agentLogs[selectedAgent]?.join("\n"));
                  setCopiedLogs(true);
                  setTimeout(() => setCopiedLogs(false), 2000);
                }}
              >
                <Copy size={12} style={{ marginRight: 4, display: "inline" }} />
                {copiedLogs ? "Trace Copied!" : "Copy Trace"}
              </button>
            </div>
            <pre className="code-block">
              {agentLogs[selectedAgent]?.join("\n") || "No logs available."}
            </pre>
          </div>
        </div>
      )}

      {showLogs && !selectedAgent && (
        <div className="pipeline-global-logs animate-fadeIn">
          <div className="flex-row justify-between items-center mb-2">
            <span className="eyebrow-glow">MULTI-AGENT MESSAGE BUS STREAM</span>
            <span className="text-xs text-muted">Latency: 12ms • All 6 agents synchronized</span>
          </div>
          <div className="terminal-window">
            {Object.entries(agentLogs).flatMap(([agentId, logs]) =>
              logs.map((log, i) => (
                <div key={`${agentId}-${i}`} className="terminal-line">
                  <span className="terminal-prefix">[{agentId.toUpperCase()}]</span> {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
