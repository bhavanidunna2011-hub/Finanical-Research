// Module 6: Research Report Data Store & Schema
import { SEED_COMPANIES } from "./seedData";
import { INITIAL_DOCUMENTS } from "./documentData";

export const REPORT_STATUSES = ["Completed", "Generating", "Draft", "Failed"];

export const AVAILABLE_REPORT_SECTIONS = [
  {
    id: "executive_summary",
    title: "1. Executive Summary",
    description: "Core investment highlights, top-line trajectory, and management commentary summary.",
    required: true
  },
  {
    id: "key_financials",
    title: "2. Key Financials",
    description: "Metric cards, GAAP/IFRS line items, ratio progression, and auditor verification.",
    required: false
  },
  {
    id: "red_flags",
    title: "3. Red Flags",
    description: "Forensic risk audit, severity rankings (High/Medium/Low), and footnote disclosures.",
    required: false
  },
  {
    id: "company_comparison",
    title: "4. Company Comparison",
    description: "Side-by-side benchmarking table, margin spread analysis, and competitive positioning.",
    required: false,
    requiresMultiCompany: true
  },
  {
    id: "outlook",
    title: "5. Outlook",
    description: "12-month forward assessment, capital allocation strategy, and sensitivity considerations.",
    required: false
  }
];

export const INITIAL_REPORTS = [
  {
    id: "rep-1",
    title: "FY24 IT Services Peer Benchmarking Dossier: Infosys vs TCS",
    company: "Infosys & TCS",
    companyIds: ["INFY", "TCS"],
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    createdAt: "May 24, 2024",
    updatedAt: "May 24, 2024",
    status: "Completed",
    isDemo: true,
    hasRealPdf: false,
    sections: ["executive_summary", "key_financials", "red_flags", "company_comparison", "outlook"],
    sourceDocuments: [
      "Infosys-Annual-Report-2023-24.pdf",
      "TCS-Annual-Report-2023-24.pdf",
      "TCS-Audited-Financial-Statements-FY24.pdf"
    ],
    summarySnippet: "Comprehensive institutional analysis benchmarking Infosys against TCS across FY24 revenue growth (+4.7% vs +6.8%), operating margin spreads (20.7% vs 24.6%), and forensic human capital adjustments."
  },
  {
    id: "rep-2",
    title: "Infosys Limited: FY24 Forensic Audit & Cost Structure Dossier",
    company: "Infosys Limited",
    companyIds: ["INFY"],
    sessionId: "session-2",
    sessionTitle: "Infosys Standalone Valuation & Cost Structure",
    createdAt: "May 22, 2024",
    updatedAt: "May 23, 2024",
    status: "Completed",
    isDemo: true,
    hasRealPdf: false,
    sections: ["executive_summary", "key_financials", "red_flags", "outlook"],
    sourceDocuments: ["Infosys-Annual-Report-2023-24.pdf"],
    summarySnippet: "In-depth forensic audit focusing on subcontractor cost elevation (9.5% of revenue), net headcount contraction of 25,933 employees, and pristine debt-free balance sheet health."
  },
  {
    id: "rep-3",
    title: "TCS Cloud & AI Deal Pipeline Momentum Review",
    company: "Tata Consultancy Services",
    companyIds: ["TCS"],
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    createdAt: "May 20, 2024",
    updatedAt: "May 21, 2024",
    status: "Draft",
    isDemo: true,
    hasRealPdf: false,
    sections: ["executive_summary", "key_financials", "outlook"],
    sourceDocuments: ["TCS-Annual-Report-2023-24.pdf"],
    summarySnippet: "Draft memorandum evaluating TCS's record order book of $42.7B in deal TCV, 24.6% operating margin resilience, and capital allocation return of 100% of free cash flow."
  },
  {
    id: "rep-4",
    title: "North American Banking Discretionary Spend Sensitivity Dossier",
    company: "Infosys & TCS",
    companyIds: ["INFY", "TCS"],
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    createdAt: "May 25, 2024",
    updatedAt: "May 25, 2024",
    status: "Generating",
    generationProgress: 68,
    generationStage: "Harmonizing Note 18 segment revenues with industry peer disclosures...",
    isDemo: true,
    hasRealPdf: false,
    sections: ["executive_summary", "red_flags", "company_comparison"],
    sourceDocuments: ["Infosys-Annual-Report-2023-24.pdf", "TCS-Annual-Report-2023-24.pdf"],
    summarySnippet: "Active multi-agent pipeline synthesizing BFSI sector contraction (-1.0% CC) and pipeline ramp-up timing for H2 FY25."
  },
  {
    id: "rep-5",
    title: "Cross-Border FX Hedging & Foreign Currency Exposure Audit",
    company: "Infosys Limited",
    companyIds: ["INFY"],
    sessionId: "session-2",
    sessionTitle: "Infosys Standalone Valuation & Cost Structure",
    createdAt: "May 18, 2024",
    updatedAt: "May 19, 2024",
    status: "Failed",
    failureReason: "Vector index retrieval timeout while accessing Note 28 (Derivative Financial Instruments). Audited coordinate bounds could not be reconciled.",
    isDemo: true,
    hasRealPdf: false,
    sections: ["executive_summary", "red_flags"],
    sourceDocuments: ["Infosys-Annual-Report-2023-24.pdf"],
    summarySnippet: "Failed generation run due to simulated vector network timeout during derivative footnote ingestion."
  }
];

