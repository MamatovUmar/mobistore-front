import type { IAdminUser, IAdminUserFilters, IAdminUserUpdatePayload } from "@/types/admin-user";
import type { IPagination, IBaseResponse } from "@/types";

export const useAdminUsers = () => {
  const { $api } = useNuxtApp();

  const users = ref<IAdminUser[]>([]);
  const pagination = ref<IPagination | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const defaultFilters: IAdminUserFilters = {
    search: "",
    is_ban: null,
    is_verified: null,
    sortBy: "created_at",
    sortOrder: "desc",
  };

  const filters = ref<IAdminUserFilters>({ ...defaultFilters });
  const page = ref(1);
  const limit = ref(20);

  const fetchUsers = async () => {
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

      if (filters.value.is_ban !== null) {
        params.is_ban = filters.value.is_ban;
      }

      if (filters.value.is_verified !== null) {
        params.is_verified = filters.value.is_verified;
      }

      const response = await $api<IBaseResponse<{ users: IAdminUser[]; pagination: IPagination }>>(
        "/admin/users",
        { params }
      );

      if (response.data) {
        users.value = response.data.users;
        pagination.value = response.data.pagination;
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки пользователей";
      console.error("Error fetching users:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchUserById = async (id: number): Promise<IAdminUser | null> => {
    try {
      const response = await $api<IBaseResponse<IAdminUser>>(`/admin/users/${id}`);
      return response.data || null;
    } catch (err: any) {
      console.error("Error fetching user:", err);
      return null;
    }
  };

  const updateUser = async (id: number, payload: IAdminUserUpdatePayload): Promise<boolean> => {
    try {
      await $api(`/admin/users/${id}`, {
        method: "PUT",
        body: payload,
      });
      return true;
    } catch (err: any) {
      console.error("Error updating user:", err);
      throw err;
    }
  };

  const generatePassword = async (id: number): Promise<string> => {
    try {
      const response = await $api<IBaseResponse<{ message: string }>>(
        `/admin/users/${id}/generate-password`,
        { method: "POST" }
      );
      return response.data?.message || "Новый пароль отправлен на email пользователя";
    } catch (err: any) {
      console.error("Error generating password:", err);
      throw err;
    }
  };

  const banUser = async (id: number): Promise<{ message: string; archivedAds: number }> => {
    try {
      const response = await $api<IBaseResponse<{ archivedAds: number; message: string }>>(
        `/admin/users/${id}/ban`,
        { method: "POST" }
      );
      return {
        message: response.data?.message || "Пользователь забанен",
        archivedAds: response.data?.archivedAds || 0,
      };
    } catch (err: any) {
      console.error("Error banning user:", err);
      throw err;
    }
  };

  const unbanUser = async (id: number): Promise<string> => {
    try {
      const response = await $api<IBaseResponse<{ message: string }>>(
        `/admin/users/${id}/unban`,
        { method: "POST" }
      );
      return response.data?.message || "Пользователь разбанен";
    } catch (err: any) {
      console.error("Error unbanning user:", err);
      throw err;
    }
  };

  const resetFilters = () => {
    filters.value = { ...defaultFilters };
    page.value = 1;
  };

  const applyFilters = () => {
    page.value = 1;
    fetchUsers();
  };

  return {
    users,
    pagination,
    loading,
    error,
    filters,
    page,
    limit,
    fetchUsers,
    fetchUserById,
    updateUser,
    generatePassword,
    banUser,
    unbanUser,
    resetFilters,
    applyFilters,
  };
};
