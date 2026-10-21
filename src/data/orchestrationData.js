// Multi-Agent Orchestration Layer Data Store for Module 4
import { SEED_COMPANIES } from "./seedData";

export const AGENT_ROLES = [
  {
    id: "documentAgent",
    name: "Document Agent",
    shortName: "Doc Agent",
    icon: "FileText",
    color: "#3b82f6", // Blue
    category: "Ingestion & Indexing",
    responsibility: "OCR text parsing, table coordinate extraction, footnote segmentation, and 1536-dimensional vector embedding generation.",
    defaultStatus: "Completed",
    currentTask: "Indexed 3,000 dense semantic vector chunks across INFY and TCS annual reports.",
    lastActivity: "2 mins ago",
    duration: "4.2s",
    stats: "3,000+ chunks • 804 pages",
    inputs: ["Audited PDF filings", "SEC Form 10-K", "Integrated Annual Reports"],
    outputs: ["HNSW vector index", "Normalized table grids", "Document text streams"],
    dependencies: ["Document Upload"],
    conditionalNote: "Always executed as Stage 1 for any ingested filing."
  },
  {
    id: "extractionAgent",
    name: "Extraction Agent",
    shortName: "Extract Agent",
    icon: "Layers",
    color: "#10b981", // Emerald
    category: "Financial Analytics",
    responsibility: "Harvester of GAAP/IFRS financial line items (Revenue, EBIT, Net Income, FCF, CapEx, Diluted EPS) and ratio reconciliation.",
    defaultStatus: "Completed",
    currentTask: "Harvested 14 core metrics and 7 financial ratios with coordinate anchors.",
    lastActivity: "1 min ago",
    duration: "2.8s",
    stats: "14 core metrics • 7 ratios",
    inputs: ["Indexed chunks from Document Agent", "Consolidated P&L & Balance Sheet schedules"],
    outputs: ["GAAP metrics matrix", "Profitability & liquidity ratios", "Reconciliation table"],
    dependencies: ["Document Agent"],
    conditionalNote: "Requires successful completion of Document Agent."
  },
  {
    id: "redFlagAgent",
    name: "Red Flag Agent",
    shortName: "Risk Agent",
    icon: "AlertTriangle",
    color: "#f59e0b", // Amber
    category: "Forensic Audit",
    responsibility: "Unprompted forensic anomaly detection: margin degradation, debt surges, customer/geographic concentration, and auditor qualifications.",
    defaultStatus: "Completed",
    currentTask: "Surfaced 5 forensic anomalies across IT discretionary spend freeze and headcount contraction.",
    lastActivity: "45s ago",
    duration: "3.1s",
    stats: "5 forensic anomalies • 8 heuristics",
    inputs: ["Extracted metrics", "Item 1A Risk Factors", "Footnote disclosures", "Auditor reports"],
    outputs: ["Forensic risk matrix", "Severity scorecards (High/Med/Low)", "Evidence snippets"],
    dependencies: ["Extraction Agent"],
    conditionalNote: "Can run independently as a standalone Forensic Scan."
  },
  {
    id: "comparisonAgent",
    name: "Comparison Agent",
    shortName: "Peer Agent",
    icon: "GitCompare",
    color: "#a855f7", // Purple
    category: "Peer Benchmarking",
    responsibility: "Cross-company benchmarking, EBIT margin variance spreads, deal TCV rankings, and competitive peer positioning.",
    defaultStatus: "Completed",
    currentTask: "Compiled 387 bps EBIT margin variance matrix for INFY vs TCS.",
    lastActivity: "30s ago",
    duration: "1.9s",
    stats: "387 bps EBIT spread • $42.7B vs $17.7B TCV",
    inputs: ["Multi-company metrics from Extraction Agent", "Segmental disclosures"],
    outputs: ["Side-by-side variance matrix", "Peer ranking scorecards", "Spread drivers"],
    dependencies: ["Extraction Agent", "Red Flag Agent"],
    conditionalNote: "CONDITIONAL BRANCH: Activated only for multi-company peer research sessions. Automatically bypassed for single-company runs."
  },
  {
    id: "researchAgent",
    name: "Research Agent",
    shortName: "Reasoning Agent",
    icon: "Bot",
    color: "#06b6d4", // Cyan
    category: "Conversational Reasoning",
    responsibility: "Multi-part financial reasoning engine decomposing complex analyst inquiries with step-by-step vector retrieval and strict citations.",
    defaultStatus: "Completed",
    currentTask: "Multi-step reasoning engine active for conversational queries with citation grounding.",
    lastActivity: "15s ago",
    duration: "Live",
    stats: "Sub-second retrieval • Strict citations",
    inputs: ["Analyst query", "Vector database", "Extracted ratios", "Red flag evidence"],
    outputs: ["Reasoning chains", "Synthesized analyst responses", "Grounded page citations"],
    dependencies: ["Extraction Agent", "Red Flag Agent", "Comparison Agent (if multi-company)"],
    conditionalNote: "Can be queried interactively at any time after Extraction completes."
  },
  {
    id: "reportAgent",
    name: "Report Agent",
    shortName: "Dossier Agent",
    icon: "Printer",
    color: "#ec4899", // Pink
    category: "Dossier Generation",
    responsibility: "Compiles outputs from all upstream agents into an institutional publication-grade analyst research report with exportable PDF formatting.",
    defaultStatus: "Completed",
    currentTask: "Compiled 5-part institutional research report ready for PDF export.",
    lastActivity: "Just now",
    duration: "1.4s",
    stats: "5 report sections • PDF export ready",
    inputs: ["Syntheses from all active agents", "Executive summaries", "Grounding citations"],
    outputs: ["Structured analyst report", "Print-ready stylesheet", "Dossier metadata"],
    dependencies: ["Research Agent", "Red Flag Agent", "Comparison Agent"],
    conditionalNote: "Final stage triggered when an analyst requests an exportable dossier."
  }
];

