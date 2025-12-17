import type { IBaseResponse, IPagination } from "~/types";
import type { IBrand } from "~/types/brand";

export type ParserStatus = "new" | "processing" | "completed" | "failed";

export interface IParserRecord {
  id: number;
  name: string;
  brand_id: number;
  brand: IBrand;
  status: ParserStatus;
  error_message: string | null;
  model_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface IParserStats {
  new: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface IParserFilters {
  page?: number;
  limit?: number;
  status?: ParserStatus;
  brandId?: number;
  search?: string;
  sortBy?: "id" | "name" | "created_at" | "status";
  sortOrder?: "asc" | "desc";
}

export interface IParserCreatePayload {
  name: string;
  brand_id: number;
}

export interface IParserBulkPayload {
  brand_id: number;
  models: string[];
}

export interface IParserResponse {
  entries: IParserRecord[];
  pagination: IPagination;
}

export const useAdminParser = () => {
  const { $api } = useNuxtApp();

  const loading = ref(false);
  const records = ref<IParserRecord[]>([]);
  const pagination = ref<IPagination | null>(null);
  const stats = ref<IParserStats | null>(null);

  const fetchRecords = async (filters: IParserFilters = {}) => {
    loading.value = true;
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      const url = `/admin/parser${queryString ? `?${queryString}` : ""}`;

      const result = await $api<IBaseResponse<IParserResponse>>(url);
      records.value = result.data?.entries ?? [];
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
      const result = await $api<IBaseResponse<IParserStats>>("/admin/parser/stats");
      stats.value = result.data ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    }
  };

  const fetchRecordById = async (id: number): Promise<IParserRecord | null> => {
    try {
      const result = await $api<IBaseResponse<IParserRecord>>(`/admin/parser/${id}`);
      return result.data ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      return null;
    }
  };

  const createRecord = async (payload: IParserCreatePayload): Promise<IParserRecord | null> => {
    try {
      const result = await $api<IBaseResponse<IParserRecord>>("/admin/parser", {
        method: "POST",
        body: payload,
      });
      ElMessage.success(result.message || "Модель добавлена в очередь");
      return result.data ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      return null;
    }
  };

  const retryRecord = async (id: number): Promise<IParserRecord | null> => {
    try {
      const result = await $api<IBaseResponse<IParserRecord>>(`/admin/parser/${id}/retry`, {
        method: "POST",
      });
      ElMessage.success(result.message || "Повторная обработка запущена");

      const index = records.value.findIndex((r) => r.id === id);
      if (index !== -1 && result.data) {
        records.value[index] = result.data;
      }

      return result.data ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      return null;
    }
  };

  const deleteRecord = async (id: number): Promise<boolean> => {
    try {
      const result = await $api<IBaseResponse<void>>(`/admin/parser/${id}`, {
        method: "DELETE",
      });
      ElMessage.success(result.message || "Запись удалена");

      records.value = records.value.filter((r) => r.id !== id);
      if (pagination.value) {
        pagination.value.total -= 1;
      }

      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      return false;
    }
  };

  const createBulkRecords = async (payload: IParserBulkPayload): Promise<IParserRecord[] | null> => {
    try {
      const result = await $api<IBaseResponse<IParserRecord[]>>("/admin/parser/bulk", {
        method: "POST",
        body: payload,
      });
      ElMessage.success(result.message || `Добавлено ${payload.models.length} моделей в очередь`);
      return result.data ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      return null;
    }
  };

  const refresh = async (filters: IParserFilters = {}) => {
    await Promise.all([fetchRecords(filters), fetchStats()]);
  };

  return {
    loading,
    records,
    pagination,
    stats,
    fetchRecords,
    fetchStats,
    fetchRecordById,
    createRecord,
    createBulkRecords,
    retryRecord,
    deleteRecord,
    refresh,
  };
};
