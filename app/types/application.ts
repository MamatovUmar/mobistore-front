// Application types for admin panel

export type ApplicationStatus = "new" | "in_progress" | "done" | "rejected";
export type ApplicationType =
  | "general"
  | "question"
  | "complaint"
  | "technical"
  | "partnership"
  | "other";

export interface IApplication {
  id: number;
  type: ApplicationType;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  file_url: string | null;
  status: ApplicationStatus;
  ip: string;
  user_agent: string;
  browser: string;
  device_type: string;
  accept_language: string;
  created_at: string;
  updated_at: string;
}

export interface IApplicationFilters {
  search?: string;
  status?: ApplicationStatus;
  type?: ApplicationType;
  sortBy: "created_at" | "updated_at";
  sortOrder: "asc" | "desc";
}

export const APPLICATION_STATUS_MAP: Record<
  ApplicationStatus,
  { label: string; type: "success" | "warning" | "info" | "danger" }
> = {
  new: { label: "Новая", type: "info" },
  in_progress: { label: "В работе", type: "warning" },
  done: { label: "Выполнена", type: "success" },
  rejected: { label: "Отклонена", type: "danger" },
};

export const APPLICATION_TYPE_MAP: Record<ApplicationType, string> = {
  general: "Общий",
  question: "Вопрос",
  complaint: "Жалоба",
  technical: "Тех. вопрос",
  partnership: "Партнёрство",
  other: "Другое",
};
