import React, { useState } from "react";
import {
  Bot,
  User,
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileText,
  ExternalLink,
  BookOpen,
  Layers,
  Table as TableIcon,
  HelpCircle,
  AlertCircle
} from "lucide-react";

export default function ChatMessageItem({
  message,
  onCitationClick,
  onViewDocument
}) {
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const [excerptsExpanded, setExcerptsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  // System notice
  if (isSystem) {
    return (
      <div className="fin-chat-system-message">
        <div className="system-message-card">
          <ShieldCheck size={15} className="text-teal" />
          <p className="text-xs">{message.content}</p>
        </div>
      </div>
    );
  }

  // Handle Copy Response
  function handleCopy() {
    let copyText = message.content || "";
    if (message.conciseAnswer) {
      copyText = `${message.conciseAnswer}\n\n`;
      if (message.metricsTable) {
        copyText += `Table: ${message.metricsTable.title}\n`;
        copyText += message.metricsTable.headers.join(" | ") + "\n";
        message.metricsTable.rows.forEach((r) => {
          copyText += r.join(" | ") + "\n";
        });
        copyText += "\n";
      }
      if (message.supportingEvidence) {
        copyText += `Supporting Observations:\n`;
        message.supportingEvidence.forEach((e) => {
          copyText += `• ${e}\n`;
        });
      }
      if (message.citations) {
        copyText += `\nCitations:\n`;
        message.citations.forEach((c) => {
          copyText += `[${c.docName || c.company}, p. ${c.page !== null && c.page !== undefined ? c.page : "Unavailable"}] - "${c.passage || "Unavailable"}"\n`;
        });
      }
    }

    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(copyText);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Copy error", e);
    }
  }

  return (
    <div className={`fin-chat-message-row ${isUser ? "user-row" : "assistant-row"}`}>
      {/* Avatar column */}
      <div className="fin-chat-avatar">
        {isUser ? (
          <div className="avatar-box user-avatar">
            <User size={15} />
          </div>
        ) : (
          <div className="avatar-box assistant-avatar">
            <Bot size={17} />
          </div>
        )}
      </div>

      {/* Message Content Bubble */}
      <div className="fin-chat-bubble-container">
        {/* Message Header */}
        <div className="fin-chat-bubble-header">
          <div className="flex-row items-center gap-2">
            <strong className="chat-sender-name">
              {isUser ? "Analyst" : "AI Research"}
            </strong>
            {!isUser && message.citations && message.citations.length > 0 && (
              <span className="fin-badge fin-badge-teal fin-badge-xs">
                <ShieldCheck size={11} className="mr-1" />
                {message.citations.length} Sources Cited
              </span>
            )}
          </div>

          <div className="flex-row items-center gap-2">
            <span className="chat-timestamp">{message.timestamp || "Just now"}</span>
            {!isUser && (
              <button
                type="button"
                className="chat-action-btn"
                onClick={handleCopy}
                title="Copy answer to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-success" />
                    <span className="text-xs text-success">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* User Message Content */}
        {isUser && (
          <div className="user-message-text">
            <p>{message.content}</p>
          </div>
        )}

        {/* Assistant Message Structured Layout */}
        {!isUser && (
          <div className="assistant-structured-content">
            {/* 1. Concise Answer */}
            {message.conciseAnswer && (
              <div className="concise-answer-box">
                <p className="concise-answer-text">{message.conciseAnswer}</p>
              </div>
            )}

            {/* If simple content fallback */}
            {message.content && !message.conciseAnswer && (
              <div className="simple-answer-text">
                <p>{message.content}</p>
              </div>
            )}

            {/* 2. Step-by-Step Explanation Accordion */}
            {message.stepByStepExplanation && message.stepByStepExplanation.length > 0 && (
              <div className="reasoning-accordion-card">
                <button
                  type="button"
                  className="reasoning-accordion-header"
                  onClick={() => setReasoningExpanded(!reasoningExpanded)}
                  aria-expanded={reasoningExpanded}
                >
                  <div className="flex-row items-center gap-2">
                    <Layers size={15} className="text-teal" />
                    <span className="reasoning-header-title">
                      Multi-Step Grounding & Reconcilement Chain
                    </span>
                    <span className="fin-badge fin-badge-outline fin-badge-xs">
                      {message.stepByStepExplanation.length} Steps
                    </span>
                  </div>
                  {reasoningExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </button>

                {reasoningExpanded && (
                  <div className="reasoning-steps-timeline">
                    {message.stepByStepExplanation.map((stepItem, sIdx) => (
                      <div key={sIdx} className="timeline-step-node">
                        <div className="timeline-node-bullet">
                          <span>{stepItem.step || sIdx + 1}</span>
                        </div>
                        <div className="timeline-node-content">
                          <strong className="timeline-step-title">{stepItem.title}</strong>
                          <p className="timeline-step-detail">{stepItem.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Financial Metrics & Tables */}
            {message.metricsTable && (
              <div className="chat-metrics-table-card">
                <div className="table-header-bar">
                  <div className="flex-row items-center gap-2">
                    <TableIcon size={14} className="text-accent" />
                    <span className="table-card-title">{message.metricsTable.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted">
                    Verified Statement Data
                  </span>
                </div>

                <div className="table-scroll-wrapper">
                  <table className="fin-custom-table">
                    <thead>
                      <tr>
                        {message.metricsTable.headers.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {message.metricsTable.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => {
                            const isPositive = typeof cell === "string" && cell.includes("+");
                            const isNegative = typeof cell === "string" && cell.includes("-") && !cell.includes("FY");
                            return (
                              <td key={cIdx}>
                                {cIdx === 0 ? (
                                  <strong className="text-main">{cell}</strong>
                                ) : (
                                  <span
                                    className={
                                      isPositive
                                        ? "text-success font-semibold"
                                        : isNegative
                                        ? "text-warning font-semibold"
                                        : ""
                                    }
                                  >
                                    {cell}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Supporting Evidence Points */}
            {message.supportingEvidence && message.supportingEvidence.length > 0 && (
              <div className="supporting-evidence-box">
                <span className="evidence-title">Audited Supporting Observations:</span>
                <ul className="evidence-list">
                  {message.supportingEvidence.map((ev, eIdx) => (
                    <li key={eIdx} className="evidence-item">
                      <span className="bullet-dash">•</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Source Citations (Document names & page references) */}
            {message.citations && message.citations.length > 0 && (
              <div className="chat-citations-strip">
                <div className="citations-header">
                  <BookOpen size={13} className="text-teal" />
                  <span className="citations-label">Source Document Citations:</span>
                </div>

                <div className="citations-chips-flow">
                  {message.citations.map((cite, cIdx) => {
                    const hasPage = cite.page !== null && cite.page !== undefined;
                    return (
                      <button
                        key={cIdx}
                        type="button"
                        className="chat-citation-chip"
                        onClick={() => onCitationClick && onCitationClick(cite)}
                        title={`Inspect citation: ${cite.docName || cite.company}`}
                      >
                        <FileText size={12} className="chip-icon" />
                        <span className="chip-doc">{cite.docName || cite.company || "Filing"}</span>
                        <span className={`chip-page ${!hasPage ? "chip-unavailable" : ""}`}>
                          {hasPage ? `p. ${cite.page}` : "p. Unavailable"}
                        </span>
                        <ExternalLink size={11} className="chip-arrow" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. Expandable Source Excerpts */}
            {message.sourceExcerpts && message.sourceExcerpts.length > 0 && (
              <div className="source-excerpts-card">
                <button
                  type="button"
                  className="excerpts-toggle-header"
                  onClick={() => setExcerptsExpanded(!excerptsExpanded)}
                >
                  <div className="flex-row items-center gap-2">
                    <FileText size={14} className="text-accent" />
                    <span className="excerpts-title">
                      Verbatim Document Excerpts ({message.sourceExcerpts.length})
                    </span>
                  </div>
                  {excerptsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {excerptsExpanded && (
                  <div className="excerpts-body-list">
                    {message.sourceExcerpts.map((exc, xIdx) => {
                      const hasPage = exc.page !== null && exc.page !== undefined;
                      return (
                        <div key={xIdx} className="excerpt-item">
                          <div className="excerpt-meta">
                            <span className="font-semibold text-main">{exc.docName}</span>
                            <span className="text-muted text-xs">
                              {hasPage ? `Page ${exc.page}` : "Page: Unavailable"}
                              {exc.section ? ` • ${exc.section}` : ""}
                            </span>
                            {hasPage && (
                              <button
                                type="button"
                                className="excerpt-view-btn"
                                onClick={() =>
                                  onViewDocument && onViewDocument(exc.docName, exc.page)
                                }
                              >
                                View in Document Viewer →
                              </button>
                            )}
                          </div>
                          <blockquote className="excerpt-quote">
                            "{exc.snippet || exc.passage || "Excerpt passage unavailable."}"
                          </blockquote>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
