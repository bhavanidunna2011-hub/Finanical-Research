import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const baseClass = "fin-btn";
  const variantClass = `fin-btn-${variant}`;
  const sizeClass = `fin-btn-${size}`;
  const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === "sm" ? 13 : 15} className="animate-spin mr-1.5" />
      ) : Icon && iconPosition === "left" ? (
        <Icon size={size === "sm" ? 14 : 16} className="btn-icon-left" />
      ) : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" ? (
        <Icon size={size === "sm" ? 14 : 16} className="btn-icon-right" />
      ) : null}
    </button>
  );
}
