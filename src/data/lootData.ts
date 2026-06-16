export interface LootStat {
  value: string;
  label: string;
}

export interface LootEntry {
  tech: string[];
  stats: LootStat[];
  scrolls: string[];
}

// Matched by checking quest.company.toLowerCase().includes(key)
export const LOOT_DATA: Record<string, LootEntry> = {
  "squa.re": {
    tech: ["Next.js", "React", "TypeScript", "Google Cloud", "CSS"],
    stats: [],
    scrolls: [
      "Building high-performance web apps with Next.js (App Router) and React, targeting Core Web Vitals excellence (LCP, CLS, INP)",
      "Implementing SEO optimization strategies — metadata, structured data, crawlability, and server-side rendering",
      "Architecting scalable frontend systems on Google Cloud with TypeScript and modern CSS patterns",
      "Driving performance budgets and monitoring real-user metrics via Lighthouse and Web Vitals tooling",
    ],
  },
  "kraya": {
    tech: ["React", "Next.js", "TypeScript", "Redux Toolkit", "MUI", "OpenAI API", "Node.js"],
    stats: [
      { value: "+40%", label: "Core Web Vitals" },
      { value: "+25%", label: "Demo-to-paid CVR" },
      { value: "−30%", label: "Delivery Time" },
      { value: "8–10h", label: "Saved / Week" },
    ],
    scrolls: [
      "Led modular frontend architecture with React, Next.js App Router, and TypeScript — 30% faster feature delivery",
      "Spearheaded Next.js 11→13 & React 17→18 migration with optimised SSR/SSG — 40% Core Web Vitals improvement",
      "Designed AI-powered essay evaluation and real-time chat interfaces using OpenAI streaming APIs",
      "Automated internal engineering workflows with LLM tools — saving 8–10 dev-hours per week",
      "Architected CRM onboarding funnels and analytics dashboards — 25% demo-to-paid conversion lift",
    ],
  },
  "tongadive": {
    tech: ["React", "TypeScript", "Ionic", "REST APIs"],
    stats: [],
    scrolls: [
      "Built a cross-platform healthcare dashboard for real-time medical inventory tracking",
      "Developed accessible UI components with semantic HTML and ARIA, ensuring WCAG compliance",
      "Integrated REST APIs for real-time data synchronisation across web and mobile clients",
      "Wrote unit and integration tests to improve reliability and reduce regressions in core workflows",
    ],
  },
  "coding ninjas": {
    tech: ["React", "JavaScript"],
    stats: [
      { value: "300+", label: "Queries Resolved" },
      { value: "4.9★", label: "Student Satisfaction" },
    ],
    scrolls: [
      "Mentored 300+ students on React and JavaScript, maintaining a 4.9/5 satisfaction rating",
      "Conducted debugging sessions and code reviews to sharpen problem-solving and code quality",
      "Created reusable examples and structured explanations to accelerate understanding of core frontend concepts",
    ],
  },
};

export function getLootForQuest(company: string): LootEntry | null {
  const key = Object.keys(LOOT_DATA).find((k) =>
    company.toLowerCase().includes(k)
  );
  return key ? (LOOT_DATA[key] ?? null) : null;
}
