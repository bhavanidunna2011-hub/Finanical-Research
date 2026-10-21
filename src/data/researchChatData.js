// Module 5: Financial Query and Conversational Research Data Store & Telemetry
import { SEED_COMPANIES, SAMPLE_CHUNKS } from "./seedData";
import { INITIAL_DOCUMENTS } from "./documentData";

// Required Suggested Questions as specified in research workflow
export const SUGGESTED_RESEARCH_QUESTIONS = [
  {
    id: "sq-1",
    question: "How has revenue changed across the available reporting periods?",
    category: "Revenue & Topline",
    targetMetric: "Revenue Growth",
    description: "Evaluates multi-year top-line progression, constant currency rates, and organic vs inorganic growth."
  },
  {
    id: "sq-2",
    question: "What financial risks are disclosed in these documents?",
    category: "Forensic Risks",
    targetMetric: "Risk Factors",
    description: "Surfaces disclosed audit caveats, geographic headwinds, and vertical concentrations."
  },
  {
    id: "sq-3",
    question: "How have debt and cash flows changed over time?",
    category: "Solvency & Capital",
    targetMetric: "Debt & Leverage",
    description: "Examines balance sheet debt-to-equity, maturities, and net cash reserve positions."
  },
  {
    id: "sq-4",
    question: "Compare profitability across the selected companies.",
    category: "Peer Benchmarking",
    targetMetric: "EBIT & Margins",
    description: "Cross-references operating margin spreads, net profit, and free cash flow conversion."
  }
];

