import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "_hellorupank",
  description:
    "Frontend Engineer with 3+ years of experience. Building high-fidelity experiences through low-fidelity constraints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("portfolio-accent-color");if(!s)return;var h=s.trim().toLowerCase(),m=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(h);if(!m)return;var r=m[1];if(r.length===3)r=r[0]+r[0]+r[1]+r[1]+r[2]+r[2];var R=parseInt(r.slice(0,2),16),G=parseInt(r.slice(2,4),16),B=parseInt(r.slice(4,6),16),d=document.documentElement;d.style.setProperty("--accent","#"+r);d.style.setProperty("--accent-rgb",R+" "+G+" "+B);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-bg-primary text-terminal-white font-mono">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
