import type { IStaffMember, IStaffFilters, IStaffUpdatePayload, UserRole } from "@/types/admin-staff";
import type { IAdminUser } from "@/types/admin-user";
import type { IPagination, IBaseResponse } from "@/types";

export const useAdminStaff = () => {
  const { $api } = useNuxtApp();

  const staff = ref<IStaffMember[]>([]);
  const pagination = ref<IPagination | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const defaultFilters: IStaffFilters = {
    search: "",
    sortBy: "created_at",
    sortOrder: "desc",
  };

  const filters = ref<IStaffFilters>({ ...defaultFilters });
  const page = ref(1);
  const limit = ref(20);

  const fetchStaff = async () => {
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

      const response = await $api<IBaseResponse<{ users: IStaffMember[]; pagination: IPagination }>>(
        "/admin/users/staff",
        { params }
      );

      if (response.data) {
        staff.value = response.data.users;
        pagination.value = response.data.pagination;
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки сотрудников";
      console.error("Error fetching staff:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchStaffById = async (id: number): Promise<IStaffMember | null> => {
    try {
      const response = await $api<IBaseResponse<IStaffMember>>(`/admin/users/staff/${id}`);
      return response.data || null;
    } catch (err: any) {
      console.error("Error fetching staff member:", err);
      return null;
    }
  };

  const updateStaff = async (id: number, payload: IStaffUpdatePayload): Promise<boolean> => {
    try {
      await $api(`/admin/users/staff/${id}`, {
        method: "PUT",
        body: payload,
      });
      return true;
    } catch (err: any) {
      console.error("Error updating staff:", err);
      throw err;
    }
  };

  const changeRole = async (id: number, role: UserRole): Promise<string> => {
    try {
      const response = await $api<IBaseResponse<{ message: string }>>(
        `/admin/users/${id}/role`,
        {
          method: "PATCH",
          body: { role },
        }
      );
      return response.message || "Роль успешно изменена";
    } catch (err: any) {
      console.error("Error changing role:", err);
      throw err;
    }
  };

  // Search users for autocomplete (to add as staff)
  const searchUsers = async (query: string): Promise<IAdminUser[]> => {
    if (!query || query.length < 2) return [];

    try {
      const response = await $api<IBaseResponse<{ users: IAdminUser[] }>>(
        "/admin/users",
        {
          params: {
            search: query,
            limit: 10,
          },
        }
      );
      return response.data?.users || [];
    } catch (err: any) {
      console.error("Error searching users:", err);
      return [];
    }
  };

  const resetFilters = () => {
    filters.value = { ...defaultFilters };
    page.value = 1;
  };

  const applyFilters = () => {
    page.value = 1;
    fetchStaff();
  };

  return {
    staff,
    pagination,
    loading,
    error,
    filters,
    page,
    limit,
    fetchStaff,
    fetchStaffById,
    updateStaff,
    changeRole,
    searchUsers,
    resetFilters,
    applyFilters,
  };
};
