// Comprehensive Financial Document Store for Module 2: Ingestion & Parsing
import { SEED_COMPANIES, SAMPLE_CHUNKS } from "./seedData";

export const DOCUMENT_TYPES = [
  "Annual Report",
  "10-K Filing",
  "Financial Statement",
  "Earnings Transcript",
  "Investor Presentation"
];

export const PROCESSING_STATUSES = [
  "Ready",
  "Parsing",
  "Chunking",
  "Indexing",
  "Uploaded",
  "Error"
];

export const INITIAL_DOCUMENTS = [
  {
    id: "doc-infy-ar24",
    name: "Infosys-Annual-Report-2023-24.pdf",
    company: "Infosys Limited",
    ticker: "INFY",
    docType: "Annual Report",
    fileSize: "18.4 MB",
    fileSizeBytes: 19293798,
    uploadDate: "May 24, 2024",
    uploadedTimestamp: "2024-05-24T10:30:00Z",
    status: "Ready",
    isSeed: true,
    pages: 384,
    chunksCount: 1420,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    ocrEngine: "Financial-OCR-TableNet v2.4",
    checksum: "sha256:7f92b1a8d4e902cf683a45c71b3e945f091",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    summary: "Integrated Annual Report 2023-24 covering Consolidated P&L, Segmental BFSI and Manufacturing performance, Human Capital disclosures, and Deloitte Audit Opinion.",
    pipelineStages: [
      { name: "Uploaded", status: "completed", timestamp: "10:30:02 AM", duration: "0.8s", detail: "Binary PDF validated, 384 pages detected, checksum verified" },
      { name: "Parsing", status: "completed", timestamp: "10:30:05 AM", duration: "3.2s", detail: "Extracted 384 page text streams, 142 financial tables, and 88 footnote references" },
      { name: "Chunking", status: "completed", timestamp: "10:30:08 AM", duration: "2.5s", detail: "Recursive semantic token chunker produced 1,420 chunks (mean: 418 tokens)" },
      { name: "Indexing", status: "completed", timestamp: "10:30:12 AM", duration: "4.1s", detail: "1,420 vectors embedded with 1536-dim cosine index in HNSW vector storage" },
      { name: "Ready", status: "completed", timestamp: "10:30:13 AM", duration: "0.3s", detail: "Citation grounding verified with zero OCR token anomalies" }
    ],
    sections: [
      { id: "sec-infy-1", title: "Corporate Profile & Strategic Highlights", page: 4, chunks: 24, category: "Overview", previewSnippet: "Infosys is a global leader in next-generation digital services and consulting operating in over 56 countries..." },
      { id: "sec-infy-2", title: "Management Discussion & Analysis (MD&A)", page: 68, chunks: 184, category: "MD&A", previewSnippet: "Global economic environment remained cautious with delayed enterprise discretionary spending in North America..." },
      { id: "sec-infy-3", title: "Segment Performance: BFSI & Manufacturing", page: 84, chunks: 72, category: "Segment Analysis", previewSnippet: "Financial Services vertical contracted 1.0% in constant currency, accounting for 27.2% of total revenues..." },
      { id: "sec-infy-4", title: "Consolidated Statement of Profit and Loss", page: 112, chunks: 48, category: "Financial Statement", previewSnippet: "Revenues from operations stood at ₹153,670 crore vs ₹146,767 crore; Operating profit at ₹31,861 crore (20.7%)..." },
      { id: "sec-infy-5", title: "Consolidated Balance Sheet", page: 114, chunks: 52, category: "Financial Statement", previewSnippet: "Total equity stood at ₹86,340 crore with zero long-term borrowings. Cash and cash equivalents reached ₹34,714 crore..." },
      { id: "sec-infy-6", title: "Consolidated Statement of Cash Flows", page: 116, chunks: 36, category: "Financial Statement", previewSnippet: "Operating cash flows generated ₹25,842 crore; Free cash flow conversion stood at 91.2% of net profit..." },
      { id: "sec-infy-7", title: "Note 21: Operating Expenses & Technical Subcontractors", page: 129, chunks: 30, category: "Footnotes", previewSnippet: "Technical sub-contractor expenses for the year ended March 31, 2024 were ₹14,562 Cr (9.5% of revenue)..." },
      { id: "sec-infy-8", title: "Human Capital Disclosures & Headcount", page: 138, chunks: 45, category: "Governance", previewSnippet: "Total headcount stood at 317,240 compared to 343,234 in the previous year. LTM voluntary attrition was 12.6%..." },
      { id: "sec-infy-9", title: "Independent Auditor's Report (Deloitte Haskins & Sells)", page: 164, chunks: 28, category: "Auditor Opinion", previewSnippet: "In our opinion, the accompanying consolidated financial statements give a true and fair view in conformity with Ind AS..." }
    ]
  },

  {
    id: "doc-tcs-ar24",
    name: "TCS-Annual-Report-2023-24.pdf",
    company: "Tata Consultancy Services",
    ticker: "TCS",
    docType: "Annual Report",
    fileSize: "22.1 MB",
    fileSizeBytes: 23173529,
    uploadDate: "June 12, 2024",
    uploadedTimestamp: "2024-06-12T14:15:00Z",
    status: "Ready",
    isSeed: true,
    pages: 420,
    chunksCount: 1580,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    ocrEngine: "Financial-OCR-TableNet v2.4",
    checksum: "sha256:3a18c992ef17d45089201cb4e601249fa82",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    summary: "Integrated Annual Report 2023-24 highlighting record $42.7B order book TCV, 24.6% operating margin, 95.1% FCF conversion, and B S R & Co. clean audit opinion.",
    pipelineStages: [
      { name: "Uploaded", status: "completed", timestamp: "02:15:01 PM", duration: "1.1s", detail: "420 pages ingested, high-res graphics and OCR layers separated" },
      { name: "Parsing", status: "completed", timestamp: "02:15:06 PM", duration: "4.8s", detail: "Reconstructed 186 tabular financial schedules and multi-column directors' report" },
      { name: "Chunking", status: "completed", timestamp: "02:15:09 PM", duration: "3.1s", detail: "Generated 1,580 chunks preserving tabular row-column alignments" },
      { name: "Indexing", status: "completed", timestamp: "02:15:14 PM", duration: "4.6s", detail: "HNSW graph built with 1536-dim embeddings and metadata tags" },
      { name: "Ready", status: "completed", timestamp: "02:15:15 PM", duration: "0.2s", detail: "Indexed and validated against FY24 statutory disclosures" }
    ],
    sections: [
      { id: "sec-tcs-1", title: "Chairman's Statement & Executive Summary", page: 8, chunks: 26, category: "Overview", previewSnippet: "TCS delivered resilient growth in a challenging macro environment, reaching ₹240,893 crore in revenue..." },
      { id: "sec-tcs-2", title: "Order Book TCV & Deal Signings", page: 45, chunks: 84, category: "Commercial", previewSnippet: "Record annual order book Total Contract Value (TCV) closed at $42.7 billion with broad-based market wins..." },
      { id: "sec-tcs-3", title: "Geographic Performance: UK & Continental Europe", page: 72, chunks: 64, category: "Segment Analysis", previewSnippet: "UK market grew 10.1% while Continental Europe contracted 1.2% in constant currency due to cautious spending..." },
      { id: "sec-tcs-4", title: "Consolidated Statement of Profit and Loss", page: 94, chunks: 52, category: "Financial Statement", previewSnippet: "Revenue grew 6.8% YoY to ₹240,893 crore. Operating margin expanded 50 bps to 24.6%. Net profit reached ₹46,585 crore..." },
      { id: "sec-tcs-5", title: "Consolidated Balance Sheet", page: 96, chunks: 46, category: "Financial Statement", previewSnippet: "Total equity reached ₹90,489 crore. Zero total debt with cash and investments of ₹49,823 crore..." },
      { id: "sec-tcs-6", title: "Cash Flow & Capital Allocation", page: 98, chunks: 38, category: "Financial Statement", previewSnippet: "Free cash flow was ₹44,289 crore (95.1% of PAT). Total dividends paid amounted to ₹47,000+ crore..." },
      { id: "sec-tcs-7", title: "Note 28: Exceptional Legal Item Disclosure", page: 118, chunks: 22, category: "Footnotes", previewSnippet: "Exceptional legal charge of ₹958 crore recognized pursuant to settlement agreement in long-standing litigation..." },
      { id: "sec-tcs-8", title: "Independent Auditor's Report (B S R & Co. LLP)", page: 142, chunks: 26, category: "Auditor Opinion", previewSnippet: "Unmodified clean opinion issued on consolidated financial statements for the year ended March 31, 2024..." }
    ]
  },

  {
    id: "doc-aapl-10k24",
    name: "Apple-10K-FY2024.pdf",
    company: "Apple Inc.",
    ticker: "AAPL",
    docType: "10-K Filing",
    fileSize: "6.8 MB",
    fileSizeBytes: 7130316,
    uploadDate: "October 31, 2024",
    uploadedTimestamp: "2024-10-31T18:00:00Z",
    status: "Ready",
    isSeed: true,
    pages: 78,
    chunksCount: 920,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    ocrEngine: "Financial-OCR-TableNet v2.4",
    checksum: "sha256:91c28f7734ea01994df5621a50c822e4310",
    sessionId: "session-2",
    sessionTitle: "Apple Inc. (AAPL) 10-K Forensic Audit & Red Flag Analysis",
    summary: "SEC Form 10-K Annual Report for fiscal year ended September 28, 2024 disclosing $391.0B net sales, $10.2B European State Aid tax charge, and Greater China revenue trends.",
    pipelineStages: [
      { name: "Uploaded", status: "completed", timestamp: "06:00:01 PM", duration: "0.5s", detail: "SEC EDGAR Form 10-K parsed with interactive XBRL tags intact" },
      { name: "Parsing", status: "completed", timestamp: "06:00:03 PM", duration: "2.1s", detail: "Extracted Item 1, 1A, 7, 8 and Notes to Consolidated Financial Statements" },
      { name: "Chunking", status: "completed", timestamp: "06:00:05 PM", duration: "1.8s", detail: "Generated 920 dense chunks tagged with Item numbers and GAAP tags" },
      { name: "Indexing", status: "completed", timestamp: "06:00:08 PM", duration: "2.9s", detail: "Index built with 1536-dim embeddings for forensic query retrieval" },
      { name: "Ready", status: "completed", timestamp: "06:00:09 PM", duration: "0.2s", detail: "Citations cross-referenced with SEC EDGAR accession 0000320193-24-000106" }
    ],
    sections: [
      { id: "sec-aapl-1", title: "Item 1: Business Overview & Ecosystem", page: 4, chunks: 68, category: "Business", previewSnippet: "Apple designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories..." },
      { id: "sec-aapl-2", title: "Item 1A: Risk Factors & Antitrust Inquiries", page: 21, chunks: 140, category: "Risk Factors", previewSnippet: "The Company is subject to complex and evolving laws, including antitrust actions by the US DOJ and EU DMA..." },
      { id: "sec-aapl-3", title: "Item 7: MD&A - Gross Margin & Services", page: 32, chunks: 98, category: "MD&A", previewSnippet: "Gross margin increased to 46.2% from 44.1% in 2023, driven by favorable product mix and Services expansion (74.0%)..." },
      { id: "sec-aapl-4", title: "Item 7: Segment Net Sales by Region (Greater China)", page: 34, chunks: 42, category: "Segment Analysis", previewSnippet: "Greater China net sales decreased 8% during 2024 to $66.95B, primarily due to lower net sales of iPhone..." },
      { id: "sec-aapl-5", title: "Item 8: Consolidated Statements of Operations", page: 48, chunks: 38, category: "Financial Statement", previewSnippet: "Total net sales were $391.04B, Operating income reached $123.22B, Net income stood at $93.74B..." },
      { id: "sec-aapl-6", title: "Item 8: Consolidated Balance Sheets", page: 50, chunks: 36, category: "Financial Statement", previewSnippet: "Current assets of $124.87B vs Current liabilities of $143.57B (0.87x current ratio). Total debt of $106.63B..." },
      { id: "sec-aapl-7", title: "Note 5: Income Taxes & European State Aid Decision", page: 61, chunks: 44, category: "Footnotes", previewSnippet: "The Company recorded a one-time income tax charge of $10.2 billion associated with the final CJEU judgment..." }
    ]
  },

  {
    id: "doc-msft-10k24",
    name: "Microsoft-10K-FY2024.pdf",
    company: "Microsoft Corporation",
    ticker: "MSFT",
    docType: "10-K Filing",
    fileSize: "8.2 MB",
    fileSizeBytes: 8598323,
    uploadDate: "July 31, 2024",
    uploadedTimestamp: "2024-07-31T20:10:00Z",
    status: "Ready",
    isSeed: true,
    pages: 96,
    chunksCount: 1140,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    ocrEngine: "Financial-OCR-TableNet v2.4",
    checksum: "sha256:56b02a9918ef013c78a011de909a32c2891",
    sessionId: "session-3",
    sessionTitle: "Microsoft (MSFT) Cloud & AI CapEx ROI Investigation",
    summary: "Form 10-K filing highlighting $245.1B revenue, $105.4B Intelligent Cloud milestone, and $55.7B CapEx infrastructure commitments.",
    pipelineStages: [
      { name: "Uploaded", status: "completed", timestamp: "08:10:01 PM", duration: "0.6s", detail: "SEC Form 10-K loaded and decomposed into financial item sections" },
      { name: "Parsing", status: "completed", timestamp: "08:10:04 PM", duration: "2.8s", detail: "Parsed commercial cloud metrics, Activision purchase accounting, and lease schedules" },
      { name: "Chunking", status: "completed", timestamp: "08:10:07 PM", duration: "2.4s", detail: "Generated 1,140 semantic chunks with specialized GAAP financial terms" },
      { name: "Indexing", status: "completed", timestamp: "08:10:11 PM", duration: "3.7s", detail: "Stored in vector index with 1536-dim embeddings for multi-agent reasoning" },
      { name: "Ready", status: "completed", timestamp: "08:10:12 PM", duration: "0.2s", detail: "Ready for multi-agent financial queries and CapEx return modeling" }
    ],
    sections: [
      { id: "sec-msft-1", title: "Item 1: Commercial Cloud & Product Offerings", page: 5, chunks: 82, category: "Business", previewSnippet: "Microsoft develops and supports software, services, devices, and solutions including Azure, M365 and Copilot..." },
      { id: "sec-msft-2", title: "Item 1A: AI Accelerator & GPU Supply Dependencies", page: 19, chunks: 110, category: "Risk Factors", previewSnippet: "Our ability to expand cloud and AI services depends on specialized semiconductor delivery and power infrastructure..." },
      { id: "sec-msft-3", title: "Item 7: MD&A - Intelligent Cloud Growth", page: 40, chunks: 92, category: "MD&A", previewSnippet: "Intelligent Cloud revenue increased $17.4 billion or 20% to $105.4 billion, driven by Azure cloud services growth of 30%..." },
      { id: "sec-msft-4", title: "Item 7: CapEx Surge & Capital Allocation", page: 43, chunks: 48, category: "Liquidity", previewSnippet: "Capital expenditures including finance leases were $55.7 billion, up 75% YoY, supporting cloud and AI demand..." },
      { id: "sec-msft-5", title: "Item 8: Consolidated Income Statements", page: 54, chunks: 34, category: "Financial Statement", previewSnippet: "Revenue reached $245.12B (+15.7%); Operating income was $109.43B (44.6% margin); Net income was $88.14B..." },
      { id: "sec-msft-6", title: "Item 8: Statements of Cash Flows", page: 58, chunks: 36, category: "Financial Statement", previewSnippet: "Cash from operations was $118.55B; CapEx cash paid was $44.48B; Free cash flow stood at $74.07B..." }
    ]
  },

  {
    id: "doc-tcs-fs24",
    name: "TCS-Audited-Financial-Statements-FY24.pdf",
    company: "Tata Consultancy Services",
    ticker: "TCS",
    docType: "Financial Statement",
    fileSize: "4.5 MB",
    fileSizeBytes: 4718592,
    uploadDate: "October 14, 2026",
    uploadedTimestamp: "2026-10-14T09:40:00Z",
    status: "Ready",
    isSeed: true,
    pages: 56,
    chunksCount: 430,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    ocrEngine: "Financial-OCR-TableNet v2.4",
    checksum: "sha256:1082cba99420fd7810398ef918a3857ca21",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    summary: "Audited Standalone and Consolidated Financial Statements for FY24 with detailed schedules on employee costs, tax reconciliations, and leases.",
    pipelineStages: [
      { name: "Uploaded", status: "completed", timestamp: "09:40:01 AM", duration: "0.4s", detail: "Standalone and consolidated financial statement tables extracted" },
      { name: "Parsing", status: "completed", timestamp: "09:40:03 AM", duration: "1.9s", detail: "56 table grids parsed with 100% cell coordinate alignment" },
      { name: "Chunking", status: "completed", timestamp: "09:40:05 AM", duration: "1.4s", detail: "430 financial statement chunks created with column headers preserved" },
      { name: "Indexing", status: "completed", timestamp: "09:40:08 AM", duration: "2.1s", detail: "Dense vector index generated for line item ratio lookups" },
      { name: "Ready", status: "completed", timestamp: "09:40:09 AM", duration: "0.1s", detail: "Auditor signatures and cross-totals reconciled" }
    ],
    sections: [
      { id: "sec-tcsfs-1", title: "Consolidated Balance Sheet Schedule", page: 4, chunks: 48, category: "Financial Statement", previewSnippet: "Property, plant and equipment stood at ₹11,382 crore. Right-of-use assets totaled ₹8,024 crore..." },
      { id: "sec-tcsfs-2", title: "Consolidated Statement of Profit and Loss", page: 8, chunks: 52, category: "Financial Statement", previewSnippet: "Employee benefit expenses were ₹133,456 crore (55.4% of total revenue). Finance costs were ₹779 crore..." },
      { id: "sec-tcsfs-3", title: "Tax Expense & Effective Rate Reconciliation", page: 24, chunks: 36, category: "Footnotes", previewSnippet: "Income tax expense amounted to ₹15,482 crore, reflecting an effective tax rate of 24.9%..." }
    ]
  },

  {
    id: "doc-infy-transcript-q125",
    name: "Infosys-Q1-FY25-Earnings-Transcript.pdf",
    company: "Infosys Limited",
    ticker: "INFY",
    docType: "Earnings Transcript",
    fileSize: "2.4 MB",
    fileSizeBytes: 2516582,
    uploadDate: "October 15, 2026",
    uploadedTimestamp: "2026-10-15T16:20:00Z",
    status: "Ready",
    isSeed: true,
    pages: 32,
    chunksCount: 240,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    ocrEngine: "Financial-OCR-TableNet v2.4",
    checksum: "sha256:bb7291a0c492198421098feea981273948b",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    summary: "Management transcript of Q1 FY25 earnings conference call with analyst Q&A discussing discretionary spending recovery, generative AI deal volume, and hiring guidance.",
    pipelineStages: [
      { name: "Uploaded", status: "completed", timestamp: "04:20:01 PM", duration: "0.3s", detail: "Earnings call transcript loaded and speaker diarization verified" },
      { name: "Parsing", status: "completed", timestamp: "04:20:03 PM", duration: "1.2s", detail: "Separated CEO opening remarks, CFO margin review, and 18 analyst Q&A dialogs" },
      { name: "Chunking", status: "completed", timestamp: "04:20:04 PM", duration: "0.9s", detail: "240 conversational chunks structured by analyst question and executive response" },
      { name: "Indexing", status: "completed", timestamp: "04:20:06 PM", duration: "1.5s", detail: "Embeddings indexed for qualitative sentiment retrieval" },
      { name: "Ready", status: "completed", timestamp: "04:20:07 PM", duration: "0.1s", detail: "Transcript ready for conversational agent retrieval" }
    ],
    sections: [
      { id: "sec-infyt-1", title: "Executive Opening Remarks: CEO Salil Parekh", page: 2, chunks: 48, category: "Executive Remarks", previewSnippet: "Good afternoon. We started the fiscal year on a strong note with broad-based growth and large deal momentum..." },
      { id: "sec-infyt-2", title: "Financial Review & Margins: CFO Jayesh Sanghrajka", page: 6, chunks: 36, category: "Financial Review", previewSnippet: "Operating margin expanded to 21.1% in Q1, driven by Project Maximus cost optimization and higher offshore utilization..." },
      { id: "sec-infyt-3", title: "Analyst Q&A: Morgan Stanley & Goldman Sachs", page: 12, chunks: 84, category: "Analyst Q&A", previewSnippet: "Question on discretionary BFSI spending recovery in the US: Salil noted stabilization with initial pilots in AI..." }
    ]
  },

  {
    id: "doc-demo-parsing",
    name: "Alphabet-Form-10Q-Q3-2024.pdf",
    company: "Alphabet Inc.",
    ticker: "GOOGL",
    docType: "10-K Filing",
    fileSize: "5.1 MB",
    fileSizeBytes: 5347737,
    uploadDate: "October 16, 2026",
    uploadedTimestamp: "2026-10-16T11:00:00Z",
    status: "Parsing",
    isSeed: true,
    pages: 64,
    chunksCount: 0,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    ocrEngine: "Financial-OCR-TableNet v2.4",
    checksum: "sha256:e821fa093c4129849204bc9123891048b29",
    sessionId: "session-1",
    sessionTitle: "Infosys vs TCS: FY24 IT Services Peer Benchmarking",
    summary: "Quarterly SEC Form 10-Q filing currently undergoing OCR extraction and table recognition.",
    pipelineStages: [
      { name: "Uploaded", status: "completed", timestamp: "11:00:01 AM", duration: "0.4s", detail: "PDF file validated, 64 pages extracted" },
      { name: "Parsing", status: "in-progress", timestamp: "11:00:03 AM", duration: "Active", detail: "Extracting multi-column text and Google Cloud segment tables" },
      { name: "Chunking", status: "waiting", timestamp: "--", duration: "--", detail: "Waiting for OCR text layer completion" },
      { name: "Indexing", status: "waiting", timestamp: "--", duration: "--", detail: "Waiting for chunk generation" },
      { name: "Ready", status: "waiting", timestamp: "--", duration: "--", detail: "Pending vector storage verification" }
    ],
    sections: [
      { id: "sec-goog-1", title: "Part I - Financial Information", page: 3, chunks: 0, category: "Financial Statement", previewSnippet: "Consolidated Statements of Income (In Progress)..." }
    ]
  }
];

const STORAGE_KEY = "finresearch_documents_v2";

export function getStoredDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load documents from localStorage:", e);
  }
  return INITIAL_DOCUMENTS;
}

export function saveStoredDocuments(docs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.warn("Failed to save documents to localStorage:", e);
  }
}

export function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
