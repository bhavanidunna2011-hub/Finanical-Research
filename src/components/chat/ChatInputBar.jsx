import React, { useRef, useEffect } from "react";
import { Send, Sparkles, CornerDownLeft, HelpCircle, Layers } from "lucide-react";
import { SUGGESTED_RESEARCH_QUESTIONS } from "../../data/researchChatData";

export default function ChatInputBar({
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  onSelectSuggestedQuestion,
  selectedDocCount = 0
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [inputValue]);

  // Keyboard shortcut: Enter to submit, Shift+Enter for newline
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        onSubmit(e);
      }
    }
  }

  return (
    <div className="fin-chat-input-container">
      {/* Suggested Questions Pills Row */}
      <div className="suggested-questions-strip">
        <div className="flex-row items-center gap-1.5 suggested-heading">
          <Sparkles size={13} className="text-teal" />
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
            Suggested Research Questions:
          </span>
        </div>

        <div className="suggested-chips-scroll">
          {SUGGESTED_RESEARCH_QUESTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="suggested-chip-btn"
              onClick={() => onSelectSuggestedQuestion && onSelectSuggestedQuestion(item.question)}
              title={item.description}
              disabled={isLoading}
            >
              <span className="chip-cat">{item.category}</span>
              <span className="chip-text">{item.question}</span>
            </button>
          ))}
        </div>
      </div>

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
                ? "Ask a financial research question (e.g. revenue trend, debt changes, risk factors)..."
                : "Select at least one document in the side panel to query..."
            }
            className="fin-chat-textarea"
            disabled={isLoading || selectedDocCount === 0}
          />

          <button
            type="submit"
            className="fin-chat-send-btn"
            disabled={!inputValue.trim() || isLoading || selectedDocCount === 0}
            title={isLoading ? "Generating response..." : "Send query (Enter)"}
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="fin-spinner-sm" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {/* Footer Hints */}
        <div className="chat-input-footer-bar">
          <div className="flex-row items-center gap-2 text-[11px] text-muted">
            <span className="flex-row items-center gap-1">
              <CornerDownLeft size={11} />
              <span>Press <strong>Enter ↵</strong> to submit</span>
            </span>
            <span>•</span>
            <span><strong>Shift + Enter</strong> for new line</span>
          </div>

          <div className="flex-row items-center gap-2 text-[11px]">
            <span className="text-muted">
              Retrieval Scope: <strong className="text-teal">{selectedDocCount} filings active</strong>
            </span>
            <span>•</span>
            <span className="text-muted">
              Mode: <strong className="text-purple-400">Deterministic Client Simulation</strong>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
