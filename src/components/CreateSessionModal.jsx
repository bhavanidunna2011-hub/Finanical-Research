import React, { useState } from "react";
import { Dialog } from "./ui/Dialog";
import Button from "./ui/Button";
import { PlusCircle, Building2, AlertTriangle, ShieldCheck } from "lucide-react";
import { SEED_COMPANIES } from "../data/seedData";

export default function CreateSessionModal({ open, onClose, onCreateSession }) {
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ticker, setTicker] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [researchType, setResearchType] = useState("Company Analysis");
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!title.trim()) {
      errs.title = "Research session name is required.";
    }
    if (!companyName.trim()) {
      errs.companyName = "Company name is required.";
    }
    if (!objective.trim()) {
      errs.objective = "Research objective or question is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleQuickFill(compKey) {
    const comp = SEED_COMPANIES[compKey];
    if (comp) {
      setTitle(`${comp.name} FY24 Financial & Forensic Audit`);
      setCompanyName(comp.name);
      setTicker(comp.ticker);
      setObjective(`Evaluate ${comp.name} key margins, deal trajectory, and risk disclosures.`);
      setErrors({});
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const upperTicker = ticker ? ticker.toUpperCase().trim() : "";
    const matchedSeed = SEED_COMPANIES[upperTicker] || SEED_COMPANIES.INFY;

    const sessionData = {
      title: title.trim(),
      company: companyName.trim(),
      ticker: upperTicker || "CUSTOM",
      companyIds: upperTicker && SEED_COMPANIES[upperTicker] ? [upperTicker] : ["INFY"],
      researchType,
      objective: objective.trim(),
      description: description.trim() || objective.trim(),
      createdAt: new Date().toLocaleDateString(),
      status: "Analysis Complete",
      documents: [
        {
          name: matchedSeed.filingDocName || `${companyName}-Filing-2024.pdf`,
          size: "18.4 MB",
          pages: matchedSeed.pageCount || 240,
          chunks: matchedSeed.chunkCount || 1020,
          status: "Indexed",
          company: upperTicker || "TARGET"
        }
      ],
      agentStatus: {
        documentAgent: "Completed",
        extractionAgent: "Completed",
        redFlagAgent: "Completed",
        comparisonAgent: "Completed",
        researchAgent: "Ready",
        reportAgent: "Generated"
      }
    };

    if (onCreateSession) {
      onCreateSession(sessionData);
    }
    handleClose();
  }

  function handleClose() {
    setTitle("");
    setCompanyName("");
    setTicker("");
    setObjective("");
    setDescription("");
    setErrors({});
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Create New Research Session"
      description="Initialize a dedicated multi-agent research session with target financial filings and automated metric extraction."
      size="md"
      footer={
        <div className="flex-row justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="teal"
            size="sm"
            icon={PlusCircle}
            onClick={handleSubmit}
          >
            Create Session
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Fill Pills */}
        <div className="quick-fill-row flex-row items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-muted">Quick fill:</span>
          <button
            type="button"
            className="quick-pill-btn"
            onClick={() => handleQuickFill("INFY")}
          >
            INFY
          </button>
          <button
            type="button"
            className="quick-pill-btn"
            onClick={() => handleQuickFill("TCS")}
          >
            TCS
          </button>
          <button
            type="button"
            className="quick-pill-btn"
            onClick={() => handleQuickFill("AAPL")}
          >
            AAPL
          </button>
          <button
            type="button"
            className="quick-pill-btn"
            onClick={() => handleQuickFill("MSFT")}
          >
            MSFT
          </button>
        </div>

        {/* Session Name */}
        <div>
          <label className="fin-form-label">Research Session Name *</label>
          <input
            type="text"
            className={`fin-input ${errors.title ? "border-danger" : ""}`}
            placeholder="e.g., Infosys FY24 Growth Durability & Margins"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
          />
          {errors.title && (
            <p className="field-error-text text-danger text-xs mt-1 flex-row items-center gap-1">
              <AlertTriangle size={11} /> {errors.title}
            </p>
          )}
        </div>

        {/* Company Name & Optional Ticker */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="fin-form-label">Company Name *</label>
            <input
              type="text"
              className={`fin-input ${errors.companyName ? "border-danger" : ""}`}
              placeholder="e.g., Infosys Limited"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: null }));
              }}
            />
            {errors.companyName && (
              <p className="field-error-text text-danger text-xs mt-1 flex-row items-center gap-1">
                <AlertTriangle size={11} /> {errors.companyName}
              </p>
            )}
          </div>

          <div>
            <label className="fin-form-label">
              Ticker <span className="text-muted font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              className="fin-input uppercase"
              placeholder="e.g., INFY"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
          </div>
        </div>

        {/* Research Objective or Question */}
        <div>
          <label className="fin-form-label">Research Objective or Question *</label>
          <input
            type="text"
            className={`fin-input ${errors.objective ? "border-danger" : ""}`}
            placeholder="e.g., Examine EBIT margin trajectory and deal TCV..."
            value={objective}
            onChange={(e) => {
              setObjective(e.target.value);
              if (errors.objective) setErrors((prev) => ({ ...prev, objective: null }));
            }}
          />
          {errors.objective && (
            <p className="field-error-text text-danger text-xs mt-1 flex-row items-center gap-1">
              <AlertTriangle size={11} /> {errors.objective}
            </p>
          )}
        </div>

        {/* Scope and Description */}
        <div>
          <label className="fin-form-label">Research Scope</label>
          <select
            className="fin-select"
            value={researchType}
            onChange={(e) => setResearchType(e.target.value)}
          >
            <option value="Company Analysis">Company Analysis (Deep Dive)</option>
            <option value="Peer Comparison & Benchmarking">Peer Comparison & Benchmarking</option>
            <option value="Forensic Financial Analysis">Forensic Financial Analysis</option>
            <option value="Investment Research">Investment Research</option>
          </select>
        </div>

        <div>
          <label className="fin-form-label">
            Optional Description
          </label>
          <textarea
            className="fin-textarea"
            rows={2}
            placeholder="Additional context or notes for the analysis..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </form>
    </Dialog>
  );
}
