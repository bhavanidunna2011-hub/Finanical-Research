import React, { useState } from "react";
import {
  FileText,
  Building2,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  AlertTriangle,
  HelpCircle,
  X
} from "lucide-react";
import Button from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { SEED_COMPANIES } from "../data/seedData";

export default function CreateSession({ onCreateSession, onCancel }) {
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ticker, setTicker] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [researchType, setResearchType] = useState("Company Analysis");
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Inline Validation Errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handlePresetSelect(presetType) {
    setSelectedPreset(presetType);
    setErrors({});
    if (presetType === "it_peers") {
      setTitle("Infosys vs TCS: FY24 IT Services Peer Benchmarking");
      setCompanyName("Infosys & TCS");
      setTicker("INFY, TCS");
      setObjective("Evaluate the 390 bps operating margin spread and record large deal TCV momentum.");
      setDescription("Cross-reference operating margins, deal pipeline TCV, and employee attrition between Infosys and TCS based on their FY24 annual reports.");
      setResearchType("Peer Comparison & Benchmarking");
    } else if (presetType === "aapl_forensic") {
      setTitle("Apple Inc. (AAPL) Forensic Risk & Tax Charge Audit");
      setCompanyName("Apple Inc.");
      setTicker("AAPL");
      setObjective("Forensic audit of Greater China revenue contraction (-7.7%) and $10.2B European State Aid tax charge.");
      setDescription("Scan Apple's Form 10-K for material anomalies, geographic revenue slowdowns, and Services gross margin durability.");
      setResearchType("Forensic Financial Analysis");
    } else if (presetType === "msft_cloud") {
      setTitle("Microsoft (MSFT) Cloud AI CapEx ROI Investigation");
      setCompanyName("Microsoft Corporation");
      setTicker("MSFT");
      setObjective("Evaluate ROI on $55.7B CapEx buildout (+75% YoY) vs Intelligent Cloud revenue acceleration.");
      setDescription("Analyze Microsoft's $55.7B CapEx spend and cross-reference with Azure generative AI run-rate growth.");
      setResearchType("Investment Research");
    }
  }

  function validate() {
    const errs = {};
    if (!title.trim()) {
      errs.title = "Research session name is required.";
    }
    if (!companyName.trim()) {
      errs.companyName = "Company name is required.";
    }
    if (!objective.trim()) {
      errs.objective = "Research objective or primary question is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Identify primary company seed info if matches
    const upperTicker = ticker ? ticker.toUpperCase().replace(/[^A-Z]/g, "") : "";
    const matchedSeed = SEED_COMPANIES[upperTicker] || SEED_COMPANIES.INFY;

    setTimeout(() => {
      onCreateSession({
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
      });
      setIsSubmitting(false);
    }, 400);
  }

  return (
    <section className="page create-session-page animate-fadeIn">
      {/* Page Header */}
      <div className="section-header-box">
        <span className="eyebrow">MODULE 1 • SESSION INITIALIZATION</span>
        <h1>Create Research Session</h1>
        <p className="muted">
          Configure a dedicated multi-agent research session with target financial filings, analytical objectives, and grounding compliance.
        </p>
      </div>

      {/* Preset Quick Start Templates */}
      <div className="preset-templates-container mt-6">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">
          RECOMMENDED INSTITUTIONAL TEMPLATES
        </span>
        <div className="presets-grid mt-2">
          <div
            className={`preset-card ${selectedPreset === "it_peers" ? "selected" : ""}`}
            onClick={() => handlePresetSelect("it_peers")}
          >
            <div className="flex-row items-center gap-2">
              <Badge variant="teal" size="sm">Template 1</Badge>
              <strong className="text-sm">IT Services Peer Comparison</strong>
            </div>
            <p className="text-xs text-muted mt-2">
              Infosys vs TCS • EBIT Margin Spread • Deal TCV • Attrition Rates
            </p>
          </div>

          <div
            className={`preset-card ${selectedPreset === "aapl_forensic" ? "selected" : ""}`}
            onClick={() => handlePresetSelect("aapl_forensic")}
          >
            <div className="flex-row items-center gap-2">
              <Badge variant="warning" size="sm">Template 2</Badge>
              <strong className="text-sm">Apple Inc. Forensic Audit</strong>
            </div>
            <p className="text-xs text-muted mt-2">
              Apple Form 10-K • Greater China -7.7% • $10.2B Tax Charge
            </p>
          </div>

          <div
            className={`preset-card ${selectedPreset === "msft_cloud" ? "selected" : ""}`}
            onClick={() => handlePresetSelect("msft_cloud")}
          >
            <div className="flex-row items-center gap-2">
              <Badge variant="primary" size="sm">Template 3</Badge>
              <strong className="text-sm">Microsoft Cloud AI CapEx ROI</strong>
            </div>
            <p className="text-xs text-muted mt-2">
              Microsoft 10-K • $55.7B CapEx Buildout • Azure Monetization
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Session Configuration & Objectives</CardTitle>
          <span className="text-xs text-muted">Fields marked with an asterisk (*) are required.</span>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Session Title */}
            <div>
              <label className="fin-form-label">
                Research Session Name *
              </label>
              <input
                type="text"
                className={`fin-input ${errors.title ? "border-danger" : ""}`}
                placeholder="e.g., Infosys vs TCS: FY24 Peer Benchmarking"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
              />
              {errors.title && (
                <p className="field-error-text text-danger text-xs mt-1.5 flex-row items-center gap-1">
                  <AlertTriangle size={12} /> {errors.title}
                </p>
              )}
            </div>

            {/* Field 2 & 3: Company Name & Optional Ticker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="fin-form-label">
                  Company Name *
                </label>
                <input
                  type="text"
                  className={`fin-input ${errors.companyName ? "border-danger" : ""}`}
                  placeholder="e.g., Infosys Limited, Apple Inc."
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: null }));
                  }}
                />
                {errors.companyName && (
                  <p className="field-error-text text-danger text-xs mt-1.5 flex-row items-center gap-1">
                    <AlertTriangle size={12} /> {errors.companyName}
                  </p>
                )}
              </div>

              <div>
                <label className="fin-form-label">
                  Company Ticker <span className="text-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="fin-input uppercase"
                  placeholder="e.g., INFY, AAPL"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                />
                <span className="text-[11px] text-muted block mt-1">Links to seed filings</span>
              </div>
            </div>

            {/* Field 4: Research Scope */}
            <div>
              <label className="fin-form-label">Analytical Research Scope</label>
              <select
                className="fin-select"
                value={researchType}
                onChange={(e) => setResearchType(e.target.value)}
              >
                <option value="Company Analysis">Company Analysis (Deep-Dive Statement Extraction)</option>
                <option value="Peer Comparison & Benchmarking">Peer Comparison & Benchmarking (Cross-Entity Ratios)</option>
                <option value="Forensic Financial Analysis">Forensic Financial Analysis (Red Flag Anomaly Scan)</option>
                <option value="Investment Research">Investment Research (Growth & CapEx Durability)</option>
              </select>
            </div>

            {/* Field 5: Research Objective or Question */}
            <div>
              <label className="fin-form-label">
                Research Objective or Question *
              </label>
              <textarea
                className={`fin-textarea ${errors.objective ? "border-danger" : ""}`}
                rows={2}
                placeholder="Specify the core financial hypothesis or question for the agents to analyze..."
                value={objective}
                onChange={(e) => {
                  setObjective(e.target.value);
                  if (errors.objective) setErrors((prev) => ({ ...prev, objective: null }));
                }}
              />
              {errors.objective && (
                <p className="field-error-text text-danger text-xs mt-1.5 flex-row items-center gap-1">
                  <AlertTriangle size={12} /> {errors.objective}
                </p>
              )}
            </div>

            {/* Field 6: Optional Description */}
            <div>
              <label className="fin-form-label">
                Detailed Scope / Notes <span className="text-muted font-normal">(Optional)</span>
              </label>
              <textarea
                className="fin-textarea"
                rows={3}
                placeholder="Additional analytical background, benchmark thresholds, or areas of focus..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Compliance Note */}
            <div className="fin-info-banner">
              <ShieldCheck size={16} className="text-teal shrink-0" />
              <span className="text-xs leading-relaxed">
                <strong>Grounding Enforcement:</strong> Upon creation, the session automatically attaches pre-indexed filing vectors and activates the 6 collaborative analysis agents.
              </span>
            </div>

            {/* Form Action Buttons */}
            <div className="flex-row justify-end items-center gap-3 pt-4 border-t border-color">
              <Button
                variant="ghost"
                size="md"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="teal"
                size="md"
                loading={isSubmitting}
                icon={CheckCircle}
              >
                Create Research Session
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}