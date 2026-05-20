"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import AuthModal from "@/components/projects/AuthModal";
import {
  clearAuthSession,
  isProjectsAdmin,
} from "@/lib/projectsAuth";

interface PortfolioAdminContextValue {
  isAdmin: boolean;
  requireAdmin: (action: () => void) => void;
  openAuthLogin: () => void;
  lockSession: () => void;
  refreshAdminState: () => void;
}

const PortfolioAdminContext = createContext<PortfolioAdminContextValue | null>(
  null
);

export function PortfolioAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(() =>
    typeof window === "undefined" ? false : isProjectsAdmin()
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTitle, setAuthTitle] = useState("ADMIN_ACCESS_REQUIRED");
  const pendingActionRef = useRef<(() => void) | null>(null);

  const refreshAdminState = useCallback(() => {
    setIsAdmin(isProjectsAdmin());
  }, []);

  const runPendingAction = useCallback(() => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setIsAdmin(true);
    runPendingAction();
  }, [runPendingAction]);

  const openAuthLogin = useCallback((title = "ADMIN_ACCESS_REQUIRED") => {
    pendingActionRef.current = null;
    setAuthTitle(title);
    setAuthModalOpen(true);
  }, []);

  const requireAdmin = useCallback(
    (action: () => void, title = "ADMIN_ACCESS_REQUIRED") => {
      if (isProjectsAdmin()) {
        setIsAdmin(true);
        action();
        return;
      }

      pendingActionRef.current = action;
      setAuthTitle(title);
      setAuthModalOpen(true);
    },
    []
  );

  const lockSession = useCallback(() => {
    clearAuthSession();
    setIsAdmin(false);
    pendingActionRef.current = null;
  }, []);

  const value = useMemo(
    () => ({
      isAdmin,
      requireAdmin,
      openAuthLogin,
      lockSession,
      refreshAdminState,
    }),
    [isAdmin, requireAdmin, openAuthLogin, lockSession, refreshAdminState]
  );

  return (
    <PortfolioAdminContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={authModalOpen}
        title={authTitle}
        onClose={() => {
          setAuthModalOpen(false);
          pendingActionRef.current = null;
        }}
        onSuccess={handleAuthSuccess}
      />
    </PortfolioAdminContext.Provider>
  );
}

export function usePortfolioAdmin() {
  const context = useContext(PortfolioAdminContext);
  if (!context) {
    throw new Error("usePortfolioAdmin must be used within PortfolioAdminProvider");
  }
  return context;
}
