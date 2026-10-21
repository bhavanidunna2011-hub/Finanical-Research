import React from "react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ""
}) {
  return (
    <div className={`fin-empty-state ${className}`}>
      {Icon && (
        <div className="fin-empty-icon-wrap">
          <Icon size={32} />
        </div>
      )}
      <h4 className="fin-empty-title">{title}</h4>
      {description && <p className="fin-empty-desc">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" className="fin-btn fin-btn-primary fin-btn-sm mt-3" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
