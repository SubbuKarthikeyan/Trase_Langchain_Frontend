"use client";

import { useState, useRef, useEffect } from "react";
import { useTraseAuth } from "@/context/auth-context";
import { configureApiClient, authenticatedFetch } from "@/lib/api-client";
import { AuthLanding } from "@/components/auth/auth-landing";
import { Sidebar } from "@/components/layout/sidebar";
import { MessageBubble, Message } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { ConnectorsView } from "@/components/connectors/connector-card";

export default function Home() {
  const { accessToken, user, isAuthenticated, isLoading, setAccessToken } = useTraseAuth();
  
  const [activeView, setActiveView] = useState<"chat" | "connectors">("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am Trase, your AI Bus Travel Assistant.\n\nAsk me about bus routes, schedules, intermediate stop fares, or facilities. I'll provide structured, point-based options and calculate exact ticket costs for your journey!",
      timestamp: "Just now",
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync API client with current access token
  useEffect(() => {
    configureApiClient(accessToken, setAccessToken);
  }, [accessToken, setAccessToken]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeView === "chat") {
      scrollToBottom();
    }
  }, [messages, isStreaming, activeView]);

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Started a new conversation! Where would you like to travel today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setActiveView("chat");
  };

  const handleSend = async (cleanedText: string) => {
    if (!cleanedText || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: cleanedText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const botMsgId = (Date.now() + 1).toString();
    const botMsgPlaceholder: Message = {
      id: botMsgId,
      sender: "bot",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, botMsgPlaceholder]);
    setIsStreaming(true);

    try {
      let response: Response;
      try {
        response = await authenticatedFetch("http://localhost:8000/query/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: cleanedText }),
        });
      } catch {
        response = await authenticatedFetch("http://127.0.0.1:8000/query/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: cleanedText }),
        });
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to Trase backend API");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) =>
          prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: accumulated } : msg))
        );
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: "I am having trouble connecting to the travel database right now. Please ensure the backend server is running and try again.",
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  // 1. Initial Loading State
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-100 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F7CAC] to-[#6FA3A0] flex items-center justify-center animate-pulse shadow-lg shadow-teal-500/20">
          <svg className="w-6 h-6 text-slate-950 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          Verifying Trase Authentication...
        </p>
      </div>
    );
  }

  // 2. Authentication Gate: Display landing screen if user is signed out
  if (!isAuthenticated) {
    return <AuthLanding />;
  }

  // 3. Authenticated Chatbot Workspace with Claude-Standard Ratio
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Left Sidebar (240-280px) */}
      <Sidebar
        onNewChat={handleNewChat}
        activeView={activeView}
        onSelectView={setActiveView}
      />

      {/* Main Workspace Area (Balanced Ratio) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Workspace Top Header */}
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-sm font-bold text-slate-200 tracking-tight">
                {activeView === "chat" ? "AI Bus Travel Assistant" : "Model Context Protocol Hub"}
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium">
              Live Session
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {activeView === "chat" && (
              <button
                onClick={handleNewChat}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>
        </header>

        {/* View Switcher: Chat Workspace vs Connectors */}
        {activeView === "connectors" ? (
          <ConnectorsView />
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden justify-between">
            {/* Scrollable Message Feed */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-4xl w-full mx-auto space-y-6">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} isStreaming={isStreaming} />
              ))}
              <div ref={messagesEndRef} />
            </main>

            {/* Chat Input with Left-Aligned Suggestions */}
            <ChatInput onSendMessage={handleSend} isStreaming={isStreaming} />
          </div>
        )}
      </div>
    </div>
  );
}
