import React from "react";
import {
  X,
  FileText,
  Building2,
  Database,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from "lucide-react";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

export default function DocumentIndexingDrawer({
  isOpen,
  onClose,
  record,
  onOpenWorkflow,
  onOpenRetrieval,
  onRetryIndexing
}) {
  if (!isOpen || !record) return null;

  const isFailed = record.status === "Failed";
  const isProcessing = record.status === "Processing";
  const isPending = record.status === "Pending";
  const isIndexed = record.status === "Indexed";

  return (
    <div className="fin-drawer-container">
      <div
        className="fin-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fin-drawer-panel animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-5 border-b border-subtle flex-row justify-between items-start">
          <div className="flex-row items-start gap-3">
            <div className="p-2.5 rounded-lg bg-accent/15 text-accent shrink-0 mt-0.5">
              <Database size={22} />
            </div>
            <div>
              <div className="flex-row items-center gap-2">
                <span className="eyebrow text-accent font-mono text-[10px]">
                  INDEXING METADATA DRAWER
                </span>
                <Badge
                  variant={
                    isIndexed
                      ? "success"
                      : isFailed
                      ? "danger"
                      : isProcessing
                      ? "warning"
                      : "default"
                  }
                  size="xs"
                  dot
                >
                  {record.status}
                </Badge>
              </div>
              <h2 className="text-base font-bold text-main mt-0.5 truncate max-w-sm" title={record.docName}>
                {record.docName}
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {record.company} ({record.ticker}) • {record.docType}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 text-muted hover:text-main rounded-md hover:bg-hover transition-colors"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Failure Alert Banner (if Failed) */}
          {isFailed && (
            <div className="p-4 border rounded-lg bg-danger/10 border-danger/30 space-y-2 animate-fadeIn">
              <div className="flex-row items-center gap-2 text-danger font-bold text-xs">
                <AlertTriangle size={15} />
                <span>Indexing Pipeline Halted</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {record.errorMessage ||
                  "OCR Glyph Parsing Exception on Page 42. Vector chunking stopped to preserve zero-hallucination grounding."}
              </p>
              <div className="pt-1">
                <Button
                  variant="danger"
                  size="xs"
                  icon={RefreshCw}
                  onClick={() => onRetryIndexing && onRetryIndexing(record.id)}
                >
                  Retry Indexing from Stage 2
                </Button>
              </div>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 border rounded-lg bg-card-subtle">
              <span className="text-[11px] text-muted block">Chunk Count</span>
              <strong className="text-lg font-bold font-mono text-accent block mt-0.5">
                {record.chunkCount > 0 ? record.chunkCount.toLocaleString() : "--"}
              </strong>
              <span className="text-[10px] text-dim">Vectors</span>
            </div>

            <div className="p-3 border rounded-lg bg-card-subtle">
              <span className="text-[11px] text-muted block">Page Length</span>
              <strong className="text-lg font-bold font-mono text-main block mt-0.5">
                {record.pages || 0}
              </strong>
              <span className="text-[10px] text-dim">Audited Pages</span>
            </div>

            <div className="p-3 border rounded-lg bg-card-subtle">
              <span className="text-[11px] text-muted block">File Size</span>
              <strong className="text-lg font-bold font-mono text-main block mt-0.5">
                {record.fileSize || "N/A"}
              </strong>
              <span className="text-[10px] text-dim">Binary Size</span>
            </div>
          </div>

          {/* Token Chunking Parameters */}
          <div className="p-4 border rounded-lg bg-card-subtle space-y-2.5">
            <div className="flex-row items-center justify-between pb-2 border-b border-subtle">
              <div className="flex-row items-center gap-2">
                <Layers size={14} className="text-accent" />
                <span className="text-xs font-bold text-main">Semantic Token Chunking</span>
              </div>
              <span className="text-[10px] font-mono text-muted">Fixed-Window Recursive</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex-row justify-between py-1 border-b border-subtle">
                <span className="text-muted">Chunking Strategy:</span>
                <span className="font-mono text-main">{record.chunkingStrategy || "RecursiveTokenChunker"}</span>
              </div>
              <div className="flex-row justify-between py-1 border-b border-subtle">
                <span className="text-muted">Target Chunk Size:</span>
                <span className="font-mono text-main">512 tokens (~2,048 chars)</span>
              </div>
              <div className="flex-row justify-between py-1 border-b border-subtle">
                <span className="text-muted">Chunk Overlap Window:</span>
                <span className="font-mono text-main">64 tokens (12.5% overlap)</span>
              </div>
              <div className="flex-row justify-between py-1 border-b border-subtle">
                <span className="text-muted">Tokenizer Engine:</span>
                <span className="font-mono text-main">cl100k_base (Byte Pair Encoding)</span>
              </div>
              <div className="flex-row justify-between py-1">
                <span className="text-muted">Table Cell Preservation:</span>
                <span className="text-success font-semibold flex-row items-center gap-1">
                  <CheckCircle2 size={12} /> Active (Coordinate Grid Mode)
                </span>
              </div>
            </div>
          </div>

          {/* Embeddings & Vector Index Configuration */}
          <div className="p-4 border rounded-lg bg-card-subtle space-y-2.5">
            <div className="flex-row items-center justify-between pb-2 border-b border-subtle">
              <div className="flex-row items-center gap-2">
                <Cpu size={14} className="text-accent" />
                <span className="text-xs font-bold text-main">Vector Space & Embeddings</span>
              </div>
              <Badge variant="teal" size="xs">1536-Dimensional</Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex-row justify-between py-1 border-b border-subtle">
                <span className="text-muted">Embedding Model:</span>
                <span className="font-mono text-main">{record.embeddingModel || "text-embedding-3-small"}</span>
              </div>
              <div className="flex-row justify-between py-1 border-b border-subtle">
                <span className="text-muted">Vector Dimensions:</span>
                <span className="font-mono text-main">1,536 floating-point values</span>
              </div>
              <div className="flex-row justify-between py-1 border-b border-subtle">
                <span className="text-muted">Vector Index Topology:</span>
                <span className="font-mono text-main">HNSW (Hierarchical Navigable Small World)</span>
              </div>
              <div className="flex-row justify-between py-1 border-b border-subtle">
                <span className="text-muted">Distance Metric:</span>
                <span className="font-mono text-accent font-bold">Cosine Similarity (Normalized L2)</span>
              </div>
              <div className="flex-row justify-between py-1">
                <span className="text-muted">Vector Namespace:</span>
                <span className="font-mono text-dim text-[11px] truncate max-w-[200px]" title={record.vectorNamespace}>
                  {record.vectorNamespace || `finresearch-${record.ticker?.toLowerCase()}-vectors`}
                </span>
              </div>
            </div>
          </div>

          {/* Verification & Security Grounding */}
          <div className="p-4 border rounded-lg bg-card-subtle space-y-2">
            <div className="flex-row items-center gap-2 text-xs font-bold text-main">
              <ShieldCheck size={14} className="text-teal" />
              <span>Institutional Citation Grounding</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Every vector chunk retains precise document metadata including page coordinates, table IDs, and section tags. The multi-agent reasoning system refuses to synthesize claims without an exact matching vector citation.
            </p>
            <div className="text-[11px] font-mono text-dim pt-1 truncate" title={record.checksum}>
              Checksum: {record.checksum || "sha256:verified"}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-subtle bg-card-subtle flex-row justify-between items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>

          <div className="flex-row items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Search}
              onClick={() => {
                onClose();
                if (onOpenRetrieval) onOpenRetrieval(record);
              }}
            >
              Test Retrieval
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => {
                onClose();
                if (onOpenWorkflow) onOpenWorkflow(record);
              }}
            >
              Visual Workflow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
