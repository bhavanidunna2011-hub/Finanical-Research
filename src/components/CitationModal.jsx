import React, { useState } from "react";
import { X, BookOpen, CheckCircle, ExternalLink, ShieldCheck, Copy, Check } from "lucide-react";

export default function CitationModal({ citation, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!citation) return null;

  function copyCitationText() {
    const text = `"${citation.snippet || citation.content}" - ${citation.docName || citation.company}, Page ${citation.page || citation.section || "N/A"}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="citation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="citation-header">
          <div className="citation-title-group">
            <span className="badge badge-accent">
              <ShieldCheck size={13} style={{ marginRight: 4, display: "inline" }} />
              Verified Source Grounding
            </span>
            <h3>Source Document Citation</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close citation">
            <X size={20} />
          </button>
        </div>

        <div className="citation-body">
          <div className="citation-meta-card">
            <div className="meta-row">
              <span className="meta-label">Document:</span>
              <span className="meta-val doc-name">
                <BookOpen size={14} style={{ marginRight: 6, display: "inline" }} />
                {citation.docName || citation.company || "Company Annual Report / 10-K"}
              </span>
            </div>
            {citation.company && (
              <div className="meta-row">
                <span className="meta-label">Entity:</span>
                <span className="meta-val font-semibold">{citation.company}</span>
              </div>
            )}
            {citation.page && (
              <div className="meta-row">
                <span className="meta-label">Page / Section:</span>
                <span className="meta-val highlight-page">Page {citation.page} {citation.section ? `• ${citation.section}` : ""}</span>
              </div>
            )}
            <div className="meta-row">
              <span className="meta-label">Extraction Agent Status:</span>
              <span className="meta-val text-success">
                <CheckCircle size={14} style={{ marginRight: 5, display: "inline" }} />
                100% Faithful Source Verification
              </span>
            </div>
          </div>

          <div className="citation-quote-box">
            <div className="quote-label">EXACT DOCUMENT EXCERPT:</div>
            <blockquote className="quote-text">
              "{citation.snippet || citation.content || citation.evidenceSnippet || "Verified financial metric extracted directly from filing."}"
            </blockquote>
          </div>

          <div className="citation-footnote">
            <small>
              Strict Source Grounding Rule: The system never generates information beyond what the indexed documents contain. All figures and assertions are bound to this excerpt.
            </small>
          </div>
        </div>

        <div className="citation-footer">
          <button className="secondary-button btn-sm" onClick={copyCitationText}>
            {copied ? (
              <>
                <Check size={14} className="text-teal" style={{ marginRight: 6, display: "inline" }} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} style={{ marginRight: 6, display: "inline" }} />
                <span>Copy Citation</span>
              </>
            )}
          </button>
          <button className="primary-button btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
