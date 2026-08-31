"use client";

import React, { useState } from "react";

interface SuggestionCategory {
  label: string;
  icon: string;
  queries: string[];
}

const CATEGORIES: SuggestionCategory[] = [
  {
    label: "Routes & Options",
    icon: "🚌",
    queries: [
      "Show AC Sleeper buses from Chennai to Madurai with stops",
      "Which buses go from Chennai to Coimbatore?",
      "Are there early morning buses from Trichy to Chennai?",
    ],
  },
  {
    label: "Fare & Stops",
    icon: "💰",
    queries: [
      "Calculate fare from Chennai to Tindivanam for Royal Transit",
      "What is the stop-based ticket price from Chennai to Perambalur?",
      "Show the full intermediate stops for Route R001",
    ],
  },
  {
    label: "Bus Types & Amenities",
    icon: "✨",
    queries: [
      "Which buses have WiFi, charger, and toilet facilities?",
      "List Non-AC Seater options to Coimbatore with minimum fare",
      "Show all Deluxe buses leaving after 05:00 AM",
    ],
  },
];

interface SuggestionsBarProps {
  onSelectQuery: (query: string) => void;
  disabled?: boolean;
}

/**
 * SuggestionsBar
 * ──────────────
 * Renders on the left side above the input bar.
 * Provides curated, contextual, and travel-specific prompt suggestions
 * categorized by intent rather than arbitrary questions.
 */
export function SuggestionsBar({ onSelectQuery, disabled }: SuggestionsBarProps) {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  return (
    <div className="w-full flex flex-col space-y-2 text-left mb-2.5">
      {/* Category selector & Header */}
      <div className="flex items-center space-x-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <span className="text-teal-400">⚡</span> Quick Suggestions:
        </span>
        <div className="flex items-center space-x-1">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveCategory(idx)}
              className={`text-[11px] px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeCategory === idx
                  ? "bg-slate-800 text-teal-300 font-medium border border-teal-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestion Pills aligned to the left */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start">
        {CATEGORIES[activeCategory].queries.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectQuery(q)}
            className="text-xs shrink-0 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 text-slate-300 hover:text-slate-100 border border-slate-800 hover:border-teal-500/40 transition-all text-left shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
          >
            <span className="text-teal-400/80 font-mono text-[10px]">↳</span>
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
