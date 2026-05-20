import type { Quest } from "@/types/quest";

export const INITIAL_QUESTS: Quest[] = [
  {
    id: "quest-kraya",
    status: "active",
    title: "Software Engineer Frontend",
    company: "Kraya AI",
    period: "Apr 2023 - PRESENT",
    description:
      "Leading development of a modular frontend architecture using React, Next.js (App Router), and TypeScript. Achieved a 40% improvement in Core Web Vitals (notably LCP and INP) through optimized SSR/SSG strategies.",
  },
  {
    id: "quest-tongadive",
    status: "completed",
    title: "Frontend Engineer Intern",
    company: "Tongadive",
    period: "Marc 2023 - Apr 2023",
    description:
      "Built a cross-platform healthcare dashboard using React, TypeScript, and Ionic, enabling real-time medical inventory tracking. Developed accessible UI components with semantic HTML and ARIA.",
  },
  {
    id: "quest-coding-ninjas",
    status: "completed",
    title: "React Teaching Assistant",
    company: "Coding Ninjas",
    period: "Dec 2022 - Apr 2023",
    description:
      "Mentored students by resolving 300+ React and JavaScript queries, maintaining a 4.9/5 satisfaction rating. Conducted debugging sessions and code reviews to accelerate understanding of core frontend concepts.",
  },
];
