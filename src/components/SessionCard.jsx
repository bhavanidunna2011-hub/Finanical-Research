import React from "react";
import { ArrowRight, Trash2, FileText, CheckCircle2, Building2 } from "lucide-react";

export default function SessionCard({ session, onOpen, onDelete }) {
  return (
    <article className="session-card">
      <div className="session-card-top">
        <div className="flex-row items-center gap-2">
          <span className="session-icon">
            <Building2 size={18} />
          </span>
          <span className="badge badge-accent">
            {session.researchType || "Financial Analysis"}
          </span>
        </div>
        <span className="status-badge">
          <CheckCircle2 size={12} style={{ marginRight: 4, display: "inline" }} />
          {session.status || "Ready"}
        </span>
      </div>

      <h3 className="session-card-title mt-3">{session.title}</h3>

      <p className="session-company-meta">
        <strong>Entity:</strong> {session.company || "Not specified"}
      </p>

      <p className="session-description">
        {session.description || "No research objective provided."}
      </p>

      <div className="session-details">
        <span className="doc-count-tag">
          <FileText size={12} style={{ marginRight: 4, display: "inline" }} />
          {session.documents?.length || 1} Document(s) Indexed
        </span>
        <span className="created-date">{session.createdAt || "Recently"}</span>
      </div>

      <div className="session-actions">
        <button
          type="button"
          className="primary-button btn-sm"
          onClick={onOpen}
        >
          Open Workspace
          <ArrowRight size={14} style={{ marginLeft: 6, display: "inline" }} />
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => {
            if (
              window.confirm(
                `Delete "${session.title}"? This cannot be undone.`
              )
            ) {
              onDelete?.();
            }
          }}
          title="Delete research session"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}