// Seed chat conversations keyed by session or company ID
export const INITIAL_CHAT_MESSAGES = [
  {
    id: "msg-0",
    role: "system",
    timestamp: "10:00:00 AM",
    content: "Financial Research Assistant active. Answers are grounded in audited SEC Form 10-K filings and annual reports. Every cited figure traces directly to verified document page streams with zero extrapolation.",
    isDemo: false
  },
  {
    id: "msg-1",
    role: "user",
    timestamp: "10:01:15 AM",
    content: "What was the company's revenue trend across the available reporting periods?",
    isDemo: true
  },
  {
    id: "msg-2",
    role: "assistant",
    timestamp: "10:01:18 AM",
    isDemo: true,
    conciseAnswer: "Infosys Limited delivered consolidated revenues of ₹153,670 Crore ($18.56B) in FY24, representing +4.7% YoY reported growth (+1.4% in constant currency). Revenue growth moderated significantly from the +20.7% surge in FY23 due to discretionary enterprise spending contraction in North America and European banking.",
    stepByStepExplanation: [
      {
        step: 1,
        title: "Vector Embeddings & Retrieval",
        detail: "Retrieved 4 candidate chunks across Consolidated Statement of Profit and Loss and MD&A Segment Disclosures with cosine similarity > 0.91."
      },
      {
        step: 2,
        title: "GAAP/IFRS Reconcilement",
        detail: "Verified reported Revenue from Operations against audited Note 18 (Revenue by Geographic & Industry Segments)."
      },
      {
        step: 3,
        title: "Multi-Period Harmonic Variance",
        detail: "Synthesized 3-year progression (FY22: ₹121,641 Cr ➔ FY23: ₹146,767 Cr ➔ FY24: ₹153,670 Cr) and constant currency decelerations."
      }
    ],
    metricsTable: {
      title: "Consolidated Revenue Progression (FY22 - FY24)",
      headers: ["Reporting Period", "Revenue (₹ Cr)", "Revenue ($ USD)", "YoY Growth", "Audit Verification"],
      rows: [
        ["FY 2023-24 (Audited)", "₹153,670 Cr", "$18.56 Billion", "+4.7% (+1.4% CC)", "Deloitte Haskins Verified"],
        ["FY 2022-23 (Audited)", "₹146,767 Cr", "$18.21 Billion", "+20.7% (+15.4% CC)", "Deloitte Haskins Verified"],
        ["FY 2021-22 (Audited)", "₹121,641 Cr", "$16.31 Billion", "+21.1% (+19.7% CC)", "Deloitte Haskins Verified"]
      ]
    },
    supportingEvidence: [
      "Financial Services vertical contracted 1.0% in constant currency, representing 27.2% of total FY24 revenues.",
      "Manufacturing vertical demonstrated resilient outperformance, growing +7.8% CC driven by automotive supply chain modernization.",
      "Large deal total contract value (TCV) stood at an all-time high of $17.7 Billion, with 52% net new wins."
    ],
    citations: [
      {
        id: "cite-infy-p112",
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        ticker: "INFY",
        page: 112,
        section: "Consolidated Statement of Profit and Loss",
        passage: "Revenues from operations for the year ended March 31, 2024 were ₹153,670 crore as against ₹146,767 crore for the year ended March 31, 2023, representing a growth of 4.7%.",
        confidence: 0.98
      },
      {
        id: "cite-infy-p84",
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        ticker: "INFY",
        page: 84,
        section: "Segment Performance: BFSI & Manufacturing",
        passage: "In constant currency terms, the Financial Services segment contracted by 1.0%, while Manufacturing grew by 7.8% and Retail contracted by 1.8%.",
        confidence: 0.95
      }
    ],
    sourceExcerpts: [
      {
        docName: "Infosys-Annual-Report-2023-24.pdf",
        page: 112,
        section: "Consolidated Statement of Profit and Loss",
        snippet: "Revenues from operations for the year ended March 31, 2024 were ₹153,670 crore as against ₹146,767 crore for the year ended March 31, 2023, representing a growth of 4.7%."
      },
      {
        docName: "Infosys-Annual-Report-2023-24.pdf",
        page: 84,
        section: "Item 7 - Segment Performance",
        snippet: "In constant currency terms, the Financial Services segment contracted by 1.0%, while Manufacturing grew by 7.8%."
      }
    ]
  },
  {
    id: "msg-3",
    role: "user",
    timestamp: "10:02:40 AM",
    content: "What are the main financial risks identified in this document?",
    isDemo: true
  },
  {
    id: "msg-4",
    role: "assistant",
    timestamp: "10:02:44 AM",
    isDemo: true,
    conciseAnswer: "The Red Flag and Research Agents surfaced 3 primary vulnerabilities in the audited filings: (1) Headcount reduction (-25,933 net departures in FY24) reflecting unprecedented capacity rationalization, (2) Subcontractor cost drag at 9.5% of revenue (₹14,562 Cr), and (3) North American banking client budget deferrals.",
    stepByStepExplanation: [
      {
        step: 1,
        title: "Forensic Red Flag Ingestion",
        detail: "Cross-referenced Human Capital disclosures, Note 21 (Operating Expenses), and Risk Factors section."
      },
      {
        step: 2,
        title: "Severity Attribution",
        detail: "Classified technical subcontractor reliance as High Operational Severity and North American revenue slowdown as Macro Headwind."
      },
      {
        step: 3,
        title: "Auditor Opinion Audit",
        detail: "Inspected Deloitte Haskins & Sells Key Audit Matters (KAM) regarding revenue recognition on fixed-price contracts."
      }
    ],
    metricsTable: {
      title: "Forensic Risk Matrix & Impact Assessment",
      headers: ["Risk Factor", "Severity", "Reported Metric", "Financial Impact", "Filing Reference"],
      rows: [
        ["Subcontractor Cost Elevation", "High", "₹14,562 Cr (9.5% of rev)", "210 bps margin headwind", "Note 21, Page 129"],
        ["Net Headcount Contraction", "High", "-25,933 employees (-7.6%)", "Billing capacity shrinkage", "Human Capital, Page 138"],
        ["Discretionary Banking Slump", "Medium", "-1.0% CC BFSI Revenue", "Top-line growth suppression", "Segment MD&A, Page 84"]
      ]
    },
    supportingEvidence: [
      "Total employee base declined from 343,234 to 317,240, marking the largest single-year staff reduction in company history.",
      "Technical subcontractor expenses accounted for 9.5% of revenue, well above historical target bands of 6.5% - 7.5%.",
      "Auditor reported Key Audit Matters regarding the evaluation of percentage-of-completion method on fixed-price software deliverables."
    ],
    citations: [
      {
        id: "cite-infy-p129",
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        ticker: "INFY",
        page: 129,
        section: "Note 21: Operating Expenses",
        passage: "Technical sub-contractor expenses for the year ended March 31, 2024 were ₹14,562 Cr as compared to ₹12,852 Cr for the year ended March 31, 2023, representing 9.5% of revenue.",
        confidence: 0.97
      },
      {
        id: "cite-infy-p138",
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        ticker: "INFY",
        page: 138,
        section: "Human Capital Disclosures",
        passage: "Total headcount as of March 31, 2024 stood at 317,240 employees, down from 343,234 employees as of March 31, 2023. Voluntary attrition was 12.6%.",
        confidence: 0.99
      },
      {
        id: "cite-infy-missing-page",
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        ticker: "INFY",
        page: null, // Strictly testing unavailable page number requirement
        section: "Corporate Governance Footnotes",
        passage: null, // Strictly testing unavailable passage requirement
        confidence: 0.82
      }
    ],
    sourceExcerpts: [
      {
        docName: "Infosys-Annual-Report-2023-24.pdf",
        page: 129,
        section: "Note 21: Operating Expenses",
        snippet: "Technical sub-contractor expenses for the year ended March 31, 2024 were ₹14,562 Cr as compared to ₹12,852 Cr."
      },
      {
        docName: "Infosys-Annual-Report-2023-24.pdf",
        page: 138,
        section: "Human Capital Disclosures",
        snippet: "Total headcount as of March 31, 2024 stood at 317,240 employees, down from 343,234 employees."
      }
    ]
  }
];

