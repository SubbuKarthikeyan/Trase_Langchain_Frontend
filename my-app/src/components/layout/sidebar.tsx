"use client";

import React from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

interface SidebarProps {
  onNewChat: () => void;
  activeView: "chat" | "connectors";
  onSelectView: (view: "chat" | "connectors") => void;
}

/**
 * Sidebar
 * ───────
 * Claude-inspired left sidebar featuring New Chat actions,
 * navigation between Chat and MCP Connectors, and User session info.
 */
export function Sidebar({ onNewChat, activeView, onSelectView }: SidebarProps) {
  const { user } = useUser();

  return (
    <aside className="w-64 sm:w-72 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between h-screen shrink-0 text-slate-200 select-none">
      {/* Top Branding & New Chat */}
      <div className="p-4 space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F7CAC] to-[#6FA3A0] flex items-center justify-center shadow-md shadow-teal-500/10">
              <svg
                className="w-4 h-4 text-slate-950"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-slate-100 to-teal-200 bg-clip-text text-transparent">
                Trase AI
              </span>
              <span className="block text-[10px] text-slate-400">Bus Travel Assistant</span>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#4F7CAC]/15 hover:bg-[#4F7CAC]/25 border border-[#4F7CAC]/40 text-teal-300 font-medium text-xs transition-all shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Conversation</span>
        </button>

        {/* Navigation Tabs */}
        <div className="space-y-1 pt-2">
          <button
            onClick={() => onSelectView("chat")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeView === "chat"
                ? "bg-slate-800 text-teal-300 border border-slate-700/80 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Active Travel Chat</span>
          </button>

          <button
            onClick={() => onSelectView("connectors")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeView === "connectors"
                ? "bg-slate-800 text-teal-300 border border-slate-700/80 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>MCP Connectors</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Future
            </span>
          </button>
        </div>
      </div>

      {/* Center History Snippet */}
      <div className="px-4 py-2 flex-1 overflow-y-auto space-y-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          Recent Searches
        </span>
        <div className="space-y-1">
          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50 text-xs text-slate-300 flex items-center justify-between">
            <span className="truncate">Chennai → Madurai Buses</span>
            <span className="text-[10px] text-slate-500">Today</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50 text-xs text-slate-300 flex items-center justify-between">
            <span className="truncate">Trichy Stop Fare Calc</span>
            <span className="text-[10px] text-slate-500">Earlier</span>
          </div>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-lg ring-1 ring-teal-500/50",
              },
            }}
          />
          <div className="truncate">
            <span className="text-xs font-semibold text-slate-200 block truncate">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Traveler"}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              {user?.primaryEmailAddress?.emailAddress || "Verified Session"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
