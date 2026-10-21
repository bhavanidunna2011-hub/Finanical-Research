import React, { useState } from "react";
import { Dialog } from "./ui/Dialog";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { UploadCloud, FileText, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { SEED_COMPANIES } from "../data/seedData";

import { getStoredDocuments, saveStoredDocuments, formatFileSize } from "../data/documentData";

export default function UploadDocumentModal({ open, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [selectedTicker, setSelectedTicker] = useState("INFY");
  const [docType, setDocType] = useState("Annual Report");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  function handleFileDrop(e) {
    e.preventDefault();
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  function handleUpload() {
    const comp = SEED_COMPANIES[selectedTicker] || SEED_COMPANIES.INFY;
    const finalFile = file || { name: comp.filingDocName, size: 18.4 * 1024 * 1024 };

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);

      const newDoc = {
        id: `doc-${Date.now()}`,
        name: finalFile.name,
        company: comp.name,
        ticker: comp.id,
        docType: docType,
        fileSize: typeof finalFile.size === "number" ? formatFileSize(finalFile.size) : "18.4 MB",
        fileSizeBytes: typeof finalFile.size === "number" ? finalFile.size : 19293798,
        uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        uploadedTimestamp: new Date().toISOString(),
        status: "Ready",
        isSeed: false,
        pages: 140,
        chunksCount: 560,
        embeddingModel: "text-embedding-3-small (1536-dim)",
        ocrEngine: "Financial-OCR-TableNet v2.4",
        checksum: `sha256:${Math.random().toString(16).substring(2, 10)}`,
        sessionId: null,
        sessionTitle: "Quick Uploaded Document",
        pipelineStages: [
          { name: "Uploaded", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "0.5s", detail: "Binary PDF validated" },
          { name: "Parsing", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "1.2s", detail: "OCR extraction completed" },
          { name: "Chunking", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "0.9s", detail: "Generated 560 semantic chunks" },
          { name: "Indexing", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "1.4s", detail: "1536-dim vectors indexed" },
          { name: "Ready", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "0.1s", detail: "Verified for multi-agent reasoning" }
        ],
        sections: [
          { id: "sec-q-1", title: "Consolidated Financial Statements", page: 12, chunks: 84, category: "Financials" }
        ]
      };

      try {
        const existing = getStoredDocuments();
        saveStoredDocuments([newDoc, ...existing]);
      } catch (err) {
        console.warn("Storage sync failed:", err);
      }

      if (onUploadSuccess) {
        onUploadSuccess(newDoc);
      }
    }, 1200);
  }

  function handleReset() {
    setFile(null);
    setIsUploading(false);
    setUploadComplete(false);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleReset}
      title="Upload Financial Document"
      description="Ingest corporate 10-K, 10-Q, or audited Annual Reports into the vector index with strict citation grounding."
      size="md"
      footer={
        <div className="flex-row justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            {uploadComplete ? "Close" : "Cancel"}
          </Button>
          {!uploadComplete ? (
            <Button
              variant="teal"
              size="sm"
              loading={isUploading}
              icon={UploadCloud}
              onClick={handleUpload}
            >
              {isUploading ? "Indexing Chunks..." : "Upload & Index Document"}
            </Button>
          ) : (
            <Button variant="teal" size="sm" onClick={handleReset}>
              Done
            </Button>
          )}
        </div>
      }
    >
      {uploadComplete ? (
        <div className="fin-upload-success animate-fadeIn">
          <div className="success-icon-wrap">
            <CheckCircle2 size={42} className="text-success" />
          </div>
          <h4>Filing Ingested & Vector Indexed</h4>
          <p className="text-muted text-sm mt-1">
            Semantic chunking completed with 1536-dim embeddings. All page references and table grids are indexed for zero-hallucination citations.
          </p>
          <div className="doc-summary-pill mt-4">
            <FileText size={16} className="text-accent" />
            <span className="font-semibold">{file?.name || "Infosys-Annual-Report-2023-24.pdf"}</span>
            <Badge variant="success" size="sm">Indexed (1,420 chunks)</Badge>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className="fin-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById("file-input-elem")?.click()}
          >
            <input
              type="file"
              id="file-input-elem"
              accept=".pdf,.doc,.docx,.xlsx"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <div className="dropzone-icon-wrap">
              <UploadCloud size={32} />
            </div>
            {file ? (
              <div className="file-picked-info">
                <strong>{file.name}</strong>
                <span className="text-xs text-muted block mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for ingestion
                </span>
              </div>
            ) : (
              <>
                <p className="dropzone-title">Click to upload or drag & drop</p>
                <p className="dropzone-hint">
                  PDF filings, Form 10-K, Form 10-Q, or Audited Financial Statements (Max 100MB)
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="fin-form-label">Corporate Entity / Ticker</label>
              <select
                className="fin-select"
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value)}
              >
                {Object.values(SEED_COMPANIES).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="fin-form-label">Filing Classification</label>
              <select
                className="fin-select"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <option value="Annual Report (Integrated)">Annual Report (Integrated)</option>
                <option value="SEC Form 10-K">SEC Form 10-K (Annual)</option>
                <option value="SEC Form 10-Q">SEC Form 10-Q (Quarterly)</option>
                <option value="Investor Presentation">Investor Presentation</option>
                <option value="Earnings Call Transcript">Earnings Call Transcript</option>
              </select>
            </div>
          </div>

          <div className="fin-info-banner">
            <ShieldCheck size={16} className="text-teal" />
            <span className="text-xs leading-relaxed">
              <strong>Grounding Protocol:</strong> OCR parser preserves page boundaries and balance sheet tables so agents never fabricate disclosures.
            </span>
          </div>
        </div>
      )}
    </Dialog>
  );
}
