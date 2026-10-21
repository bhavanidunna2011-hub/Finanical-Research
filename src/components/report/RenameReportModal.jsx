import React, { useState, useEffect } from "react";
import { X, Edit2, AlertCircle } from "lucide-react";

export default function RenameReportModal({ open, onClose, report, onSave }) {
  if (!open || !report) return null;

  const [newTitle, setNewTitle] = useState(report.title || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setNewTitle(report.title || "");
    setError("");
  }, [report]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!newTitle.trim()) {
      setError("Report title cannot be empty.");
      return;
    }
    onSave(report.id, newTitle.trim());
    onClose();
  }

  return (
    <div className="fin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="fin-rename-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div className="flex-row items-center gap-2">
            <div className="modal-icon-badge">
              <Edit2 size={18} className="text-teal" />
            </div>
            <div>
              <h3 className="text-base font-bold text-main">Rename Report</h3>
              <span className="text-xs text-muted block">Update the title of this research dossier</span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body-scroll p-4">
            <label htmlFor="rename-input" className="text-xs font-semibold text-main block mb-1">
              Report Title:
            </label>
            <input
              id="rename-input"
              type="text"
              className={`fin-input fin-input-sm w-full ${error ? "border-danger" : ""}`}
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (error) setError("");
              }}
              autoFocus
            />
            {error && (
              <span className="text-[11px] text-danger flex-row items-center gap-1 mt-1">
                <AlertCircle size={11} /> {error}
              </span>
            )}
          </div>

          <div className="modal-footer-row">
            <button type="button" className="fin-btn fin-btn-secondary fin-btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="fin-btn fin-btn-primary fin-btn-sm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
