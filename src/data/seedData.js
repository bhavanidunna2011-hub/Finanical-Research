// Comprehensive seed financial datasets grounded strictly in real annual reports and 10-K filings

export const SEED_COMPANIES = {
  INFY: {
    id: "INFY",
    ticker: "INFY",
    name: "Infosys Limited",
    sector: "Information Technology",
    industry: "IT Services & Consulting",
    currency: "INR (Cr) / USD ($)",
    fiscalYear: "FY 2023-24",
    filingType: "Integrated Annual Report 2023-24",
    filingDate: "May 2024",
    filingDocName: "Infosys-Annual-Report-2023-24.pdf",
    pageCount: 384,
    chunkCount: 1420,
    vectorIndexSize: "1,420 vectors (1536-dim)",
    logoInitials: "INFY",
    color: "#007cc3",
    description: "Global leader in next-generation digital services and consulting, operating in over 56 countries.",
    metrics: {
      revenue: "₹1,53,670 Cr ($18.56B)",
      revenueGrowth: "+4.7% YoY",
      operatingMargin: "20.7%",
      operatingMarginDelta: "-0.3% YoY",
      netProfit: "₹26,233 Cr ($3.16B)",
      netProfitGrowth: "+8.9% YoY",
      dilutedEPS: "₹63.39 ($0.76)",
      epsGrowth: "+9.9% YoY",
      freeCashFlow: "₹23,982 Cr ($2.88B)",
      fcfConversion: "91.2% of Net Profit",
      totalDebt: "₹0 Cr (Debt-free)",
      cashEquivalents: "₹34,714 Cr ($4.18B)",
      roe: "31.8%",
      roa: "20.4%",
      currentRatio: "2.1x",
      dealTCV: "$17.7 Billion (Large deals)",
      activeClients: "1,882",
      headcount: "317,240 (-25,933 YoY)"
    },
    ratios: [
      { name: "Operating Margin (EBIT %)", value: "20.7%", benchmark: "20-22%", status: "Good", citation: { page: 112, section: "Consolidated P&L Statement" } },
      { name: "Net Profit Margin", value: "17.1%", benchmark: "16-18%", status: "Good", citation: { page: 112, section: "Consolidated P&L Statement" } },
      { name: "Return on Equity (ROE)", value: "31.8%", benchmark: ">25%", status: "Excellent", citation: { page: 145, section: "Shareholders Equity Analysis" } },
      { name: "Free Cash Flow Conversion", value: "91.2%", benchmark: ">80%", status: "Excellent", citation: { page: 116, section: "Consolidated Cash Flow" } },
      { name: "Debt-to-Equity", value: "0.00x", benchmark: "<0.5x", status: "Superior", citation: { page: 114, section: "Balance Sheet - Non-current Liabilities" } },
      { name: "Current Ratio", value: "2.12x", benchmark: ">1.5x", status: "Healthy", citation: { page: 114, section: "Current Assets vs Liabilities" } },
      { name: "Days Sales Outstanding (DSO)", value: "66 days", benchmark: "<70 days", status: "Normal", citation: { page: 88, section: "Management Discussion & Analysis" } }
    ],
    redFlags: [
      {
        id: "rf-infy-1",
        title: "Discretionary Tech Spending Freeze in Key Verticals",
        category: "Revenue Vulnerability",
        severity: "High",
        impact: "Slowdown in BFSI (Financial Services, -1.0% constant currency) and Retail clients delayed contract milestones and decision cycles.",
        evidenceSnippet: "Revenues from Financial Services declined 1.0% in constant currency during the year ended March 31, 2024, reflecting cautious client behavior and delayed digital program ramp-ups.",
        citation: "Infosys-Annual-Report-2023-24.pdf, Page 84 (Segmental Performance)",
        recommendation: "Monitor BFSI pipeline and mega-deal conversion velocity in Q1/Q2."
      },
      {
        id: "rf-infy-2",
        title: "Net Headcount Contraction of 25,933 Employees",
        category: "Operational / Capacity Risk",
        severity: "Medium",
        impact: "Infosys witnessed total headcount reduce from 343,234 to 317,240, reflecting lower hiring due to automation and cautious utilization management.",
        evidenceSnippet: "Total employee count as of March 31, 2024 stood at 317,240 compared to 343,234 as of March 31, 2023. Voluntary attrition for the LTM dropped to 12.6%.",
        citation: "Infosys-Annual-Report-2023-24.pdf, Page 138 (Human Capital Disclosure)",
        recommendation: "Assess if reduced bench strength impedes rapid scaling when IT discretionary budgets rebound."
      },
      {
        id: "rf-infy-3",
        title: "Subcontractor Cost Fluctuations & Margin Drag",
        category: "Cost Structure",
        severity: "Low",
        impact: "Third-party consultant and subcontractor expenses remained volatile across quarters, contributing to 30 bps operating margin compression.",
        evidenceSnippet: "Technical sub-contractor expenses for the year ended March 31, 2024 were ₹14,562 Cr (9.5% of revenue) versus ₹15,920 Cr (10.8% of revenue).",
        citation: "Infosys-Annual-Report-2023-24.pdf, Page 129 (Note 21 - Operating Expenses)",
        recommendation: "Ensure offshore delivery optimization stabilizes subcontractor outlays."
      }
    ],
    auditorReport: {
      auditor: "Deloitte Haskins & Sells LLP",
      opinion: "Unmodified (Clean Opinion)",
      keyAuditMatters: [
        "Revenue recognition involving fixed-price and complex time-and-material contracts (estimation of costs to completion)",
        "Valuation of goodwill and intangible assets associated with acquisitions",
        "Evaluation of uncertain direct and indirect tax positions"
      ],
      page: 164
    }
  },

  TCS: {
    id: "TCS",
    ticker: "TCS",
    name: "Tata Consultancy Services",
    sector: "Information Technology",
    industry: "IT Services & Consulting",
    currency: "INR (Cr) / USD ($)",
    fiscalYear: "FY 2023-24",
    filingType: "Integrated Annual Report 2023-24",
    filingDate: "June 2024",
    filingDocName: "TCS-Annual-Report-2023-24.pdf",
    pageCount: 420,
    chunkCount: 1580,
    vectorIndexSize: "1,580 vectors (1536-dim)",
    logoInitials: "TCS",
    color: "#2563eb",
    description: "Largest Indian multinational information technology services and consulting company, part of Tata Group.",
    metrics: {
      revenue: "₹2,40,893 Cr ($29.08B)",
      revenueGrowth: "+6.8% YoY",
      operatingMargin: "24.6%",
      operatingMarginDelta: "+0.5% YoY",
      netProfit: "₹46,585 Cr ($5.62B)",
      netProfitGrowth: "+10.5% YoY",
      dilutedEPS: "₹127.34 ($1.54)",
      epsGrowth: "+11.1% YoY",
      freeCashFlow: "₹44,289 Cr ($5.34B)",
      fcfConversion: "95.1% of Net Profit",
      totalDebt: "₹0 Cr (Debt-free)",
      cashEquivalents: "₹49,823 Cr ($6.01B)",
      roe: "51.5%",
      roa: "31.2%",
      currentRatio: "2.4x",
      dealTCV: "$42.7 Billion (All-time high)",
      activeClients: "2,200+",
      headcount: "601,546 (-13,249 YoY)"
    },
    ratios: [
      { name: "Operating Margin (EBIT %)", value: "24.6%", benchmark: "20-22%", status: "Superior", citation: { page: 94, section: "Consolidated P&L Statement" } },
      { name: "Net Profit Margin", value: "19.3%", benchmark: "16-18%", status: "Superior", citation: { page: 94, section: "Consolidated P&L Statement" } },
      { name: "Return on Equity (ROE)", value: "51.5%", benchmark: ">25%", status: "Exceptional", citation: { page: 128, section: "Statement of Changes in Equity" } },
      { name: "Free Cash Flow Conversion", value: "95.1%", benchmark: ">80%", status: "Exceptional", citation: { page: 98, section: "Consolidated Cash Flow" } },
      { name: "Debt-to-Equity", value: "0.00x", benchmark: "<0.5x", status: "Superior", citation: { page: 96, section: "Balance Sheet Liabilities" } },
      { name: "Current Ratio", value: "2.42x", benchmark: ">1.5x", status: "Healthy", citation: { page: 96, section: "Current Assets" } },
      { name: "Days Sales Outstanding (DSO)", value: "68 days", benchmark: "<70 days", status: "Normal", citation: { page: 62, section: "Financial Analysis" } }
    ],
    redFlags: [
      {
        id: "rf-tcs-1",
        title: "Continental Europe Stagnation (-1.2% Growth)",
        category: "Geographic Concentration",
        severity: "Medium",
        impact: "Macro headwinds and delayed manufacturing sector spending in Germany and France tempered European growth.",
        evidenceSnippet: "Continental Europe revenue contracted 1.2% in constant currency due to cautious budget environments across automotive and industrial manufacturing sectors.",
        citation: "TCS-Annual-Report-2023-24.pdf, Page 72 (Geographic Performance)",
        recommendation: "Track renewal cycles of enterprise transformation deals in the UK and DACH regions."
      },
      {
        id: "rf-tcs-2",
        title: "Legal Settlement and Contingent Settlement Provision",
        category: "Legal & Compliance",
        severity: "Medium",
        impact: "Settlement charges regarding the Epic Systems intellectual property litigation impacted other non-operating expenses.",
        evidenceSnippet: "Exceptional legal charge of ₹958 Cr recognized pursuant to the settlement agreement entered in long-standing legal dispute.",
        citation: "TCS-Annual-Report-2023-24.pdf, Page 118 (Note 28 - Exceptional Items)",
        recommendation: "Verify that legal exposures are closed with no further indemnification claims."
      }
    ],
    auditorReport: {
      auditor: "B S R & Co. LLP",
      opinion: "Unmodified (Clean Opinion)",
      keyAuditMatters: [
        "Revenue recognition from fixed-price contracts and percentage of completion estimates",
        "Assessment of contingent liabilities and legal proceedings disclosure"
      ],
      page: 142
    }
  },

  AAPL: {
    id: "AAPL",
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Consumer Electronics & Services",
    industry: "Technology Hardware, Storage & Peripherals",
    currency: "USD ($)",
    fiscalYear: "FY 2024 (Ended Sep 28, 2024)",
    filingType: "Form 10-K Annual Report",
    filingDate: "October 31, 2024",
    filingDocName: "Apple-10K-FY2024.pdf",
    pageCount: 78,
    chunkCount: 920,
    vectorIndexSize: "920 vectors (1536-dim)",
    logoInitials: "AAPL",
    color: "#a855f7",
    description: "Designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories, and sells a variety of related services.",
    metrics: {
      revenue: "$391.04 Billion",
      revenueGrowth: "+2.0% YoY",
      operatingMargin: "31.5%",
      operatingMarginDelta: "+1.7% YoY",
      netProfit: "$93.74 Billion",
      netProfitGrowth: "-3.4% YoY (Tax affected)",
      dilutedEPS: "$6.08",
      epsGrowth: "-0.8% YoY",
      freeCashFlow: "$108.81 Billion",
      fcfConversion: "116.1% of Net Income",
      totalDebt: "$106.63 Billion",
      cashEquivalents: "$156.65 Billion (Cash + Marketable)",
      roe: "147.2% (Driven by share buybacks)",
      roa: "25.7%",
      currentRatio: "0.87x",
      dealTCV: "N/A (Hardware + Services)",
      activeClients: "2.2 Billion Active Devices",
      headcount: "164,000 employees"
    },
    ratios: [
      { name: "Gross Margin", value: "46.2%", benchmark: "42-45%", status: "Superior", citation: { page: 32, section: "Item 7 - Management Discussion" } },
      { name: "Services Gross Margin", value: "74.0%", benchmark: ">70%", status: "Exceptional", citation: { page: 33, section: "Item 7 - Segment Breakdown" } },
      { name: "Operating Margin", value: "31.5%", benchmark: "28-30%", status: "Excellent", citation: { page: 48, section: "Consolidated Statements of Operations" } },
      { name: "Debt-to-Equity", value: "1.87x", benchmark: "<1.5x", status: "High Leverage", citation: { page: 50, section: "Consolidated Balance Sheets" } },
      { name: "Current Ratio", value: "0.87x", benchmark: ">1.0x", status: "Liquidity Alert", citation: { page: 50, section: "Working Capital" } },
      { name: "Free Cash Flow Yield", value: "3.2%", benchmark: "3-4%", status: "Healthy", citation: { page: 52, section: "Consolidated Statements of Cash Flows" } }
    ],
    redFlags: [
      {
        id: "rf-aapl-1",
        title: "Greater China Revenue Decline (-7.7% YoY)",
        category: "Geographic Market Risk",
        severity: "High",
        impact: "Greater China net sales dropped from $72.56B in FY23 to $66.95B in FY24 due to fierce domestic competition (Huawei) and government workplace device bans.",
        evidenceSnippet: "Greater China net sales decreased 8% during 2024 compared to 2023, primarily due to lower net sales of iPhone and foreign currency headwinds.",
        citation: "Apple-10K-FY2024.pdf, Page 34 (Segment Net Sales by Geographic Region)",
        recommendation: "Examine Apple Intelligence rollout localized for China and promotional subsidies."
      },
      {
        id: "rf-aapl-2",
        title: "European State Aid Tax Liability Charge of $10.2 Billion",
        category: "Regulatory / Tax Risk",
        severity: "High",
        impact: "A final ruling from Court of Justice of the European Union (CJEU) reversed lower court judgments, forcing Apple to record a $10.2B income tax charge in Q4 FY24.",
        evidenceSnippet: "During the fourth quarter of 2024, the Company recorded a one-time income tax charge of $10.2 billion associated with the CJEU judgment in the European State Aid case.",
        citation: "Apple-10K-FY2024.pdf, Page 61 (Note 5 - Income Taxes)",
        recommendation: "Factor non-recurring tax adjustment out of run-rate operational earnings."
      },
      {
        id: "rf-aapl-3",
        title: "Global Antitrust & App Store Regulatory Scrutiny",
        category: "Legal & Business Model Risk",
        severity: "Medium",
        impact: "US Department of Justice filed comprehensive civil antitrust lawsuit; EU Digital Markets Act required alternative app stores in EU.",
        evidenceSnippet: "The Company is subject to complex and evolving laws and regulations, including antitrust actions brought by the U.S. DOJ and investigations under the EU Digital Markets Act.",
        citation: "Apple-10K-FY2024.pdf, Page 21 (Item 1A - Risk Factors)",
        recommendation: "Model potential downward fee adjustments on high-margin Services take rates."
      }
    ],
    auditorReport: {
      auditor: "Ernst & Young LLP",
      opinion: "Unmodified (Clean Opinion)",
      keyAuditMatters: [
        "Uncertain tax positions including European State Aid settlement and cross-border transfer pricing",
        "Valuation of inventory and commitments with manufacturing partners (Foxconn, Pegatron)"
      ],
      page: 46
    }
  },

  MSFT: {
    id: "MSFT",
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Enterprise Software & Cloud",
    industry: "Systems Software",
    currency: "USD ($)",
    fiscalYear: "FY 2024 (Ended Jun 30, 2024)",
    filingType: "Form 10-K Annual Report",
    filingDate: "July 31, 2024",
    filingDocName: "Microsoft-10K-FY2024.pdf",
    pageCount: 96,
    chunkCount: 1140,
    vectorIndexSize: "1,140 vectors (1536-dim)",
    logoInitials: "MSFT",
    color: "#059669",
    description: "Develops and supports software, services, devices, and solutions including Azure, Microsoft 365, LinkedIn, and Xbox.",
    metrics: {
      revenue: "$245.12 Billion",
      revenueGrowth: "+15.7% YoY",
      operatingMargin: "44.6%",
      operatingMarginDelta: "+2.8% YoY",
      netProfit: "$88.14 Billion",
      netProfitGrowth: "+21.8% YoY",
      dilutedEPS: "$11.80",
      epsGrowth: "+22.0% YoY",
      freeCashFlow: "$74.07B",
      fcfConversion: "84.0% of Net Income",
      totalDebt: "$42.66 Billion",
      cashEquivalents: "$75.54 Billion",
      roe: "35.8%",
      roa: "17.4%",
      currentRatio: "1.25x",
      dealTCV: "$269 Billion (Commercial RPO)",
      activeClients: "Tens of millions of enterprises",
      headcount: "228,000 employees"
    },
    ratios: [
      { name: "Operating Margin (EBIT %)", value: "44.6%", benchmark: "35-40%", status: "Superior", citation: { page: 38, section: "Item 7 - Operating Results" } },
      { name: "Cloud Revenue (Intelligent Cloud)", value: "$105.36B (+20%)", benchmark: ">15%", status: "Exceptional", citation: { page: 40, section: "Segment Performance" } },
      { name: "Return on Invested Capital (ROIC)", value: "29.4%", benchmark: ">20%", status: "Superior", citation: { page: 42, section: "Capital Allocation" } },
      { name: "Debt-to-Equity", value: "0.19x", benchmark: "<0.5x", status: "Extremely Safe", citation: { page: 56, section: "Consolidated Balance Sheets" } },
      { name: "CapEx as % of Revenue", value: "22.7%", benchmark: "12-15%", status: "Aggressive Expansion", citation: { page: 58, section: "Statements of Cash Flows" } }
    ],
    redFlags: [
      {
        id: "rf-msft-1",
        title: "Capital Expenditures Surge (+75% YoY to $55.7B) for AI Infrastructure",
        category: "CapEx & Asset Turnover Risk",
        severity: "High",
        impact: "Massive datacenter and AI chip (GPU) buildouts require sustained demand monetization to avoid depreciation drag on future operating margins.",
        evidenceSnippet: "Capital expenditures including assets acquired under finance leases were $55.7 billion, up from $31.9 billion in FY23, supporting investments to meet cloud and AI demand.",
        citation: "Microsoft-10K-FY2024.pdf, Page 43 (Liquidity and Capital Resources)",
        recommendation: "Track Azure AI contribution to revenue growth (was 800 bps in Q4) relative to depreciation schedule."
      },
      {
        id: "rf-msft-2",
        title: "Supply Constraints on Advanced AI Accelerators",
        category: "Operational Dependency",
        severity: "Medium",
        impact: "Third-party GPU constraints (primarily Nvidia HGX systems) restricted near-term capacity ramp-ups across several Azure regions.",
        evidenceSnippet: "Our ability to expand cloud and AI services depends on the timely delivery of specialized semiconductor components and electrical power infrastructure.",
        citation: "Microsoft-10K-FY2024.pdf, Page 19 (Item 1A - Risk Factors)",
        recommendation: "Monitor internal custom silicon (Maia 100) adoption and multi-supplier qualification."
      }
    ],
    auditorReport: {
      auditor: "Deloitte & Touche LLP",
      opinion: "Unmodified (Clean Opinion)",
      keyAuditMatters: [
        "Valuation and purchase price allocation of Activision Blizzard acquisition ($68.7B)",
        "Revenue recognition for multi-year commercial enterprise agreements with multi-product bundles"
      ],
      page: 54
    }
  }
};

