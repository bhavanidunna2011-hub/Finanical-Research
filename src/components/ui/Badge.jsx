import React from "react";

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  ...props
}) {
  const baseClass = "fin-badge";
  const variantClass = `fin-badge-${variant}`;
  const sizeClass = `fin-badge-${size}`;
  const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(" ");

  return (
    <span className={classes} {...props}>
      {dot && <span className="fin-badge-dot" />}
      {children}
    </span>
  );
}
