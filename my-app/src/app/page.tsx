"use client";

import { useState, useRef, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { useTraseAuth } from "@/context/auth-context";
import { configureApiClient, authenticatedFetch } from "@/lib/api-client";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function Home() {
  const { accessToken, user, isAuthenticated, isLoading, setAccessToken } = useTraseAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am Trase, your AI Bus Travel Assistant. Ask me anything about bus schedules, routes, facilities, or stop fares!",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep API client configured with current access token
  useEffect(() => {
    configureApiClient(accessToken, setAccessToken);
  }, [accessToken, setAccessToken]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
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
    if (!queryText) setInput("");
    setIsStreaming(true);

    try {
      let response: Response;
      try {
        response = await authenticatedFetch("http://localhost:8000/query/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: textToSend }),
        });
      } catch (fetchErr) {
        response = await authenticatedFetch("http://127.0.0.1:8000/query/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: textToSend }),
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
                text: "I'm having trouble connecting to the travel database right now. Please ensure the backend is running and try again.",
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const sampleQueries = [
    "Are there any AC buses from Chennai to Madurai?",
    "Which buses have sleeper seats to Bangalore?",
    "What is the fare breakdown from Madurai to Trichy?",
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <svg className="w-6 h-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-300 via-emerald-300 to-white bg-clip-text text-transparent">
              Trase Bus Travel AI
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Travel Assistant Online
              </p>

              {/* Session Status Pill */}
              {isAuthenticated && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 font-medium">
                  MongoDB Synced
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              setMessages([
                {
                  id: "welcome",
                  sender: "bot",
                  text: "Chat cleared! How can I help you with your bus travel today?",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ])
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
          >
            Clear Chat
          </button>

          {/* Clerk Authentication Controls */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/40 text-teal-300 transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400 transition-all shadow-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-2">
                {user && (
                  <span className="text-xs text-slate-300 max-w-[120px] truncate hidden sm:inline">
                    {user.first_name || user.email}
                  </span>
                )}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-lg ring-1 ring-teal-500/50",
                    },
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl w-full mx-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-teal-500/10 text-teal-400 border border-teal-500/30"
              }`}
            >
              {msg.sender === "user" ? "You" : "AI"}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
              }`}
            >
              {msg.text ? (
                <div className="whitespace-pre-wrap">{msg.text}</div>
              ) : (
                <div className="flex items-center space-x-2 text-slate-400 py-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-150"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-300"></span>
                  <span className="text-xs italic ml-2">Searching travel database...</span>
                </div>
              )}
              <div
                suppressHydrationWarning
                className={`text-[10px] mt-1.5 text-right ${
                  msg.sender === "user" ? "text-indigo-200" : "text-slate-500"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Footer & Input Area */}
      <footer className="border-t border-slate-800 bg-slate-900/90 p-4 sticky bottom-0 z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Quick Suggestion Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              Suggestions:
            </span>
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isStreaming}
                onClick={() => handleSend(q)}
                className="text-xs shrink-0 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all hover:border-teal-500/40 hover:text-white disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about buses, schedules, fares, or routes..."
              disabled={isStreaming}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
