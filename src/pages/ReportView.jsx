import React, { useState, useEffect } from "react";
import ReportsLibrary from "../components/report/ReportsLibrary";
import ReportConfigModal from "../components/report/ReportConfigModal";
import ReportPreview from "../components/report/ReportPreview";
import PdfExportModal from "../components/report/PdfExportModal";
import RenameReportModal from "../components/report/RenameReportModal";
import DeleteConfirmModal from "../components/report/DeleteConfirmModal";
import {
  getStoredReports,
  saveStoredReports,
  INITIAL_REPORTS,
  generateStructuredReportContent
} from "../data/reportData";

export default function ReportView({
  session,
  sessions = [],
  onBack,
  initialView = "library" // "library" | "preview"
}) {
  const [reports, setReports] = useState(() => getStoredReports());
  const [currentView, setCurrentView] = useState(initialView);
  const [activeReport, setActiveReport] = useState(() => {
    if (session) {
      const match = reports.find((r) => r.sessionId === session.id);
      if (match) return match;
    }
    return reports[0] || INITIAL_REPORTS[0];
  });

  // Modals state
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredReports(reports);
  }, [reports]);

  // Synchronize view mode if initialView prop changes (e.g., clicking "Read Dossier" vs "Research Reports")
  useEffect(() => {
    if (initialView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

  // If session changes from header/workspace, adjust default report
  useEffect(() => {
    if (session) {
      const match = reports.find((r) => r.sessionId === session.id);
      if (match) {
        setActiveReport(match);
      }
    }
  }, [session?.id]);

  // Handle generating a new report (with simulated pipeline)
  function handleCreateReport(config) {
    const newReport = {
      id: `rep-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      summarySnippet: `Multi-agent research dossier analyzing ${config.company} across ${config.sections?.length || 5} audited reporting modules.`,
      generationProgress: config.status === "Generating" ? 25 : 100,
      generationStage: config.status === "Generating" ? "Parsing audited footnote disclosures..." : "",
      ...config
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    setActiveReport(newReport);

    // If generating, simulate asynchronous multi-agent pipeline
    if (config.status === "Generating") {
      setTimeout(() => {
        setReports((prev) =>
          prev.map((r) =>
            r.id === newReport.id
              ? {
                  ...r,
                  generationProgress: 60,
                  generationStage: "Harmonizing GAAP/IFRS ratios with industry peer benchmarks..."
                }
              : r
          )
        );

        setTimeout(() => {
          setReports((prev) =>
            prev.map((r) =>
              r.id === newReport.id
                ? {
                    ...r,
                    generationProgress: 90,
                    generationStage: "Injecting verified citation anchors and auditor verification..."
                  }
                : r
            )
          );

          setTimeout(() => {
            setReports((prev) =>
              prev.map((r) =>
                r.id === newReport.id
                  ? {
                      ...r,
                      status: "Completed",
                      generationProgress: 100,
                      generationStage: ""
                    }
                  : r
              )
            );
          }, 800);
        }, 900);
      }, 800);
    }
  }

  // Handle previewing a report
  function handlePreviewReport(report) {
    setActiveReport(report);
    setCurrentView("preview");
  }

  // Handle opening export modal for a report
  function handleOpenDownload(report) {
    setActiveReport(report);
    setExportModalOpen(true);
  }

  // Handle renaming a report
  function handleRenameReport(reportId, newTitle) {
    const updated = reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            title: newTitle,
            updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          }
        : r
    );
    setReports(updated);
    if (activeReport?.id === reportId) {
      setActiveReport((prev) => ({ ...prev, title: newTitle }));
    }
  }

  // Handle deleting a report
  function handleDeleteReport(reportId) {
    const updated = reports.filter((r) => r.id !== reportId);
    setReports(updated);
    if (activeReport?.id === reportId) {
      setActiveReport(updated[0] || null);
      if (updated.length === 0) {
        setCurrentView("library");
      }
    }
  }

  // Handle retrying a failed report
  function handleRetryGeneration(reportId) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: "Generating",
              generationProgress: 35,
              generationStage: "Retrying vector retrieval cluster query...",
              failureReason: null
            }
          : r
      )
    );

    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                generationProgress: 80,
                generationStage: "Reconciling Note 24 derivatives with balance sheet..."
              }
            : r
        )
      );

      setTimeout(() => {
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId
              ? {
                  ...r,
                  status: "Completed",
                  generationProgress: 100,
                  generationStage: ""
                }
              : r
          )
        );
      }, 900);
    }, 900);
  }

  return (
    <div className="fin-reports-module-page">
      {/* View 1: Reports Library */}
      {currentView === "library" && (
        <ReportsLibrary
          reports={reports}
          onGenerateReportClick={() => setConfigModalOpen(true)}
          onPreviewReport={handlePreviewReport}
          onDownloadReport={handleOpenDownload}
          onRenameReport={(r) => setRenameTarget(r)}
          onDeleteReport={(r) => setDeleteTarget(r)}
          onRetryGeneration={handleRetryGeneration}
        />
      )}

      {/* View 2: Report Preview */}
      {currentView === "preview" && activeReport && (
        <ReportPreview
          report={activeReport}
          onBackToLibrary={() => setCurrentView("library")}
          onOpenPdfExport={() => setExportModalOpen(true)}
        />
      )}

      {/* Page 2: Report Configuration Modal */}
      <ReportConfigModal
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        sessions={sessions}
        activeSession={session}
        onGenerateReport={handleCreateReport}
      />

      {/* Page 4: PDF Export Modal */}
      <PdfExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        report={activeReport}
        onPrint={() => window.print()}
        onReturnToLibrary={() => {
          setExportModalOpen(false);
          setCurrentView("library");
        }}
      />

      {/* Rename Modal */}
      <RenameReportModal
        open={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        report={renameTarget}
        onSave={handleRenameReport}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        report={deleteTarget}
        onConfirm={handleDeleteReport}
      />
    </div>
  );
}
