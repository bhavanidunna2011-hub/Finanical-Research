import React from "react";

export function Table({ children, className = "", ...props }) {
  return (
    <div className="fin-table-wrapper">
      <table className={`fin-table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "", ...props }) {
  return <thead className={`fin-table-header ${className}`} {...props}>{children}</thead>;
}

export function TableBody({ children, className = "", ...props }) {
  return <tbody className={`fin-table-body ${className}`} {...props}>{children}</tbody>;
}

export function TableRow({ children, className = "", isHeader = false, ...props }) {
  return <tr className={`fin-table-row ${isHeader ? "fin-table-row-head" : ""} ${className}`} {...props}>{children}</tr>;
}

export function TableHead({ children, className = "", align = "left", ...props }) {
  return (
    <th className={`fin-table-head fin-table-align-${align} ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", align = "left", numeric = false, ...props }) {
  return (
    <td
      className={`fin-table-cell fin-table-align-${align} ${numeric ? "fin-table-num" : ""} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
