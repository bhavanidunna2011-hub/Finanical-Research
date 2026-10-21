// Financial Knowledge Base & Vector Index Data Store for Module 3
import { SEED_COMPANIES, SAMPLE_CHUNKS } from "./seedData";
import { getStoredDocuments } from "./documentData";

export const INDEXING_STATUSES = ["Pending", "Processing", "Indexed", "Failed"];

export const WORKFLOW_STAGES = [
  {
    step: 1,
    id: "received",
    title: "Document received",
    description: "PDF file ingested, binary payload verified, SHA-256 cryptographic checksum calculated."
  },
  {
    step: 2,
    id: "extracted",
    title: "Text extracted",
    description: "Optical Character Recognition (OCR) applied to extract clean text streams, coordinate table layouts, and footnotes."
  },
  {
    step: 3,
    id: "chunked",
    title: "Document split into chunks",
    description: "Recursive semantic token chunking splits filing into contextual blocks (512 tokens / 64 token overlap)."
  },
  {
    step: 4,
    id: "embedded",
    title: "Embeddings generated",
    description: "1536-dimensional dense vector embeddings generated via OpenAI text-embedding-3-small."
  },
  {
    step: 5,
    id: "indexed",
    title: "Vectors indexed",
    description: "Embeddings structured into Hierarchical Navigable Small World (HNSW) vector index graph with cosine distance."
  },
  {
    step: 6,
    id: "ready",
    title: "Document ready for retrieval",
    description: "Citation grounding verified; filing active for semantic search and multi-agent reasoning synthesis."
  }
];

