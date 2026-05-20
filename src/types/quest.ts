export type QuestStatus = "active" | "completed";

export interface Quest {
  id: string;
  status: QuestStatus;
  title: string;
  company: string;
  period: string;
  description: string;
}

export type QuestFormData = Omit<Quest, "id">;
