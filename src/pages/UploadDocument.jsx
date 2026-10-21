import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  Eye,
  ArrowLeft,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  Info,
  Clock,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { SEED_COMPANIES } from "../data/seedData";
import { DOCUMENT_TYPES, formatFileSize } from "../data/documentData";
import DocumentViewer from "../components/DocumentViewer";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export default function UploadDocument({
  sessions = [],
  activeSession,
  onUploadSuccess,
  onCancel,
  onViewDetails
}) {
  const [file, setFile] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Form Fields
  const [selectedTicker, setSelectedTicker] = useState("INFY");
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [docType, setDocType] = useState("Annual Report");
  const [selectedSessionId, setSelectedSessionId] = useState(activeSession?.id || (sessions[0]?.id || ""));
  const [simulateError, setSimulateError] = useState(false);

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [simulationFailed, setSimulationFailed] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const fileInputRef = useRef(null);

  const stages = [
    { name: "Uploaded", label: "Reading PDF binary & checksum verification" },
    { name: "Parsing", label: "Financial OCR & balance sheet table extraction" },
    { name: "Chunking", label: "Semantic token chunking (400 tokens / 15% overlap)" },
    { name: "Indexing", label: "1536-dimensional vector embedding & HNSW index" },
    { name: "Ready", label: "Grounded & verified for multi-agent reasoning" }
  ];

  // Clean up object URLs on unmount or file reset
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  function validateFile(selectedFile) {
    if (!selectedFile) return false;

    // Check file type
    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setValidationError("Invalid file type. Only PDF documents (.pdf) are supported for financial parsing.");
      setFile(null);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
      return false;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setValidationError(
        `File size (${formatFileSize(selectedFile.size)}) exceeds the 50 MB limit. Please select an SEC filing under 50 MB.`
      );
      setFile(null);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
      return false;
    }

    setValidationError("");
    return true;
  }

  function handleFileSelected(pickedFile) {
    if (validateFile(pickedFile)) {
      setFile(pickedFile);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      const url = URL.createObjectURL(pickedFile);
      setBlobUrl(url);

      // Guess company or type from filename
      const fname = pickedFile.name.toLowerCase();
      if (fname.includes("10-k") || fname.includes("10k")) {
        setDocType("10-K Filing");
      } else if (fname.includes("transcript") || fname.includes("earnings")) {
        setDocType("Earnings Transcript");
      } else if (fname.includes("financial") || fname.includes("statement")) {
        setDocType("Financial Statement");
      }

      if (fname.includes("apple") || fname.includes("aapl")) setSelectedTicker("AAPL");
      else if (fname.includes("microsoft") || fname.includes("msft")) setSelectedTicker("MSFT");
      else if (fname.includes("tcs") || fname.includes("tata")) setSelectedTicker("TCS");
      else if (fname.includes("infosys") || fname.includes("infy")) setSelectedTicker("INFY");
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  }

  function handleRemoveFile() {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setFile(null);
    setBlobUrl(null);
    setValidationError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleStartUpload() {
    if (!file) return;

    setIsSimulating(true);
    setSimulationFailed(false);
    setUploadProgress(10);
    setCurrentStageIndex(0);

    // Step 1: Uploaded (0 -> 25%)
    setTimeout(() => {
      setUploadProgress(28);
      setCurrentStageIndex(1); // Parsing

      // If user toggled simulate error, trigger error on Parsing stage
      if (simulateError) {
        setTimeout(() => {
          setIsSimulating(false);
          setSimulationFailed(true);
          setValidationError(
            "OCR Extraction Failure (Simulated): Incomplete embedded font table on Page 42. Parsing halted."
          );
        }, 1200);
        return;
      }

      // Step 2: Parsing (28 -> 55%)
      setTimeout(() => {
        setUploadProgress(58);
        setCurrentStageIndex(2); // Chunking

        // Step 3: Chunking (58 -> 82%)
        setTimeout(() => {
          setUploadProgress(84);
          setCurrentStageIndex(3); // Indexing

          // Step 4: Indexing (84 -> 100%)
          setTimeout(() => {
            setUploadProgress(100);
            setCurrentStageIndex(4); // Ready

            // Determine Company details
            const comp = SEED_COMPANIES[selectedTicker];
            const compName = selectedTicker === "CUSTOM"
              ? (customCompanyName || "Custom Enterprise")
              : (comp?.name || "Target Corporation");
            const ticker = selectedTicker === "CUSTOM" ? "CUST" : selectedTicker;

            // Compute realistic pages and chunks
            const estimatedPages = Math.max(12, Math.round(file.size / (1024 * 55)));
            const estimatedChunks = estimatedPages * 4;

            const linkedSession = sessions.find((s) => s.id === selectedSessionId);

            const newDoc = {
              id: `doc-${Date.now()}`,
              name: file.name,
              company: compName,
              ticker: ticker,
              docType: docType,
              fileSize: formatFileSize(file.size),
              fileSizeBytes: file.size,
              uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              uploadedTimestamp: new Date().toISOString(),
              status: "Ready",
              isSeed: false,
              pages: estimatedPages,
              chunksCount: estimatedChunks,
              embeddingModel: "text-embedding-3-small (1536-dim)",
              ocrEngine: "Financial-OCR-TableNet v2.4",
              checksum: `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
              sessionId: selectedSessionId || null,
              sessionTitle: linkedSession?.title || "Standalone Ingested Filing",
              summary: `User ingested ${docType} for ${compName}. Complete OCR text layers and tabular schedules parsed into ${estimatedChunks} semantic vector chunks.`,
              blobUrl: blobUrl,
              pipelineStages: [
                { name: "Uploaded", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "0.6s", detail: "PDF binary loaded and checksum computed" },
                { name: "Parsing", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "1.4s", detail: `Extracted ${estimatedPages} page text layers and tables` },
                { name: "Chunking", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "1.2s", detail: `Segmented into ${estimatedChunks} semantic chunks` },
                { name: "Indexing", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "1.8s", detail: "1536-dimensional embeddings generated" },
                { name: "Ready", status: "completed", timestamp: new Date().toLocaleTimeString(), duration: "0.2s", detail: "Ready for multi-agent reasoning and citation retrieval" }
              ],
              sections: [
                { id: "sec-user-1", title: "Executive Overview & Table of Contents", page: 1, chunks: Math.round(estimatedChunks * 0.15), category: "Overview" },
                { id: "sec-user-2", title: "Management Discussion & Analysis", page: Math.round(estimatedPages * 0.2), chunks: Math.round(estimatedChunks * 0.35), category: "MD&A" },
                { id: "sec-user-3", title: "Audited Consolidated Financial Statements", page: Math.round(estimatedPages * 0.45), chunks: Math.round(estimatedChunks * 0.25), category: "Financials" },
                { id: "sec-user-4", title: "Notes to Financial Statements & Disclosures", page: Math.round(estimatedPages * 0.7), chunks: Math.round(estimatedChunks * 0.25), category: "Footnotes" }
              ]
            };

            setUploadedDoc(newDoc);
            setIsSimulating(false);

            if (onUploadSuccess) {
              onUploadSuccess(newDoc);
            }
          }, 900);
        }, 900);
      }, 900);
    }, 800);
  }

  function handleResetForm() {
    handleRemoveFile();
    setIsSimulating(false);
    setUploadProgress(0);
    setCurrentStageIndex(0);
    setSimulationFailed(false);
    setUploadedDoc(null);
  }

  return (
    <div className="fin-upload-page animate-fadeIn">
      {/* Page Header */}
      <div className="flex-row items-center justify-between pb-4 border-b border-subtle">
        <div className="flex-row items-center gap-3">
          <button
            type="button"
            className="fin-btn fin-btn-ghost fin-btn-sm"
            onClick={onCancel}
            title="Return to Financial Documents"
          >
            <ArrowLeft size={16} />
            <span>Back to Financial Documents</span>
          </button>
          <div className="h-4 w-px bg-border-color" />
          <div>
            <h1 className="text-xl font-bold text-main">Upload Financial Document</h1>
            <p className="text-xs text-muted">
              Ingest corporate filings into the research library with automated table extraction and vector chunking.
            </p>
          </div>
        </div>

        <Badge variant="outline" size="xs">
          PDF Format Supported
        </Badge>
      </div>

      {/* Success State View */}
      {uploadedDoc && !isSimulating ? (
        <div className="fin-upload-success-panel mt-6 p-8 border rounded-lg text-center animate-fadeIn bg-card">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4 text-success">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold text-main">Filing Ingested & Vector Indexed</h2>
          <p className="text-sm text-muted max-w-lg mx-auto mt-2 leading-relaxed">
            <strong>{uploadedDoc.name}</strong> was parsed into{" "}
            <span className="text-accent font-semibold">{uploadedDoc.chunksCount} semantic chunks</span> across{" "}
            <span className="text-accent font-semibold">{uploadedDoc.pages} pages</span>. Ready for multi-agent
            retrieval, reasoning, and citation verification.
          </p>

          <div className="doc-summary-badge-box mt-6 p-4 border rounded max-w-md mx-auto bg-card-subtle text-left">
            <div className="flex-row justify-between text-xs py-1">
              <span className="text-muted">Entity / Ticker:</span>
              <strong className="text-main">{uploadedDoc.company} ({uploadedDoc.ticker})</strong>
            </div>
            <div className="flex-row justify-between text-xs py-1">
              <span className="text-muted">Document Type:</span>
              <Badge variant="primary" size="xs">{uploadedDoc.docType}</Badge>
            </div>
            <div className="flex-row justify-between text-xs py-1">
              <span className="text-muted">File Size:</span>
              <span className="font-mono text-main">{uploadedDoc.fileSize}</span>
            </div>
            <div className="flex-row justify-between text-xs py-1">
              <span className="text-muted">Linked Research Session:</span>
              <span className="text-accent truncate max-w-[200px]" title={uploadedDoc.sessionTitle}>
                {uploadedDoc.sessionTitle}
              </span>
            </div>
          </div>

          <div className="flex-row justify-center gap-3 mt-8">
            <Button
              variant="primary"
              size="md"
              icon={Eye}
              onClick={() => {
                if (onViewDetails) onViewDetails(uploadedDoc);
              }}
            >
              View Document Details & Parsed Pages
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={FolderOpen}
              onClick={onCancel}
            >
              Return to Financial Documents
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={handleResetForm}
            >
              Upload Another Filing
            </Button>
          </div>
        </div>
      ) : (
        /* Upload Form & Drag Dropzone */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column: Drag & Drop Area */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className={`fin-dropzone-large ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""} ${validationError ? "has-error" : ""}`}
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelected(e.target.files[0]);
                  }
                }}
              />

              {!file ? (
                <div className="dropzone-empty-content text-center py-8">
                  <div className="dropzone-icon-circle mx-auto mb-3">
                    <UploadCloud size={40} className="text-accent" />
                  </div>
                  <h3 className="text-base font-bold text-main">
                    Drag and drop your financial PDF here
                  </h3>
                  <p className="text-xs text-muted max-w-sm mx-auto mt-1 leading-relaxed">
                    Supports SEC Form 10-K, 10-Q, Audited Integrated Annual Reports, and Earnings Transcripts (PDF only, up to 50 MB)
                  </p>

                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Browse Local Files
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="selected-file-details p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex-row items-center justify-between">
                    <div className="flex-row items-center gap-3">
                      <div className="p-3 rounded-lg bg-accent/15 text-accent">
                        <FileText size={28} />
                      </div>
                      <div>
                        <strong className="text-sm text-main block truncate max-w-md" title={file.name}>
                          {file.name}
                        </strong>
                        <div className="flex-row items-center gap-2 text-xs text-muted mt-0.5">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>PDF Document</span>
                          <span>•</span>
                          <span className="text-success flex-row items-center gap-1">
                            <CheckCircle2 size={12} /> Validated
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-row items-center gap-2">
                      {blobUrl && (
                        <button
                          type="button"
                          className="fin-btn fin-btn-ghost fin-btn-xs text-accent"
                          onClick={() => setPreviewOpen(true)}
                          title="Preview selected PDF"
                        >
                          <Eye size={13} />
                          <span>Preview PDF</span>
                        </button>
                      )}
                      <button
                        type="button"
                        className="fin-btn fin-btn-ghost fin-btn-xs text-danger"
                        onClick={handleRemoveFile}
                        title="Remove selected file"
                        disabled={isSimulating}
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="fin-form-error-alert flex-row items-center gap-2 p-3 rounded border text-xs text-danger bg-danger/10 border-danger/30">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{validationError}</span>
                <button
                  type="button"
                  className="ml-auto text-muted hover:text-main"
                  onClick={() => setValidationError("")}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Ingestion Progress Simulation Card */}
            {isSimulating && (
              <div className="fin-upload-progress-card p-4 border rounded-lg bg-card-subtle animate-fadeIn">
                <div className="flex-row justify-between items-center mb-2">
                  <div className="flex-row items-center gap-2">
                    <RefreshCw size={14} className="text-accent animate-spin" />
                    <strong className="text-xs text-main">
                      {stages[currentStageIndex]?.name}: {stages[currentStageIndex]?.label}
                    </strong>
                  </div>
                  <span className="text-xs font-mono font-bold text-accent">{uploadProgress}%</span>
                </div>

                <div className="fin-progress-bar-track h-2 bg-border-color rounded-full overflow-hidden">
                  <div
                    className="fin-progress-bar-fill h-full bg-accent transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                {/* 5-Stage Stepper Tracker */}
                <div className="grid grid-cols-5 gap-1 mt-4 pt-3 border-t border-subtle">
                  {stages.map((stg, idx) => {
                    const isDone = currentStageIndex > idx;
                    const isCurrent = currentStageIndex === idx;
                    return (
                      <div key={stg.name} className="text-center">
                        <div
                          className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isDone
                              ? "bg-success text-white"
                              : isCurrent
                              ? "bg-accent text-white animate-pulse"
                              : "bg-border-color text-muted"
                          }`}
                        >
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <span className={`text-[10px] block mt-1 ${isCurrent ? "text-accent font-bold" : "text-muted"}`}>
                          {stg.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Metadata & Association Settings */}
          <div className="lg:col-span-5 space-y-4">
            <div className="fin-card p-5 border rounded-lg bg-card">
              <h3 className="text-sm font-bold text-main flex-row items-center gap-2 mb-4 pb-2 border-b border-subtle">
                <Building2 size={16} className="text-accent" />
                Document Metadata & Association
              </h3>

              <div className="space-y-4">
                {/* Company Selection */}
                <div>
                  <label className="fin-form-label">Corporate Entity / Ticker</label>
                  <select
                    className="fin-select w-full"
                    value={selectedTicker}
                    onChange={(e) => setSelectedTicker(e.target.value)}
                    disabled={isSimulating}
                  >
                    {Object.values(SEED_COMPANIES).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} — {c.name}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Other / Custom Corporate Entity</option>
                  </select>
                </div>

                {selectedTicker === "CUSTOM" && (
                  <div>
                    <label className="fin-form-label">Custom Enterprise Name</label>
                    <input
                      type="text"
                      className="fin-input w-full"
                      placeholder="e.g. Nvidia Corporation"
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                      disabled={isSimulating}
                    />
                  </div>
                )}

                {/* Document Type Selection */}
                <div>
                  <label className="fin-form-label">Document Classification</label>
                  <select
                    className="fin-select w-full"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    disabled={isSimulating}
                  >
                    {DOCUMENT_TYPES.map((dt) => (
                      <option key={dt} value={dt}>
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Research Session Linkage */}
                <div>
                  <label className="fin-form-label">Associate with Research Session (Module 1)</label>
                  <select
                    className="fin-select w-full"
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    disabled={isSimulating}
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                    <option value="">General Library (No Session Linkage)</option>
                  </select>
                  <p className="text-[11px] text-muted mt-1">
                    Documents linked to a session will be immediately queryable by the conversational Research Agent.
                  </p>
                </div>

                {/* Test Simulation Controls */}
                <div className="p-3 border rounded bg-card-subtle">
                  <div className="flex-row items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-main block">Simulate OCR Error</span>
                      <span className="text-[11px] text-muted block">
                        Test error handling & retry states during ingestion
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="simulate-error-chk"
                      checked={simulateError}
                      onChange={(e) => setSimulateError(e.target.checked)}
                      disabled={isSimulating}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex-row justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    disabled={isSimulating}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={UploadCloud}
                    disabled={!file || isSimulating}
                    loading={isSimulating}
                    onClick={handleStartUpload}
                  >
                    {isSimulating ? "Ingesting & Chunking..." : "Upload Document"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Local PDF Preview Modal */}
      {previewOpen && file && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex-row justify-between items-center">
              <div className="flex-row items-center gap-2">
                <FileText size={18} className="text-accent" />
                <strong className="text-sm text-main">{file.name}</strong>
                <Badge variant="primary" size="xs">Local File Preview</Badge>
              </div>
              <button
                type="button"
                className="text-muted hover:text-main"
                onClick={() => setPreviewOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 h-[600px]">
              <iframe
                src={blobUrl}
                title={file.name}
                className="w-full h-full border rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
