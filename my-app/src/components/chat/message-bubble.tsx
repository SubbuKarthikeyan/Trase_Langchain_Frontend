"use client";

import React from "react";

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

/**
 * MessageBubble
 * ─────────────
 * Renders individual chat messages formatted with generous spacing,
 * clear typography, and subtle modern theme accents.
 */
export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-3 w-full ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
          isUser
            ? "bg-[#4F7CAC] text-white shadow-[#4F7CAC]/20"
            : "bg-slate-800 text-teal-400 border border-slate-700/80"
        }`}
      >
        {isUser ? "You" : "Trase"}
      </div>

      {/* Message Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-5 py-4 text-sm leading-relaxed transition-all shadow-md ${
          isUser
            ? "bg-[#34566F] text-white rounded-tr-none shadow-[#34566F]/10 border border-[#4F7CAC]/40"
            : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-black/20"
        }`}
      >
        {message.text ? (
          <div className="whitespace-pre-wrap space-y-2 text-[13.5px] font-sans">
            {message.text}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-slate-400 py-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-150"></span>
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-300"></span>
            <span className="text-xs italic ml-2 text-teal-300">
              Retrieving bus schedules & calculating fares...
            </span>
          </div>
        )}

        {/* Timestamp */}
        <div
          suppressHydrationWarning
          className={`text-[10px] mt-2 text-right ${
            isUser ? "text-slate-300/80" : "text-slate-500"
          }`}
        >
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}