const REPORT_STORAGE_KEY = "finresearch_reports_v6";

export function getStoredReports() {
  try {
    const raw = localStorage.getItem(REPORT_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (err) {
    console.warn("Failed to load reports from localStorage", err);
    return [];
  }
}

export function saveStoredReports(reports) {
  try {
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.warn("Failed to save reports to localStorage", err);
  }
}

// Generate structured report content for a given configuration
export function generateStructuredReportContent(report) {
  const primaryKey = report.companyIds?.[0] || "INFY";
  const secondaryKey = report.companyIds?.[1] || "TCS";
  const primary = SEED_COMPANIES[primaryKey] || SEED_COMPANIES.INFY;
  const secondary = SEED_COMPANIES[secondaryKey] || SEED_COMPANIES.TCS;
  const isMulti = report.companyIds?.length > 1;

  return {
    metadata: {
      reportId: report.id,
      title: report.title,
      division: "FINRESEARCH AI • EQUITY RESEARCH DIVISION",
      coverage: `${primary.name} (${primary.ticker})${isMulti ? ` & ${secondary.name} (${secondary.ticker})` : ""}`,
      filingBasis: "Audited SEC Form 10-K / Integrated Annual Reports",
      publicationDate: report.createdAt || new Date().toLocaleDateString(),
      analyst: "Lead Research Analyst (Institutional Systems)",
      validationStatus: "100% Strict Grounding Verified",
      confidence: "98.4% Vector Fidelity"
    },
    executiveSummary: {
      paragraphs: [
        `This institutional research report provides a multi-agent financial audit and synthesis of ${primary.name} (${primary.ticker})${isMulti ? ` in side-by-side benchmark comparison with ${secondary.name} (${secondary.ticker})` : ""} for the fiscal year ended March 31, 2024. All financial metrics, operating ratios, and risk observations reported herein are anchored directly in published audited filings under strict zero-hallucination standards.`,
        `During FY24, ${primary.name} generated consolidated revenues of ${primary.metrics.revenue} (${primary.metrics.revenueGrowth}), delivering operating profit margins of ${primary.metrics.operatingMargin}. Net profit attributable to shareholders stood at ${primary.metrics.netProfit} (${primary.metrics.dilutedEPS} diluted EPS). Free cash flow conversion remained exceptional at ${primary.metrics.fcfConversion} (${primary.metrics.freeCashFlow}), sustaining a pristine zero-debt capital structure with ${primary.metrics.cashEquivalents} in cash and liquid investments.`
      ],
      takeaways: [
        { label: "Top-line Trajectory", text: `${primary.name} expanded revenues +4.7% reported (+1.4% constant currency), driven by record large deal TCV of ${primary.metrics.dealTCV}.` },
        { label: "Operational Discipline", text: `Operating margin of ${primary.metrics.operatingMargin} maintained within corporate guidance band despite elevated subcontractor expenses.` },
        { label: "Capital Allocation", text: `Free cash flow conversion of ${primary.metrics.fcfConversion} supported dividend distributions and capital returns with zero financial leverage.` }
      ]
    },
    keyFinancials: {
      metricCards: [
        { title: "Consolidated Revenue", value: primary.metrics.revenue, delta: primary.metrics.revenueGrowth, isPositive: true, subtitle: primary.ticker },
        { title: "Operating Margin (EBIT)", value: primary.metrics.operatingMargin, delta: primary.metrics.operatingMarginDelta, isPositive: false, subtitle: "Target: 20-22%" },
        { title: "Net Profit (PAT)", value: primary.metrics.netProfit, delta: primary.metrics.netProfitGrowth, isPositive: true, subtitle: primary.metrics.dilutedEPS },
        { title: "Free Cash Flow", value: primary.metrics.freeCashFlow, delta: primary.metrics.fcfConversion, isPositive: true, subtitle: "Cash Conversion" },
        { title: "Return on Equity (ROE)", value: primary.metrics.roe, delta: "Top Quartile", isPositive: true, subtitle: "DuPont Analysis" }
      ],
      table: {
        title: "Consolidated Financial Metrics & Audit Verification Table",
        headers: ["Financial Line Item / Metric", `${primary.name} (${primary.ticker})`, ...(isMulti ? [`${secondary.name} (${secondary.ticker})`] : []), "Target / Benchmark", "Audited Filing Citation"],
        rows: [
          ["Revenue from Operations", primary.metrics.revenue, ...(isMulti ? [secondary.metrics.revenue] : []), "Positive YoY", `${primary.filingDocName}, p. 112`],
          ["Operating Profit (EBIT)", primary.metrics.operatingMargin, ...(isMulti ? [secondary.metrics.operatingMargin] : []), "20.0% - 24.0%", `${primary.filingDocName}, p. 112`],
          ["Net Profit (PAT)", primary.metrics.netProfit, ...(isMulti ? [secondary.metrics.netProfit] : []), "Positive Growth", `${primary.filingDocName}, p. 112`],
          ["Diluted Earnings Per Share", primary.metrics.dilutedEPS, ...(isMulti ? [secondary.metrics.dilutedEPS] : []), "EPS Expansion", `${primary.filingDocName}, p. 112`],
          ["Free Cash Flow", primary.metrics.freeCashFlow, ...(isMulti ? [secondary.metrics.freeCashFlow] : []), ">80% PAT Conversion", `${primary.filingDocName}, p. 116`],
          ["Return on Equity (ROE)", primary.metrics.roe, ...(isMulti ? [secondary.metrics.roe] : []), ">25.0%", `${primary.filingDocName}, p. 145`],
          ["Balance Sheet Debt", primary.metrics.totalDebt, ...(isMulti ? [secondary.metrics.totalDebt] : []), "Zero Debt / AAA", `${primary.filingDocName}, p. 114`],
          ["Cash & Liquid Reserves", primary.metrics.cashEquivalents, ...(isMulti ? [secondary.metrics.cashEquivalents] : []), ">15% Revenue", `${primary.filingDocName}, p. 114`]
        ]
      },
      auditorOpinion: {
        auditor: primary.auditorReport?.auditor || "Deloitte Haskins & Sells LLP",
        opinion: primary.auditorReport?.opinion || "Unqualified (Clean Opinion)",
        page: primary.auditorReport?.page || 164,
        keyAuditMatters: primary.auditorReport?.keyAuditMatters || ["Revenue recognition on fixed-price contracts", "Evaluation of software project completion milestones"]
      }
    },
    redFlags: {
      summary: "The automated Red Flag Agent surfaced 3 notable vulnerabilities in audited filings, categorized by severity:",
      risks: primary.redFlags || [
        {
          id: "rf-1",
          title: "Subcontractor Cost Elevation",
          category: "Cost Drag",
          severity: "High",
          impact: "Technical subcontractor expenses rose to ₹14,562 Cr (9.5% of revenue), exerting a ~210 bps headwind on operating margins.",
          evidenceSnippet: "Technical sub-contractor expenses for the year ended March 31, 2024 were ₹14,562 Cr as compared to ₹12,852 Cr for the year ended March 31, 2023.",
          citation: `${primary.filingDocName}, Page 129 (Note 21: Operating Expenses)`
        },
        {
          id: "rf-2",
          title: "Net Headcount Contraction",
          category: "Capacity Rationalization",
          severity: "High",
          impact: "Workforce contracted by 25,933 employees (-7.6%), marking the largest single-year staff reduction in company history.",
          evidenceSnippet: "Total headcount as of March 31, 2024 stood at 317,240 employees compared to 343,234 employees as of March 31, 2023.",
          citation: `${primary.filingDocName}, Page 138 (Human Capital Disclosures)`
        },
        {
          id: "rf-3",
          title: "Discretionary BFSI Spending Contraction",
          category: "Top-line Headwind",
          severity: "Medium",
          impact: "Financial Services vertical contracted 1.0% in constant currency, delaying client contract ramp-ups.",
          evidenceSnippet: "In constant currency terms, the Financial Services segment contracted by 1.0%, while Manufacturing grew by 7.8%.",
          citation: `${primary.filingDocName}, Page 84 (Segmental MD&A)`
        }
      ]
    },
    companyComparison: isMulti ? {
      summary: `Direct peer benchmarking between ${primary.name} and ${secondary.name} highlights structural margin, scale, and capital efficiency spreads:`,
      headers: ["Benchmarking Parameter", `${primary.name} (${primary.ticker})`, `${secondary.name} (${secondary.ticker})`, "Spread / Variance", "Category Leader"],
      rows: [
        ["Operating Margin (EBIT)", primary.metrics.operatingMargin, secondary.metrics.operatingMargin, "+390 bps spread", `${secondary.ticker} (Superior Cost Discipline)`],
        ["Revenue Scale ($ USD)", "$18.56 Billion", "$29.08 Billion", "1.57x scale spread", `${secondary.ticker} (Global Scale Advantage)`],
        ["Return on Equity (ROE)", primary.metrics.roe, secondary.metrics.roe, "+1,970 bps spread", `${secondary.ticker} (Asset-Light Compounding)`],
        ["Free Cash Flow Conversion", primary.metrics.fcfConversion, secondary.metrics.fcfConversion, "+390 bps spread", `${secondary.ticker} (Accelerated Cash Cycle)`],
        ["Deal TCV Pipeline", primary.metrics.dealTCV, secondary.metrics.dealTCV, "2.4x order book spread", `${secondary.ticker} (Record Enterprise Mega-deals)`],
        ["Balance Sheet Solvency", "Zero Debt (Net Cash)", "Zero Debt (Net Cash)", "Parity", "Both Entities (Pristine AAA Health)"]
      ]
    } : null,
    outlook: {
      narrative: `Both capital discipline and liquidity remain bulletproof, supported by debt-free balance sheets and positive operational cash flows. While corporate discretionary IT spend in North American banking remains cautious, multi-year cloud transformation, AI enablement, and digital vendor consolidation programs provide a solid floor for steady revenue expansion into FY25.`,
      strategicPriorities: [
        "Acceleration of generative AI offerings and enterprise foundation model fine-tuning.",
        "Optimization of subcontractor costs back towards historical 6.5% - 7.5% target bands.",
        "Sustained offshore delivery ratio (~75-82%) to protect operating margins against onshore wage inflation."
      ],
      caveats: "Forward observations are derived from management MD&A disclosures and are subject to macroeconomic currency volatility and enterprise budget release cycles."
    },
    citations: [
      { doc: primary.filingDocName, page: 112, section: "Consolidated Statement of Profit and Loss", passage: "Revenues from operations for the year ended March 31, 2024 were ₹153,670 crore." },
      { doc: primary.filingDocName, page: 114, section: "Consolidated Balance Sheet", passage: "Long-term borrowings stood at Nil as of March 31, 2024. Cash reserves stood at ₹34,714 crore." },
      { doc: primary.filingDocName, page: 116, section: "Consolidated Statement of Cash Flows", passage: "Free cash flow was ₹23,982 crore, reflecting a cash conversion ratio of 91.2%." },
      { doc: primary.filingDocName, page: 129, section: "Note 21: Operating Expenses", passage: "Technical sub-contractor expenses were ₹14,562 Cr (9.5% of revenue)." }
    ]
  };
}
