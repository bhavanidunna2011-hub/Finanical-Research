import React, { useState } from "react";
import {
  Printer,
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Building2,
  TrendingUp,
  AlertTriangle,
  Info,
  ExternalLink,
  Table as TableIcon,
  Sparkles,
  Layers,
  FileText,
  FileCheck2
} from "lucide-react";
import { generateStructuredReportContent } from "../../data/reportData";
import { SEED_COMPANIES } from "../../data/seedData";

export default function ReportPreview({
  report,
  onBackToLibrary,
  onOpenPdfExport
}) {
  if (!report) return null;

  // Generate or get report structured content
  const content = report.content || generateStructuredReportContent(report);
  const { metadata, executiveSummary, keyFinancials, redFlags, companyComparison, outlook, citations } = content;

  const includedSections = report.sections || [
    "executive_summary",
    "key_financials",
    "red_flags",
    "company_comparison",
    "outlook"
  ];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="report-preview-page-container animate-fadeIn">
      {/* Top action controls toolbar (Hidden during print) */}
      <div className="report-controls-bar no-print">
        <button
          type="button"
          className="fin-btn fin-btn-secondary fin-btn-sm"
          onClick={onBackToLibrary}
        >
          <ArrowLeft size={14} className="mr-1.5" />
          <span>Back to Reports Library</span>
        </button>

        <div className="flex-row items-center gap-3">
          <span className="fin-badge fin-badge-teal fin-badge-xs">
            <ShieldCheck size={12} className="mr-1" />
            Strict Grounding Standard
          </span>

          <button
            type="button"
            className="fin-btn fin-btn-secondary fin-btn-sm"
            onClick={handlePrint}
            title="Launch native print dialog to save as PDF"
          >
            <Printer size={14} className="mr-1.5" />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            className="fin-btn fin-btn-primary fin-btn-sm"
            onClick={onOpenPdfExport}
            title="Open PDF Export options & progress dialog"
          >
            <Download size={14} className="mr-1.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Clear Demo State / Sample Data Disclaimer Banner (Hidden during print) */}
      <div className="report-sample-data-banner no-print">
        <Info size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-xs leading-relaxed">
          <strong>Demo Research Dossier (Sample Evaluation Data):</strong> Figures, tables, and risk ratios presented below are synthesized institutional sample metrics modeled after published corporate filings. These findings demonstrate system presentation and are not certified investment ratings.
        </div>
      </div>

      {/* Publication-Ready Analyst PDF Dossier */}
      <article className="analyst-report-document" id="printable-analyst-report">
        {/* Cover / Document Header */}
        <header className="report-doc-header">
          <div className="flex-row justify-between items-start flex-wrap gap-4">
            <div className="header-brand-block">
              <span className="report-eyebrow">{metadata.division}</span>
              <h1 className="report-main-title">{metadata.title}</h1>
              <h3 className="report-subtitle">
                Institutional Financial Analysis & Multi-Agent Grounding Dossier
              </h3>
            </div>

            <div className="report-meta-box">
              <div className="meta-row">
                <span className="meta-k">Publication Date:</span>
                <span className="meta-v font-mono">{metadata.publicationDate}</span>
              </div>
              <div className="meta-row">
                <span className="meta-k">Lead Analyst:</span>
                <span className="meta-v">{metadata.analyst}</span>
              </div>
              <div className="meta-row">
                <span className="meta-k">Coverage:</span>
                <span className="meta-v font-semibold text-main">{metadata.coverage}</span>
              </div>
              <div className="meta-row">
                <span className="meta-k">Filing Basis:</span>
                <span className="meta-v">{metadata.filingBasis}</span>
              </div>
              <div className="meta-row">
                <span className="meta-k">Validation:</span>
                <span className="meta-v text-teal font-semibold flex-row items-center gap-1">
                  <ShieldCheck size={12} /> {metadata.validationStatus}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* SECTION 1: EXECUTIVE SUMMARY */}
        {includedSections.includes("executive_summary") && executiveSummary && (
          <section className="report-section">
            <div className="section-title-strip">
              <h2 className="report-section-heading">1. Executive Summary</h2>
              <span className="section-badge">Strategic Synthesis</span>
            </div>

            <div className="report-prose">
              {executiveSummary.paragraphs?.map((p, idx) => (
                <p key={idx} className="report-body-text">
                  {p}
                </p>
              ))}
            </div>

            {/* Strategic Takeaway Cards */}
            {executiveSummary.takeaways && (
              <div className="takeaways-grid mt-4">
                {executiveSummary.takeaways.map((item, tIdx) => (
                  <div key={tIdx} className="takeaway-card">
                    <strong className="takeaway-lbl">{item.label}</strong>
                    <p className="takeaway-desc">{item.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: KEY FINANCIALS */}
        {includedSections.includes("key_financials") && keyFinancials && (
          <section className="report-section">
            <div className="section-title-strip">
              <h2 className="report-section-heading">2. Key Financial Metrics & Ratio Progressions</h2>
              <span className="section-badge">Audited Line Items</span>
            </div>

            {/* Metric Cards Row */}
            {keyFinancials.metricCards && (
              <div className="preview-metrics-cards-grid mt-3">
                {keyFinancials.metricCards.map((card, mIdx) => (
                  <div key={mIdx} className="preview-stat-card">
                    <span className="stat-title text-muted text-xs uppercase font-semibold">
                      {card.title}
                    </span>
                    <strong className="stat-num text-lg text-main block mt-1">
                      {card.value}
                    </strong>
                    <div className="flex-row items-center gap-1 mt-1">
                      <span className={`stat-delta ${card.isPositive ? "text-success" : "text-warning"}`}>
                        {card.delta}
                      </span>
                      {card.subtitle && (
                        <span className="stat-sub text-[10px] text-muted">• {card.subtitle}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Statement & Ratios Table */}
            {keyFinancials.table && (
              <div className="preview-table-card mt-4">
                <div className="preview-table-title-row">
                  <span className="text-xs font-bold text-main">
                    {keyFinancials.table.title}
                  </span>
                  <span className="text-[11px] font-mono text-muted">
                    Verified Statement Data
                  </span>
                </div>

                <div className="table-scroll-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        {keyFinancials.table.headers.map((h, i) => (
                          <th key={i}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {keyFinancials.table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx}>
                              {cIdx === 0 ? (
                                <strong className="text-main">{cell}</strong>
                              ) : cIdx === row.length - 1 ? (
                                <span className="citation-cell-tag text-teal font-mono text-[11px]">
                                  {cell}
                                </span>
                              ) : (
                                <span>{cell}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Auditor Verification Box */}
            {keyFinancials.auditorOpinion && (
              <div className="auditor-opinion-box mt-3">
                <div className="flex-row items-center gap-2">
                  <ShieldCheck size={16} className="text-teal" />
                  <strong className="text-xs text-main">
                    Independent Auditor Verification: {keyFinancials.auditorOpinion.auditor}
                  </strong>
                  <span className="fin-badge fin-badge-outline fin-badge-xs font-mono ml-auto">
                    p. {keyFinancials.auditorOpinion.page}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Opinion: <strong>{keyFinancials.auditorOpinion.opinion}</strong>. Key Audit Matters (KAM):{" "}
                  {keyFinancials.auditorOpinion.keyAuditMatters?.join(", ")}.
                </p>
              </div>
            )}
          </section>
        )}

        {/* SECTION 3: RED FLAGS */}
        {includedSections.includes("red_flags") && redFlags && (
          <section className="report-section">
            <div className="section-title-strip">
              <h2 className="report-section-heading">3. Forensic Red Flags & Risk Audit</h2>
              <span className="section-badge badge-warning">Vulnerability Scan</span>
            </div>

            <p className="report-body-text">{redFlags.summary}</p>

            <div className="preview-risks-list mt-3">
              {redFlags.risks?.map((rf, rIdx) => {
                const isHigh = rf.severity === "High";
                const isMed = rf.severity === "Medium";

                return (
                  <div key={rIdx} className="preview-risk-item">
                    <div className="risk-item-header flex-row items-center gap-2">
                      <span
                        className={`fin-badge fin-badge-xs ${
                          isHigh
                            ? "bg-danger/15 text-danger border border-danger/30"
                            : isMed
                            ? "bg-warning/15 text-warning border border-warning/30"
                            : "fin-badge-outline"
                        }`}
                      >
                        {rf.severity} Severity
                      </span>
                      <strong className="text-sm text-main">{rf.title}</strong>
                      <span className="text-[11px] text-muted ml-auto font-medium">
                        {rf.category}
                      </span>
                    </div>

                    <p className="risk-impact-text mt-1 text-xs text-muted leading-relaxed">
                      {rf.impact}
                    </p>

                    {rf.evidenceSnippet && (
                      <div className="risk-evidence-block mt-2">
                        <em className="text-xs text-main">
                          "{rf.evidenceSnippet}"
                        </em>
                        <span className="evidence-cite text-teal text-[11px] block mt-1 font-mono">
                          Citation Anchor: {rf.citation}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 4: COMPANY COMPARISON */}
        {includedSections.includes("company_comparison") && companyComparison && (
          <section className="report-section">
            <div className="section-title-strip">
              <h2 className="report-section-heading">4. Company Comparison & Peer Benchmarking</h2>
              <span className="section-badge">Relative Positioning</span>
            </div>

            <p className="report-body-text">{companyComparison.summary}</p>

            <div className="preview-table-card mt-3">
              <div className="table-scroll-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      {companyComparison.headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {companyComparison.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>
                            {cIdx === 0 ? (
                              <strong className="text-main">{cell}</strong>
                            ) : cIdx === row.length - 1 ? (
                              <span className="text-teal font-semibold text-xs">{cell}</span>
                            ) : (
                              <span>{cell}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: OUTLOOK */}
        {includedSections.includes("outlook") && outlook && (
          <section className="report-section">
            <div className="section-title-strip">
              <h2 className="report-section-heading">5. Outlook & Forward Strategic Assessment</h2>
              <span className="section-badge">12-Month Horizon</span>
            </div>

            <p className="report-body-text">{outlook.narrative}</p>

            {outlook.strategicPriorities && (
              <div className="outlook-priorities-card mt-3">
                <span className="text-xs font-bold text-main uppercase tracking-wider block mb-2">
                  Key Strategic Priorities & Catalysts:
                </span>
                <ul className="priorities-list">
                  {outlook.strategicPriorities.map((item, pIdx) => (
                    <li key={pIdx} className="priority-item">
                      <span className="text-teal mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {outlook.caveats && (
              <p className="text-[11px] text-muted italic mt-2.5">
                Note on Forward Guidance: {outlook.caveats}
              </p>
            )}
          </section>
        )}

        {/* SECTION 6: SOURCE REFERENCES & CITATIONS */}
        {citations && citations.length > 0 && (
          <section className="report-section">
            <div className="section-title-strip">
              <h2 className="report-section-heading">6. Source References & Citations Index</h2>
              <span className="section-badge">Audited Evidence</span>
            </div>

            <div className="citations-index-list mt-2">
              {citations.map((cite, cIdx) => (
                <div key={cIdx} className="citation-ref-row">
                  <div className="flex-row items-center gap-2">
                    <FileText size={13} className="text-teal" />
                    <strong className="text-xs text-main">{cite.doc}</strong>
                    <span className="text-[11px] font-mono text-teal">
                      Page {cite.page}
                    </span>
                    <span className="text-xs text-muted">• {cite.section}</span>
                  </div>
                  <blockquote className="citation-passage-quote mt-1">
                    "{cite.passage}"
                  </blockquote>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formal Institutional Sign-Off & Legal Disclaimer */}
        <footer className="report-doc-footer mt-6 pt-4 border-t border-subtle">
          <div className="sign-off-row flex-row justify-between items-start flex-wrap gap-4">
            <div>
              <strong className="text-xs text-main block">Report Compiled By:</strong>
              <p className="text-xs text-muted">
                Report Agent • FinResearch AI Multi-Agent Financial Research System
              </p>
            </div>
            <div>
              <strong className="text-xs text-main block">Verification Status:</strong>
              <p className="text-xs text-success font-semibold flex-row items-center gap-1">
                <ShieldCheck size={13} /> 100% Strictly Source Grounded
              </p>
            </div>
          </div>

          <p className="report-disclaimer mt-3 text-[10px] text-muted leading-relaxed">
            INSTITUTIONAL DISCLAIMER: This research document was generated by an automated multi-agent intelligence system summarizing official corporate financial disclosures. It is provided strictly for academic and portfolio research evaluation and does not constitute an offer, solicitation, or recommendation to purchase or sell any security.
          </p>
        </footer>
      </article>
    </div>
  );
}
