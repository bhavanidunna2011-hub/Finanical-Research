import React, { useState, useMemo } from "react";
import {
  Info,
  FileText,
  BookOpen,
  Search,
  CheckSquare,
  Square,
  ShieldCheck,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  Copy,
  Check,
  X,
  Eye,
  Trash2,
  FolderOpen
} from "lucide-react";
import { SEED_COMPANIES } from "../../data/seedData";

export default function ContextSourcesPanel({
  isOpen,
  onClose,
  activeTab = "context",
  onTabChange,
  activeSession,
  sessions = [],
  onSelectSession,
  availableDocuments = [],
  selectedDocIds = [],
  onToggleDocSelection,
  onSelectAllDocs,
  onDeselectAllDocs,
  onOpenDocumentLibrary,
  onViewDocument,
  activeCitation,
  allCitations = [],
  onCitationClick
}) {
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Derive companies from active session
  const primaryCompanyKey = activeSession?.companyIds?.[0] || "INFY";
  const secondaryCompanyKey = activeSession?.companyIds?.[1] || "TCS";
  const primaryCompany = SEED_COMPANIES[primaryCompanyKey] || SEED_COMPANIES.INFY;
  const secondaryCompany = SEED_COMPANIES[secondaryCompanyKey] || SEED_COMPANIES.TCS;
  const isComparison = activeSession?.companyIds?.length > 1;

  // Filtered documents for Sources tab
  const filteredDocs = useMemo(() => {
    const q = docSearchQuery.trim().toLowerCase();
    if (!q) return availableDocuments;
    return availableDocuments.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.company?.toLowerCase().includes(q) ||
        d.ticker?.toLowerCase().includes(q) ||
        d.docType?.toLowerCase().includes(q)
    );
  }, [availableDocuments, docSearchQuery]);

  // Citation metadata checks
  const citeHasPage = activeCitation?.page !== null && activeCitation?.page !== undefined;
  const citeHasPassage = !!activeCitation?.passage || !!activeCitation?.snippet || !!activeCitation?.content;

  function copyCitationText() {
    if (!activeCitation) return;
    const passage = activeCitation.passage || activeCitation.snippet || activeCitation.content || "Passage unavailable";
    const text = `"${passage}" — ${activeCitation.docName || activeCitation.company || "Filing"}, Page ${citeHasPage ? activeCitation.page : "Unavailable"}`;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      }
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    } catch (e) {
      console.warn("Copy error", e);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fin-panel-backdrop lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fin-context-sources-panel"
        aria-label="Context and sources panel"
      >
        {/* Panel Header & Tabs */}
        <div className="fin-panel-header">
          <div className="fin-panel-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "context"}
              className={`fin-panel-tab-btn ${activeTab === "context" ? "active" : ""}`}
              onClick={() => onTabChange("context")}
            >
              <Info size={14} />
              <span>Context</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "sources"}
              className={`fin-panel-tab-btn ${activeTab === "sources" ? "active" : ""}`}
              onClick={() => onTabChange("sources")}
            >
              <FileText size={14} />
              <span>Sources</span>
              <span className="fin-tab-count">{selectedDocIds.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "citations"}
              className={`fin-panel-tab-btn ${activeTab === "citations" ? "active" : ""}`}
              onClick={() => onTabChange("citations")}
            >
              <BookOpen size={14} />
              <span>Citations</span>
              {activeCitation && <span className="fin-tab-active-dot" />}
            </button>
          </div>

          <button
            type="button"
            className="fin-panel-close-btn"
            onClick={onClose}
            title="Close panel"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Panel Content Body */}
        <div className="fin-panel-body">
          {/* =========================================================================
              TAB 1: CONTEXT
             ========================================================================= */}
          {activeTab === "context" && (
            <div className="fin-tab-content animate-fadeIn">
              {/* Active Session Card */}
              <div className="fin-context-section">
                <span className="fin-context-label">RESEARCH SESSION</span>
                <div className="fin-session-select-row mt-1.5">
                  <select
                    className="fin-select fin-select-sm w-full"
                    value={activeSession?.id || ""}
                    onChange={(e) => {
                      const found = sessions.find((s) => s.id === e.target.value);
                      if (found && onSelectSession) onSelectSession(found);
                    }}
                    aria-label="Active research session"
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.company || "General"})
                      </option>
                    ))}
                  </select>
                </div>
                {activeSession?.description && (
                  <p className="fin-context-desc mt-2">{activeSession.description}</p>
                )}
              </div>

              {/* Research Scope & Companies */}
              <div className="fin-context-section mt-5">
                <div className="flex items-center justify-between">
                  <span className="fin-context-label">TARGET ENTITIES</span>
                  <span className="text-[11px] font-mono text-muted">
                    {isComparison ? "Peer Benchmark (2)" : "Single Target (1)"}
                  </span>
                </div>

                <div className="fin-entity-cards-list mt-2">
                  <div className="fin-entity-card">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-semibold text-main">{primaryCompany.name}</strong>
                      <span className="fin-badge fin-badge-outline fin-badge-xs">{primaryCompany.ticker}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted mt-1">
                      <span>{primaryCompany.sector}</span>
                      <span>•</span>
                      <span>{primaryCompany.fiscalYear || "FY 2023-24"}</span>
                    </div>
                    <span className="text-[11px] text-teal block mt-1">
                      Filing: {primaryCompany.filingDocName || "Annual Report"}
                    </span>
                  </div>

                  {isComparison && (
                    <div className="fin-entity-card mt-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-semibold text-main">{secondaryCompany.name}</strong>
                        <span className="fin-badge fin-badge-outline fin-badge-xs">{secondaryCompany.ticker}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted mt-1">
                        <span>{secondaryCompany.sector}</span>
                        <span>•</span>
                        <span>{secondaryCompany.fiscalYear || "FY 2023-24"}</span>
                      </div>
                      <span className="text-[11px] text-teal block mt-1">
                        Filing: {secondaryCompany.filingDocName || "Annual Report"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Grounding & Index Status */}
              <div className="fin-context-section mt-5">
                <span className="fin-context-label">RETRIEVAL GROUNDING</span>
                <div className="fin-grounding-status-box mt-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-teal shrink-0" />
                    <div>
                      <strong className="text-xs font-semibold text-main block">
                        Strict Source Grounding Active
                      </strong>
                      <span className="text-[11px] text-muted">
                        {selectedDocIds.length} of {availableDocuments.length} indexed filings selected
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted mt-2 leading-relaxed">
                    Queries are evaluated strictly against text streams and tables from selected filings. Unsubstantiated claims are excluded.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: SOURCES
             ========================================================================= */}
          {activeTab === "sources" && (
            <div className="fin-tab-content animate-fadeIn">
              {/* Search Bar */}
              <div className="fin-sources-search-box">
                <Search size={14} className="text-muted shrink-0" />
                <input
                  type="text"
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  placeholder="Filter filings by ticker or title..."
                  className="fin-sources-search-input"
                  aria-label="Filter source documents"
                />
                {docSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setDocSearchQuery("")}
                    className="text-xs text-muted hover:text-main"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Bulk Selection Actions */}
              <div className="fin-sources-bulk-bar mt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-xs text-teal hover:underline font-medium"
                    onClick={onSelectAllDocs}
                  >
                    Select All
                  </button>
                  <span className="text-xs text-muted">•</span>
                  <button
                    type="button"
                    className="text-xs text-muted hover:text-main font-medium"
                    onClick={onDeselectAllDocs}
                  >
                    Clear Selection
                  </button>
                </div>
                <span className="text-[11px] font-mono text-muted">
                  {selectedDocIds.length} / {availableDocuments.length} active
                </span>
              </div>

              {/* Documents List */}
              <div className="fin-sources-list mt-3">
                {filteredDocs.length === 0 ? (
                  <div className="fin-empty-state-box p-4 text-center text-xs text-muted">
                    No matching filings found in research scope.
                  </div>
                ) : (
                  filteredDocs.map((doc) => {
                    const isSelected = selectedDocIds.includes(doc.id);
                    const isIndexed = doc.status === "Indexed" || doc.status === "Completed" || true;

                    return (
                      <div
                        key={doc.id}
                        className={`fin-source-item ${isSelected ? "selected" : ""}`}
                        onClick={() => onToggleDocSelection && onToggleDocSelection(doc.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            onToggleDocSelection && onToggleDocSelection(doc.id);
                          }
                        }}
                      >
                        <div className="fin-source-checkbox">
                          {isSelected ? (
                            <CheckSquare size={16} className="text-teal" />
                          ) : (
                            <Square size={16} className="text-muted" />
                          )}
                        </div>

                        <div className="fin-source-info">
                          <div className="flex items-center justify-between gap-1">
                            <span className="fin-source-title truncate" title={doc.name}>
                              {doc.name}
                            </span>
                            <span className="fin-source-ticker font-mono">
                              {doc.ticker || "FILING"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-muted mt-1">
                            <span>
                              {doc.pages ? `${doc.pages} pages` : "Annual Filing"}
                              {doc.fiscalYear ? ` • ${doc.fiscalYear}` : ""}
                            </span>

                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <span className="fin-badge fin-badge-xs fin-badge-teal">
                                Indexed
                              </span>
                              {onViewDocument && (
                                <button
                                  type="button"
                                  className="fin-icon-btn-xs"
                                  onClick={() => onViewDocument(doc.name, 1)}
                                  title="Inspect filing in document viewer"
                                >
                                  <Eye size={12} className="text-teal" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Link to Document Library */}
              {onOpenDocumentLibrary && (
                <div className="mt-4 pt-3 border-t border-subtle">
                  <button
                    type="button"
                    className="fin-btn fin-btn-secondary fin-btn-xs w-full flex items-center justify-center gap-1.5"
                    onClick={onOpenDocumentLibrary}
                  >
                    <FolderOpen size={13} />
                    <span>Manage All Filings in Document Library</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: CITATION DETAILS
             ========================================================================= */}
          {activeTab === "citations" && (
            <div className="fin-tab-content animate-fadeIn">
              {activeCitation ? (
                <div className="fin-citation-active-card">
                  <div className="fin-citation-header-row">
                    <span className="fin-context-label">SELECTED CITATION</span>
                    <button
                      type="button"
                      className="text-[11px] text-teal flex items-center gap-1 hover:underline font-medium"
                      onClick={copyCitationText}
                    >
                      {copiedCitation ? (
                        <>
                          <Check size={12} className="text-success" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Document & Page Details */}
                  <div className="fin-citation-meta-group mt-2">
                    <div className="fin-meta-field">
                      <span className="meta-label">Document:</span>
                      <strong className="meta-value text-xs text-main truncate block">
                        {activeCitation.docName || activeCitation.company || "Corporate Filing"}
                      </strong>
                    </div>

                    <div className="fin-meta-field mt-1.5">
                      <span className="meta-label">Page Reference:</span>
                      <span className={`meta-value font-mono font-semibold ${citeHasPage ? "text-teal" : "text-warning"}`}>
                        {citeHasPage ? `Page ${activeCitation.page}` : "Page Unavailable"}
                      </span>
                    </div>

                    {activeCitation.section && (
                      <div className="fin-meta-field mt-1.5">
                        <span className="meta-label">Schedule / Note:</span>
                        <span className="meta-value text-xs text-muted">
                          {activeCitation.section}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Verbatim Source Excerpt */}
                  <div className="fin-citation-quote-box mt-3">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1">
                      VERBATIM AUDITED PASSAGE:
                    </span>
                    {citeHasPassage ? (
                      <blockquote className="fin-quote-text">
                        "{activeCitation.passage || activeCitation.snippet || activeCitation.content}"
                      </blockquote>
                    ) : (
                      <span className="text-xs text-muted italic">
                        Source passage text was not included in this reference.
                      </span>
                    )}
                  </div>

                  {/* Open in Viewer Button */}
                  {onViewDocument && citeHasPage && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="fin-btn fin-btn-primary fin-btn-sm w-full flex items-center justify-center gap-1.5"
                        onClick={() => onViewDocument(activeCitation.docName, activeCitation.page)}
                      >
                        <ExternalLink size={13} />
                        <span>Open Document at Page {activeCitation.page}</span>
                      </button>
                    </div>
                  )}

                  {/* All Citations in current thread */}
                  {allCitations.length > 0 && (
                    <div className="fin-thread-citations-block mt-6 pt-4 border-t border-subtle">
                      <span className="fin-context-label block mb-2">
                        THREAD CITATIONS ({allCitations.length})
                      </span>
                      <div className="fin-thread-cites-list">
                        {allCitations.map((c, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`fin-thread-cite-item ${
                              activeCitation?.id === c.id || activeCitation?.page === c.page ? "active" : ""
                            }`}
                            onClick={() => onCitationClick && onCitationClick(c)}
                          >
                            <FileText size={12} className="text-teal shrink-0" />
                            <span className="truncate text-xs text-left flex-1">
                              {c.docName || c.company}
                            </span>
                            <span className="text-[10px] font-mono text-muted">
                              {c.page !== null && c.page !== undefined ? `p. ${c.page}` : "p. N/A"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="fin-citation-empty-card p-6 text-center">
                  <BookOpen size={28} className="text-muted mx-auto mb-2 opacity-60" />
                  <strong className="text-xs font-semibold text-main block">
                    No Citation Selected
                  </strong>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Click any inline citation chip (e.g. <code className="text-teal font-mono">[p. 112]</code>) in the conversation stream to inspect source excerpts and audited page references.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