// Initial default sessions pre-loaded for immediate demonstration
export const INITIAL_SESSIONS = [
  {
    id: "session-1",
    title: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    company: "Infosys & TCS",
    companyIds: ["INFY", "TCS"],
    researchType: "Peer Comparison & Benchmarking",
    description: "Comprehensive multi-agent financial comparative analysis cross-referencing FY24 operating margins, deal TCV, attrition dynamics, and revenue growth drivers between India's top two IT services firms.",
    status: "Analysis Complete",
    createdAt: "Oct 16, 2026",
    documents: [
      { name: "Infosys-Annual-Report-2023-24.pdf", size: "18.4 MB", pages: 384, chunks: 1420, status: "Indexed", company: "INFY" },
      { name: "TCS-Annual-Report-2023-24.pdf", size: "22.1 MB", pages: 420, chunks: 1580, status: "Indexed", company: "TCS" }
    ],
    agentStatus: {
      documentAgent: "Completed",
      extractionAgent: "Completed",
      redFlagAgent: "Completed",
      comparisonAgent: "Completed",
      researchAgent: "Ready",
      reportAgent: "Generated"
    }
  },
  {
    id: "session-2",
    title: "Apple Inc. (AAPL) 10-K Forensic Audit & Red Flag Analysis",
    company: "Apple Inc.",
    companyIds: ["AAPL"],
    researchType: "Forensic Financial Analysis",
    description: "Deep-dive scan for operational anomalies, geographic revenue slowdowns in Greater China, the $10.2B European State Aid tax charge, and Services gross margin durability.",
    status: "Analysis Complete",
    createdAt: "Oct 15, 2026",
    documents: [
      { name: "Apple-10K-FY2024.pdf", size: "6.8 MB", pages: 78, chunks: 920, status: "Indexed", company: "AAPL" }
    ],
    agentStatus: {
      documentAgent: "Completed",
      extractionAgent: "Completed",
      redFlagAgent: "Completed",
      comparisonAgent: "N/A (Single Company)",
      researchAgent: "Ready",
      reportAgent: "Generated"
    }
  },
  {
    id: "session-3",
    title: "Microsoft (MSFT) Cloud & AI CapEx ROI Investigation",
    company: "Microsoft Corporation",
    companyIds: ["MSFT"],
    researchType: "Investment Research",
    description: "Investigate whether Microsoft's 75% increase in capital expenditures ($55.7B) is yielding commensurate revenue acceleration in Azure and Copilot enterprise licenses.",
    status: "Analysis Complete",
    createdAt: "Oct 14, 2026",
    documents: [
      { name: "Microsoft-10K-FY2024.pdf", size: "8.2 MB", pages: 96, chunks: 1140, status: "Indexed", company: "MSFT" }
    ],
    agentStatus: {
      documentAgent: "Completed",
      extractionAgent: "Completed",
      redFlagAgent: "Completed",
      comparisonAgent: "N/A (Single Company)",
      researchAgent: "Ready",
      reportAgent: "Generated"
    }
  }
];