// Contextual dynamic mock generator based on user questions
export function generateMockAgentResponse(query, selectedDocs = [], session = null) {
  const q = (query || "").toLowerCase();
  const primaryCompany = session?.companyIds?.[0] || "INFY";
  const isComparison = session?.companyIds?.length > 1;

  // Question 1: Revenue trend
  if (q.includes("revenue") || q.includes("trend") || q.includes("reporting period")) {
    return {
      conciseAnswer: `Based on the latest audited filings for ${session?.company || "target entity"}, revenue expanded to ₹153,670 Cr ($18.56B) in FY24 (+4.7% YoY reported, +1.4% constant currency). This reflects solid mega-deal execution ($17.7B large deal TCV) counterbalanced by enterprise discretionary spending caution.`,
      stepByStepExplanation: [
        {
          step: 1,
          title: "Statement of Profit and Loss Query",
          detail: "Extracted line items from Consolidated Financial Statements with page grounding."
        },
        {
          step: 2,
          title: "Segment Breakdown Reconcilement",
          detail: "Harmonized constant-currency growth across Financial Services (-1.0%), Manufacturing (+7.8%), and Energy (+4.2%)."
        },
        {
          step: 3,
          title: "Multi-Agent Synthesis",
          detail: "Cross-checked with Extraction Agent ratio tables and audited footnotes."
        }
      ],
      metricsTable: {
        title: "Audited Revenue Breakdown & Growth",
        headers: ["Fiscal Year", "Revenue (INR)", "Constant Currency Growth", "Operating Profit", "Status"],
        rows: [
          ["FY 2023-24", "₹153,670 Cr", "+1.4% CC", "₹31,861 Cr (20.7%)", "Audited / Verified"],
          ["FY 2022-23", "₹146,767 Cr", "+15.4% CC", "₹31,437 Cr (21.4%)", "Audited / Verified"],
          ["FY 2021-22", "₹121,641 Cr", "+19.7% CC", "₹27,788 Cr (22.8%)", "Audited / Verified"]
        ]
      },
      supportingEvidence: [
        "Large deal TCV reached an all-time record of $17.7 Billion with 52% net new bookings.",
        "Operating margin was 20.7%, reflecting a modest 70 bps contraction from FY23.",
        "North America accounted for 59.6% of revenue, European business generated 28.6%."
      ],
      citations: [
        {
          id: `cite-${Date.now()}-1`,
          docName: "Infosys-Annual-Report-2023-24.pdf",
          company: "Infosys Limited",
          ticker: "INFY",
          page: 112,
          section: "Consolidated Statement of Profit and Loss",
          passage: "Revenues from operations for the year ended March 31, 2024 were ₹153,670 crore as against ₹146,767 crore for the year ended March 31, 2023.",
          confidence: 0.98
        }
      ],
      sourceExcerpts: [
        {
          docName: "Infosys-Annual-Report-2023-24.pdf",
          page: 112,
          section: "P&L Statement",
          snippet: "Revenues from operations for the year ended March 31, 2024 were ₹153,670 crore."
        }
      ]
    };
  }

  // Question 3: Debt changes
  if (q.includes("debt") || q.includes("leverage") || q.includes("liabilities") || q.includes("borrowing")) {
    return {
      conciseAnswer: "The balance sheet displays a pristine, debt-free capital structure with ₹0 Crore in long-term borrowings and zero outstanding bond debt. Total liabilities are comprised strictly of operating lease obligations (under Ind AS 116 / IFRS 16) and short-term vendor trade payables.",
      stepByStepExplanation: [
        {
          step: 1,
          title: "Consolidated Balance Sheet Extraction",
          detail: "Retrieved Non-Current and Current Liabilities from the audited balance sheet."
        },
        {
          step: 2,
          title: "Operating Lease vs Debt Distinction",
          detail: "Separated IFRS 16 lease liabilities (₹7,842 Cr) from formal interest-bearing bank debt (₹0 Cr)."
        },
        {
          step: 3,
          title: "Cash Liquidity Reconciliation",
          detail: "Cross-checked cash and liquid investments of ₹34,714 Cr, confirming a net-cash position of 100%."
        }
      ],
      metricsTable: {
        title: "Capital Structure & Solvency Indicators",
        headers: ["Metric", "Reported Value", "Industry Benchmark", "Leverage Status", "Filing Source"],
        rows: [
          ["Long-term Debt", "₹0 Cr ($0.00)", "<0.5x Debt/Equity", "Debt-Free (Net Cash Position)", "Balance Sheet, p. 114"],
          ["Cash & Liquid Investments", "₹34,714 Cr ($4.19B)", ">15% of Revenue", "Pristine Liquidity Buffer", "Balance Sheet, p. 114"],
          ["Current Ratio", "2.12x", ">1.50x", "Superior Working Capital", "Financial Analysis, p. 64"],
          ["Free Cash Flow Conversion", "91.2% of Net Profit", ">80.0%", "Elite Cash Generation", "Cash Flows, p. 116"]
        ]
      },
      supportingEvidence: [
        "Total equity stood at ₹86,340 Crore against total assets of ₹138,542 Crore.",
        "Zero interest expense on financial debt was incurred during the fiscal year.",
        "Cash conversion ratio exceeded 91%, providing robust self-funding for dividends and buybacks."
      ],
      citations: [
        {
          id: `cite-${Date.now()}-debt-1`,
          docName: "Infosys-Annual-Report-2023-24.pdf",
          company: "Infosys Limited",
          ticker: "INFY",
          page: 114,
          section: "Consolidated Balance Sheet",
          passage: "Borrowings: Long-term borrowings stood at Nil as of March 31, 2024 and March 31, 2023. Lease liabilities were ₹7,842 crore.",
          confidence: 0.99
        }
      ],
      sourceExcerpts: [
        {
          docName: "Infosys-Annual-Report-2023-24.pdf",
          page: 114,
          section: "Consolidated Balance Sheet",
          snippet: "Borrowings: Long-term borrowings stood at Nil as of March 31, 2024."
        }
      ]
    };
  }

  // Question 4: Compare profitability metrics for two selected companies
  if (q.includes("compare") || q.includes("profitability") || q.includes("margin") || q.includes("tcs") || isComparison) {
    return {
      conciseAnswer: "Comparing FY24 audited metrics reveals that TCS outperformed Infosys on profitability, generating a 24.6% operating margin (+390 bps advantage) versus Infosys's 20.7%. TCS also delivered superior Return on Equity (51.5% vs 31.8%) and a higher Free Cash Flow conversion rate (95.1% vs 91.2%).",
      stepByStepExplanation: [
        {
          step: 1,
          title: "Dual Filing Retrieval",
          detail: "Retrieved audited P&L and Cash Flow statements from Infosys-Annual-Report-2023-24.pdf and TCS-Annual-Report-2023-24.pdf."
        },
        {
          step: 2,
          title: "Margin Spread Decomposition",
          detail: "Identified that Infosys's higher subcontractor expense (9.5% of rev vs ~7.0% for TCS) accounts for ~250 bps of the margin spread."
        },
        {
          step: 3,
          title: "Capital Efficiency Benchmarking",
          detail: "Calculated Return on Equity (ROE) and Free Cash Flow to Net Profit ratios."
        }
      ],
      metricsTable: {
        title: "Side-by-Side Profitability & Efficiency Benchmark",
        headers: ["Profitability Metric", "Infosys (INFY)", "TCS (TCS)", "Variance / Spread", "Top Performer"],
        rows: [
          ["Operating Margin (EBIT %)", "20.7%", "24.6%", "+390 bps spread", "TCS (Superior Cost Control)"],
          ["Net Profit Margin", "17.1%", "19.3%", "+220 bps spread", "TCS (Lower G&A Overhead)"],
          ["Return on Equity (ROE)", "31.8%", "51.5%", "+1,970 bps spread", "TCS (Asset-light Leverage)"],
          ["Free Cash Flow Conversion", "91.2%", "95.1%", "+390 bps spread", "TCS (Faster DSO Cycle)"],
          ["Deal TCV Pipeline", "$17.7 Billion", "$42.7 Billion", "2.4x Scale Spread", "TCS (Record Mega-deals)"]
        ]
      },
      supportingEvidence: [
        "TCS achieved ₹46,585 Cr in net profit (+10.5% YoY), while Infosys recorded ₹26,248 Cr (+8.9% YoY).",
        "Infosys maintained an offshore effort mix of ~75%, while TCS sustained ~82% offshore utilization.",
        "Both entities maintain zero debt and net-cash capital structures."
      ],
      citations: [
        {
          id: `cite-${Date.now()}-infy-margin`,
          docName: "Infosys-Annual-Report-2023-24.pdf",
          company: "Infosys Limited",
          ticker: "INFY",
          page: 112,
          section: "Consolidated Statement of Profit and Loss",
          passage: "Operating profit for the year was ₹31,861 crore, representing an operating margin of 20.7%.",
          confidence: 0.98
        },
        {
          id: `cite-${Date.now()}-tcs-margin`,
          docName: "TCS-Annual-Report-2023-24.pdf",
          company: "Tata Consultancy Services",
          ticker: "TCS",
          page: 94,
          section: "Consolidated Financial Statements",
          passage: "Operating margin for the year stood at 24.6%, expanding 50 bps over the prior fiscal year.",
          confidence: 0.97
        }
      ],
      sourceExcerpts: [
        {
          docName: "Infosys-Annual-Report-2023-24.pdf",
          page: 112,
          section: "P&L Statement",
          snippet: "Operating profit for the year was ₹31,861 crore, representing an operating margin of 20.7%."
        },
        {
          docName: "TCS-Annual-Report-2023-24.pdf",
          page: 94,
          section: "P&L Statement",
          snippet: "Operating margin for the year stood at 24.6%, expanding 50 bps over the prior fiscal year."
        }
      ]
    };
  }

  // Question 5 or Default query: Source passages & general synthesis
  return {
    conciseAnswer: `Cross-referencing the active filings confirms that the extracted conclusions are strictly anchored in audited financial disclosure tables and management notes. Every cited figure traces directly to verified document page streams with zero extrapolation.`,
    stepByStepExplanation: [
      {
        step: 1,
        title: "Exact Vector Index Match",
        detail: `Queried semantic embeddings across active filings (${selectedDocs.length > 0 ? selectedDocs.map(d => d.name || d).join(", ") : "All Session Filings"}).`
      },
      {
        step: 2,
        title: "Passage Extraction & Boundary Check",
        detail: "Extracted verbatim paragraphs without modifying tabular coordinates or values."
      },
      {
        step: 3,
        title: "Institutional Grounding Verification",
        detail: "Verified against cited filing disclosures before emitting response."
      }
    ],
    metricsTable: {
      title: "Extracted Document Verification Coordinates",
      headers: ["Target Parameter", "Filing Document", "Page Location", "Audit Status", "Grounding Fidelity"],
      rows: [
        ["Operating Topline", "Infosys-Annual-Report-2023-24.pdf", "Page 112", "Statutory Audited", "100% Faithful"],
        ["Subcontractor Costs", "Infosys-Annual-Report-2023-24.pdf", "Page 129", "Note 21 Disclosed", "100% Faithful"],
        ["Cash & Bank Reserves", "Infosys-Annual-Report-2023-24.pdf", "Page 114", "Balance Sheet Verified", "100% Faithful"]
      ]
    },
    supportingEvidence: [
      "All numeric quantities reconcile identically with published GAAP/IFRS schedules.",
      "Footnote disclaimers regarding market risk and interest rate sensitivities are noted.",
      "Missing metadata is never fabricated and remains labeled as unavailable."
    ],
    citations: [
      {
        id: `cite-${Date.now()}-passage-1`,
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        ticker: "INFY",
        page: 112,
        section: "Consolidated Statement of Profit and Loss",
        passage: "Revenues from operations for the year ended March 31, 2024 were ₹153,670 crore as against ₹146,767 crore for the year ended March 31, 2023.",
        confidence: 0.98
      },
      {
        id: `cite-${Date.now()}-passage-2`,
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        ticker: "INFY",
        page: 116,
        section: "Consolidated Statement of Cash Flows",
        passage: "Cash generated from operating activities before changes in working capital was ₹34,228 crore.",
        confidence: 0.96
      }
    ],
    sourceExcerpts: [
      {
        docName: "Infosys-Annual-Report-2023-24.pdf",
        page: 112,
        section: "P&L Statement",
        snippet: "Revenues from operations for the year ended March 31, 2024 were ₹153,670 crore."
      },
      {
        docName: "Infosys-Annual-Report-2023-24.pdf",
        page: 116,
        section: "Cash Flows",
        snippet: "Cash generated from operating activities before changes in working capital was ₹34,228 crore."
      }
    ]
  };
}

// Local storage management for chat history
const CHAT_STORAGE_KEY_PREFIX = "finresearch_chat_history_v5_";

export function getStoredChatHistory(sessionId = "default") {
  try {
    const raw = localStorage.getItem(`${CHAT_STORAGE_KEY_PREFIX}${sessionId}`);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (err) {
    console.warn("Error reading chat history from localStorage", err);
    return [];
  }
}

export function saveStoredChatHistory(sessionId = "default", messages = []) {
  try {
    localStorage.setItem(`${CHAT_STORAGE_KEY_PREFIX}${sessionId}`, JSON.stringify(messages));
  } catch (err) {
    console.warn("Error saving chat history to localStorage", err);
  }
}

export function clearStoredChatHistory(sessionId = "default") {
  try {
    localStorage.removeItem(`${CHAT_STORAGE_KEY_PREFIX}${sessionId}`);
  } catch (err) {
    console.warn("Error clearing chat history", err);
  }
}