export const WORKFLOW_PRESETS = [
  {
    id: "wf-full-benchmark",
    name: "Full Institutional Peer Benchmarking Pipeline",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    type: "Peer Comparison & Benchmarking",
    targetCompanies: ["Infosys Limited (INFY)", "Tata Consultancy Services (TCS)"],
    inputDocuments: [
      "Infosys-Annual-Report-2023-24.pdf (384 pages, 1,420 chunks)",
      "TCS-Annual-Report-2023-24.pdf (420 pages, 1,580 chunks)"
    ],
    status: "Completed",
    totalDuration: "13.4s",
    activeAgentsCount: 6,
    bypassedAgents: [],
    description: "End-to-end multi-agent execution cross-referencing EBIT spreads, order book TCV, and employee costs between India's top two IT services firms.",
    steps: [
      {
        step: 1,
        agentId: "documentAgent",
        name: "Document Ingestion & 1536-Dim Vector Indexing",
        status: "Completed",
        timestamp: "10:30:02 AM",
        duration: "4.2s",
        detail: "Ingested 804 total pages across 2 filings. OCR table parsing extracted 68 tabular schedules. Generated 3,000 vector chunks in HNSW storage.",
        sourceReferences: ["Infosys-Annual-Report-2023-24.pdf, p. 1-384", "TCS-Annual-Report-2023-24.pdf, p. 1-420"]
      },
      {
        step: 2,
        agentId: "extractionAgent",
        name: "Financial Metric Harvesting & Ratio Calculation",
        status: "Completed",
        timestamp: "10:30:06 AM",
        duration: "2.8s",
        detail: "Harvested Revenue (₹153,670 Cr vs ₹240,893 Cr), Operating Margins (20.7% vs 24.6%), and Net Profit (₹26,233 Cr vs ₹46,585 Cr). Calculated 7 normalized financial ratios.",
        sourceReferences: ["INFY Consolidated P&L, p. 112", "TCS Consolidated P&L, p. 94"]
      },
      {
        step: 3,
        agentId: "redFlagAgent",
        name: "Forensic Scan & Risk Disclosures",
        status: "Completed",
        timestamp: "10:30:09 AM",
        duration: "3.1s",
        detail: "Identified 3 anomalies for INFY (BFSI CC contraction -1.0%, net headcount reduction of 25,933) and 2 for TCS (Continental Europe -1.2%, Epic legal charge). Both clean audit opinions confirmed.",
        sourceReferences: ["INFY Segment Performance, p. 84", "TCS Geographic Performance, p. 72"]
      },
      {
        step: 4,
        agentId: "comparisonAgent",
        name: "Peer Benchmarking & Spread Decomposition",
        status: "Completed",
        timestamp: "10:30:12 AM",
        duration: "1.9s",
        detail: "Computed 387 bps EBIT margin spread in favor of TCS. Decomposed drivers: TCS offshore bench discipline and INFY subcontractor cost drag (9.5% of revenue).",
        sourceReferences: ["INFY Note 21 (Subcontractors), p. 129", "TCS Note 28 (Exceptional items), p. 118"]
      },
      {
        step: 5,
        agentId: "researchAgent",
        name: "Conversational Multi-Step Reasoning",
        status: "Completed",
        timestamp: "10:30:14 AM",
        duration: "Live",
        detail: "Synthesized multi-part inquiry regarding margin divergence with 4 reasoning steps and verbatim page citations.",
        sourceReferences: ["Chunk chk-infy-048", "Chunk chk-tcs-094"]
      },
      {
        step: 6,
        agentId: "reportAgent",
        name: "Institutional Analyst PDF Dossier Compilation",
        status: "Completed",
        timestamp: "10:30:16 AM",
        duration: "1.4s",
        detail: "Compiled publication-ready 5-part research dossier covering Executive Summary, Financial Performance, Forensic Red Flags, Peer Benchmarking, and Strategic Outlook.",
        sourceReferences: ["Audited Annual Reports FY24"]
      }
    ]
  },
  {
    id: "wf-single-company",
    name: "Single-Company Forensic Deep-Dive Pipeline",
    sessionId: "session-2",
    sessionTitle: "Apple Inc. (AAPL) 10-K Forensic Audit & Red Flag Analysis",
    type: "Forensic Financial Analysis",
    targetCompanies: ["Apple Inc. (AAPL)"],
    inputDocuments: ["Apple-10K-FY2024.pdf (78 pages, 920 chunks)"],
    status: "Completed",
    totalDuration: "8.6s",
    activeAgentsCount: 5,
    bypassedAgents: ["comparisonAgent"],
    description: "Targeted single-company forensic workflow bypassing the Comparison Agent. Scans for China market slowdown and the $10.2B European State Aid tax charge.",
    steps: [
      {
        step: 1,
        agentId: "documentAgent",
        name: "SEC Form 10-K Parsing & Vector Embeddings",
        status: "Completed",
        timestamp: "06:00:01 PM",
        duration: "2.1s",
        detail: "Parsed 78 pages of Form 10-K with interactive XBRL tags intact. Created 920 semantic chunks in AAPL vector namespace.",
        sourceReferences: ["Apple-10K-FY2024.pdf, Items 1, 1A, 7, 8"]
      },
      {
        step: 2,
        agentId: "extractionAgent",
        name: "GAAP Financial Metrics & Segment Harvesting",
        status: "Completed",
        timestamp: "06:00:03 PM",
        duration: "1.8s",
        detail: "Extracted Net Sales ($391.04B), Gross Margin (46.2%), Services Revenue ($96.2B, 74.0% margin), and Free Cash Flow ($108.8B).",
        sourceReferences: ["Item 8 Consolidated Statements of Operations, p. 48"]
      },
      {
        step: 3,
        agentId: "redFlagAgent",
        name: "Forensic Anomaly & Tax Event Audit",
        status: "Completed",
        timestamp: "06:00:06 PM",
        duration: "2.4s",
        detail: "Flagged $10.2B European State Aid tax charge in Q4 and Greater China net sales contraction (-7.7% to $66.95B).",
        sourceReferences: ["Note 5 (Income Taxes), p. 61", "Item 7 (Segment Net Sales), p. 34"]
      },
      {
        step: 4,
        agentId: "comparisonAgent",
        name: "Peer Benchmarking (Bypassed)",
        status: "Bypassed",
        timestamp: "--",
        duration: "0.0s",
        detail: "Bypassed automatically: Session targets single entity (Apple Inc.). No peer variance requested.",
        sourceReferences: []
      },
      {
        step: 5,
        agentId: "researchAgent",
        name: "Forensic Reasoning & Anomaly Assessment",
        status: "Completed",
        timestamp: "06:00:08 PM",
        duration: "1.2s",
        detail: "Decomposed the tax charge impact on run-rate earnings and working capital buffer.",
        sourceReferences: ["Item 8 Consolidated Balance Sheets, p. 50"]
      },
      {
        step: 6,
        agentId: "reportAgent",
        name: "Forensic Report Dossier Compilation",
        status: "Completed",
        timestamp: "06:00:09 PM",
        duration: "1.1s",
        detail: "Compiled single-company forensic dossier with audit disclosures and risk ratings.",
        sourceReferences: ["Apple Form 10-K FY2024"]
      }
    ]
  },
  {
    id: "wf-capex-investigation",
    name: "AI Infrastructure CapEx ROI Investigation Pipeline",
    sessionId: "session-3",
    sessionTitle: "Microsoft (MSFT) Cloud & AI CapEx ROI Investigation",
    type: "Investment Research",
    targetCompanies: ["Microsoft Corporation (MSFT)"],
    inputDocuments: ["Microsoft-10K-FY2024.pdf (96 pages, 1,140 chunks)"],
    status: "Completed",
    totalDuration: "9.2s",
    activeAgentsCount: 5,
    bypassedAgents: ["comparisonAgent"],
    description: "Specialized CapEx return workflow examining Microsoft's 75% increase in capital expenditures ($55.7B) against Azure AI acceleration.",
    steps: [
      {
        step: 1,
        agentId: "documentAgent",
        name: "Form 10-K Ingestion & Capital Schedule Chunking",
        status: "Completed",
        timestamp: "08:10:01 PM",
        duration: "2.4s",
        detail: "Ingested 96 pages. Structured commercial cloud disclosures, lease assets, and GPU supply notes into 1,140 chunks.",
        sourceReferences: ["Microsoft-10K-FY2024.pdf, Items 1, 7, 8"]
      },
      {
        step: 2,
        agentId: "extractionAgent",
        name: "Cloud Revenue & Free Cash Flow Harvesting",
        status: "Completed",
        timestamp: "08:10:04 PM",
        duration: "2.0s",
        detail: "Harvested Intelligent Cloud revenue ($105.4B, +20%), CapEx cash outlays ($44.5B), and Free Cash Flow ($74.1B).",
        sourceReferences: ["Item 7 (Operating Results), p. 40", "Item 8 (Statements of Cash Flows), p. 58"]
      },
      {
        step: 3,
        agentId: "redFlagAgent",
        name: "Depreciation Run-Rate & Supply Bottleneck Scan",
        status: "Completed",
        timestamp: "08:10:07 PM",
        duration: "2.6s",
        detail: "Flagged CapEx acceleration (22.7% of revenue) causing an impending $6.5B annual depreciation headwind into FY25.",
        sourceReferences: ["Item 7 (Liquidity and Capital Resources), p. 43"]
      },
      {
        step: 4,
        agentId: "comparisonAgent",
        name: "Peer Benchmarking (Bypassed)",
        status: "Bypassed",
        timestamp: "--",
        duration: "0.0s",
        detail: "Bypassed: Single-entity investigation.",
        sourceReferences: []
      },
      {
        step: 5,
        agentId: "researchAgent",
        name: "Azure Monetization vs CapEx Payback Modeling",
        status: "Completed",
        timestamp: "08:10:09 PM",
        duration: "1.3s",
        detail: "Analyzed Azure's 800 bps AI growth contribution and $269B Commercial RPO backlog against server depreciation.",
        sourceReferences: ["Item 7 (Segment Performance), p. 40"]
      },
      {
        step: 6,
        agentId: "reportAgent",
        name: "CapEx ROI Analyst Dossier Generation",
        status: "Completed",
        timestamp: "08:10:10 PM",
        duration: "0.9s",
        detail: "Structured CapEx ROI research note ready for export.",
        sourceReferences: ["Microsoft Form 10-K FY2024"]
      }
    ]
  }
];

