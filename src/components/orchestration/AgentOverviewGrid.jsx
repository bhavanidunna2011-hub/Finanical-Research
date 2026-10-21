import React from "react";
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
  Cpu,
  ArrowRight,
  ShieldCheck,
  Activity,
  Zap,
  Sparkles
} from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function AgentOverviewGrid({
  agents = [],
  onSelectAgent,
  onRunSimulation,
  isSimulating
}) {
  const iconMap = {
    FileText: FileText,
    Layers: Layers,
    AlertTriangle: AlertTriangle,
    GitCompare: GitCompare,
    Bot: Bot,
    Printer: Printer
  };

  const completedCount = agents.filter((a) => a.defaultStatus === "Completed").length;
  const runningCount = agents.filter((a) => a.defaultStatus === "Running").length;
  const failedCount = agents.filter((a) => a.defaultStatus === "Failed").length;

  return (
    <div className="fin-agent-operations-view space-y-6 animate-fadeIn">
      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Orchestrated Agents</span>
          <strong className="text-2xl font-bold font-mono text-main block mt-1">
            6 Specialized Agents
          </strong>
          <span className="text-[11px] text-accent flex-row items-center gap-1 mt-1 font-semibold">
            <Cpu size={12} /> Autonomous Pipeline Ready
          </span>
        </div>

        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Orchestration Mode</span>
          <strong className="text-xl font-bold text-main block mt-1">
            {runningCount > 0 ? `${runningCount} Running` : "Client Simulation"}
          </strong>
          <span className="text-[11px] text-teal flex-row items-center gap-1 mt-1 font-semibold">
            <CheckCircle2 size={12} /> In-Browser Diagnostics
          </span>
        </div>

        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Benchmark Latency</span>
          <strong className="text-2xl font-bold font-mono text-accent block mt-1">
            ~2.4s
          </strong>
          <span className="text-[11px] text-muted block mt-1">
            Simulated pipeline estimate
          </span>
        </div>

        <div className="fin-stat-card p-4 border rounded-lg bg-card">
          <span className="text-xs text-muted block">Active Research Runs</span>
          <strong className="text-2xl font-bold font-mono text-main block mt-1">
            3 Workflows
          </strong>
          <span className="text-[11px] text-muted block mt-1">
            INFY vs TCS, AAPL, MSFT
          </span>
        </div>
      </div>

      {/* Six Agent Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const IconComponent = iconMap[agent.icon] || Cpu;
          const isCompleted = agent.defaultStatus === "Completed";
          const isRunning = agent.defaultStatus === "Running";
          const isFailed = agent.defaultStatus === "Failed";
          const isIdle = agent.defaultStatus === "Idle";

          return (
            <div
              key={agent.id}
              className={`fin-agent-card p-5 border rounded-lg bg-card transition-all flex flex-col justify-between hover:border-accent/60 ${
                isRunning
                  ? "border-accent ring-1 ring-accent/40 shadow-glow"
                  : isFailed
                  ? "border-danger bg-danger/5"
                  : "border-border-color"
              }`}
            >
              <div>
                {/* Card Top: Icon, Agent Name, Status Badge */}
                <div className="flex-row items-start justify-between gap-3 mb-3">
                  <div className="flex-row items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                      style={{
                        backgroundColor: `${agent.color}20`,
                        color: agent.color,
                        border: `1px solid ${agent.color}40`
                      }}
                    >
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-main block">
                        {agent.name}
                      </h3>
                      <span className="text-[10px] text-dim block font-mono">
                        {agent.category}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      isCompleted
                        ? "success"
                        : isRunning
                        ? "warning"
                        : isFailed
                        ? "danger"
                        : "default"
                    }
                    size="xs"
                    dot
                  >
                    {agent.defaultStatus}
                  </Badge>
                </div>

                {/* Agent Responsibility */}
                <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-3" title={agent.responsibility}>
                  {agent.responsibility}
                </p>

                {/* Current Task Box */}
                <div className="p-3 border rounded bg-card-subtle mb-4 space-y-1.5">
                  <div className="flex-row items-center justify-between text-[10px] text-dim">
                    <span className="font-semibold uppercase tracking-wider">Current Task</span>
                    {isRunning && (
                      <span className="text-accent flex-row items-center gap-1 font-mono">
                        <RefreshCw size={10} className="animate-spin" /> In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-main font-medium leading-relaxed">
                    {agent.currentTask}
                  </p>
                </div>

                {/* Metadata Row: Last Activity & Processing Duration */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-subtle">
                  <div>
                    <span className="text-[11px] text-muted block">Last Activity:</span>
                    <strong className="text-main font-mono text-[11px] block mt-0.5">
                      {agent.lastActivity || "Just now"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted block">Processing Duration:</span>
                    <strong className="text-accent font-mono text-[11px] block mt-0.5">
                      {agent.duration ? `${agent.duration} (Simulated)` : "N/A"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Button: Links to Agent Details (Page 3) */}
              <div className="pt-3 mt-3 border-t border-subtle flex-row justify-between items-center">
                <span className="text-[10px] text-dim font-mono truncate max-w-[150px]" title={agent.stats}>
                  {agent.stats}
                </span>

                <Button
                  variant="ghost"
                  size="xs"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => onSelectAgent && onSelectAgent(agent.id)}
                >
                  Inspect Agent
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
