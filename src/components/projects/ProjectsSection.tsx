"use client";

import { useCallback, useEffect, useState } from "react";
import AdminSectionToolbar from "@/components/admin/AdminSectionToolbar";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFormModal from "@/components/projects/ProjectFormModal";
import { usePortfolioAdmin } from "@/context/PortfolioAdminContext";
import {
  createProjectApi,
  deleteProjectApi,
  fetchProjects,
  updateProjectApi,
} from "@/lib/portfolioApi";
import type { Project, ProjectFormData } from "@/types/project";

export default function ProjectsSection() {
  const { isAdmin, requireAdmin } = usePortfolioAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load projects"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

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

  const handleSaveProject = async (data: ProjectFormData, id?: string) => {
    try {
      if (id) {
        await updateProjectApi(id, data);
      } else {
        await createProjectApi(data);
      }
      await loadData();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to save project");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProjectApi(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to delete project");
    }
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
              meta={`Loot Count: ${String(projects.length).padStart(2, "0")} · Access Level: ${isAdmin ? "WRITE_ENABLED" : "READ_ONLY"} · Sync: Supabase`}
            />
          </div>
        </div>

        {loadError && (
          <p className="text-accent-red text-xs tracking-wider border border-accent-red/30 bg-accent-red/10 px-3 py-2 mb-6">
            {loadError}
          </p>
        )}

        {isLoading ? (
          <p className="text-terminal-muted text-sm tracking-wider animate-blink">
            Loading project archive...
          </p>
        ) : (
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
        )}

        {!isLoading && projects.length === 0 && !loadError && (
          <div className="border border-terminal-white/10 bg-bg-card p-8 text-center box-retro">
            <p className="text-terminal-muted text-sm tracking-wider">
              No projects in the archive yet.
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
        onConfirm={() => {
          void confirmDelete();
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}
