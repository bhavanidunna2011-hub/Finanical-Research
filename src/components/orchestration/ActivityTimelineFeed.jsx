import React, { useState, useMemo } from "react";
import {
  FileText,
  Layers,
  AlertTriangle,
  GitCompare,
  Bot,
  Printer,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Bookmark,
  Activity,
  Sparkles
} from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { AGENT_ROLES } from "../../data/orchestrationData";

export default function ActivityTimelineFeed({
  events = [],
  onSelectAgent,
  onSelectSession
}) {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  const iconMap = {
    documentAgent: FileText,
    extractionAgent: Layers,
    redFlagAgent: AlertTriangle,
    comparisonAgent: GitCompare,
    researchAgent: Bot,
    reportAgent: Printer
  };

  function toggleExpand(id) {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  // Filtered timeline
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // 1. Agent filter
      if (selectedAgentFilter !== "all" && evt.agentId !== selectedAgentFilter) {
        return false;
      }

      // 2. Status filter
      if (selectedStatusFilter !== "all" && evt.status !== selectedStatusFilter) {
        return false;
      }

      // 3. Search query
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const inTitle = evt.title.toLowerCase().includes(q);
        const inDesc = evt.description.toLowerCase().includes(q);
        const inDoc = evt.docRef?.toLowerCase().includes(q);
        const inAgent = evt.agentName.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inDoc && !inAgent) return false;
      }

      return true;
    });
  }, [events, selectedAgentFilter, selectedStatusFilter, searchFilter]);

  function handleResetFilters() {
    setSelectedAgentFilter("all");
    setSelectedStatusFilter("all");
    setSearchFilter("");
  }

  return (
    <div className="fin-activity-timeline-view space-y-5 animate-fadeIn">
      {/* Timeline Controls & Multi-Filter Bar */}
      <div className="fin-filter-panel p-4 border rounded-lg bg-card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Events */}
          <div className="md:col-span-6 relative">
            <Search size={15} className="absolute left-3.5 top-2.5 text-muted" />
            <input
              type="text"
              className="fin-input w-full pl-9 pr-8 text-xs"
              placeholder="Search timeline events, metrics, or citations..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            {searchFilter && (
              <button
                type="button"
                className="absolute right-2.5 top-2.5 text-muted hover:text-main"
                onClick={() => setSearchFilter("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter by Agent */}
          <div className="md:col-span-3">
            <select
              className="fin-select w-full text-xs"
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
            >
              <option value="all">All Agents (6 Core)</option>
              {AGENT_ROLES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="md:col-span-3">
            <select
              className="fin-select w-full text-xs"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Warning">Warning / Forensic Flag</option>
              <option value="Failed">Failed</option>
              <option value="Running">Running</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        {(selectedAgentFilter !== "all" || selectedStatusFilter !== "all" || searchFilter) && (
          <div className="flex-row items-center justify-between text-xs pt-2 border-t border-subtle">
            <span className="text-muted">
              Showing <strong className="text-main">{filteredEvents.length}</strong> of {events.length} chronological events
            </span>
            <button
              type="button"
              className="text-accent hover:underline text-xs"
              onClick={handleResetFilters}
            >
              Reset timeline filters
            </button>
          </div>
        )}
      </div>

      {/* Chronological Timeline Feed */}
      <div className="fin-card border rounded-lg bg-card p-5">
        <div className="flex-row items-center justify-between pb-3 mb-4 border-b border-subtle">
          <div className="flex-row items-center gap-2">
            <Activity size={16} className="text-accent" />
            <h3 className="text-sm font-bold text-main">
              Chronological Orchestrator Event Log
            </h3>
          </div>
          <span className="text-xs text-muted font-mono">
            {filteredEvents.length} Recorded Events
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-color">
            {filteredEvents.map((evt) => {
              const IconComponent = iconMap[evt.agentId] || Activity;
              const isExpanded = expandedItems[evt.id];
              const isWarning = evt.status === "Warning";
              const isFailed = evt.status === "Failed";

              return (
                <div key={evt.id} className="relative group animate-fadeIn">
                  {/* Timeline Bullet Node */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                      isWarning
                        ? "bg-warning text-black border-warning"
                        : isFailed
                        ? "bg-danger text-white border-danger"
                        : "bg-card border-accent text-accent"
                    }`}
                  >
                    {isWarning ? "!" : isFailed ? "✕" : "✓"}
                  </div>

                  {/* Event Card Content */}
                  <div className="p-3.5 border rounded-lg bg-card-subtle hover:border-accent/40 transition-all space-y-2">
                    <div className="flex-row items-start justify-between gap-2 flex-wrap">
                      <div className="flex-row items-center gap-2 flex-wrap">
                        <Badge variant="primary" size="xs">
                          {evt.agentName}
                        </Badge>
                        <strong className="text-xs text-main">
                          {evt.title}
                        </strong>
                      </div>

                      <div className="flex-row items-center gap-2">
                        <span className="text-[10px] font-mono text-dim">
                          {evt.timestamp} ({evt.relativeTime})
                        </span>
                        <Badge
                          variant={isWarning ? "warning" : isFailed ? "danger" : "success"}
                          size="xs"
                        >
                          {evt.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className="text-xs text-muted leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Document Reference & Evidence */}
                    <div className="flex-row items-center justify-between text-[11px] pt-1">
                      <div className="flex-row items-center gap-1.5 text-accent font-mono truncate max-w-md">
                        <Bookmark size={11} className="shrink-0" />
                        <span className="truncate">{evt.docRef}</span>
                      </div>

                      <div className="flex-row items-center gap-2">
                        {evt.evidence && (
                          <button
                            type="button"
                            className="text-[11px] text-dim hover:text-main flex-row items-center gap-1"
                            onClick={() => toggleExpand(evt.id)}
                          >
                            <span>{isExpanded ? "Hide Evidence" : "View Evidence"}</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        )}

                        <button
                          type="button"
                          className="text-[11px] text-accent hover:underline font-semibold"
                          onClick={() => onSelectAgent && onSelectAgent(evt.agentId)}
                        >
                          Inspect Agent →
                        </button>
                      </div>
                    </div>

                    {/* Expandable Evidence Snippet */}
                    {isExpanded && evt.evidence && (
                      <div className="p-2.5 rounded bg-card border border-subtle text-xs text-main font-serif italic mt-2 animate-fadeIn">
                        "{evt.evidence}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <EmptyState
              title="No Activity Events Found"
              description="No timeline events match your current filter settings. Reset filters to view all orchestrator activities."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          </div>
        )}
      </div>
    </div>
  );
}
