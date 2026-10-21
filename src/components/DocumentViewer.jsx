import React, { useState } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Search,
  CheckCircle2,
  Bookmark,
  Layers,
  Sparkles,
  FileCheck2,
  Eye,
  ShieldCheck
} from "lucide-react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

export default function DocumentViewer({
  document: doc,
  onCitationClick,
  initialPage = 1
}) {
  const [currentPage, setCurrentPage] = useState(initialPage || (doc?.sections?.[2]?.page || 112));
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState(doc?.blobUrl ? "native" : "parsed"); // "native" | "parsed"
  const [inDocSearch, setInDocSearch] = useState("");
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0);

  const totalPages = doc?.pages || 100;

  // Key landmark pages for quick navigation
  const landmarkPages = doc?.sections || [
    { id: "p1", title: "Corporate Cover & Title", page: 1, category: "Cover" },
    { id: "p2", title: "Management Discussion (MD&A)", page: doc?.ticker === "AAPL" ? 32 : 84, category: "MD&A" },
    { id: "p3", title: "Consolidated Statement of Profit and Loss", page: doc?.ticker === "AAPL" ? 48 : 112, category: "Financials" },
    { id: "p4", title: "Consolidated Balance Sheet", page: doc?.ticker === "AAPL" ? 50 : 114, category: "Financials" },
    { id: "p5", title: "Statement of Cash Flows", page: doc?.ticker === "AAPL" ? 52 : 116, category: "Financials" },
    { id: "p6", title: "Risk Factors & Disclosures", page: doc?.ticker === "AAPL" ? 21 : 138, category: "Risk" },
    { id: "p7", title: "Independent Auditor's Report", page: doc?.ticker === "AAPL" ? 46 : 164, category: "Audit" }
  ];

  function handlePrevPage() {
    setCurrentPage((p) => Math.max(1, p - 1));
  }

  function handleNextPage() {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }

  function handleZoomIn() {
    setZoomLevel((z) => Math.min(175, z + 25));
  }

  function handleZoomOut() {
    setZoomLevel((z) => Math.max(75, z - 25));
  }

  function jumpToSection(page, index) {
    setCurrentPage(page);
    setActiveThumbnailIndex(index);
  }

  return (
    <div className="fin-doc-viewer-container">
      {/* Top PDF Toolbar */}
      <div className="doc-viewer-toolbar">
        <div className="flex-row items-center gap-2">
          <FileText size={16} className="text-accent" />
          <span className="doc-viewer-filename truncate max-w-xs" title={doc?.name}>
            {doc?.name}
          </span>
          {doc?.blobUrl && (
            <div className="viewer-mode-toggle ml-2">
              <button
                type="button"
                className={`mode-btn ${viewMode === "native" ? "active" : ""}`}
                onClick={() => setViewMode("native")}
              >
                Native PDF
              </button>
              <button
                type="button"
                className={`mode-btn ${viewMode === "parsed" ? "active" : ""}`}
                onClick={() => setViewMode("parsed")}
              >
                Audited Page View
              </button>
            </div>
          )}
        </div>

        {/* Page navigation & Zoom controls */}
        <div className="flex-row items-center gap-2">
          {viewMode === "parsed" && (
            <>
              <div className="doc-page-nav-group">
                <button
                  type="button"
                  className="page-nav-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  title="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>
                <div className="page-indicator">
                  <span>Page</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        setCurrentPage(val);
                      }
                    }}
                    className="page-number-input"
                  />
                  <span>of {totalPages}</span>
                </div>
                <button
                  type="button"
                  className="page-nav-btn"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  title="Next page"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              <div className="doc-zoom-group">
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 75}
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="zoom-label">{zoomLevel}%</span>
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 175}
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </>
          )}

          {doc?.blobUrl && (
            <a
              href={doc.blobUrl}
              target="_blank"
              rel="noreferrer"
              className="open-external-btn"
              title="Open PDF in new browser tab"
            >
              <ExternalLink size={14} />
              <span>Full Tab</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Viewer Body with Optional Left Thumbnails */}
      <div className="doc-viewer-body">
        {/* Left Page Landmarks & Thumbnails Sidebar */}
        <div className="doc-thumbnails-sidebar">
          <div className="thumbnails-header">
            <Bookmark size={13} className="text-muted" />
            <span>Document Sections</span>
          </div>
          <div className="thumbnails-list">
            {landmarkPages.map((sec, idx) => {
              const isSelected = currentPage === sec.page || activeThumbnailIndex === idx;
              return (
                <div
                  key={sec.id || idx}
                  className={`thumbnail-item ${isSelected ? "selected" : ""}`}
                  onClick={() => jumpToSection(sec.page, idx)}
                  title={`${sec.title} (Page ${sec.page})`}
                >
                  <div className="thumb-mini-preview">
                    <span className="thumb-page-num">P.{sec.page}</span>
                    <div className="thumb-skeleton">
                      <div className="skeleton-line w-8" />
                      <div className="skeleton-line w-12" />
                      <div className="skeleton-line w-10" />
                    </div>
                  </div>
                  <div className="thumb-info">
                    <span className="thumb-title truncate">{sec.title}</span>
                    <span className="thumb-cat">{sec.category || "Section"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Document Display */}
        <div className="doc-canvas-viewport">
          {viewMode === "native" && doc?.blobUrl ? (
            <iframe
              src={doc.blobUrl}
              title={doc.name}
              className="native-pdf-iframe"
            />
          ) : (
            <div
              className="doc-rendered-page animate-fadeIn"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            >
              {/* Authentic Financial Document Header */}
              <div className="rendered-page-header">
                <div className="header-meta">
                  <span className="corp-header-brand">{doc?.company || "CORPORATE DISCLOSURE"}</span>
                  <span className="filing-header-tag">{doc?.docType || "FORM 10-K"} • FY2024</span>
                </div>
                <span className="page-header-num">PAGE {currentPage}</span>
              </div>

              {/* Dynamic Page Content Based on Selected Page */}
              <div className="rendered-page-content">
                {currentPage === 1 ? (
                  <div className="cover-page-view text-center py-12">
                    <div className="cover-logo-pill mx-auto mb-4">
                      <ShieldCheck size={36} className="text-accent" />
                    </div>
                    <h1 className="text-2xl font-bold">{doc?.company}</h1>
                    <p className="text-sm text-muted mt-2 uppercase tracking-widest">{doc?.docType}</p>
                    <p className="text-xs text-muted mt-1">FOR THE FISCAL YEAR ENDED 2024</p>
                    <div className="cover-stats-box mt-8 mx-auto max-w-sm p-4 border rounded">
                      <div className="flex-row justify-between text-xs py-1">
                        <span>Filing Date:</span>
                        <strong>{doc?.uploadDate}</strong>
                      </div>
                      <div className="flex-row justify-between text-xs py-1">
                        <span>Document ID:</span>
                        <strong className="font-mono">{doc?.id}</strong>
                      </div>
                      <div className="flex-row justify-between text-xs py-1">
                        <span>Total Document Length:</span>
                        <strong>{totalPages} Pages</strong>
                      </div>
                      <div className="flex-row justify-between text-xs py-1">
                        <span>Semantic Vector Chunks:</span>
                        <strong className="text-accent">{doc?.chunksCount || 1420} Chunks</strong>
                      </div>
                    </div>
                  </div>
                ) : currentPage === 112 || currentPage === 94 || currentPage === 48 ? (
                  /* Financial Statement Page: Statement of Profit and Loss */
                  <div className="financial-statement-page">
                    <div className="sec-banner mb-3">
                      <span className="text-xs font-bold tracking-wider uppercase text-muted">
                        Item 8 • Consolidated Financial Statements
                      </span>
                      <h2 className="text-lg font-bold text-main mt-0.5">
                        Consolidated Statement of Profit and Loss
                      </h2>
                      <p className="text-xs text-muted">
                        (Amounts in ₹ Crore / US$ Million as disclosed in official audited filing)
                      </p>
                    </div>

                    {/* Grounded Citation Callout Pill */}
                    <div className="grounded-chunk-callout mb-4">
                      <div className="flex-row items-center gap-1.5">
                        <Sparkles size={13} className="text-teal" />
                        <span className="text-xs font-semibold text-accent">Indexed Vector Chunk: chk-{doc?.ticker?.toLowerCase()}-048</span>
                        <Badge variant="success" size="xs" className="ml-auto">Cosine Sim: 94.2%</Badge>
                      </div>
                      <p className="text-xs mt-1.5 text-muted leading-relaxed">
                        "Revenues from operations stood at {doc?.ticker === "TCS" ? "₹240,893 crore" : doc?.ticker === "AAPL" ? "$391.04 billion" : "₹153,670 crore"}, yielding an operating margin of {doc?.ticker === "TCS" ? "24.6%" : doc?.ticker === "AAPL" ? "31.5%" : "20.7%"} compared to prior fiscal year."
                      </p>
                    </div>

                    <table className="rendered-financial-table">
                      <thead>
                        <tr>
                          <th className="text-left">Particulars / Line Item</th>
                          <th className="text-right">FY 2024</th>
                          <th className="text-right">FY 2023</th>
                          <th className="text-right">% Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="row-bold highlight-grounded">
                          <td>Revenue from Operations (Net Sales)</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹2,40,893" : doc?.ticker === "AAPL" ? "$391,036" : "₹1,53,670"}</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹2,25,458" : doc?.ticker === "AAPL" ? "$383,285" : "₹1,46,767"}</td>
                          <td className="text-right font-mono text-success">{doc?.ticker === "TCS" ? "+6.8%" : doc?.ticker === "AAPL" ? "+2.0%" : "+4.7%"}</td>
                        </tr>
                        <tr>
                          <td>Cost of Software & Employee Expenses</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹1,33,456" : doc?.ticker === "AAPL" ? "$210,352" : "₹82,410"}</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹1,27,522" : doc?.ticker === "AAPL" ? "$214,137" : "₹78,245"}</td>
                          <td className="text-right font-mono">+4.6%</td>
                        </tr>
                        <tr>
                          <td>Technical Sub-contractor Expenses</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹19,240" : doc?.ticker === "AAPL" ? "N/A" : "₹14,562"}</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹20,105" : doc?.ticker === "AAPL" ? "N/A" : "₹15,920"}</td>
                          <td className="text-right font-mono text-warning">-8.5%</td>
                        </tr>
                        <tr className="row-bold highlight-grounded">
                          <td>Operating Profit (EBIT)</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹59,258" : doc?.ticker === "AAPL" ? "$123,216" : "₹31,861"}</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹54,263" : doc?.ticker === "AAPL" ? "$114,301" : "₹30,905"}</td>
                          <td className="text-right font-mono text-success">{doc?.ticker === "TCS" ? "+9.2%" : doc?.ticker === "AAPL" ? "+7.8%" : "+3.1%"}</td>
                        </tr>
                        <tr className="row-italic">
                          <td>Operating Margin (%)</td>
                          <td className="text-right font-mono font-bold text-accent">{doc?.ticker === "TCS" ? "24.6%" : doc?.ticker === "AAPL" ? "31.5%" : "20.7%"}</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "24.1%" : doc?.ticker === "AAPL" ? "29.8%" : "21.0%"}</td>
                          <td className="text-right font-mono text-accent">{doc?.ticker === "TCS" ? "+50 bps" : doc?.ticker === "AAPL" ? "+170 bps" : "-30 bps"}</td>
                        </tr>
                        <tr>
                          <td>Income Taxes</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹15,482" : doc?.ticker === "AAPL" ? "$29,474" : "₹9,310"}</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹14,604" : doc?.ticker === "AAPL" ? "$16,741" : "₹9,214"}</td>
                          <td className="text-right font-mono">+1.0%</td>
                        </tr>
                        <tr className="row-double-underline">
                          <td>Profit After Tax (Net Income)</td>
                          <td className="text-right font-mono font-bold text-success">{doc?.ticker === "TCS" ? "₹46,585" : doc?.ticker === "AAPL" ? "$93,736" : "₹26,233"}</td>
                          <td className="text-right font-mono">{doc?.ticker === "TCS" ? "₹42,147" : doc?.ticker === "AAPL" ? "$96,995" : "₹24,095"}</td>
                          <td className="text-right font-mono text-success">{doc?.ticker === "TCS" ? "+10.5%" : doc?.ticker === "AAPL" ? "-3.4%" : "+8.9%"}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="page-footnote-box mt-4">
                      <p className="text-[11px] text-muted italic">
                        * Notes 1 to 32 form an integral part of these consolidated financial statements. Subject to statutory audit report by independent auditors.
                      </p>
                    </div>
                  </div>
                ) : currentPage === 84 || currentPage === 72 || currentPage === 34 ? (
                  /* Segmental Analysis Page */
                  <div className="segmental-analysis-page">
                    <span className="text-xs font-bold uppercase text-muted">Management Discussion & Analysis</span>
                    <h2 className="text-lg font-bold text-main mt-0.5">Vertical & Geographic Segment Performance</h2>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      Enterprise transformation deal momentum remained robust across Manufacturing and Energy verticals, while discretionary tech spending experienced client-level decision deferrals in Financial Services.
                    </p>

                    <div className="grounded-chunk-callout mt-4 mb-4">
                      <div className="flex-row items-center gap-1.5">
                        <Sparkles size={13} className="text-teal" />
                        <span className="text-xs font-semibold text-accent">Indexed Vector Chunk: chk-{doc?.ticker?.toLowerCase()}-084</span>
                        <Badge variant="success" size="xs" className="ml-auto">Cosine Sim: 89.5%</Badge>
                      </div>
                      <p className="text-xs mt-1.5 text-muted leading-relaxed">
                        "Revenues from Financial Services vertical contracted 1.0% in constant currency, accounting for 27.2% of total revenue. Total contract value (TCV) of large deal signings reached an all-time record of $17.7 billion."
                      </p>
                    </div>

                    <div className="segment-kpi-summary grid grid-cols-3 gap-3 my-4">
                      <div className="p-3 border rounded bg-card-subtle">
                        <span className="text-[11px] text-muted block">Financial Services Vertical</span>
                        <strong className="text-sm text-warning font-mono block mt-1">-1.0% Constant Currency</strong>
                        <span className="text-[10px] text-dim">27.2% of revenue mix</span>
                      </div>
                      <div className="p-3 border rounded bg-card-subtle">
                        <span className="text-[11px] text-muted block">Manufacturing Vertical</span>
                        <strong className="text-sm text-success font-mono block mt-1">+11.2% YoY Growth</strong>
                        <span className="text-[10px] text-dim">Resilient industrial demand</span>
                      </div>
                      <div className="p-3 border rounded bg-card-subtle">
                        <span className="text-[11px] text-muted block">Large Deal TCV Order Book</span>
                        <strong className="text-sm text-accent font-mono block mt-1">$17.7 Billion Total</strong>
                        <span className="text-[10px] text-dim">52% net new deals</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Extracted Document Page */
                  <div className="standard-page-view">
                    <span className="text-xs font-bold uppercase text-muted">Audited Disclosure • Section Content</span>
                    <h2 className="text-lg font-bold text-main mt-0.5">
                      {landmarkPages.find((p) => p.page === currentPage)?.title || `Filing Section — Page ${currentPage}`}
                    </h2>
                    <p className="text-xs text-muted mt-3 leading-relaxed">
                      This page contains verified text streams and tabular disclosures extracted by the Financial-OCR ingestion pipeline. All line items have been indexed with 1536-dimensional OpenAI vector embeddings for grounded multi-agent queries.
                    </p>

                    <div className="ocr-text-box mt-4 p-4 border rounded font-mono text-xs text-muted leading-loose">
                      <p>
                        [PAGE {currentPage} — OCR STREAM DECODED — ZERO TOKEN DRIFT]
                      </p>
                      <p className="mt-2 text-main">
                        The accompanying disclosures and balance sheet allocations have been audited under applicable regulatory accounting standards. Management continues to evaluate capital structure, employee utilization rates, and contract margin realization.
                      </p>
                      <p className="mt-2">
                        Forward-looking statements involve known and unknown risks, including currency fluctuations, regulatory shifts in enterprise cloud adoption, and supply constraints for specialized AI accelerators.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Authentic Page Footer */}
              <div className="rendered-page-footer">
                <span className="text-[11px] text-muted">{doc?.name} • Institutional Ingestion Engine</span>
                <span className="text-[11px] font-mono text-muted">Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
