"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminSectionToolbar from "@/components/admin/AdminSectionToolbar";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import SkillFormModal from "@/components/skills/SkillFormModal";
import { usePortfolioAdmin } from "@/context/PortfolioAdminContext";
import EditTrigger from "@/components/admin/EditTrigger";
import GearEditModal from "@/components/admin/GearEditModal";
import SystemLogEditModal from "@/components/admin/SystemLogEditModal";
import { useSiteContent } from "@/context/SiteContentContext";
import { getSkillCategoryFilters } from "@/lib/skillCategories";
import {
  createSkillApi,
  deleteSkillApi,
  fetchSkills,
  updateSkillApi,
} from "@/lib/portfolioApi";
import type { Skill, SkillFilterCategory, SkillFormData } from "@/types/skill";

const coreAttributes = [
  { name: "Web_Vitals_Optimization", value: 95 },
  { name: "AI_Integration", value: 88 },
];

export default function SkillsSection() {
  const { isAdmin, requireAdmin } = usePortfolioAdmin();
  const { content, updateContent } = useSiteContent();
  const [gearEditOpen, setGearEditOpen] = useState(false);
  const [logEditOpen, setLogEditOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeCategory, setActiveCategory] = useState<SkillFilterCategory>("all");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await fetchSkills();
      setSkills(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const categories = useMemo(() => getSkillCategoryFilters(skills), [skills]);

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category.includes(activeCategory));

  const openAddForm = () => {
    setFormMode("add");
    setEditingSkill(undefined);
    setFormModalOpen(true);
  };

  const openEditForm = (skill: Skill) => {
    setFormMode("edit");
    setEditingSkill(skill);
    setFormModalOpen(true);
  };

  const handleAddClick = () => requireAdmin(openAddForm);
  const handleEdit = (skill: Skill) => requireAdmin(() => openEditForm(skill));
  const handleDeleteRequest = (skill: Skill) =>
    requireAdmin(() => setDeleteTarget(skill));

  const handleSaveSkill = async (data: SkillFormData, id?: string) => {
    try {
      if (id) {
        await updateSkillApi(id, data);
      } else {
        await createSkillApi(data);
      }
      await loadData();
      if (id && selectedSkill?.id === id) {
        setSelectedSkill({ id, ...data });
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to save skill");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSkillApi(deleteTarget.id);
      if (selectedSkill?.id === deleteTarget.id) setSelectedSkill(null);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to delete skill");
    }
  };

  return (
    <section id="skills" className="bg-bg-primary py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-terminal-white/20 pb-6 mb-8 md:mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-terminal-green text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider uppercase">
              Technical_Manifest
            </h2>
            <p className="text-terminal-muted text-xs sm:text-sm mt-2 tracking-wider">
              User_ID: _hellorupank · Level: 3+ Software_Engineer
            </p>
          </div>

          <AdminSectionToolbar
            addLabel="+ NEW SKILL"
            onAdd={openAddForm}
            meta={`Skill Count: ${String(skills.length).padStart(2, "0")} · Access Level: ${isAdmin ? "WRITE_ENABLED" : "READ_ONLY"} · Sync: Supabase`}
          />
        </div>

        {loadError && (
          <p className="text-accent-red text-xs tracking-wider border border-accent-red/30 bg-accent-red/10 px-3 py-2 mb-6">
            {loadError}
          </p>
        )}

        {isLoading ? (
          <p className="text-terminal-muted text-sm tracking-wider animate-blink mb-8">
            Loading technical manifest...
          </p>
        ) : (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="lg:w-56 shrink-0 space-y-6">
            <div className="bg-bg-card p-4 box-retro">
              <h3 className="text-terminal-green text-xs font-bold uppercase tracking-wider pb-3 mb-3 border-b border-terminal-white/20">
                Filter_Types
              </h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-xs tracking-wider transition-all duration-150 ${
                      activeCategory === cat.id
                        ? "text-terminal-green bg-terminal-green/10"
                        : "text-terminal-muted hover:text-terminal-white opacity-60 hover:opacity-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          activeCategory === cat.id
                            ? "bg-terminal-green"
                            : "bg-terminal-muted"
                        }`}
                      />
                      {cat.label}
                    </span>
                    <span className="text-terminal-muted">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-bg-card-alt border border-terminal-white/10 p-4">
              <h3 className="text-terminal-muted text-xs uppercase tracking-wider mb-3">
                Core_Attributes
              </h3>
              {coreAttributes.map((attr) => (
                <div key={attr.name} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-terminal-muted">{attr.name}</span>
                    <span className="text-terminal-muted">{attr.value}%</span>
                  </div>
                  <div className="h-1.5 bg-terminal-white/10 w-full">
                    <div
                      className="h-full bg-terminal-green/40 transition-all duration-1000"
                      style={{ width: `${attr.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredSkills.map((skill) => (
                <div key={skill.id} className="relative group/skill">
                  <button
                    onClick={() =>
                      setSelectedSkill(
                        selectedSkill?.id === skill.id ? null : skill
                      )
                    }
                    className={`w-full bg-bg-card border p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-200 hover:border-terminal-green/60 ${
                      selectedSkill?.id === skill.id
                        ? "border-terminal-green bg-terminal-green/5"
                        : skill.highlight
                          ? "border-terminal-green/30"
                          : "border-terminal-white/10"
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-2 h-8 flex items-center justify-center text-terminal-green/70 group-hover/skill:text-terminal-green transition-colors">
                      {skill.icon}
                    </div>
                    <span className="text-xs text-terminal-muted tracking-wider mb-1 truncate w-full">
                      {skill.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold tracking-widest ${
                        skill.highlight
                          ? "text-terminal-green text-glow-sm"
                          : "text-terminal-green"
                      }`}
                    >
                      {skill.level}
                    </span>
                  </button>

                  {isAdmin && (
                    <div className="mt-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(skill)}
                        className="flex-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-1 border border-terminal-green/40 text-terminal-green hover:bg-terminal-green/10 transition-colors"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRequest(skill)}
                        className="flex-1 text-[9px] font-bold uppercase tracking-widest px-1.5 py-1 border border-accent-red/40 text-accent-red hover:bg-accent-red/10 transition-colors"
                      >
                        DEL
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isAdmin && (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="border border-dashed border-terminal-green/30 p-4 flex flex-col items-center justify-center gap-1 hover:border-terminal-green/60 hover:bg-terminal-green/5 transition-all min-h-[108px]"
                >
                  <span className="text-2xl text-terminal-green">+</span>
                  <span className="text-[9px] text-terminal-muted tracking-widest uppercase">
                    Add Skill
                  </span>
                </button>
              )}
            </div>

            {filteredSkills.length === 0 && (
              <p className="text-terminal-muted text-sm tracking-wider mt-4 text-center">
                No skills in this category.
              </p>
            )}
          </div>

          <div className="lg:w-64 shrink-0 space-y-6">
            <div className="group/edit bg-bg-card-alt border-l-2 border-terminal-white/20 p-4 box-retro">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-terminal-green text-xs font-bold uppercase tracking-wider">
                  Equipped_Gear
                </h3>
                <EditTrigger
                  label="equipped gear"
                  onEdit={() => setGearEditOpen(true)}
                />
              </div>
              <div className="space-y-3">
                {content.equipped_gear.map((gear, i) => (
                  <div key={gear.id} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 shrink-0 flex items-center justify-center text-xs ${
                        i === 0
                          ? "bg-terminal-green text-black"
                          : "border border-terminal-white/20 text-terminal-muted"
                      }`}
                    >
                      {gear.icon}
                    </div>
                    <div>
                      <div className="text-xs text-terminal-muted tracking-wider">
                        {gear.name}
                      </div>
                      <div className="text-[10px] text-terminal-muted/60 tracking-wider">
                        {gear.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="group/edit bg-bg-card p-4 box-retro">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-terminal-muted text-xs uppercase tracking-wider">
                  System_Log:
                </h3>
                <EditTrigger
                  label="system log"
                  onEdit={() => setLogEditOpen(true)}
                />
              </div>
              <div className="space-y-1">
                {content.system_log.lines.map((line, i) => (
                  <p
                    key={`${line}-${i}`}
                    className={`text-[11px] leading-relaxed ${
                      line === "> _"
                        ? "text-terminal-green animate-blink"
                        : "text-terminal-green/50"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-bg-card border border-terminal-white/10 py-2.5 text-terminal-green text-xs font-bold uppercase tracking-widest hover:bg-terminal-green/10 hover:border-terminal-green/30 transition-all duration-200"
            >
              SYNC_PORTFOLIO
            </button>
          </div>
        </div>
        )}
      </div>

      <SkillFormModal
        key={`${formMode}-${editingSkill?.id ?? "new"}-${formModalOpen}`}
        isOpen={formModalOpen}
        mode={formMode}
        initialData={editingSkill}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveSkill}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="DELETE_SKILL_ENTRY?"
        itemName={deleteTarget?.name ?? ""}
        onConfirm={() => {
          void confirmDelete();
        }}
        onClose={() => setDeleteTarget(null)}
      />

      <GearEditModal
        key={`gear-edit-${gearEditOpen}-${content.equipped_gear.length}`}
        isOpen={gearEditOpen}
        initial={content.equipped_gear}
        onClose={() => setGearEditOpen(false)}
        onSave={async (items) => {
          await updateContent("equipped_gear", items);
        }}
      />

      <SystemLogEditModal
        key={`log-edit-${logEditOpen}-${content.system_log.lines.length}`}
        isOpen={logEditOpen}
        initialLines={content.system_log.lines}
        onClose={() => setLogEditOpen(false)}
        onSave={async (lines) => {
          await updateContent("system_log", { lines });
        }}
      />
    </section>
  );
}
