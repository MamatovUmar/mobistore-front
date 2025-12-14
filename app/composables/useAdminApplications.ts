import type {
  IApplication,
  IApplicationFilters,
  ApplicationStatus,
} from "@/types/application";
import type { IPagination, IBaseResponse } from "@/types";

export const useAdminApplications = () => {
  const { $api } = useNuxtApp();

  const applications = ref<IApplication[]>([]);
  const pagination = ref<IPagination | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const defaultFilters: IApplicationFilters = {
    search: "",
    status: undefined,
    type: undefined,
    sortBy: "created_at",
    sortOrder: "desc",
  };

  const filters = ref<IApplicationFilters>({ ...defaultFilters });
  const page = ref(1);
  const limit = ref(20);

  const fetchApplications = async () => {
    loading.value = true;
    error.value = null;

    try {
      const params: Record<string, any> = {
        page: page.value,
        limit: limit.value,
        sortBy: filters.value.sortBy,
        sortOrder: filters.value.sortOrder,
      };

      if (filters.value.search) {
        params.search = filters.value.search;
      }

      if (filters.value.status) {
        params.status = filters.value.status;
      }

      if (filters.value.type) {
        params.type = filters.value.type;
      }

      const response = await $api<
        IBaseResponse<{ applications: IApplication[]; pagination: IPagination }>
      >("/applications/list", { params });

      if (response.data) {
        applications.value = response.data.applications;
        pagination.value = response.data.pagination;
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки заявок";
      console.error("Error fetching applications:", err);
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (
    id: number,
    status: ApplicationStatus
  ): Promise<boolean> => {
    try {
      await $api(`/applications/${id}/status`, {
        method: "PATCH",
        body: { status },
      });

      // Update local state
      const app = applications.value.find((a) => a.id === id);
      if (app) {
        app.status = status;
      }

      return true;
    } catch (err: any) {
      console.error("Error updating application status:", err);
      throw err;
    }
  };

  const deleteApplication = async (id: number): Promise<boolean> => {
    try {
      await $api(`/applications/${id}`, {
        method: "DELETE",
      });

      // Remove from local state
      applications.value = applications.value.filter((a) => a.id !== id);

      // Update pagination total
      if (pagination.value) {
        pagination.value.total -= 1;
      }

      return true;
    } catch (err: any) {
      console.error("Error deleting application:", err);
      throw err;
    }
  };

  const resetFilters = () => {
    filters.value = { ...defaultFilters };
    page.value = 1;
  };

  const applyFilters = () => {
    page.value = 1;
    fetchApplications();
  };

  return {
    applications,
    pagination,
    loading,
    error,
    filters,
    page,
    limit,
    fetchApplications,
    updateStatus,
    deleteApplication,
    resetFilters,
    applyFilters,
  };
};
