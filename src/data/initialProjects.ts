import type { Project } from "@/types/project";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-kraya-dashboard",
    title: "Kraya AI Command Center",
    description:
      "Modular analytics dashboard with SSR routes, role-based views, and real-time pipeline status for growth teams.",
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://example.com/kraya-dashboard",
    githubUrl: "https://github.com/javacatscript/kraya-dashboard",
  },
  {
    id: "proj-health-inventory",
    title: "MedInventory Tracker",
    description:
      "Cross-platform healthcare inventory console with live stock alerts, barcode lookup, and accessible form controls.",
    techStack: ["React", "TypeScript", "Ionic", "REST APIs"],
    githubUrl: "https://github.com/javacatscript/med-inventory",
  },
  {
    id: "proj-terminal-portfolio",
    title: "Terminal Portfolio v1",
    description:
      "Retro terminal portfolio with quest-log experience timeline, skill filters, and save-point contact flow.",
    techStack: ["Next.js", "React", "Tailwind CSS"],
    liveUrl: "http://localhost:3000",
    githubUrl: "https://github.com/javacatscript/rupank-portfolio",
  },
  {
    id: "proj-ai-widget",
    title: "LLM Support Widget",
    description:
      "Embeddable AI assistant panel with streaming responses, prompt presets, and graceful offline fallback states.",
    techStack: ["React", "OpenAI API", "Node.js", "GraphQL"],
    liveUrl: "https://example.com/ai-widget",
    githubUrl: "https://github.com/javacatscript/ai-support-widget",
  },
];
