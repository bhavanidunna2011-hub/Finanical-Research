import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "md", label, className = "" }) {
  const sizeMap = { sm: 16, md: 24, lg: 36 };
  return (
    <div className={`fin-loading-spinner-wrap ${className}`}>
      <Loader2 size={sizeMap[size] || 24} className="fin-spinner-icon animate-spin" />
      {label && <span className="fin-loading-label">{label}</span>}
    </div>
  );
}

export function Skeleton({ className = "", width, height }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  return <div className={`fin-skeleton ${className}`} style={style} />;
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="fin-table-skeleton">
      <Skeleton height="36px" className="mb-2" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="42px" className="mb-1.5" />
      ))}
    </div>
  );
}
