"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AdminSectionToolbar from "@/components/admin/AdminSectionToolbar";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import QuestFormModal from "@/components/quests/QuestFormModal";
import { usePortfolioAdmin } from "@/context/PortfolioAdminContext";
import { INITIAL_QUESTS } from "@/data/initialQuests";
import { createQuestId, loadQuests, saveQuests } from "@/lib/questsStorage";
import type { Quest, QuestFormData } from "@/types/quest";

const skillTree = [
  { name: "React Framework", level: "LVL 99", width: 99 },
  { name: "Tailwind CSS", level: "LVL 92", width: 92 },
];

export default function ExperienceSection() {
  const { isAdmin, requireAdmin } = usePortfolioAdmin();
  const [quests, setQuests] = useState<Quest[]>(() =>
    typeof window === "undefined" ? INITIAL_QUESTS : loadQuests()
  );
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingQuest, setEditingQuest] = useState<Quest | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Quest | null>(null);

  const persistQuests = useCallback((nextQuests: Quest[]) => {
    setQuests(nextQuests);
    saveQuests(nextQuests);
  }, []);

  const openAddForm = () => {
    setFormMode("add");
    setEditingQuest(undefined);
    setFormModalOpen(true);
  };

  const openEditForm = (quest: Quest) => {
    setFormMode("edit");
    setEditingQuest(quest);
    setFormModalOpen(true);
  };

  const handleEdit = (quest: Quest) => requireAdmin(() => openEditForm(quest));
  const handleDeleteRequest = (quest: Quest) =>
    requireAdmin(() => setDeleteTarget(quest));

  const handleSaveQuest = (data: QuestFormData, id?: string) => {
    if (id) {
      persistQuests(
        quests.map((quest) => (quest.id === id ? { ...quest, ...data, id } : quest))
      );
      return;
    }

    const newQuest: Quest = { id: createQuestId(), ...data };
    persistQuests([newQuest, ...quests]);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    persistQuests(quests.filter((quest) => quest.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <section id="experience" className="bg-bg-primary py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-terminal-white/20 pb-6 mb-8 md:mb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative inline-block">
              <h2 className="text-terminal-green text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-glow relative z-10">
                QUEST LOG
              </h2>
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-terminal-green/20" />
            </div>

            <AdminSectionToolbar
              addLabel="+ NEW QUEST"
              onAdd={openAddForm}
              meta={`Quest Count: ${String(quests.length).padStart(2, "0")} · Access Level: ${isAdmin ? "WRITE_ENABLED" : "READ_ONLY"}`}
            />
          </div>

          <p className="text-terminal-muted text-xs sm:text-sm mt-3 tracking-wider sm:hidden">
            System Status: Operational · User: _hellorupank · Level: Software Engineer
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-terminal-white/10" />

          <div className="space-y-8 md:space-y-12">
            {quests.map((quest, index) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                index={index}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>

          {quests.length === 0 && (
            <div className="border border-terminal-white/10 bg-bg-card p-8 text-center box-retro">
              <p className="text-terminal-muted text-sm tracking-wider">
                No quests in the log. Add your first entry in admin mode.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkillTreeTeaser />
          <AchievementsTeaser />
          <UnlockNextTeaser />
        </div>
      </div>

      <QuestFormModal
        key={`${formMode}-${editingQuest?.id ?? "new"}-${formModalOpen}`}
        isOpen={formModalOpen}
        mode={formMode}
        initialData={editingQuest}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSaveQuest}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="DELETE_QUEST_ENTRY?"
        itemName={deleteTarget ? `${deleteTarget.title} @ ${deleteTarget.company}` : ""}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </section>
  );
}

function QuestCard({
  quest,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: {
  quest: Quest;
  index: number;
  isAdmin: boolean;
  onEdit: (quest: Quest) => void;
  onDelete: (quest: Quest) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative pl-10 md:pl-20 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div
        className={`absolute left-2.5 md:left-6.5 top-2 w-3 h-3 rounded-full border-2 ${
          quest.status === "active"
            ? "bg-terminal-green border-terminal-green shadow-[0_0_8px_rgba(0,255,0,0.6)]"
            : "bg-terminal-white/20 border-terminal-white/40"
        }`}
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="md:w-64 shrink-0">
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 mb-2 ${
              quest.status === "active"
                ? "bg-terminal-green text-black"
                : "bg-terminal-white/10 text-terminal-muted"
            }`}
          >
            {quest.status === "active" ? "Active Quest" : "Quest Completed"}
          </span>
          <h3
            className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight ${
              quest.status === "active"
                ? "text-terminal-green text-glow-sm"
                : "text-terminal-muted"
            }`}
          >
            {quest.title}
          </h3>
          <p className="text-terminal-muted text-xs tracking-wider mt-1">
            {quest.company} &bull; {quest.period}
          </p>
        </div>

        <div className="flex-1">
          <div className="border-l-2 p-4 sm:p-6 bg-bg-card box-retro border-terminal-white/20">
            <p
              className={`text-sm leading-relaxed ${
                quest.status === "active"
                  ? "text-terminal-muted"
                  : "text-terminal-muted/70"
              }`}
            >
              {quest.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="#projects"
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 transition-colors ${
                  quest.status === "active"
                    ? "bg-terminal-green text-black hover:bg-terminal-green/90"
                    : "bg-terminal-white/10 text-terminal-green hover:bg-terminal-white/20"
                }`}
              >
                VIEW LOOT
              </a>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(quest)}
                    className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-terminal-green/40 text-terminal-green hover:bg-terminal-green/10 transition-colors"
                  >
                    EDIT
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(quest)}
                    className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-accent-red/40 text-accent-red hover:bg-accent-red/10 transition-colors"
                  >
                    DELETE
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillTreeTeaser() {
  return (
    <div className="bg-bg-card-alt border border-terminal-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="text-terminal-green"
        >
          <path
            d="M8 1L14 5V11L8 15L2 11V5L8 1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <h3 className="text-terminal-green text-sm font-bold uppercase tracking-wider">
          Skill Tree
        </h3>
      </div>
      <div className="space-y-3">
        {skillTree.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-terminal-muted">{skill.name}</span>
              <span className="text-terminal-muted">{skill.level}</span>
            </div>
            <div className="h-1.5 bg-terminal-white/10 w-full">
              <div
                className="h-full bg-terminal-green/30"
                style={{ width: `${skill.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsTeaser() {
  return (
    <div className="bg-bg-card-alt border border-terminal-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="text-terminal-muted"
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <h3 className="text-terminal-muted text-sm font-bold uppercase tracking-wider">
          Achievements
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["40%", "4.9★", "300+"].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-lg font-bold text-terminal-green">{stat}</div>
            <div className="text-[9px] text-terminal-muted uppercase tracking-wider">
              {i === 0 ? "WEB VITALS" : i === 1 ? "RATING" : "QUERIES"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UnlockNextTeaser() {
  return (
    <a
      href="#projects"
      className="bg-bg-card border border-terminal-white/10 p-5 flex items-center gap-3 group cursor-pointer hover:border-terminal-green/30 transition-all"
    >
      <div className="w-10 h-10 shrink-0 border border-terminal-white/10 flex items-center justify-center group-hover:border-terminal-green/30 transition-all">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="text-terminal-green"
        >
          <rect
            x="3"
            y="7"
            width="10"
            height="7"
            rx="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M5 7V5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5V7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-terminal-green text-sm font-bold tracking-wider">
          Unlock Next Project
        </h3>
        <p className="text-[10px] text-terminal-muted tracking-wider">
          CONTINUE_QUEST →
        </p>
      </div>
    </a>
  );
}