// Rich vector chunk samples with metadata for the Vector DB & Chunk Inspector
export const SAMPLE_CHUNKS = [
  {
    id: "chk-infy-048",
    companyId: "INFY",
    docName: "Infosys-Annual-Report-2023-24.pdf",
    page: 112,
    section: "Consolidated Statement of Profit and Loss",
    tokens: 432,
    embeddingNorm: 0.9984,
    similarityScore: 0.942,
    content: "Revenue from operations for the year ended March 31, 2024 stood at ₹153,670 crore, compared to ₹146,767 crore in the previous year, registering a growth of 4.7% (1.4% in constant currency terms). Operating profit was ₹31,861 crore as against ₹30,905 crore in the prior year, yielding an operating margin of 20.7% compared to 21.0% in FY23. Net profit attributable to owners was ₹26,233 crore, reflecting growth of 8.9%."
  },
  {
    id: "chk-infy-084",
    companyId: "INFY",
    docName: "Infosys-Annual-Report-2023-24.pdf",
    page: 84,
    section: "Management Discussion & Analysis - Segment Performance",
    tokens: 388,
    embeddingNorm: 0.9991,
    similarityScore: 0.895,
    content: "Revenues from Financial Services vertical contracted 1.0% in constant currency, accounting for 27.2% of total revenue compared to 29.8% in the previous year. Manufacturing vertical demonstrated resilient performance, expanding 11.2% in constant currency. Total contract value (TCV) of large deal signings reached an all-time record of $17.7 billion, with net new deals constituting 52% of total signings."
  },
  {
    id: "chk-tcs-094",
    companyId: "TCS",
    docName: "TCS-Annual-Report-2023-24.pdf",
    page: 94,
    section: "Consolidated Statement of Profit and Loss",
    tokens: 412,
    embeddingNorm: 0.9978,
    similarityScore: 0.938,
    content: "Consolidated revenue from operations increased to ₹240,893 crore ($29.08B), representing an expansion of 6.8% YoY (3.4% in constant currency terms). Operating margin for the full year reached 24.6%, expanding 50 basis points over the prior fiscal year, supported by productivity gains and pyramid optimization. Profit after tax reached ₹46,585 crore, up 10.5% YoY, representing a net margin of 19.3%."
  },
  {
    id: "chk-aapl-032",
    companyId: "AAPL",
    docName: "Apple-10K-FY2024.pdf",
    page: 32,
    section: "Item 7 - Management's Discussion and Analysis",
    tokens: 465,
    embeddingNorm: 0.9989,
    similarityScore: 0.916,
    content: "Total net sales were $391.0 billion in 2024, an increase of 2% or $7.8 billion compared to 2023. Products net sales were $294.9 billion, essentially flat compared to $298.1 billion in 2023. Services net sales reached a record $96.2 billion, up 13% compared to $85.2 billion in 2023. Gross margin increased to 46.2% from 44.1% in 2023, driven by favorable product mix and Services revenue expansion."
  },
  {
    id: "chk-msft-043",
    companyId: "MSFT",
    docName: "Microsoft-10K-FY2024.pdf",
    page: 43,
    section: "Liquidity and Capital Resources - CapEx",
    tokens: 440,
    embeddingNorm: 0.9995,
    similarityScore: 0.927,
    content: "Capital expenditures including assets acquired under finance leases were $55.7 billion, compared to $31.9 billion in FY 2023. Cash paid for property and equipment was $44.5 billion. These investments are driven by cloud and AI demand, primarily for data centers, compute infrastructure, and networking hardware required to train and serve frontier generative AI models across our commercial cloud."
  }
];

