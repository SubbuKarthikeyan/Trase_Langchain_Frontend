"use client";

import React, { createContext, useContext, useState } from "react";

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_verified: boolean;
  is_banned: boolean;
  role: string;
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        setIsLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useTraseAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useTraseAuth must be used within an AuthContextProvider");
  }
  return context;
}
