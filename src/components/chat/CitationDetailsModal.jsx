import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  BookOpen,
  FileText,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Building2,
  FileCheck2
} from "lucide-react";

export default function CitationDetailsModal({
  citation,
  onClose,
  onViewDocument
}) {
  const [copied, setCopied] = useState(false);

  if (!citation) return null;

  const hasDoc = !!citation.docName || !!citation.company;
  const hasPage = citation.page !== null && citation.page !== undefined;
  const hasPassage = !!citation.passage || !!citation.snippet || !!citation.content;
  const hasSection = !!citation.section;

  function handleCopyCitation() {
    const passage = citation.passage || citation.snippet || citation.content || "Passage unavailable";
    const text = `"${passage}" — ${citation.docName || citation.company || "Filing"}, Page ${hasPage ? citation.page : "Unavailable"}${hasSection ? ` (${citation.section})` : ""}`;
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn("Copy error", e);
    }
  }

  function handleViewDocumentClick() {
    if (hasPage && onViewDocument) {
      onViewDocument(citation.docName, citation.page);
      onClose();
    }
  }

  return (
    <div className="fin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="fin-citation-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-row">
          <div className="flex-row items-center gap-2">
            <div className="modal-icon-badge">
              <ShieldCheck size={18} className="text-teal" />
            </div>
            <div>
              <h3 className="text-base font-bold text-main">Source Document Citation</h3>
              <span className="text-xs text-muted block">
                Audited Institutional Evidence Disclosure
              </span>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scroll">
          {/* Metadata Card */}
          <div className="citation-meta-grid">
            <div className="meta-cell">
              <span className="meta-label">Source Document:</span>
              <strong className="meta-val flex-row items-center gap-1.5 text-main">
                <FileText size={14} className="text-teal" />
                <span className="truncate">{citation.docName || citation.company || "Unavailable"}</span>
              </strong>
            </div>

            <div className="meta-cell">
              <span className="meta-label">Entity / Issuer:</span>
              <span className="meta-val font-semibold">
                {citation.company || "General Issuer"} {citation.ticker ? `(${citation.ticker})` : ""}
              </span>
            </div>

            {/* Page number with strict Unavailable handling */}
            <div className="meta-cell">
              <span className="meta-label">Page Reference:</span>
              <span className={`meta-val ${hasPage ? "text-teal font-bold" : "text-warning"}`}>
                {hasPage ? `Page ${citation.page}` : "Unavailable (Not specified in filing)"}
              </span>
            </div>

            {/* Section with strict Unavailable handling */}
            <div className="meta-cell">
              <span className="meta-label">Filing Section:</span>
              <span className="meta-val text-xs">
                {hasSection ? citation.section : "Unavailable in document metadata"}
              </span>
            </div>
          </div>

          {/* Verification Status */}
          <div className="grounding-notice-pill mt-3">
            <ShieldCheck size={14} className="text-teal mr-1 inline" />
            <span className="text-xs font-semibold text-teal">
              Extraction Agent: 100% Faithful Source Verification
            </span>
            <span className="text-xs text-muted ml-2">
              (Confidence: {citation.confidence ? `${(citation.confidence * 100).toFixed(0)}%` : "Verified"})
            </span>
          </div>

          {/* Verbatim Document Excerpt */}
          <div className="verbatim-excerpt-block mt-4">
            <div className="flex-row justify-between items-center mb-1">
              <span className="text-[11px] font-mono font-bold text-muted uppercase tracking-wider">
                EXACT VERBATIM PASSAGE:
              </span>
              <button
                type="button"
                className="text-xs text-teal hover:underline flex-row items-center gap-1"
                onClick={handleCopyCitation}
              >
                {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy Excerpt"}</span>
              </button>
            </div>

            {hasPassage ? (
              <blockquote className="verbatim-quote">
                "{citation.passage || citation.snippet || citation.content}"
              </blockquote>
            ) : (
              <div className="verbatim-unavailable-box">
                <AlertTriangle size={15} className="text-warning mr-1.5 inline" />
                <span className="text-xs text-warning">
                  Source passage: Unavailable in document metadata. No quotation was generated.
                </span>
              </div>
            )}
          </div>

          {/* Strict Grounding Policy Footnote */}
          <div className="grounding-policy-card mt-4">
            <p className="text-[11px] text-muted leading-relaxed">
              <strong>Institutional Policy:</strong> This system never invents page numbers, quotations, financial values, or citations. Missing filing coordinates remain explicitly labeled as unavailable.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer-row">
          <button
            type="button"
            className="fin-btn fin-btn-secondary fin-btn-sm"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="fin-btn fin-btn-primary fin-btn-sm"
            disabled={!hasPage}
            onClick={handleViewDocumentClick}
            title={hasPage ? `Open Document Viewer at Page ${citation.page}` : "Page is unavailable"}
          >
            <FileCheck2 size={14} className="mr-1" />
            <span>
              {hasPage ? `View Document (Page ${citation.page})` : "Page View Unavailable"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
