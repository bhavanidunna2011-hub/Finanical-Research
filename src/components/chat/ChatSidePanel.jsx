import React, { useState } from "react";
import {
  Building2,
  FileText,
  BookOpen,
  CheckSquare,
  Square,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Layers,
  Database,
  Info,
  AlertTriangle,
  FolderOpen,
  FileCheck2,
  Copy,
  Hash,
  Trash2,
  Plus,
  Eye
} from "lucide-react";
import { SEED_COMPANIES } from "../../data/seedData";

export default function ChatSidePanel({
  sessions = [],
  activeSession,
  onSelectSession,
  availableDocuments = [],
  allLibraryDocs = [],
  selectedDocIds = [],
  onToggleDocSelection,
  onSelectAllDocs,
  onDeselectAllDocs,
  onRemoveDoc,
  onAddDoc,
  onOpenDocumentLibrary,
  activeCitation,
  onViewDocument,
  allCitations = [],
  onCitationClick
}) {
  const [showAddDocPicker, setShowAddDocPicker] = useState(false);

  const primaryCompanyKey = activeSession?.companyIds?.[0] || "INFY";
  const secondaryCompanyKey = activeSession?.companyIds?.[1] || "TCS";
  const primaryCompany = SEED_COMPANIES[primaryCompanyKey] || SEED_COMPANIES.INFY;
  const secondaryCompany = SEED_COMPANIES[secondaryCompanyKey] || SEED_COMPANIES.TCS;
  const isComparison = activeSession?.companyIds?.length > 1;

  // Documents in library not yet added to current research scope
  const unaddedDocs = allLibraryDocs.filter(
    (libDoc) => !availableDocuments.some((d) => d.id === libDoc.id)
  );

  // Citation metadata checks for strict "Unavailable" handling
  const citeHasDoc = !!activeCitation?.docName || !!activeCitation?.company;
  const citeHasPage = activeCitation?.page !== null && activeCitation?.page !== undefined;
  const citeHasPassage = !!activeCitation?.passage || !!activeCitation?.snippet || !!activeCitation?.content;
  const citeHasSection = !!activeCitation?.section;

  function copyCitation() {
    if (!activeCitation) return;
    const passage = activeCitation.passage || activeCitation.snippet || activeCitation.content || "Passage unavailable";
    const text = `"${passage}" — ${activeCitation.docName || activeCitation.company || "Filing"}, Page ${citeHasPage ? activeCitation.page : "Unavailable"}`;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch (e) {
      console.warn("Copy error", e);
    }
  }

  return (
    <aside className="fin-chat-side-panel">
      {/* 1. Research Session Switcher & Metadata */}
      <div className="panel-card session-context-card">
        <div className="card-top-row">
          <span className="fin-card-eyebrow">ACTIVE RESEARCH SESSION</span>
          <span className="fin-badge fin-badge-teal fin-badge-xs">
            {activeSession?.status || "Analysis Complete"}
          </span>
        </div>

        <div className="session-select-wrapper mt-2">
          <label htmlFor="session-picker" className="text-xs text-muted block mb-1">
            Switch Research Session:
          </label>
          <select
            id="session-picker"
            className="fin-select fin-select-sm w-full"
            value={activeSession?.id || ""}
            onChange={(e) => {
              const target = sessions.find((s) => s.id === e.target.value);
              if (target && onSelectSession) onSelectSession(target);
            }}
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.company || "General"})
              </option>
            ))}
          </select>
        </div>

        <p className="session-desc-text mt-2">
          {activeSession?.description || "Institutional multi-agent financial research."}
        </p>
      </div>

      {/* 2. Selected Companies Context */}
      <div className="panel-card companies-context-card">
        <div className="card-top-row">
          <span className="fin-card-eyebrow">SELECTED COMPANIES</span>
          <span className="text-xs font-mono text-muted">
            {isComparison ? "2 Entities (Peer Benchmark)" : "1 Entity Target"}
          </span>
        </div>

        <div className="companies-pills-list mt-2">
          {/* Primary Company */}
          <div className="company-context-item">
            <div className="company-badge-icon">
              <Building2 size={16} className="text-teal" />
            </div>
            <div className="company-context-info">
              <div className="flex-row items-center gap-1.5">
                <strong className="text-sm text-main">{primaryCompany.name}</strong>
                <span className="fin-badge fin-badge-outline fin-badge-xs">
                  {primaryCompany.ticker}
                </span>
              </div>
              <span className="text-xs text-muted block">
                {primaryCompany.sector} • {primaryCompany.filingType}
              </span>
            </div>
          </div>

          {/* Secondary Company if comparison */}
          {isComparison && (
            <div className="company-context-item mt-2">
              <div className="company-badge-icon">
                <Building2 size={16} className="text-accent" />
              </div>
              <div className="company-context-info">
                <div className="flex-row items-center gap-1.5">
                  <strong className="text-sm text-main">{secondaryCompany.name}</strong>
                  <span className="fin-badge fin-badge-outline fin-badge-xs">
                    {secondaryCompany.ticker}
                  </span>
                </div>
                <span className="text-xs text-muted block">
                  {secondaryCompany.sector} • {secondaryCompany.filingType}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Document Selection Control (Select or remove source documents) */}
      <div className="panel-card doc-selection-card">
        <div className="card-top-row">
          <div className="flex-row items-center gap-1.5">
            <FileText size={14} className="text-teal" />
            <span className="fin-card-eyebrow">SOURCE DOCUMENTS IN SCOPE</span>
          </div>
          <span className="fin-badge fin-badge-outline fin-badge-xs font-mono">
            {selectedDocIds.length} / {availableDocuments.length} Active
          </span>
        </div>

        <p className="text-xs text-muted mt-1">
          Select or remove ingested filings to restrict the retrieval scope of the Research Agent:
        </p>

        {/* Bulk toggles and actions */}
        <div className="flex-row justify-between items-center mt-2 pb-2 border-b border-subtle">
          <div className="flex-row gap-2 items-center">
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

          {onOpenDocumentLibrary && (
            <button
              type="button"
              className="text-[11px] text-muted hover:text-teal flex-row items-center gap-1 font-medium"
              onClick={onOpenDocumentLibrary}
              title="Browse all library documents"
            >
              <FolderOpen size={11} />
              <span>Library</span>
            </button>
          )}
        </div>

        {/* Document List */}
        <div className="doc-selection-list mt-2">
          {availableDocuments.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted border border-dashed border-subtle rounded">
              No documents in scope. Add one below to enable retrieval.
            </div>
          ) : (
            availableDocuments.map((doc) => {
              const isSelected = selectedDocIds.includes(doc.id);
              return (
                <div
                  key={doc.id}
                  className={`doc-selection-item ${isSelected ? "selected" : "deselected"}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleDocSelection && onToggleDocSelection(doc.id)}
                    className="doc-checkbox"
                    title={isSelected ? "Uncheck to exclude from query" : "Check to include in query"}
                  />
                  <div className="doc-item-body">
                    <div className="flex-row justify-between items-center">
                      <span className="doc-item-title truncate font-medium text-xs text-main" title={doc.name}>
                        {doc.name}
                      </span>
                      <span className="doc-item-ticker text-[10px] font-mono">
                        {doc.ticker || "PDF"}
                      </span>
                    </div>
                    <div className="doc-item-meta flex-row justify-between items-center text-[11px] text-muted mt-1">
                      <span>{doc.pages || 100} pages • {doc.chunksCount || 1200} chunks</span>

                      {/* Quick Document Actions: View & Remove */}
                      <div className="flex-row items-center gap-1.5 doc-action-icons">
                        <button
                          type="button"
                          className="doc-quick-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDocument && onViewDocument(doc.name, 1);
                          }}
                          title="Open in Document Viewer"
                        >
                          <Eye size={12} className="text-teal" />
                        </button>
                        {onRemoveDoc && (
                          <button
                            type="button"
                            className="doc-quick-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveDoc(doc.id);
                            }}
                            title="Remove document from research scope"
                          >
                            <Trash2 size={12} className="text-warning" />
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

        {/* Add Document to Research Scope dropdown */}
        {unaddedDocs.length > 0 && onAddDoc && (
          <div className="mt-2.5 pt-2 border-t border-subtle">
            {!showAddDocPicker ? (
              <button
                type="button"
                className="fin-btn fin-btn-secondary fin-btn-xs w-full flex-row items-center justify-center gap-1"
                onClick={() => setShowAddDocPicker(true)}
              >
                <Plus size={12} className="text-teal" />
                <span>Add Filing from Library ({unaddedDocs.length} available)</span>
              </button>
            ) : (
              <div className="add-doc-picker-box p-2 bg-subtle rounded border border-subtle">
                <div className="flex-row justify-between items-center mb-1">
                  <span className="text-[11px] font-semibold text-muted">Select Filing to Add:</span>
                  <button
                    type="button"
                    className="text-[10px] text-muted hover:text-main"
                    onClick={() => setShowAddDocPicker(false)}
                  >
                    Cancel
                  </button>
                </div>
                <select
                  className="fin-select fin-select-xs w-full text-xs"
                  onChange={(e) => {
                    const picked = unaddedDocs.find((d) => d.id === e.target.value);
                    if (picked) {
                      onAddDoc(picked);
                      setShowAddDocPicker(false);
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>-- Choose a document --</option>
                  {unaddedDocs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.ticker || d.company})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Active Citation Inspector Details Panel */}
      <div className="panel-card citation-inspector-card">
        <div className="card-top-row">
          <div className="flex-row items-center gap-1.5">
            <BookOpen size={14} className="text-accent" />
            <span className="fin-card-eyebrow">CITATION DETAILS INSPECTOR</span>
          </div>
          <span className="fin-badge fin-badge-xs fin-badge-outline">
            {activeCitation ? "Inspecting" : "Idle"}
          </span>
        </div>

        {activeCitation ? (
          <div className="citation-inspector-content mt-2 animate-fadeIn">
            {/* Document reference */}
            <div className="inspector-field">
              <span className="field-label">Source Document:</span>
              <strong className="field-value doc-value truncate block">
                {activeCitation.docName || activeCitation.company || "Unavailable"}
              </strong>
            </div>

            {/* Entity */}
            {activeCitation.company && (
              <div className="inspector-field mt-1.5">
                <span className="field-label">Entity / Ticker:</span>
                <span className="field-value font-semibold">
                  {activeCitation.company} {activeCitation.ticker ? `(${activeCitation.ticker})` : ""}
                </span>
              </div>
            )}

            {/* Page number with strict Unavailable handling */}
            <div className="inspector-field mt-1.5">
              <span className="field-label">Page Number:</span>
              <span className={`field-value ${citeHasPage ? "highlight-page" : "text-warning"}`}>
                {citeHasPage ? `Page ${activeCitation.page}` : "Unavailable (Not specified in filing)"}
              </span>
            </div>

            {/* Section with strict Unavailable handling */}
            <div className="inspector-field mt-1.5">
              <span className="field-label">Filing Section:</span>
              <span className="field-value text-xs">
                {citeHasSection ? activeCitation.section : "Unavailable in document metadata"}
              </span>
            </div>

            {/* Verbatim Source Passage */}
            <div className="inspector-passage-box mt-3">
              <div className="flex-row justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                  VERBATIM SOURCE PASSAGE:
                </span>
                <button
                  type="button"
                  className="text-[11px] text-teal flex-row items-center gap-1 hover:underline"
                  onClick={copyCitation}
                >
                  <Copy size={11} />
                  <span>Copy</span>
                </button>
              </div>

              {citeHasPassage ? (
                <blockquote className="inspector-quote">
                  "{activeCitation.passage || activeCitation.snippet || activeCitation.content}"
                </blockquote>
              ) : (
                <div className="passage-unavailable-notice">
                  <AlertTriangle size={13} className="text-warning mr-1 inline" />
                  <span className="text-xs text-warning">
                    Source passage: Unavailable in document metadata.
                  </span>
                </div>
              )}
            </div>

            {/* View Document Action */}
            <div className="inspector-actions mt-3">
              <button
                type="button"
                className="fin-btn fin-btn-primary fin-btn-sm w-full"
                disabled={!citeHasPage}
                onClick={() =>
                  citeHasPage &&
                  onViewDocument &&
                  onViewDocument(activeCitation.docName, activeCitation.page)
                }
              >
                <FileCheck2 size={14} className="mr-1" />
                <span>
                  {citeHasPage
                    ? `View Document at Page ${activeCitation.page}`
                    : "Document Page Unavailable"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="citation-placeholder-box mt-2">
            <Info size={16} className="text-muted mb-1" />
            <p className="text-xs text-muted leading-relaxed">
              Click any citation chip (e.g. <code>[p. 112]</code>) in the conversation stream to inspect source passages, page numbers, and open the document viewer.
            </p>
          </div>
        )}
      </div>

      {/* 5. Thread Citations Quick Index */}
      {allCitations.length > 0 && (
        <div className="panel-card thread-citations-card">
          <div className="card-top-row">
            <span className="fin-card-eyebrow">CITATIONS IN CURRENT THREAD</span>
            <span className="text-xs font-mono text-muted">{allCitations.length} total</span>
          </div>

          <div className="thread-citations-list mt-2">
            {allCitations.map((c, i) => (
              <button
                key={i}
                type="button"
                className="thread-citation-item"
                onClick={() => onCitationClick && onCitationClick(c)}
              >
                <FileText size={12} className="text-teal" />
                <span className="truncate text-xs flex-1 text-left">{c.docName || c.company}</span>
                <span className="text-[10px] font-mono text-muted">
                  {c.page !== null && c.page !== undefined ? `p. ${c.page}` : "p. N/A"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
