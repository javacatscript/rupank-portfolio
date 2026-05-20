"use client";

import { useCallback, useState } from "react";
import AdminSectionToolbar from "@/components/admin/AdminSectionToolbar";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFormModal from "@/components/projects/ProjectFormModal";
import { usePortfolioAdmin } from "@/context/PortfolioAdminContext";
import { INITIAL_PROJECTS } from "@/data/initialProjects";
import {
  createProjectId,
  loadProjects,
  saveProjects,
} from "@/lib/projectsStorage";
import type { Project, ProjectFormData } from "@/types/project";

export default function ProjectsSection() {
  const { isAdmin, requireAdmin } = usePortfolioAdmin();
  const [projects, setProjects] = useState<Project[]>(() =>
    typeof window === "undefined" ? INITIAL_PROJECTS : loadProjects()
  );
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const persistProjects = useCallback((nextProjects: Project[]) => {
    setProjects(nextProjects);
    saveProjects(nextProjects);
  }, []);

  const openAddForm = () => {
    setFormMode("add");
    setEditingProject(undefined);
    setFormModalOpen(true);
  };

  const openEditForm = (project: Project) => {
    setFormMode("edit");
    setEditingProject(project);
    setFormModalOpen(true);
  };

  const handleEdit = (project: Project) =>
    requireAdmin(() => openEditForm(project));

  const handleDeleteRequest = (project: Project) =>
    requireAdmin(() => setDeleteTarget(project));

  const handleSaveProject = (data: ProjectFormData, id?: string) => {
    if (id) {
      persistProjects(
        projects.map((project) =>
          project.id === id ? { ...project, ...data, id } : project
        )
      );
      return;
    }

    const newProject: Project = {
      id: createProjectId(),
      ...data,
    };

    persistProjects([newProject, ...projects]);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    persistProjects(projects.filter((project) => project.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <section id="projects" className="bg-bg-primary py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-terminal-white/20 pb-6 mb-8 md:mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative inline-block">
              <h2 className="text-terminal-green text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-glow relative z-10">
                PROJECT ARCHIVE
              </h2>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-terminal-green/20" />
            </div>

            <AdminSectionToolbar
              addLabel="+ NEW LOOT"
              onAdd={openAddForm}
              meta={`Loot Count: ${String(projects.length).padStart(2, "0")} · Access Level: ${isAdmin ? "WRITE_ENABLED" : "READ_ONLY"}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="border border-terminal-white/10 bg-bg-card p-8 text-center box-retro">
            <p className="text-terminal-muted text-sm tracking-wider">
              No projects loaded. Add your first loot entry in admin mode.
            </p>
          </div>
        )}
      </div>

      <ProjectFormModal
        key={`${formMode}-${editingProject?.id ?? "new"}-${formModalOpen}`}
        isOpen={formModalOpen}
        mode={formMode}
        initialData={editingProject}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveProject}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="DELETE_LOOT_ENTRY?"
        itemName={deleteTarget?.title ?? ""}
        description="Remove this entry from the archive. This cannot be undone."
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}
