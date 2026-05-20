"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { refreshToken } from "@/lib/auth/actions";

interface User {
  userId: string;
  email: string;
}

interface Profile {
  id: string;
  name: string;
  avatarKey: string | null;
  avatarUrl: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  activeProfile: Profile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setActiveProfile: (profile: Profile | null) => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
  initialProfile,
}: {
  children: React.ReactNode;
  initialUser: User | null;
  initialProfile: Profile | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(initialProfile);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = user !== null;

  const refreshSession = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await refreshToken();
      if (!success) {
        setUser(null);
        setActiveProfile(null);
      }
      return success;
    } catch {
      setUser(null);
      setActiveProfile(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshSession();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        activeProfile,
        loading,
        setUser,
        setActiveProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