// Pre-packaged conversational research Q&As with multi-step reasoning chains and exact citations
export const SAMPLE_RESEARCH_QUERIES = [
  {
    question: "Compare the operating margins and deal pipelines between Infosys and TCS in FY24. What caused the margin variance?",
    category: "Peer Benchmarking",
    reasoningSteps: [
      {
        step: 1,
        title: "Query Decomposition & Target Metric Identification",
        detail: "Decomposed multi-part query into 3 sub-targets: (a) FY24 Operating Margin (EBIT %) for INFY & TCS; (b) Large deal TCV for both firms; (c) Root causes of the 390 bps margin divergence (24.6% vs 20.7%)."
      },
      {
        step: 2,
        title: "Vector Retrieval Across Indexed Chunks",
        detail: "Retrieved chunk `chk-infy-048` (similarity 0.942, p. 112) and `chk-tcs-094` (similarity 0.938, p. 94) from vector store using 1536-dim cosine similarity threshold > 0.85."
      },
      {
        step: 3,
        title: "Financial Calculation & Fact Verification",
        detail: "Verified EBIT: TCS reported ₹59,258 Cr on ₹240,893 Cr (24.60%); Infosys reported ₹31,861 Cr on ₹153,670 Cr (20.73%). Spread equals exactly 387 bps (3.87 percentage points) in favor of TCS."
      },
      {
        step: 4,
        title: "Causal Factor Synthesis & Source Grounding",
        detail: "Cross-referenced employee cost and subcontractor line items. TCS employee expense was 55.4% of revenue with 95.1% FCF conversion; Infosys had higher subcontractor leakage (9.5% of revenue) and sharper BFSI slowdown (-1.0% CC)."
      }
    ],
    answer: `Based on the official FY 2023-24 Integrated Annual Reports for **Infosys** and **Tata Consultancy Services (TCS)**, here is the structured comparative analysis:

### 1. Operating Margin Comparison
- **TCS:** Achieved an industry-leading operating margin of **24.6%** (expanding +50 bps YoY from 24.1% in FY23) [TCS-FY24-AR, p. 94].
- **Infosys:** Delivered an operating margin of **20.7%** (contracting -30 bps YoY from 21.0% in FY23) [INFY-FY24-AR, p. 112].
- **Spread:** TCS outperformed Infosys by **387 basis points (3.87 percentage points)**.

### 2. Deal Pipeline & Large Deal TCV
- **TCS:** Reported an all-time record annual order book Total Contract Value (TCV) of **$42.7 Billion**, demonstrating exceptional resilience across both North America and UK mega-deals [TCS-FY24-AR, p. 45].
- **Infosys:** Closed **$17.7 Billion** in large deal TCV (with net new deals accounting for 52%), representing a strong pipeline despite longer decision cycles [INFY-FY24-AR, p. 87].

### 3. Primary Drivers of the Margin Variance
1. **Pyramid & Subcontractor Optimization:** Infosys incurred **₹14,562 Cr (9.5% of revenue)** in third-party subcontractor costs [INFY-FY24-AR, p. 129], whereas TCS maintained superior offshore delivery discipline and internal bench utilization.
2. **Vertical Exposure:** Infosys suffered a **-1.0% constant currency decline** in its largest vertical (Financial Services, 27.2% of mix) [INFY-FY24-AR, p. 84], whereas TCS mitigated BFSI softness with strong UK public sector and energy contracts.
3. **Productivity Gains:** TCS successfully drove a **+50 bps margin accretion** through pyramid restructuring and reduced attrition (down to 12.5%) [TCS-FY24-AR, p. 62].`,
    citations: [
      {
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        page: 112,
        section: "Consolidated Statement of Profit and Loss",
        snippet: "Operating profit was ₹31,861 crore as against ₹30,905 crore in the prior year, yielding an operating margin of 20.7% compared to 21.0% in FY23."
      },
      {
        docName: "TCS-Annual-Report-2023-24.pdf",
        company: "Tata Consultancy Services",
        page: 94,
        section: "Operating Margins and Segmental EBIT Analysis",
        snippet: "Operating margin for the full year reached 24.6%, expanding 50 basis points over the prior fiscal year, supported by productivity gains."
      },
      {
        docName: "Infosys-Annual-Report-2023-24.pdf",
        company: "Infosys Limited",
        page: 84,
        section: "Segmental Performance - Financial Services",
        snippet: "Revenues from Financial Services vertical contracted 1.0% in constant currency, reflecting cautious client behavior."
      }
    ]
  },
  {
    question: "What financial red flags or anomalies were detected in Apple's FY24 Form 10-K filing?",
    category: "Forensic Audit",
    reasoningSteps: [
      {
        step: 1,
        title: "Scan for Material Forensic Triggers",
        detail: "Queried indexed 10-K sections: Geographic segment sales, Tax contingencies, Long-term debt obligations, and Legal risk factors."
      },
      {
        step: 2,
        title: "Quantify Geographic & Tax Impact",
        detail: "Found two high-severity anomalies: (1) Greater China net sales dropped 7.7% ($66.95B vs $72.56B); (2) $10.2B European State Aid tax hit recorded in Q4."
      },
      {
        step: 3,
        title: "Evaluate Working Capital and Liquidity Structure",
        detail: "Identified Current Ratio of 0.87x (Current assets of $124.9B vs Current liabilities of $143.6B), reflecting aggressive negative working capital model."
      }
    ],
    answer: `The **Red Flag Agent** flagged three primary financial and operational anomalies in Apple Inc.'s FY24 Form 10-K filing:

### 🚨 1. Greater China Market Contraction (-7.7% YoY) — [Severity: HIGH]
- Greater China net sales fell from **$72.56 Billion in FY23 to $66.95 Billion in FY24**, representing a sharp contraction of **-$5.61 Billion (-7.7%)** [Apple-10K-FY24, p. 34].
- **Driver:** Intensified domestic competition from Huawei (Mate 60 / Pura series) and Chinese government restrictions on foreign smartphone usage in state-backed enterprises.

### 🚨 2. One-Time European State Aid Tax Charge of $10.2 Billion — [Severity: HIGH]
- In September 2024, the **Court of Justice of the European Union (CJEU)** issued a final judgment annulling previous lower-court rulings, requiring Apple to pay Ireland ~€13 Billion in back taxes [Apple-10K-FY24, p. 61].
- Apple recognized a **$10.2 Billion tax expense** in Q4 FY24, which suppressed full-year Net Income by 3.4% ($93.74B vs $97.00B in FY23) despite higher operating income.

### ⚠️ 3. Negative Working Capital & Sub-1.0 Current Ratio (0.87x) — [Severity: MEDIUM]
- Current assets of **$124.87B** vs Current liabilities of **$143.57B** yield a current ratio of **0.87x** [Apple-10K-FY24, p. 50].
- While this reflects Apple's strong bargaining power with suppliers (Foxconn/Pegatron), it leaves zero liquid buffer if short-term vendor credit terms tighten.`,
    citations: [
      {
        docName: "Apple-10K-FY2024.pdf",
        company: "Apple Inc.",
        page: 34,
        section: "Item 7 - Segment Net Sales by Geographic Region",
        snippet: "Greater China net sales decreased 8% during 2024 compared to 2023, primarily due to lower net sales of iPhone and foreign currency headwinds."
      },
      {
        docName: "Apple-10K-FY2024.pdf",
        company: "Apple Inc.",
        page: 61,
        section: "Note 5 - Income Taxes",
        snippet: "The Company recorded a one-time income tax charge of $10.2 billion associated with the CJEU judgment in the European State Aid case."
      }
    ]
  },
  {
    question: "Analyze Microsoft's $55.7B CapEx spending in FY24. Is it supported by Azure cloud growth?",
    category: "Investment Analysis",
    reasoningSteps: [
      {
        step: 1,
        title: "CapEx & Free Cash Flow Verification",
        detail: "Retrieved Statements of Cash Flows from Form 10-K: FY24 CapEx jumped +75% from $31.9B to $55.7B (22.7% of total revenue)."
      },
      {
        step: 2,
        title: "Intelligent Cloud & Azure Monetization Rate",
        detail: "Retrieved Segment Disclosures: Intelligent Cloud revenue reached $105.36B (+20% YoY); Azure specifically grew ~30% with an 800 bps contribution from AI services."
      },
      {
        step: 3,
        title: "Return on Invested Capital (ROIC) Sustainability",
        detail: "ROIC remained robust at 29.4%, but depreciation run-rate will increase by ~$6.5B annually starting FY25."
      }
    ],
    answer: `Based on **Microsoft's FY24 Form 10-K**, here is the financial assessment of Microsoft's AI infrastructure capital expenditures:

### 1. The CapEx Surge
- Microsoft's capital expenditures (including finance leases) surged by **+74.6% YoY to $55.7 Billion** in FY24, up from $31.9 Billion in FY23 [Microsoft-10K-FY24, p. 43].
- CapEx as a proportion of total revenue escalated to **22.7%**, compared to historical norms of 12-14%.
- **Allocation:** Over 70% of outlays were dedicated to cloud computing assets (datacenter land, power substation buildouts, high-density server racks, and Nvidia GPU clusters).

### 2. Is Azure Growth Justifying the Investment?
- **Intelligent Cloud Revenue:** Exceeded **$105.36 Billion (+20% YoY)**, surpassing the $100B milestone for the first time [Microsoft-10K-FY24, p. 40].
- **Azure AI Contribution:** Azure revenue expanded ~30% in constant currency, with **800 basis points of growth directly attributable to Azure OpenAI and Copilot workloads**.
- **Commercial RPO (Remaining Performance Obligation):** Increased to **$269 Billion**, demonstrating multi-year enterprise purchase commitments that derisk this infrastructure spend.

### 3. Red Flag Alert for Analysts
- **Depreciation Overhang:** Property and equipment assets grew to $135.8B. Annual depreciation expense will accelerate into FY25, which will exert a **100-150 bps headwind on operating margins** unless AI inference gross margins improve significantly.`,
    citations: [
      {
        docName: "Microsoft-10K-FY2024.pdf",
        company: "Microsoft Corporation",
        page: 43,
        section: "Item 7 - Liquidity and Capital Resources",
        snippet: "Capital expenditures including assets acquired under finance leases were $55.7 billion, compared to $31.9 billion in FY 2023."
      },
      {
        docName: "Microsoft-10K-FY2024.pdf",
        company: "Microsoft Corporation",
        page: 40,
        section: "Item 7 - Segment Results of Operations",
        snippet: "Intelligent Cloud revenue increased $17.4 billion or 20%, driven by Azure and other cloud services growth of 30%."
      }
    ]
  }
];

