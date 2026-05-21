import type { SiteContentBundle } from "@/types/siteContent";

export const INITIAL_SITE_CONTENT: SiteContentBundle = {
  hero: {
    name: "RUPANK JOSHI",
    tagline:
      "Frontend Engineer with 3+ years of experience. Analog ghosts in a digital machine. Building high-fidelity experiences through low-fidelity constraints.",
  },
  equipped_gear: [
    { id: "gear-1", name: "CURSOR_IDE", type: "PRIMARY_TOOL", icon: "⚙" },
    { id: "gear-2", name: "REST/GRAPHQL_LINK", type: "DATA_TRANSFER", icon: "⇄" },
    { id: "gear-3", name: "CI/CD_PIPELINE", type: "DEPLOY_SHIELD", icon: "▶" },
  ],
  system_log: {
    lines: [
      "> Loading _hellorupank.profile...",
      "> [OK] React 18 & Next.js App Router",
      "> [OK] Core Web Vitals optimized",
      "> [OK] OpenAI API connection active",
      "> _",
    ],
  },
  resume_archive: {
    title: "Resume_Rupank.v1",
    sizeLabel: "143KB",
    format: "PDF",
    downloadName: "Rupank_Joshi_Resume.pdf",
    fileUrl: "/resume.pdf",
  },
};
