import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({ open, onClose, report, onConfirm }) {
  if (!open || !report) return null;

  return (
    <div className="fin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="fin-delete-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div className="flex-row items-center gap-2">
            <div className="modal-icon-badge bg-danger/15 text-danger">
              <Trash2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-main">Delete Research Report</h3>
              <span className="text-xs text-muted block">Confirmation required</span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-scroll p-4">
          <div className="flex-row items-start gap-3">
            <AlertTriangle size={24} className="text-danger flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-main leading-relaxed">
                Are you sure you want to permanently delete:
              </p>
              <strong className="text-sm text-teal block mt-1">
                "{report.title}"
              </strong>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                This action cannot be undone. Associated report configuration and preview data will be removed from your local workspace repository.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer-row">
          <button type="button" className="fin-btn fin-btn-secondary fin-btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="fin-btn fin-btn-primary fin-btn-sm bg-danger hover:bg-danger/80 border-none"
            onClick={() => {
              onConfirm(report.id);
              onClose();
            }}
          >
            <Trash2 size={13} className="mr-1" />
            <span>Delete Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
