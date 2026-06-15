"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PlayerProfileSection from "@/components/PlayerProfileSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { ArcadeProvider } from "@/context/ArcadeContext";
import { PortfolioAdminProvider } from "@/context/PortfolioAdminContext";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "skills", "experience", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider>
      <PortfolioAdminProvider>
        <SiteContentProvider>
          <ArcadeProvider>
            <Navbar activeSection={activeSection} />
            <main>
              <HeroSection />
              <PlayerProfileSection />
              <SkillsSection />
              <ExperienceSection />
              <ProjectsSection />
              <ContactSection />
            </main>
            <Footer />
          </ArcadeProvider>
        </SiteContentProvider>
      </PortfolioAdminProvider>
    </ThemeProvider>
  );
}
