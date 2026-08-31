"use client";

import React, { useState } from "react";

interface MCPTool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  badge: string;
}

const MCP_SERVERS: MCPTool[] = [
  {
    id: "gmail",
    name: "Gmail MCP",
    category: "Communication",
    description: "Send automated ticket confirmations, PDF itinerary attachments, and travel reminders.",
    icon: "✉️",
    badge: "Official",
  },
  {
    id: "github",
    name: "GitHub MCP",
    category: "Developer Tools",
    description: "Sync travel telemetry, issue reports, and automated schedule indexing pipelines.",
    icon: "🐙",
    badge: "Official",
  },
  {
    id: "google_maps",
    name: "Google Maps MCP",
    category: "Navigation & Geocoding",
    description: "Fetch live traffic conditions, satellite depot views, and exact kilometer route distances.",
    icon: "🗺️",
    badge: "Preview",
  },
  {
    id: "slack",
    name: "Slack MCP",
    category: "Team Coordination",
    description: "Broadcast group tour updates, driver shift assignments, and route delay notifications.",
    icon: "💬",
    badge: "Preview",
  },
  {
    id: "agentmail",
    name: "AgentMail Tool",
    category: "Email Infrastructure",
    description: "Active high-reliability email dispatch service currently powering Trase ticket receipts.",
    icon: "⚡",
    badge: "Active",
  },
  {
    id: "weather",
    name: "OpenWeather MCP",
    category: "Meteorology",
    description: "Live rainfall and monsoon forecast alerts along key Tamil Nadu highway corridors.",
    icon: "🌦️",
    badge: "Coming Soon",
  },
];

/**
 * ConnectorsView
 * ──────────────
 * Showcase for external MCP connectors (Gmail, GitHub, Google Maps, Slack, etc.)
 * with clickable interactive connection toggles.
 */
export function ConnectorsView() {
  const [connectedState, setConnectedState] = useState<Record<string, boolean>>({
    agentmail: true,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggle = (id: string, name: string) => {
    setConnectedState((prev) => {
      const nextState = !prev[id];
      showToast(`${name} is now ${nextState ? "Connected" : "Disconnected"}`);
      return { ...prev, [id]: nextState };
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-teal-500/50 text-teal-300 text-xs font-semibold shadow-xl shadow-teal-500/10 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-medium">
          <span>⚡</span> Model Context Protocol (MCP) Hub
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          External Integrations & Connectors
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Connect Trase with third-party MCP servers to extend assistant capabilities with live geocoding, calendar sync, developer workflows, and communication pipelines.
        </p>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {MCP_SERVERS.map((server) => {
          const isConnected = !!connectedState[server.id];

          return (
            <div
              key={server.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-slate-700/60">
                    {server.icon}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      isConnected
                        ? "bg-teal-500/20 text-teal-300 border-teal-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {isConnected ? "Active" : server.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-slate-100">{server.name}</h3>
                  <span className="text-[11px] text-teal-400/80 font-medium">
                    {server.category}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {server.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleToggle(server.id, server.name)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isConnected
                      ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-[#4F7CAC] hover:bg-[#34566F] text-white shadow-sm shadow-[#4F7CAC]/20"
                  }`}
                >
                  {isConnected ? "Disconnect MCP" : "Connect Integration"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
