"use client";

import React, { useState, FormEvent, KeyboardEvent } from "react";
import { cleanPrompt } from "@/lib/prompt-cleaner";
import { SuggestionsBar } from "./suggestions-bar";

interface ChatInputProps {
  onSendMessage: (cleanedText: string) => void;
  isStreaming: boolean;
}

/**
 * ChatInput
 * ─────────
 * Main input dock containing the left-aligned suggestions bar
 * and the prompt input field with automated sanitization.
 */
export function ChatInput({ onSendMessage, isStreaming }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const sanitized = cleanPrompt(input);
    if (!sanitized || isStreaming) return;

    onSendMessage(sanitized);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionSelect = (query: string) => {
    const sanitized = cleanPrompt(query);
    if (!sanitized || isStreaming) return;
    onSendMessage(sanitized);
  };

  return (
    <div className="w-full bg-slate-900/90 border-t border-slate-800/80 p-4 sticky bottom-0 z-10 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex flex-col">
        {/* Contextual Suggestions aligned to the left */}
        <SuggestionsBar
          onSelectQuery={handleSuggestionSelect}
          disabled={isStreaming}
        />

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about bus routes, schedules, stop fares, or facilities..."
            disabled={isStreaming}
            className="flex-1 bg-slate-950/90 border border-slate-800 focus:border-[#4F7CAC] rounded-2xl px-5 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#4F7CAC] transition-all shadow-inner"
          />

          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="bg-gradient-to-r from-[#4F7CAC] to-[#6FA3A0] hover:from-[#34566F] hover:to-[#4F7CAC] text-slate-950 font-semibold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shrink-0 text-white"
          >
            {isStreaming ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Searching</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
