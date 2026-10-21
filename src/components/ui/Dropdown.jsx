import React, { useState, useRef, useEffect } from "react";

export function Dropdown({ trigger, children, align = "left", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`fin-dropdown-container ${className}`} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="fin-dropdown-trigger">
        {typeof trigger === "function" ? trigger({ isOpen }) : trigger}
      </div>
      {isOpen && (
        <div
          className={`fin-dropdown-menu fin-dropdown-align-${align}`}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, active = false, danger = false, icon: Icon, className = "" }) {
  return (
    <button
      type="button"
      className={`fin-dropdown-item ${active ? "active" : ""} ${danger ? "danger" : ""} ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon size={14} className="mr-2" />}
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="fin-dropdown-divider" />;
}