export const INITIAL_TIMELINE_EVENTS = [
  {
    id: "evt-01",
    timestamp: "10:30:16 AM",
    relativeTime: "1 min ago",
    agentId: "reportAgent",
    agentName: "Report Agent",
    status: "Completed",
    title: "Institutional Analyst Dossier Compiled",
    description: "Compiled 5-part research report cross-referencing INFY vs TCS operating margins, deal pipeline, and risk factors.",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS Peer Benchmarking",
    docRef: "Infosys-Annual-Report-2023-24.pdf & TCS-Annual-Report-2023-24.pdf",
    evidence: "Full PDF export structure assembled with verified citations on page 112 and page 94."
  },
  {
    id: "evt-02",
    timestamp: "10:30:14 AM",
    relativeTime: "1 min ago",
    agentId: "researchAgent",
    agentName: "Research Agent",
    status: "Completed",
    title: "Multi-Part Reasoning Chain Validated",
    description: "Evaluated 387 bps EBIT margin spread: TCS 24.6% vs INFY 20.7%. Attached exact page citations.",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS Peer Benchmarking",
    docRef: "Infosys-Annual-Report-2023-24.pdf, p. 112",
    evidence: "Operating profit was ₹31,861 Cr (20.7%) vs ₹59,258 Cr (24.6%) with strict grounding."
  },
  {
    id: "evt-03",
    timestamp: "10:30:12 AM",
    relativeTime: "2 mins ago",
    agentId: "comparisonAgent",
    agentName: "Comparison Agent",
    status: "Completed",
    title: "Cross-Company Peer Spread Decomposed",
    description: "Computed Order Book variance ($42.7B vs $17.7B) and subcontractor expense divergence (8.0% vs 9.5%).",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS Peer Benchmarking",
    docRef: "TCS-Annual-Report-2023-24.pdf, p. 45 & INFY p. 87",
    evidence: "TCS large deal TCV expanded to $42.7B; Infosys subcontractor leakage of ₹14,562 Cr verified."
  },
  {
    id: "evt-04",
    timestamp: "10:30:09 AM",
    relativeTime: "2 mins ago",
    agentId: "redFlagAgent",
    agentName: "Red Flag Agent",
    status: "Warning",
    title: "Revenue Vulnerability & Attrition Anomaly Disclosed",
    description: "Flagged BFSI discretionary spend freeze in INFY (-1.0% CC) and European manufacturing delay in TCS (-1.2% CC).",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS Peer Benchmarking",
    docRef: "Infosys-Annual-Report-2023-24.pdf, p. 84",
    evidence: "Financial Services vertical contracted 1.0% in CC, representing 27.2% of total revenue."
  },
  {
    id: "evt-05",
    timestamp: "10:30:06 AM",
    relativeTime: "3 mins ago",
    agentId: "extractionAgent",
    agentName: "Extraction Agent",
    status: "Completed",
    title: "Consolidated P&L and Balance Sheet Metrics Extracted",
    description: "Harvested Revenue, EBIT, FCF conversion, and debt-to-equity ratios for both companies.",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS Peer Benchmarking",
    docRef: "INFY p. 112 & TCS p. 94",
    evidence: "INFY FCF: ₹23,982 Cr (91.2% PAT); TCS FCF: ₹44,289 Cr (95.1% PAT)."
  },
  {
    id: "evt-06",
    timestamp: "10:30:02 AM",
    relativeTime: "3 mins ago",
    agentId: "documentAgent",
    agentName: "Document Agent",
    status: "Completed",
    title: "PDF Ingestion & 1536-Dim Embeddings Generated",
    description: "Parsed 804 pages and indexed 3,000 vector chunks in HNSW vector storage with zero token drift.",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS Peer Benchmarking",
    docRef: "Infosys-Annual-Report-2023-24.pdf & TCS-Annual-Report-2023-24.pdf",
    evidence: "Embeddings model: text-embedding-3-small (1536-dim), M=16, efConstruction=64."
  },
  {
    id: "evt-07",
    timestamp: "06:00:06 PM",
    relativeTime: "1 hour ago",
    agentId: "redFlagAgent",
    agentName: "Red Flag Agent",
    status: "Warning",
    title: "European State Aid Tax Liability Charge ($10.2B)",
    description: "Flagged one-time $10.2B income tax charge in Apple's Q4 FY24 following the final CJEU judgment.",
    sessionId: "session-2",
    sessionTitle: "Apple 10-K Forensic Audit",
    docRef: "Apple-10K-FY2024.pdf, p. 61",
    evidence: "Note 5: The Company recorded a one-time income tax charge of $10.2 billion in Q4 FY24."
  },
  {
    id: "evt-08",
    timestamp: "06:00:03 PM",
    relativeTime: "1 hour ago",
    agentId: "extractionAgent",
    agentName: "Extraction Agent",
    status: "Completed",
    title: "Services Gross Margin Surge (74.0%) Extracted",
    description: "Harvested record Services net sales ($96.2B, +13% YoY) with 74.0% gross margin.",
    sessionId: "session-2",
    sessionTitle: "Apple 10-K Forensic Audit",
    docRef: "Apple-10K-FY2024.pdf, p. 32",
    evidence: "Gross margin expanded to 46.2% from 44.1% in 2023, driven by Services revenue expansion."
  },
  {
    id: "evt-09",
    timestamp: "08:10:07 PM",
    relativeTime: "3 hours ago",
    agentId: "redFlagAgent",
    agentName: "Red Flag Agent",
    status: "Warning",
    title: "CapEx Acceleration Risk Flagged (+75% YoY to $55.7B)",
    description: "Surfaced AI infrastructure spend surge to 22.7% of revenue and future depreciation drag.",
    sessionId: "session-3",
    sessionTitle: "Microsoft CapEx ROI Investigation",
    docRef: "Microsoft-10K-FY2024.pdf, p. 43",
    evidence: "Capital expenditures including finance leases reached $55.7 billion, up from $31.9 billion."
  }
];

const ORCH_STORAGE_KEY = "finresearch_orchestration_state_v4";

export function getStoredOrchestrationState() {
  try {
    const raw = localStorage.getItem(ORCH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.agents) && Array.isArray(parsed.timeline)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load orchestration state from storage:", e);
  }
  return {
    agents: AGENT_ROLES,
    workflows: WORKFLOW_PRESETS,
    timeline: []
  };
}

export function saveStoredOrchestrationState(state) {
  try {
    localStorage.setItem(ORCH_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save orchestration state to storage:", e);
  }
}
