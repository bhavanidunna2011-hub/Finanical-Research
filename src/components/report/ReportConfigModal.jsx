import React, { useState, useEffect } from "react";
import {
  X,
  FileCheck2,
  Building2,
  FileText,
  Layers,
  Sparkles,
  AlertCircle,
  Check,
  CheckSquare,
  Square,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";
import { AVAILABLE_REPORT_SECTIONS } from "../../data/reportData";
import { SEED_COMPANIES } from "../../data/seedData";
import { INITIAL_DOCUMENTS } from "../../data/documentData";

export default function ReportConfigModal({
  open,
  onClose,
  sessions = [],
  activeSession,
  onGenerateReport,
  onSaveDraft
}) {
  if (!open) return null;

  // Selected session
  const defaultSession = activeSession || sessions[0];
  const [selectedSessionId, setSelectedSessionId] = useState(defaultSession?.id || "");
  const currentSession = sessions.find((s) => s.id === selectedSessionId) || defaultSession;

  // Selected companies (IDs)
  const [selectedCompanyIds, setSelectedCompanyIds] = useState(() => {
    return currentSession?.companyIds || ["INFY", "TCS"];
  });

  // Report Title
  const [reportTitle, setReportTitle] = useState(() => {
    const primaryName = SEED_COMPANIES[currentSession?.companyIds?.[0]]?.name || "Target Entity";
    return `FY24 Institutional Research Dossier: ${primaryName}`;
  });

  // Available documents for selected session
  const [availableDocs, setAvailableDocs] = useState(() => {
    return INITIAL_DOCUMENTS.filter((d) => {
      if (!currentSession?.companyIds) return true;
      return currentSession.companyIds.includes(d.ticker);
    });
  });

  // Selected document IDs
  const [selectedDocIds, setSelectedDocIds] = useState(() =>
    availableDocs.map((d) => d.id)
  );

  // Selected sections (IDs)
  const [selectedSectionIds, setSelectedSectionIds] = useState([
    "executive_summary",
    "key_financials",
    "red_flags",
    "company_comparison",
    "outlook"
  ]);

  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When session changes, update companies, docs, and suggest a title
  function handleSessionChange(sessionId) {
    setSelectedSessionId(sessionId);
    const ses = sessions.find((s) => s.id === sessionId);
    if (ses) {
      const cids = ses.companyIds || ["INFY"];
      setSelectedCompanyIds(cids);

      const docs = INITIAL_DOCUMENTS.filter((d) => cids.includes(d.ticker));
      setAvailableDocs(docs.length > 0 ? docs : INITIAL_DOCUMENTS.slice(0, 3));
      setSelectedDocIds(docs.map((d) => d.id));

      const primary = SEED_COMPANIES[cids[0]]?.name || "Target Entity";
      setReportTitle(
        cids.length > 1
          ? `FY24 IT Services Peer Benchmarking Dossier: ${primary} vs ${SEED_COMPANIES[cids[1]]?.name || "Peer"}`
          : `FY24 Comprehensive Financial Dossier: ${primary}`
      );
    }
  }

  // Toggle company
  function handleToggleCompany(cid) {
    setSelectedCompanyIds((prev) => {
      const next = prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid];
      // Update docs
      const relevantDocs = INITIAL_DOCUMENTS.filter((d) => next.includes(d.ticker));
      setAvailableDocs(relevantDocs.length > 0 ? relevantDocs : INITIAL_DOCUMENTS.slice(0, 3));
      setSelectedDocIds(relevantDocs.map((d) => d.id));
      return next;
    });
  }

  // Toggle document
  function handleToggleDoc(docId) {
    setSelectedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  }

  // Toggle section
  function handleToggleSection(sectionId) {
    setSelectedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  }

  function handleSelectAllSections() {
    setSelectedSectionIds(AVAILABLE_REPORT_SECTIONS.map((s) => s.id));
  }

  function handleDeselectOptionalSections() {
    setSelectedSectionIds(["executive_summary"]);
  }

  // Validation
  function validateForm() {
    const errs = {};
    if (!reportTitle.trim()) {
      errs.title = "Report title is required.";
    }
    if (selectedCompanyIds.length === 0) {
      errs.companies = "Please select at least one company.";
    }
    if (selectedSectionIds.length === 0) {
      errs.sections = "Please select at least one report section.";
    }
    if (selectedSectionIds.includes("company_comparison") && selectedCompanyIds.length < 2) {
      errs.comparison = "Company Comparison requires at least 2 selected companies. Deselect this section or select a second company.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(status = "Generating") {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const primaryCompany = SEED_COMPANIES[selectedCompanyIds[0]]?.name || "General Entity";
    const companyLabel =
      selectedCompanyIds.length > 1
        ? `${SEED_COMPANIES[selectedCompanyIds[0]]?.name || "Company A"} & ${SEED_COMPANIES[selectedCompanyIds[1]]?.name || "Company B"}`
        : primaryCompany;

    const selectedDocObjects = availableDocs.filter((d) => selectedDocIds.includes(d.id));

    const newReportConfig = {
      title: reportTitle.trim(),
      company: companyLabel,
      companyIds: selectedCompanyIds,
      sessionId: currentSession?.id || "session-custom",
      sessionTitle: currentSession?.title || "Financial Analysis Session",
      status: status, // "Generating" | "Draft"
      sections: selectedSectionIds,
      sourceDocuments: selectedDocObjects.map((d) => d.name),
      isDemo: true,
      hasRealPdf: false
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onGenerateReport(newReportConfig);
      onClose();
    }, 400);
  }

  return (
    <div className="fin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="fin-report-config-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-row">
          <div className="flex-row items-center gap-2">
            <div className="modal-icon-badge">
              <FileCheck2 size={20} className="text-teal" />
            </div>
            <div>
              <h3 className="text-base font-bold text-main">Configure Research Report</h3>
              <span className="text-xs text-muted block">
                Define scope, company benchmarks, and sections for automated compilation
              </span>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close configuration modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Form */}
        <div className="modal-body-scroll config-form-body">
          {/* 1. Research Session Selection */}
          <div className="config-form-group">
            <label htmlFor="config-session" className="config-label flex-row items-center justify-between">
              <span>1. Associated Research Session:</span>
              <span className="text-[11px] text-teal">Auto-populates session filings</span>
            </label>
            <select
              id="config-session"
              className="fin-select fin-select-sm w-full"
              value={selectedSessionId}
              onChange={(e) => handleSessionChange(e.target.value)}
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.company || "General"})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Report Title */}
          <div className="config-form-group mt-3">
            <label htmlFor="config-title" className="config-label">
              <span>2. Report Title:</span>
              <span className="text-danger ml-1">*</span>
            </label>
            <input
              id="config-title"
              type="text"
              className={`fin-input fin-input-sm w-full ${errors.title ? "border-danger" : ""}`}
              value={reportTitle}
              onChange={(e) => {
                setReportTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              placeholder="e.g. FY24 Comprehensive IT Services Peer Benchmarking Dossier"
            />
            {errors.title && (
              <span className="text-[11px] text-danger flex-row items-center gap-1 mt-1">
                <AlertCircle size={11} /> {errors.title}
              </span>
            )}
          </div>

          {/* 3. Company Selection */}
          <div className="config-form-group mt-3">
            <label className="config-label flex-row justify-between items-center">
              <span>3. Company Selection (Target & Comparison):</span>
              <span className="text-[11px] text-muted">
                {selectedCompanyIds.length} entity selected
              </span>
            </label>
            <div className="companies-checkbox-grid mt-1.5">
              {Object.keys(SEED_COMPANIES).map((key) => {
                const comp = SEED_COMPANIES[key];
                const isSelected = selectedCompanyIds.includes(key);
                return (
                  <label
                    key={key}
                    className={`company-choice-box ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleCompany(key)}
                      className="doc-checkbox"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex-row items-center justify-between">
                        <strong className="text-xs text-main">{comp.name}</strong>
                        <span className="fin-badge fin-badge-outline fin-badge-xs font-mono">
                          {comp.ticker}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted block truncate mt-0.5">
                        {comp.sector} • {comp.currency}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.companies && (
              <span className="text-[11px] text-danger flex-row items-center gap-1 mt-1">
                <AlertCircle size={11} /> {errors.companies}
              </span>
            )}
          </div>

          {/* 4. Source Document Selection */}
          <div className="config-form-group mt-3">
            <div className="flex-row justify-between items-center mb-1">
              <label className="config-label">
                <span>4. Source Documents in Retrieval Scope:</span>
              </label>
              <div className="flex-row gap-2 text-[11px]">
                <button
                  type="button"
                  className="text-teal hover:underline font-medium"
                  onClick={() => setSelectedDocIds(availableDocs.map((d) => d.id))}
                >
                  Select All
                </button>
                <span className="text-muted">•</span>
                <button
                  type="button"
                  className="text-muted hover:text-main font-medium"
                  onClick={() => setSelectedDocIds([])}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="config-docs-list">
              {availableDocs.map((doc) => {
                const isChecked = selectedDocIds.includes(doc.id);
                return (
                  <label
                    key={doc.id}
                    className={`config-doc-item ${isChecked ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleDoc(doc.id)}
                      className="doc-checkbox"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex-row justify-between items-center">
                        <span className="text-xs font-medium text-main truncate" title={doc.name}>
                          {doc.name}
                        </span>
                        <span className="text-[10px] font-mono text-teal">
                          {doc.ticker || "PDF"}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted block mt-0.5">
                        {doc.pages || 100} pages • {doc.chunksCount || 1200} chunks • {doc.status || "Ready"}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 5. Report Sections to Include (The 5 required sections) */}
          <div className="config-form-group mt-3">
            <div className="flex-row justify-between items-center mb-1.5">
              <label className="config-label">
                <span>5. Report Sections to Include:</span>
                <span className="text-danger ml-1">*</span>
              </label>
              <div className="flex-row gap-2 text-[11px]">
                <button
                  type="button"
                  className="text-teal hover:underline font-medium"
                  onClick={handleSelectAllSections}
                >
                  Include All
                </button>
                <span className="text-muted">•</span>
                <button
                  type="button"
                  className="text-muted hover:text-main font-medium"
                  onClick={handleDeselectOptionalSections}
                >
                  Essential Only
                </button>
              </div>
            </div>

            <div className="sections-selection-flow">
              {AVAILABLE_REPORT_SECTIONS.map((sec) => {
                const isSelected = selectedSectionIds.includes(sec.id);
                const isComparison = sec.id === "company_comparison";
                const hasComparisonWarning = isComparison && selectedCompanyIds.length < 2 && isSelected;

                return (
                  <label
                    key={sec.id}
                    className={`section-choice-card ${isSelected ? "selected" : ""} ${
                      hasComparisonWarning ? "warning" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSection(sec.id)}
                      className="doc-checkbox"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex-row items-center justify-between">
                        <strong className="text-xs text-main">{sec.title}</strong>
                        {sec.required ? (
                          <span className="fin-badge fin-badge-xs fin-badge-outline">Required</span>
                        ) : isComparison ? (
                          <span className="fin-badge fin-badge-xs fin-badge-purple">2+ Entities</span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                        {sec.description}
                      </p>
                      {hasComparisonWarning && (
                        <div className="comparison-warning-inline mt-1 text-[11px] text-warning flex-row items-center gap-1">
                          <AlertCircle size={11} />
                          <span>Requires 2+ companies. Select a second company above to generate.</span>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.sections && (
              <span className="text-[11px] text-danger flex-row items-center gap-1 mt-1">
                <AlertCircle size={11} /> {errors.sections}
              </span>
            )}
            {errors.comparison && (
              <span className="text-[11px] text-warning flex-row items-center gap-1 mt-1">
                <AlertCircle size={11} /> {errors.comparison}
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer-row">
          <button
            type="button"
            className="fin-btn fin-btn-secondary fin-btn-sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="fin-btn fin-btn-secondary fin-btn-sm"
            onClick={() => handleSubmit("Draft")}
            disabled={isSubmitting}
            title="Save configuration as a Draft report"
          >
            <Clock size={13} className="mr-1" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            className="fin-btn fin-btn-primary fin-btn-sm"
            onClick={() => handleSubmit("Generating")}
            disabled={isSubmitting}
            id="start-report-generation-btn"
          >
            {isSubmitting ? (
              <>
                <span className="fin-spinner-sm mr-1.5" />
                <span>Initializing Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} className="mr-1.5" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
