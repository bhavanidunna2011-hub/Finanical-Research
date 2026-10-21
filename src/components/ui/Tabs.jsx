import React from "react";

export function Tabs({ tabs, activeTab, onChange, className = "" }) {
  return (
    <div className={`fin-tabs-container ${className}`}>
      <div className="fin-tabs-list" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`fin-tab-trigger ${isActive ? "active" : ""}`}
              onClick={() => onChange(tab.id)}
            >
              {Icon && <Icon size={15} className="mr-1.5" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`fin-tab-badge ${isActive ? "active" : ""}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
