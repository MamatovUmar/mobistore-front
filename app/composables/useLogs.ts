import type { IBaseResponse, IPagination } from "~/types";

export type LogType = "error" | "warning" | "info" | "debug";
export type LogStatus = "pending" | "reviewed" | "resolved" | "ignored";

export interface ILog {
  id: number;
  type: LogType;
  message: string;
  stack: string | null;
  status_code: number | null;
  method: string | null;
  path: string | null;
  ip: string | null;
  user_agent: string | null;
  headers: Record<string, any> | null;
  request_body: Record<string, any> | null;
  user_id: number | null;
  status: LogStatus;
  reviewed_by: number | null;
  reviewed_at: string | null;
  notes: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface ILogStats {
  total: number;
  by_type: Record<LogType, number>;
  by_status: Record<LogStatus, number>;
  today: number;
  this_week: number;
}

export interface ILogsResponse {
  logs: ILog[];
  pagination: IPagination;
}

export interface ILogsFilters {
  page?: number;
  limit?: number;
  type?: LogType;
  status?: LogStatus;
  user_id?: number;
  from_date?: string;
  to_date?: string;
}

export interface IUpdateStatusPayload {
  status: LogStatus;
  notes?: string;
}

export interface IBulkUpdateStatusPayload {
  ids: number[];
  status: LogStatus;
  notes?: string;
}

export interface ICleanupPayload {
  before_date: string;
  type?: LogType;
  status?: LogStatus;
}

export const useLogs = () => {
  const { $api } = useNuxtApp();

  const loading = ref(false);
  const logs = ref<ILog[]>([]);
  const pagination = ref<IPagination | null>(null);
  const stats = ref<ILogStats | null>(null);
  const selectedLog = ref<ILog | null>(null);

  const fetchLogs = async (filters: ILogsFilters = {}) => {
    loading.value = true;
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      const url = `/logs${queryString ? `?${queryString}` : ""}`;

      const result = await $api<IBaseResponse<ILogsResponse>>(url);
      logs.value = result.data?.logs ?? [];
      pagination.value = result.data?.pagination ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    } finally {
      loading.value = false;
    }
  };

  const fetchStats = async () => {
    try {
      const result = await $api<IBaseResponse<ILogStats>>("/logs/stats");
      stats.value = result.data ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    }
  };

  const fetchLogById = async (id: number) => {
    loading.value = true;
    try {
      const result = await $api<IBaseResponse<ILog>>(`/logs/${id}`);
      selectedLog.value = result.data ?? null;
      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: number, payload: IUpdateStatusPayload) => {
    try {
      const result = await $api<IBaseResponse<ILog>>(`/logs/${id}/status`, {
        method: "PATCH",
        body: payload,
      });
      ElMessage.success(result.message || "Статус обновлён");

      const index = logs.value.findIndex((log) => log.id === id);
      if (index !== -1 && result.data) {
        logs.value[index] = result.data;
      }
      if (selectedLog.value?.id === id && result.data) {
        selectedLog.value = result.data;
      }

      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  const bulkUpdateStatus = async (payload: IBulkUpdateStatusPayload) => {
    try {
      const result = await $api<IBaseResponse<void>>("/logs/bulk/status", {
        method: "PATCH",
        body: payload,
      });
      ElMessage.success(result.message || "Статусы обновлены");
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  const cleanupLogs = async (payload: ICleanupPayload) => {
    try {
      const result = await $api<IBaseResponse<{ deleted: number }>>("/logs/cleanup", {
        method: "DELETE",
        body: payload,
      });
      ElMessage.success(result.message || "Логи очищены");
      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  const refresh = async (filters: ILogsFilters = {}) => {
    await Promise.all([fetchLogs(filters), fetchStats()]);
  };

  return {
    loading,
    logs,
    pagination,
    stats,
    selectedLog,
    fetchLogs,
    fetchStats,
    fetchLogById,
    updateStatus,
    bulkUpdateStatus,
    cleanupLogs,
    refresh,
  };
};
