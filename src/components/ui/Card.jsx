import React from "react";

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div className={`fin-card ${hover ? "fin-card-hoverable" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return <div className={`fin-card-header ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = "", ...props }) {
  return <h3 className={`fin-card-title ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ children, className = "", ...props }) {
  return <p className={`fin-card-description ${className}`} {...props}>{children}</p>;
}

export function CardContent({ children, className = "", ...props }) {
  return <div className={`fin-card-content ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ children, className = "", ...props }) {
  return <div className={`fin-card-footer ${className}`} {...props}>{children}</div>;
}
