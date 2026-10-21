# FinResearch AI — Multi-Agent Financial Research System

FinResearch AI is an institutional-grade, multi-agent financial research workspace designed for financial analysts, equity researchers, and forensic accountants. The platform automates the extraction, verification, benchmarking, and dossier reporting of audited corporate filings (SEC Form 10-K, 10-Q, and annual reports).

Unlike generic AI chatbot dashboards, FinResearch AI enforces **strict document grounding**, **verifiable page-level citations**, and **audited GAAP/IFRS disclosures**, eliminating fabricated metrics and hallucinated ratings.

---

## 🏛 Six-Agent Autonomous Architecture

The system coordinates six specialized financial intelligence agents:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INGESTED CORPORATE FILINGS                      │
│                  (Form 10-K, Annual Reports, Transcripts)              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 1. DOCUMENT AGENT                                                      │
│    • Ingestion, table extraction, recursive semantic token chunking    │
│    • Vector embedding (1536-dim) & HNSW retrieval index                │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │                                          │
               ▼                                          ▼
┌───────────────────────────────┐          ┌─────────────────────────────┐
│ 2. EXTRACTION AGENT           │          │ 3. RED FLAG AGENT           │
│    • GAAP / IFRS line items   │          │    • Forensic risk scans    │
│    • Operating margin & PAT   │          │    • Segment revenue drags  │
│    • FCF & cash conversion    │          │    • One-off tax liabilities│
└──────────────┬────────────────┘          └──────────────┬──────────────┘
               │                                          │
               └────────────────────┬─────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. COMPARISON AGENT                                                    │
│    • Cross-company benchmarking & EBIT spread decomposition            │
│    • Capital efficiency (ROE, ROA) and offshore utilization            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. RESEARCH AGENT (Conversational Analytical Engine)                   │
│    • Multi-step step-by-step reasoning chains with passage anchors     │
│    • On-demand citation verification against original statement pages   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 6. REPORT AGENT                                                        │
│    • Publication-ready institutional research dossiers                 │
│    • Executive summaries, audit opinions, and vector-backed PDF export │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Core Application Modules

### 1. Dashboard (`/`)
- Unified executive overview displaying live counts for active workspaces, ingested filings, and analyzed entities.
- Consolidated filings table displaying file size, upload dates, chunk counts, and real-time processing statuses.
- Factual statistics without vanity progress bars or unverified scores.

### 2. Research Sessions (`/sessions`)
- Entity-specific workspaces grouping target companies (e.g., *Infosys vs TCS Peer Benchmarking*, *Apple 10-K Forensic Audit*, *Microsoft Cloud CapEx*).
- Advanced multi-filter controls (Company, Status, Date) and session creation/duplication.
- Synchronized workspace state that sets the target context across all analytical views.

### 3. Financial Documents Library (`/documents`)
- **Document Lifecycle Tracking:** Differentiates between `Uploaded`, `Parsing`, `Chunking`, `Indexing`, and `Ready`.
- **Sub-Views:** Filing Library table/grid view, multi-file upload zone, and vector search similarity sandbox.
- **Deduplicated Storage:** Unified client-side document store synced with research sessions.

### 4. AI Research (`/research`)
- **Interactive Financial Querying:** Central conversational canvas designed for complex financial inquiries.
- **Collapsible Context & Sources Drawer:** Dynamic scope selector showing active documents for the selected research session.
- **Passage-Level Citations:** Clickable source badges opening the original document page, section name, and verbatim excerpt.
- **Shortcut Prompts:** Pre-configured analytical queries covering revenue slowdowns, legal contingencies, debt structures, and peer margins.

### 5. Financial Analysis (`/analysis`)
- **Key Financial Metrics & Sparklines:** Revenue growth, operating margins (EBIT), net profit (PAT), and free cash flow conversion.
- **Balance Sheet & Solvency Profile:** Capital structure overview displaying real reported debt, cash reserves, and current ratios without fabricated health scores.
- **Extracted Ratio Performance Matrix:** Direct side-by-side comparison with industry benchmarks and document citations.

### 6. Reports (`/reports`)
- Comprehensive analyst dossiers complete with executive summaries, P&L schedules, red flag registers, and auditor opinions.
- **Native Print & PDF Export:** Formatted for clean printing with customizable sections and evaluation disclaimer banners.
- Management options: Rename, duplicate, re-generate, and delete reports.

