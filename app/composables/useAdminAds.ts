import type { IBaseResponse, IPagination } from "@/types";
import type { IListing, ListingStatus } from "@/types/ads";

export interface IAdminAdsStats {
  total: number;
  byStatus: {
    draft: number;
    active: number;
    sold: number;
    archived: number;
    moderation: number;
    rejected: number;
  };
  todayCreated: number;
  todayPublished: number;
}

export interface IAdminAdsFilters {
  page?: number;
  limit?: number;
  status?: ListingStatus;
  userId?: number;
  search?: string;
  sortBy?: "created_at" | "updated_at" | "price" | "views_count";
  sortOrder?: "asc" | "desc";
}

export interface IAdminAdsResponse {
  ads: IListing[];
  pagination: IPagination;
}

export interface IAdUpdateStatusPayload {
  status: ListingStatus;
  reason?: string;
}

export interface IRejectPayload {
  reason: string;
}

export interface IDeleteResponse {
  deletedImages: number;
  deletedFavorites: number;
}

export const useAdminAds = () => {
  const { $api } = useNuxtApp();

  const loading = ref(false);
  const ads = ref<IListing[]>([]);
  const pagination = ref<IPagination | null>(null);
  const stats = ref<IAdminAdsStats | null>(null);
  const selectedAd = ref<IListing | null>(null);
  const moderationAds = ref<IListing[]>([]);

  // Build query string from filters
  const buildQueryString = (filters: IAdminAdsFilters): string => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    return params.toString();
  };

  // ADMIN: Get all ads with filters
  const fetchAds = async (filters: IAdminAdsFilters = {}) => {
    loading.value = true;
    try {
      const queryString = buildQueryString(filters);
      const url = `/admin/ads${queryString ? `?${queryString}` : ""}`;
      const result = await $api<IBaseResponse<IAdminAdsResponse>>(url);
      ads.value = result.data?.ads ?? [];
      pagination.value = result.data?.pagination ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    } finally {
      loading.value = false;
    }
  };

  // ADMIN: Get statistics
  const fetchStats = async () => {
    try {
      const result = await $api<IBaseResponse<IAdminAdsStats>>("/admin/ads/statistics");
      stats.value = result.data ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    }
  };

  // MODERATOR + ADMIN: Get moderation queue
  const fetchModerationAds = async (filters: IAdminAdsFilters = {}) => {
    loading.value = true;
    try {
      const queryString = buildQueryString(filters);
      const url = `/admin/ads/moderation${queryString ? `?${queryString}` : ""}`;
      const result = await $api<IBaseResponse<IAdminAdsResponse>>(url);
      ads.value = result.data?.ads ?? [];
      pagination.value = result.data?.pagination ?? null;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
    } finally {
      loading.value = false;
    }
  };

  // MODERATOR + ADMIN: Get ad for review
  const fetchAdForReview = async (id: number) => {
    loading.value = true;
    try {
      const result = await $api<IBaseResponse<IListing>>(`/admin/ads/${id}/review`);
      selectedAd.value = result.data ?? null;
      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // MODERATOR + ADMIN: Approve ad
  const approveAd = async (id: number) => {
    try {
      const result = await $api<IBaseResponse<IListing>>(`/admin/ads/${id}/approve`, {
        method: "POST",
      });
      ElMessage.success(result.message || "Объявление одобрено");

      // Update local state
      const index = ads.value.findIndex((ad) => ad.id === id);
      if (index !== -1 && result.data) {
        ads.value[index] = result.data;
      }
      if (selectedAd.value?.id === id && result.data) {
        selectedAd.value = result.data;
      }

      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  // MODERATOR + ADMIN: Reject ad
  const rejectAd = async (id: number, payload: IRejectPayload) => {
    try {
      const result = await $api<IBaseResponse<IListing>>(`/admin/ads/${id}/reject`, {
        method: "POST",
        body: payload,
      });
      ElMessage.success(result.message || "Объявление отклонено");

      // Update local state
      const index = ads.value.findIndex((ad) => ad.id === id);
      if (index !== -1 && result.data) {
        ads.value[index] = result.data;
      }
      if (selectedAd.value?.id === id && result.data) {
        selectedAd.value = result.data;
      }

      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  // ADMIN: Force change status
  const changeStatus = async (id: number, payload: IAdUpdateStatusPayload) => {
    try {
      const result = await $api<IBaseResponse<IListing>>(`/admin/ads/${id}/status`, {
        method: "PATCH",
        body: payload,
      });
      ElMessage.success(result.message || "Статус изменён");

      // Update local state
      const index = ads.value.findIndex((ad) => ad.id === id);
      if (index !== -1 && result.data) {
        ads.value[index] = result.data;
      }
      if (selectedAd.value?.id === id && result.data) {
        selectedAd.value = result.data;
      }

      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  // ADMIN: Edit ad without owner check
  const updateAd = async (id: number, payload: Partial<IListing>) => {
    try {
      const result = await $api<IBaseResponse<IListing>>(`/admin/ads/${id}`, {
        method: "PUT",
        body: payload,
      });
      ElMessage.success(result.message || "Объявление обновлено");

      // Update local state
      const index = ads.value.findIndex((ad) => ad.id === id);
      if (index !== -1 && result.data) {
        ads.value[index] = result.data;
      }
      if (selectedAd.value?.id === id && result.data) {
        selectedAd.value = result.data;
      }

      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  // ADMIN: Delete ad completely
  const deleteAd = async (id: number) => {
    try {
      const result = await $api<IBaseResponse<IDeleteResponse>>(`/admin/ads/${id}`, {
        method: "DELETE",
      });
      ElMessage.success(result.message || "Объявление удалено");

      // Remove from local state
      ads.value = ads.value.filter((ad) => ad.id !== id);
      if (selectedAd.value?.id === id) {
        selectedAd.value = null;
      }

      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  // ADMIN: Ban all user ads
  const banUserAds = async (userId: number) => {
    try {
      const result = await $api<IBaseResponse<{ count: number }>>(`/admin/ads/users/${userId}/ban-ads`, {
        method: "POST",
      });
      ElMessage.success(result.message || "Объявления пользователя заблокированы");
      return result.data;
    } catch (error) {
      const message = getErrorMessage(error);
      ElMessage.error(message);
      throw error;
    }
  };

  // Refresh data based on role
  const refresh = async (filters: IAdminAdsFilters = {}, isAdmin: boolean) => {
    if (isAdmin) {
      await Promise.all([fetchAds(filters), fetchStats()]);
    } else {
      await fetchModerationAds(filters);
    }
  };

  return {
    loading,
    ads,
    pagination,
    stats,
    selectedAd,
    moderationAds,
    fetchAds,
    fetchStats,
    fetchModerationAds,
    fetchAdForReview,
    approveAd,
    rejectAd,
    changeStatus,
    updateAd,
    deleteAd,
    banUserAds,
    refresh,
  };
};
