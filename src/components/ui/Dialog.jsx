import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Dialog({ open, onClose, title, description, children, footer, size = "md" }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fin-dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`fin-dialog-content fin-dialog-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fin-dialog-header">
          <div>
            <h3 className="fin-dialog-title">{title}</h3>
            {description && <p className="fin-dialog-description">{description}</p>}
          </div>
          <button
            type="button"
            className="fin-dialog-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="fin-dialog-body">{children}</div>
        {footer && <div className="fin-dialog-footer">{footer}</div>}
      </div>
    </div>
  );
}
