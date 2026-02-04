import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "@/hooks/use-session";
import { SessionData, SessionUpdateFields } from "@/lib/session";

interface SessionContextValue {
  session: SessionData | null;
  loading: boolean;
  error: Error | null;
  update: (updates: Partial<Pick<SessionData, SessionUpdateFields>>) => Promise<void>;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const sessionHook = useSession();

  return (
    <SessionContext.Provider value={sessionHook}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}
