"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type ArcadeOpenReason = "start" | "coin" | "navSave";

type Handler = () => void | Promise<void>;

interface ArcadeHandlers {
  requestSave?: Handler;
  requestLoad?: Handler;
}

interface ArcadeContextValue {
  isOpen: boolean;
  lastOpenReason: ArcadeOpenReason | null;
  open: (reason?: ArcadeOpenReason) => void;
  close: () => void;
  requestSave: () => Promise<void>;
  requestLoad: () => Promise<void>;
  registerHandlers: (handlers: ArcadeHandlers) => () => void;
}

const ArcadeContext = createContext<ArcadeContextValue | null>(null);

export function ArcadeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastOpenReason, setLastOpenReason] = useState<ArcadeOpenReason | null>(
    null,
  );
  const saveHandlersRef = useRef(new Set<Handler>());
  const loadHandlersRef = useRef(new Set<Handler>());

  const open = useCallback((reason?: ArcadeOpenReason) => {
    setLastOpenReason(reason ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setLastOpenReason(null);
  }, []);

  const requestSave = useCallback(async () => {
    const handlers = Array.from(saveHandlersRef.current);
    await Promise.allSettled(handlers.map((handler) => handler()));
  }, []);

  const requestLoad = useCallback(async () => {
    const handlers = Array.from(loadHandlersRef.current);
    await Promise.allSettled(handlers.map((handler) => handler()));
  }, []);

  const registerHandlers = useCallback((handlers: ArcadeHandlers) => {
    if (handlers.requestSave) saveHandlersRef.current.add(handlers.requestSave);
    if (handlers.requestLoad) loadHandlersRef.current.add(handlers.requestLoad);

    return () => {
      if (handlers.requestSave) {
        saveHandlersRef.current.delete(handlers.requestSave);
      }
      if (handlers.requestLoad) {
        loadHandlersRef.current.delete(handlers.requestLoad);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      lastOpenReason,
      open,
      close,
      requestSave,
      requestLoad,
      registerHandlers,
    }),
    [
      isOpen,
      lastOpenReason,
      open,
      close,
      requestSave,
      requestLoad,
      registerHandlers,
    ]
  );

  return (
    <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>
  );
}

export function useArcade() {
  const context = useContext(ArcadeContext);
  if (!context) {
    throw new Error("useArcade must be used within ArcadeProvider");
  }
  return context;
}