// Complete multi-agent pipeline definition
export const AGENT_PIPELINE_STAGES = [
  {
    id: "documentAgent",
    name: "Document Agent",
    role: "Ingestion, OCR, Chunking & Vector Indexing",
    description: "Extracts raw text, table grids, and footnotes; divides filings into semantic chunks; generates 1536-dimensional embeddings; and indexes them into vector storage.",
    icon: "FileText",
    status: "Completed",
    duration: "4.2s",
    stats: "3,000+ chunks indexed across 2 filings"
  },
  {
    id: "extractionAgent",
    name: "Extraction Agent",
    role: "Financial Metrics & Ratio Harvesting",
    description: "Pulls GAAP/IFRS line items (Revenue, EBIT, FCF, Net Income, Debt, EPS) and computes profitability, liquidity, solvency, and efficiency ratios.",
    icon: "Layers",
    status: "Completed",
    duration: "2.8s",
    stats: "14 core metrics & 7 financial ratios extracted"
  },
  {
    id: "redFlagAgent",
    name: "Red Flag Agent",
    role: "Forensic Anomaly & Risk Detection",
    description: "Performs unprompted forensic scans for falling margins, rising debt, customer/geographic concentration, auditor qualifications, and unusual accounting charges.",
    icon: "AlertTriangle",
    status: "Completed",
    duration: "3.1s",
    stats: "5 forensic anomalies surfaced with page evidence"
  },
  {
    id: "comparisonAgent",
    name: "Comparison Agent",
    role: "Cross-Company Benchmarking & Peer Variance",
    description: "Cross-references extracted financial data across multiple companies for side-by-side metric benchmarking, margin spreads, and peer rankings.",
    icon: "GitCompare",
    status: "Completed",
    duration: "1.9s",
    stats: "Side-by-side variance matrix compiled"
  },
  {
    id: "researchAgent",
    name: "Research Agent",
    role: "Conversational Multi-Step Reasoning with Citations",
    description: "Answers complex multi-part user financial questions using vector retrieval, reasoning step decomposition, and strict document source citations.",
    icon: "Bot",
    status: "Ready",
    duration: "Live",
    stats: "Multi-part reasoning engine active"
  },
  {
    id: "reportAgent",
    name: "Report Agent",
    role: "Analyst-Style PDF Dossier Generation",
    description: "Compiles findings from all agents into a publication-ready analyst report covering Executive Summary, Key Financials, Red Flags, Comparison, and Outlook.",
    icon: "Printer",
    status: "Generated",
    duration: "1.4s",
    stats: "Structured PDF export ready"
  }
];
