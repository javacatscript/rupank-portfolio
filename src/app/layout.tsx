import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUPANK JOSHI | KINETIC_TERMINAL",
  description:
    "Frontend Engineer with 3+ years of experience. Building high-fidelity experiences through low-fidelity constraints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-bg-primary text-terminal-white font-mono">
        {children}
      </body>
    </html>
  );
}
