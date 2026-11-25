// Static list — no year shown on purpose. Each entry links to its public
// verification page.

const CERTIFICATIONS = [
  {
    name: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic",
    url: "https://academy.claude.com/verify/e0b91fadcf4b3aa892575194e9ecf830",
  },
  {
    name: "Intermediate Machine Learning",
    issuer: "Kaggle",
    url: "https://www.kaggle.com/learn/certification/rupank0/intermediate-machine-learning",
  },
  {
    name: "Python for Data Science",
    issuer: "Kaggle",
    url: "https://www.kaggle.com/learn/certification/rupank0/python",
  },
] as const;

export default function CertificationsSection() {
  return (
    <section id="certifications" className="bg-bg-primary py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-terminal-green text-xs font-bold uppercase tracking-widest border border-terminal-green/40 px-3 py-1">
            Certifications
          </span>
          <span className="h-px flex-1 bg-terminal-white/10" />
          <span className="text-[10px] uppercase tracking-widest text-terminal-muted/80">
            badges_unlocked.log
          </span>
        </div>

        <ul className="border-l-2 border-terminal-white/20 bg-bg-card box-retro divide-y divide-dashed divide-terminal-white/10">
          {CERTIFICATIONS.map((cert) => (
            <li
              key={cert.name}
              className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 px-4 sm:px-6 py-4"
            >
              <p className="text-sm sm:text-base text-terminal-white/90">
                <span className="font-bold text-terminal-white">
                  {cert.name}
                </span>
                <span className="text-terminal-muted"> — {cert.issuer}</span>
              </p>
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs font-bold uppercase tracking-widest text-terminal-green hover:text-terminal-green/70 transition-colors"
              >
                Verify &rarr;
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
