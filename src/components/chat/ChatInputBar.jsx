import React, { useRef, useEffect } from "react";
import { Send, Sparkles, CornerDownLeft, HelpCircle, Layers } from "lucide-react";
import { SUGGESTED_RESEARCH_QUESTIONS } from "../../data/researchChatData";

export default function ChatInputBar({
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  selectedDocCount = 0,
  onOpenSources
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  // Keyboard shortcut: Enter to submit, Shift+Enter for newline
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading && selectedDocCount > 0) {
        onSubmit(e);
      }
    }
  }

  return (
    <div className="fin-chat-input-container">
      {/* Main Textarea & Submit Form */}
      <form onSubmit={onSubmit} className="fin-chat-input-form">
        <div className="input-textarea-wrapper">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedDocCount > 0
                ? "Ask a question about the selected filings (e.g. revenue trends, debt, risks)..."
                : "Select at least one document in the Context & Sources panel to query..."
            }
            className="fin-chat-textarea"
            disabled={isLoading || selectedDocCount === 0}
            aria-label="Ask financial research question"
          />

          <button
            type="submit"
            className="fin-chat-send-btn"
            disabled={!inputValue.trim() || isLoading || selectedDocCount === 0}
            title={isLoading ? "Generating response..." : "Send query (Enter)"}
            aria-label="Send query"
          >
            {isLoading ? (
              <span className="fin-spinner-sm" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>

        {/* Clean Minimal Footer Bar */}
        <div className="chat-input-footer-bar flex items-center justify-between mt-1 px-1">
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <span>Press <kbd className="px-1 py-0.5 rounded bg-subtle text-[10px]">Enter ↵</kbd> to send</span>
            <span>•</span>
            <span><kbd className="px-1 py-0.5 rounded bg-subtle text-[10px]">Shift + Enter</kbd> for newline</span>
          </div>

          <div className="text-[11px] text-muted flex items-center gap-1.5">
            <span>Scope:</span>
            <button
              type="button"
              className="text-teal hover:underline font-medium cursor-pointer"
              onClick={onOpenSources}
              title="Click to view and configure source documents"
            >
              {selectedDocCount} {selectedDocCount === 1 ? "document" : "documents"} selected
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
