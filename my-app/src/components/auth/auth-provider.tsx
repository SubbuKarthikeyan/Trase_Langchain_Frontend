"use client";

import React, { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTraseAuth } from "@/context/auth-context";

export function TraseAuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { setAccessToken, setUser, setIsLoading, accessToken } = useTraseAuth();
  const syncInProgress = useRef(false);

  useEffect(() => {
    async function syncSession() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setAccessToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (syncInProgress.current || accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        syncInProgress.current = true;
        setIsLoading(true);

        const clerkToken = await getToken();
        if (!clerkToken) {
          throw new Error("Could not retrieve Clerk token");
        }

        // Send Clerk token to Next.js API session proxy route
        const res = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerk_token: clerkToken }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error("Backend session exchange failed:", errData);
          setAccessToken(null);
          setUser(null);
          return;
        }

        const data = await res.json();
        setAccessToken(data.access_token);
        setUser(data.user);
      } catch (err) {
        console.error("Error synchronizing session with backend:", err);
      } finally {
        syncInProgress.current = false;
        setIsLoading(false);
      }
    }

    syncSession();
  }, [isLoaded, isSignedIn, getToken, setAccessToken, setUser, setIsLoading, accessToken]);

  return <>{children}</>;
}
