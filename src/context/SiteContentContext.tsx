"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { INITIAL_SITE_CONTENT } from "@/data/initialSiteContent";
import { fetchSiteContent, patchSiteContent } from "@/lib/portfolioApi";
import type { SiteContentBundle, SiteContentKey } from "@/types/siteContent";

interface SiteContentContextValue {
  content: SiteContentBundle;
  isLoading: boolean;
  error: string;
  reload: () => Promise<void>;
  updateContent: <K extends SiteContentKey>(
    key: K,
    value: SiteContentBundle[K]
  ) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContentBundle>(INITIAL_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchSiteContent();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load site content");
      setContent(INITIAL_SITE_CONTENT);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const updateContent = useCallback(
    async <K extends SiteContentKey>(key: K, value: SiteContentBundle[K]) => {
      const saved = await patchSiteContent(key, value);
      setContent((prev) => ({ ...prev, [key]: saved }));
    },
    []
  );

  const value = useMemo(
    () => ({ content, isLoading, error, reload, updateContent }),
    [content, isLoading, error, reload, updateContent]
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return context;
}