export const INITIAL_INDEXING_RECORDS = [
  {
    id: "kb-infy-ar24",
    docName: "Infosys-Annual-Report-2023-24.pdf",
    company: "Infosys Limited",
    ticker: "INFY",
    docType: "Annual Report",
    chunkCount: 1420,
    status: "Indexed",
    lastIndexedDate: "Oct 16, 2026, 10:30 AM",
    fileSize: "18.4 MB",
    pages: 384,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-infy-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:7f92b1a8d4e902cf683a45c71b3e945f091",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "10:30:02 AM", duration: "0.8s", message: "PDF binary received (18.4 MB, 384 pages). Checksum validated." },
      { step: 2, name: "Text extracted", status: "completed", timestamp: "10:30:05 AM", duration: "3.2s", message: "OCR extracted 384 page text layers, 142 financial tables, and 88 footnotes." },
      { step: 3, name: "Document split into chunks", status: "completed", timestamp: "10:30:08 AM", duration: "2.5s", message: "Created 1,420 semantic chunks with average token count of 418." },
      { step: 4, name: "Embeddings generated", status: "completed", timestamp: "10:30:12 AM", duration: "4.1s", message: "1,420 dense vector embeddings computed with 1536 dimensions." },
      { step: 5, name: "Vectors indexed", status: "completed", timestamp: "10:30:13 AM", duration: "1.2s", message: "HNSW graph built with M=16, efConstruction=64." },
      { step: 6, name: "Document ready for retrieval", status: "completed", timestamp: "10:30:14 AM", duration: "0.3s", message: "Document verified for multi-agent semantic retrieval." }
    ]
  },
  {
    id: "kb-tcs-ar24",
    docName: "TCS-Annual-Report-2023-24.pdf",
    company: "Tata Consultancy Services",
    ticker: "TCS",
    docType: "Annual Report",
    chunkCount: 1580,
    status: "Indexed",
    lastIndexedDate: "Oct 16, 2026, 02:15 PM",
    fileSize: "22.1 MB",
    pages: 420,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-tcs-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:3a18c992ef17d45089201cb4e601249fa82",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "02:15:01 PM", duration: "1.1s", message: "Filing ingested (22.1 MB, 420 pages). Signature verified." },
      { step: 2, name: "Text extracted", status: "completed", timestamp: "02:15:06 PM", duration: "4.8s", message: "Extracted 186 tabular financial schedules and directors' report." },
      { step: 3, name: "Document split into chunks", status: "completed", timestamp: "02:15:09 PM", duration: "3.1s", message: "Generated 1,580 semantic chunks preserving tabular structures." },
      { step: 4, name: "Embeddings generated", status: "completed", timestamp: "02:15:14 PM", duration: "4.6s", message: "Calculated 1536-dim vectors with cosine normalization." },
      { step: 5, name: "Vectors indexed", status: "completed", timestamp: "02:15:15 PM", duration: "1.4s", message: "Indexed into HNSW vector graph in namespace finresearch-tcs-vectors." },
      { step: 6, name: "Document ready for retrieval", status: "completed", timestamp: "02:15:16 PM", duration: "0.2s", message: "Filing active with strict citation grounding." }
    ]
  },
  {
    id: "kb-aapl-10k24",
    docName: "Apple-10K-FY2024.pdf",
    company: "Apple Inc.",
    ticker: "AAPL",
    docType: "10-K Filing",
    chunkCount: 920,
    status: "Indexed",
    lastIndexedDate: "Oct 15, 2026, 06:00 PM",
    fileSize: "6.8 MB",
    pages: 78,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-aapl-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:91c28f7734ea01994df5621a50c822e4310",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "06:00:01 PM", duration: "0.5s", message: "SEC EDGAR Form 10-K received." },
      { step: 2, name: "Text extracted", status: "completed", timestamp: "06:00:03 PM", duration: "2.1s", message: "Extracted Items 1, 1A, 7, 8 and Notes to Consolidated Financial Statements." },
      { step: 3, name: "Document split into chunks", status: "completed", timestamp: "06:00:05 PM", duration: "1.8s", message: "Generated 920 chunks tagged with Item numbers and GAAP tags." },
      { step: 4, name: "Embeddings generated", status: "completed", timestamp: "06:00:08 PM", duration: "2.9s", message: "920 dense vectors embedded with 1536-dim OpenAI model." },
      { step: 5, name: "Vectors indexed", status: "completed", timestamp: "06:00:09 PM", duration: "0.8s", message: "Indexed into AAPL vector space." },
      { step: 6, name: "Document ready for retrieval", status: "completed", timestamp: "06:00:10 PM", duration: "0.2s", message: "Ready for forensic audit analysis and red flag scanning." }
    ]
  },
  {
    id: "kb-msft-10k24",
    docName: "Microsoft-10K-FY2024.pdf",
    company: "Microsoft Corporation",
    ticker: "MSFT",
    docType: "10-K Filing",
    chunkCount: 1140,
    status: "Indexed",
    lastIndexedDate: "Oct 15, 2026, 08:10 PM",
    fileSize: "8.2 MB",
    pages: 96,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-msft-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:56b02a9918ef013c78a011de909a32c2891",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "08:10:01 PM", duration: "0.6s", message: "SEC Form 10-K filing verified." },
      { step: 2, name: "Text extracted", status: "completed", timestamp: "08:10:04 PM", duration: "2.8s", message: "Segment disclosures and Activision Blizzard acquisition notes parsed." },
      { step: 3, name: "Document split into chunks", status: "completed", timestamp: "08:10:07 PM", duration: "2.4s", message: "Divided into 1,140 semantic chunks." },
      { step: 4, name: "Embeddings generated", status: "completed", timestamp: "08:10:11 PM", duration: "3.7s", message: "Computed 1536-dim embeddings for Intelligent Cloud & CapEx sections." },
      { step: 5, name: "Vectors indexed", status: "completed", timestamp: "08:10:12 PM", duration: "1.1s", message: "Vector graph indexing complete." },
      { step: 6, name: "Document ready for retrieval", status: "completed", timestamp: "08:10:13 PM", duration: "0.2s", message: "Available for multi-agent CapEx ROI queries." }
    ]
  },
  {
    id: "kb-tcs-fs24",
    docName: "TCS-Audited-Financial-Statements-FY24.pdf",
    company: "Tata Consultancy Services",
    ticker: "TCS",
    docType: "Financial Statement",
    chunkCount: 430,
    status: "Indexed",
    lastIndexedDate: "Oct 14, 2026, 09:40 AM",
    fileSize: "4.5 MB",
    pages: 56,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-tcs-fs-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:1082cba99420fd7810398ef918a3857ca21",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "09:40:01 AM", duration: "0.4s", message: "Audited statement schedules ingested." },
      { step: 2, name: "Text extracted", status: "completed", timestamp: "09:40:03 AM", duration: "1.9s", message: "Parsed 56 table coordinate grids." },
      { step: 3, name: "Document split into chunks", status: "completed", timestamp: "09:40:05 AM", duration: "1.4s", message: "Generated 430 financial statement chunks." },
      { step: 4, name: "Embeddings generated", status: "completed", timestamp: "09:40:08 AM", duration: "2.1s", message: "1536-dim vectors computed." },
      { step: 5, name: "Vectors indexed", status: "completed", timestamp: "09:40:09 AM", duration: "0.9s", message: "HNSW index generated." },
      { step: 6, name: "Document ready for retrieval", status: "completed", timestamp: "09:40:10 AM", duration: "0.1s", message: "Ready for line item ratio queries." }
    ]
  },
  {
    id: "kb-infy-transcript-q125",
    docName: "Infosys-Q1-FY25-Earnings-Transcript.pdf",
    company: "Infosys Limited",
    ticker: "INFY",
    docType: "Earnings Transcript",
    chunkCount: 240,
    status: "Indexed",
    lastIndexedDate: "Oct 15, 2026, 04:20 PM",
    fileSize: "2.4 MB",
    pages: 32,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-infy-transcript-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:bb7291a0c492198421098feea981273948b",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "04:20:01 PM", duration: "0.3s", message: "Earnings conference call transcript ingested." },
      { step: 2, name: "Text extracted", status: "completed", timestamp: "04:20:03 PM", duration: "1.2s", message: "Speaker diarization and Q&A dialogs separated." },
      { step: 3, name: "Document split into chunks", status: "completed", timestamp: "04:20:04 PM", duration: "0.9s", message: "240 conversational chunks structured." },
      { step: 4, name: "Embeddings generated", status: "completed", timestamp: "04:20:06 PM", duration: "1.5s", message: "Dense vectors generated." },
      { step: 5, name: "Vectors indexed", status: "completed", timestamp: "04:20:07 PM", duration: "0.6s", message: "Indexed into vector store." },
      { step: 6, name: "Document ready for retrieval", status: "completed", timestamp: "04:20:08 PM", duration: "0.1s", message: "Ready for qualitative sentiment queries." }
    ]
  },
  {
    id: "kb-goog-10q24",
    docName: "Alphabet-Form-10Q-Q3-2024.pdf",
    company: "Alphabet Inc.",
    ticker: "GOOGL",
    docType: "10-K Filing",
    chunkCount: 380,
    status: "Processing",
    lastIndexedDate: "Oct 17, 2026, 09:10 AM",
    fileSize: "5.1 MB",
    pages: 64,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-googl-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:e821fa093c4129849204bc9123891048b29",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "09:10:01 AM", duration: "0.4s", message: "SEC Form 10-Q validated." },
      { step: 2, name: "Text extracted", status: "completed", timestamp: "09:10:04 AM", duration: "2.3s", message: "Google Cloud and Google Services revenue schedules extracted." },
      { step: 3, name: "Document split into chunks", status: "completed", timestamp: "09:10:06 AM", duration: "1.6s", message: "380 chunks generated." },
      { step: 4, name: "Embeddings generated", status: "in-progress", timestamp: "09:10:08 AM", duration: "Active", message: "Computing 1536-dimensional embeddings (240 / 380 vectors complete)..." },
      { step: 5, name: "Vectors indexed", status: "pending", timestamp: "--", duration: "--", message: "Awaiting embedding completion." },
      { step: 6, name: "Document ready for retrieval", status: "pending", timestamp: "--", duration: "--", message: "Awaiting index graph build." }
    ]
  },
  {
    id: "kb-amzn-10k24",
    docName: "Amazon-Form-10K-FY2024.pdf",
    company: "Amazon.com Inc.",
    ticker: "AMZN",
    docType: "10-K Filing",
    chunkCount: 0,
    status: "Pending",
    lastIndexedDate: "Oct 17, 2026, 09:12 AM",
    fileSize: "9.4 MB",
    pages: 110,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-amzn-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:4c89ab01de23ff5018a992bc44e11234567",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "09:12:01 AM", duration: "0.7s", message: "Filing payload queued in ingestion pipeline buffer." },
      { step: 2, name: "Text extracted", status: "pending", timestamp: "--", duration: "--", message: "Queued for OCR processing." },
      { step: 3, name: "Document split into chunks", status: "pending", timestamp: "--", duration: "--", message: "Queued for token chunking." },
      { step: 4, name: "Embeddings generated", status: "pending", timestamp: "--", duration: "--", message: "Queued for embedding generation." },
      { step: 5, name: "Vectors indexed", status: "pending", timestamp: "--", duration: "--", message: "Queued for vector indexing." },
      { step: 6, name: "Document ready for retrieval", status: "pending", timestamp: "--", duration: "--", message: "Queued." }
    ]
  },
  {
    id: "kb-meta-10q24",
    docName: "Meta-Platforms-10Q-Q2-2024.pdf",
    company: "Meta Platforms Inc.",
    ticker: "META",
    docType: "10-K Filing",
    chunkCount: 0,
    status: "Failed",
    lastIndexedDate: "Oct 17, 2026, 08:45 AM",
    fileSize: "7.1 MB",
    pages: 82,
    embeddingModel: "text-embedding-3-small (1536-dim)",
    vectorNamespace: "finresearch-meta-vectors",
    chunkingStrategy: "RecursiveTokenChunker (chunk_size=512, overlap=64)",
    checksum: "sha256:f12a809bcae7102948c5b3e21098a543210",
    errorMessage: "OCR Glyph Parsing Exception: Corrupted TrueType font table encountered in Note 12 (Commitments and Contingencies) on Page 42. Embedding generation halted.",
    workflow: [
      { step: 1, name: "Document received", status: "completed", timestamp: "08:45:01 AM", duration: "0.5s", message: "Binary PDF validated." },
      { step: 2, name: "Text extracted", status: "failed", timestamp: "08:45:04 AM", duration: "Failed", message: "OCR Glyph Exception on Page 42: Corrupted TrueType font table in Note 12." },
      { step: 3, name: "Document split into chunks", status: "pending", timestamp: "--", duration: "--", message: "Halted due to OCR extraction failure." },
      { step: 4, name: "Embeddings generated", status: "pending", timestamp: "--", duration: "--", message: "Halted." },
      { step: 5, name: "Vectors indexed", status: "pending", timestamp: "--", duration: "--", message: "Halted." },
      { step: 6, name: "Document ready for retrieval", status: "pending", timestamp: "--", duration: "--", message: "Halted." }
    ]
  }
];