### 7. System & Agents (`/settings`)
- In-browser multi-agent pipeline simulation and telemetry monitoring.
- Interactive workflow diagrams illustrating data handoffs between all 6 specialized agents.
- Error state simulation tools (e.g., testing Red Flag Agent failure and diagnostic reporting).

---

## 🛠 Technology Stack

- **Core Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vite.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling Architecture:** Vanilla CSS with custom CSS design tokens (responsive dark/light theme, institutional palette, tabular numerals).

---

## 📁 Project Structure

```
Finanical-Research/
├── index.html                     # HTML entry point with Inter & Outfit webfonts
├── package.json                   # Project dependencies and npm scripts
├── vite.config.js                 # Vite configuration with React plugin
├── src/
│   ├── App.jsx                    # Root application shell, state management & routing
│   ├── index.css                  # Core design tokens, typography, and utility classes
│   ├── main.jsx                   # React DOM entry point
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Header.jsx             # Top bar with company focus selector and theme toggle
│   │   ├── Sidebar.jsx            # 7-item navigation sidebar with collapse support
│   │   ├── CitationModal.jsx      # Slide-out citation verification modal
│   │   ├── DocumentViewer.jsx     # Document excerpt and statement inspector
│   │   ├── UploadDocumentModal.jsx# Lightweight filing upload dialog
│   │   ├── CreateSessionModal.jsx # New research workspace wizard
│   │   │
│   │   ├── chat/                  # AI Research conversation components
│   │   │   ├── ChatInputBar.jsx
│   │   │   ├── ChatMessageItem.jsx
│   │   │   ├── ContextSourcesPanel.jsx
│   │   │   └── CitationDetailsModal.jsx
│   │   │
│   │   ├── orchestration/         # Multi-agent system diagnostic views
│   │   │   ├── AgentOverviewGrid.jsx
│   │   │   ├── WorkflowDiagram.jsx
│   │   │   ├── ExecutionDetailsView.jsx
│   │   │   └── ActivityTimelineFeed.jsx
│   │   │
│   │   ├── report/                # Dossier and reporting components
│   │   │   ├── ReportsLibrary.jsx
│   │   │   ├── ReportPreview.jsx
│   │   │   ├── ReportConfigModal.jsx
│   │   │   ├── PdfExportModal.jsx
│   │   │   └── DeleteConfirmModal.jsx
│   │   │
│   │   └── ui/                    # Base design system primitives
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Badge.jsx
│   │       ├── Table.jsx
│   │       ├── Dialog.jsx
│   │       └── EmptyState.jsx
│   │
│   ├── data/                      # Data models, seed files & storage services
│   │   ├── documentData.js        # Seed filings, lifecycle stages, and storage helpers
│   │   ├── seedData.js            # Extracted financial metrics, red flags, and benchmarks
│   │   ├── researchChatData.js    # Grounded reasoning questions, citations, and history
│   │   ├── reportData.js          # Dossier templates and structured report generator
│   │   └── orchestrationData.js   # 6-agent specifications and telemetry presets
│   │
│   └── pages/                     # Primary module page views
│       ├── Dashboard.jsx
│       ├── WorkspaceDirectory.jsx
│       ├── SessionDetails.jsx
│       ├── CreateSession.jsx
│       ├── DocumentLibrary.jsx
│       ├── UploadDocument.jsx
│       ├── DocumentDetails.jsx
│       ├── KnowledgeBase.jsx
│       ├── ConversationalResearch.jsx
│       ├── ResearchWorkspace.jsx
│       ├── ReportView.jsx
│       └── OrchestrationView.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher)

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/bhavanidunna2011-hub/Finanical-Research.git
   cd Finanical-Research
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5174/` (or your assigned port).

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build locally:
   ```bash
   npm run preview
   ```

---

## 🛡 Financial Data Integrity Standard

FinResearch AI adheres to financial compliance and audit standards:

1. **Strict Lineage:** Every displayed financial metric links to its source document, fiscal year, statement schedule, and page number.
2. **Fact vs. Model Interpretation:** Statutory GAAP/IFRS figures are clearly distinguished from AI-synthesized risk observations and peer variances.
3. **Transparent Simulation:** In-browser pipeline orchestration, latency benchmarks, and sample outputs are explicitly labeled as demonstration environments.
4. **No Hallucinated Ratings:** Unsupported scores (such as synthetic "AAA Equivalent" credit ratings or arbitrary health percentages) are barred in favor of factual balance sheet ratios.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

*Disclaimer: FinResearch AI is an analytical research workspace designed for financial research and evaluation purposes. Information extracted by the system should be verified against official statutory regulatory filings before making investment or credit decisions.*
