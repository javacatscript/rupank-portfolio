"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  index: number;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function getProjectCode(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

export default function ProjectCard({
  project,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`group bg-bg-card border border-terminal-white/10 box-retro transition-all duration-500 hover:border-terminal-green/30 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-terminal-white/10 bg-bg-card-alt">
          {project.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageUrl}
              alt={`${project.title} preview`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl sm:text-5xl font-black text-terminal-green/25 tracking-widest">
                {getProjectCode(project.title)}
              </span>
            </div>
          )}

          <div className="absolute top-2 left-2 bg-bg-primary/90 border border-terminal-white/20 px-2 py-0.5">
            <span className="text-[10px] text-terminal-green tracking-widest uppercase">
              Loot #{String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="text-terminal-green text-base sm:text-lg font-bold tracking-tight text-glow-sm">
            {project.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-terminal-muted flex-1">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={`${project.id}-${tech}`}
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-terminal-white/15 text-terminal-muted bg-terminal-white/5"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-terminal-green text-black hover:bg-terminal-green/90 transition-colors"
              >
                LAUNCH
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-terminal-white/10 text-terminal-green hover:bg-terminal-white/20 transition-colors"
              >
                SOURCE
              </a>
            )}
          </div>

          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-terminal-white/10 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-terminal-green/40 text-terminal-green hover:bg-terminal-green/10 transition-colors"
              >
                EDIT
              </button>
              <button
                type="button"
                onClick={() => onDelete(project)}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-accent-red/40 text-accent-red hover:bg-accent-red/10 transition-colors"
              >
                DELETE
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