export const MOCK_RETRIEVAL_PASSAGES = [
  {
    id: "ret-1",
    queryKeywords: ["margin", "ebit", "operating margin", "variance", "infosys", "tcs"],
    docName: "Infosys-Annual-Report-2023-24.pdf",
    company: "Infosys Limited",
    ticker: "INFY",
    page: 112,
    section: "Consolidated Statement of Profit and Loss",
    relevanceScore: 0.942,
    relevanceTier: "High Match (94.2%)",
    tokens: 432,
    content: "Revenue from operations for the year ended March 31, 2024 stood at ₹153,670 crore, compared to ₹146,767 crore in the previous year, registering a growth of 4.7% (1.4% in constant currency terms). Operating profit was ₹31,861 crore as against ₹30,905 crore in the prior year, yielding an operating margin of 20.7% compared to 21.0% in FY23. Net profit attributable to owners was ₹26,233 crore, reflecting growth of 8.9%."
  },
  {
    id: "ret-2",
    queryKeywords: ["margin", "ebit", "tcs", "operating margin", "variance", "infosys"],
    docName: "TCS-Annual-Report-2023-24.pdf",
    company: "Tata Consultancy Services",
    ticker: "TCS",
    page: 94,
    section: "Consolidated Statement of Profit and Loss",
    relevanceScore: 0.938,
    relevanceTier: "High Match (93.8%)",
    tokens: 412,
    content: "Consolidated revenue from operations increased to ₹240,893 crore ($29.08B), representing an expansion of 6.8% YoY (3.4% in constant currency terms). Operating margin for the full year reached 24.6%, expanding 50 basis points over the prior fiscal year, supported by productivity gains and pyramid optimization. Profit after tax reached ₹46,585 crore, up 10.5% YoY, representing a net margin of 19.3%."
  },
  {
    id: "ret-3",
    queryKeywords: ["deal", "tcv", "order book", "signings", "contract"],
    docName: "TCS-Annual-Report-2023-24.pdf",
    company: "Tata Consultancy Services",
    ticker: "TCS",
    page: 45,
    section: "Management Discussion - Order Book TCV",
    relevanceScore: 0.912,
    relevanceTier: "High Match (91.2%)",
    tokens: 384,
    content: "Record annual order book Total Contract Value (TCV) closed at an all-time high of $42.7 billion with broad-based wins across North America, the UK, and continental European transformation accounts. Q4 TCV alone reached $13.2 billion."
  },
  {
    id: "ret-4",
    queryKeywords: ["deal", "tcv", "infosys", "large deal", "pipeline"],
    docName: "Infosys-Annual-Report-2023-24.pdf",
    company: "Infosys Limited",
    ticker: "INFY",
    page: 87,
    section: "Segment Performance & Deal Velocity",
    relevanceScore: 0.904,
    relevanceTier: "High Match (90.4%)",
    tokens: 396,
    content: "Total contract value (TCV) of large deal signings reached an all-time record of $17.7 billion in FY24, with net new deals constituting 52% of total signings, underscoring enduring client trust in our Cobalt and Topaz generative AI platforms."
  },
  {
    id: "ret-5",
    queryKeywords: ["tax", "red flag", "apple", "state aid", "cjeu", "ireland", "fine"],
    docName: "Apple-10K-FY2024.pdf",
    company: "Apple Inc.",
    ticker: "AAPL",
    page: 61,
    section: "Note 5 - Income Taxes",
    relevanceScore: 0.951,
    relevanceTier: "High Match (95.1%)",
    tokens: 420,
    content: "During the fourth quarter of 2024, the Company recorded a one-time income tax charge of $10.2 billion associated with the CJEU judgment in the European State Aid case. This non-operating tax expense increased the effective tax rate for FY24 to 24.1% compared to 14.7% in FY23."
  },
  {
    id: "ret-6",
    queryKeywords: ["china", "greater china", "apple", "revenue decline", "hardware"],
    docName: "Apple-10K-FY2024.pdf",
    company: "Apple Inc.",
    ticker: "AAPL",
    page: 34,
    section: "Item 7 - Segment Net Sales by Geographic Region",
    relevanceScore: 0.923,
    relevanceTier: "High Match (92.3%)",
    tokens: 410,
    content: "Greater China net sales decreased 8% during 2024 compared to 2023, falling from $72.56 billion to $66.95 billion, primarily due to lower net sales of iPhone and foreign currency headwinds against the U.S. dollar."
  },
  {
    id: "ret-7",
    queryKeywords: ["capex", "capital expenditures", "microsoft", "azure", "cloud", "ai", "gpu"],
    docName: "Microsoft-10K-FY2024.pdf",
    company: "Microsoft Corporation",
    ticker: "MSFT",
    page: 43,
    section: "Liquidity and Capital Resources - CapEx",
    relevanceScore: 0.935,
    relevanceTier: "High Match (93.5%)",
    tokens: 440,
    content: "Capital expenditures including assets acquired under finance leases were $55.7 billion, compared to $31.9 billion in FY 2023. Cash paid for property and equipment was $44.5 billion. These investments are driven by cloud and AI demand, primarily for data centers, compute infrastructure, and networking hardware required to train and serve frontier generative AI models across our commercial cloud."
  },
  {
    id: "ret-8",
    queryKeywords: ["intelligent cloud", "azure", "microsoft", "copilot", "cloud revenue"],
    docName: "Microsoft-10K-FY2024.pdf",
    company: "Microsoft Corporation",
    ticker: "MSFT",
    page: 40,
    section: "Item 7 - Segment Results of Operations",
    relevanceScore: 0.928,
    relevanceTier: "High Match (92.8%)",
    tokens: 415,
    content: "Intelligent Cloud revenue increased $17.4 billion or 20% to $105.4 billion, driven by Azure and other cloud services growth of 30%. Azure growth included approximately 800 basis points of contribution from artificial intelligence services."
  },
  {
    id: "ret-9",
    queryKeywords: ["subcontractor", "pyramid", "employee cost", "margin drag", "offshore"],
    docName: "Infosys-Annual-Report-2023-24.pdf",
    company: "Infosys Limited",
    ticker: "INFY",
    page: 129,
    section: "Note 21 - Operating Expenses",
    relevanceScore: 0.887,
    relevanceTier: "Strong Match (88.7%)",
    tokens: 360,
    content: "Technical sub-contractor expenses for the year ended March 31, 2024 were ₹14,562 Cr (9.5% of revenue) versus ₹15,920 Cr (10.8% of revenue). Subcontractor outlays continued to be disciplined through internal project rotation and offshore delivery substitution."
  },
  {
    id: "ret-10",
    queryKeywords: ["subcontractor", "tcs", "employee benefit", "cost structure"],
    docName: "TCS-Audited-Financial-Statements-FY24.pdf",
    company: "Tata Consultancy Services",
    ticker: "TCS",
    page: 8,
    section: "Consolidated Statement of Profit and Loss - Schedule",
    relevanceScore: 0.882,
    relevanceTier: "Strong Match (88.2%)",
    tokens: 375,
    content: "Employee benefit expenses stood at ₹133,456 crore (55.4% of total revenue) compared to ₹127,522 crore in FY23. Fees to external consultants and sub-contractors accounted for 8.0% of revenue, demonstrating superior in-house pyramid utilization."
  }
];

export const SAMPLE_QUERIES = [
  "Compare operating margin and deal TCV for Infosys and TCS in FY24",
  "What financial red flags or tax charges were disclosed in Apple's FY24 Form 10-K?",
  "Analyze Microsoft's $55.7B CapEx spending and Azure AI monetization",
  "Technical subcontractor expenses and pyramid margin drag",
  "Greater China market revenue contraction and foreign currency headwinds"
];

const KB_STORAGE_KEY = "finresearch_kb_records_v3";

export function getStoredIndexingRecords() {
  try {
    const raw = localStorage.getItem(KB_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load KB records from storage:", e);
  }
  return [];
}

export function saveStoredIndexingRecords(records) {
  try {
    localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn("Failed to save KB records to storage:", e);
  }
}
