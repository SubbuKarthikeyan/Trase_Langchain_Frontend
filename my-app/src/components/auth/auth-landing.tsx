"use client";

import React from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

/**
 * AuthLanding
 * ───────────
 * Rendered whenever the user is unauthenticated.
 * Presents a modern, calm, and trustworthy landing screen with clear
 * sign-in/sign-up entry points before revealing the AI chatbot workspace.
 */
export function AuthLanding() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 px-4 py-8">
      {/* Top Navbar */}
      <header className="w-full max-w-6xl flex items-center justify-between py-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F7CAC] to-[#6FA3A0] flex items-center justify-center shadow-lg shadow-teal-500/10">
            <svg
              className="w-5 h-5 text-slate-950"
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
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-teal-100 to-[#6FA3A0] bg-clip-text text-transparent">
              Trase
            </span>
            <span className="ml-2 text-xs uppercase px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-medium border border-slate-700/60">
              AI Travel
            </span>
          </div>
        </div>

        {/* Quick Auth Actions */}
        <div className="flex items-center space-x-3">
          <SignInButton mode="modal">
            <button className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 bg-slate-900/60 transition-all cursor-pointer">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F7CAC] to-[#6FA3A0] text-slate-950 hover:brightness-110 shadow-md shadow-teal-500/20 transition-all font-medium cursor-pointer">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </header>

      {/* Hero & Auth Card */}
      <main className="w-full max-w-4xl my-auto py-12 flex flex-col items-center text-center space-y-8">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium animate-pulse">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          Intelligent Multi-Modal Bus Assistant
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Seamless Bus Journeys,{" "}
            <span className="bg-gradient-to-r from-[#4F7CAC] via-[#6FA3A0] to-[#D9A441] bg-clip-text text-transparent">
              Calculated Instantly.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Sign in to access real-time route comparisons, stop-by-stop fare calculations, AC/Sleeper options, and direct email ticket confirmations powered by Trase AI.
          </p>
        </div>

        {/* Primary CTA Box */}
        <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl space-y-4">
          <p className="text-xs text-slate-400 font-medium">
            Join thousands of travelers exploring Tamil Nadu routes with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <SignInButton mode="modal">
              <button className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#4F7CAC] to-[#6FA3A0] hover:from-[#34566F] hover:to-[#4F7CAC] text-white font-semibold text-sm transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 cursor-pointer">
                <span>Sign In with Clerk</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700/60 transition-all cursor-pointer">
                Create Account
              </button>
            </SignUpButton>
          </div>
          <p className="text-[11px] text-slate-500">
            Authentication is required to synchronize conversations and travel itineraries.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left pt-6">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-teal-500/30 transition-all space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-300 flex items-center justify-center font-bold text-xs">
              🚌
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Point-Based Route Choices</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare multiple bus schedules, intermediate stops, seat configurations, and facilities clearly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-teal-500/30 transition-all space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-[#D9A441] flex items-center justify-center font-bold text-xs">
              💰
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Stop-Based Fare Formula</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent ticket prices computed using exact base minimum fares and intermediate stop rates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-teal-500/30 transition-all space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-300 flex items-center justify-center font-bold text-xs">
              ✉️
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Instant Email Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Finalize your selected bus and receive complete itinerary details sent directly to your inbox via AgentMail.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800/60">
        <div>© 2026 Trase AI Travel Assistant. All rights reserved.</div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Support</span>
        </div>
      </footer>
    </div>
  );
}
