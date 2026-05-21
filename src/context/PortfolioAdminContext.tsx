"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AuthModal from "@/components/projects/AuthModal";
import {
  checkAdminSession,
  clearAuthSession,
  isClientAdminFlagSet,
} from "@/lib/projectsAuth";

interface PortfolioAdminContextValue {
  isAdmin: boolean;
  requireAdmin: (action: () => void, title?: string) => void;
  openAuthLogin: () => void;
  lockSession: () => Promise<void>;
  refreshAdminState: () => Promise<void>;
}

const PortfolioAdminContext = createContext<PortfolioAdminContextValue | null>(
  null
);

export function PortfolioAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTitle, setAuthTitle] = useState("ADMIN_ACCESS_REQUIRED");
  const pendingActionRef = useRef<(() => void) | null>(null);

  const refreshAdminState = useCallback(async () => {
    const sessionActive = await checkAdminSession();
    setIsAdmin(sessionActive);
    if (!sessionActive) {
      clearAuthSession();
    }
  }, []);

  useEffect(() => {
    if (!isClientAdminFlagSet()) return;

    let cancelled = false;
    void checkAdminSession().then((sessionActive) => {
      if (!cancelled) setIsAdmin(sessionActive);
    });

    return () => {
      cancelled = true;
    };
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
      void (async () => {
        const sessionActive = isAdmin || (await checkAdminSession());
        if (sessionActive) {
          setIsAdmin(true);
          action();
          return;
        }

        pendingActionRef.current = action;
        setAuthTitle(title);
        setAuthModalOpen(true);
      })();
    },
    [isAdmin]
  );

  const lockSession = useCallback(async () => {
    await clearAuthSession();
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
