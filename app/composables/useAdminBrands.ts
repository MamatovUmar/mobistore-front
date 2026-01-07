import type {
  IBrand,
  IBrandFilters,
  IBrandCreatePayload,
  IBrandUpdatePayload,
} from "@/types/brand";
import type { IPagination, IBaseResponse } from "@/types";

export const useAdminBrands = () => {
  const { $api } = useNuxtApp();

  const brands = ref<IBrand[]>([]);
  const pagination = ref<IPagination | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const defaultFilters: IBrandFilters = {
    search: "",
    sortBy: "name",
    sortOrder: "asc",
    is_popular: undefined,
  };

  const filters = ref<IBrandFilters>({ ...defaultFilters });
  const page = ref(1);
  const limit = ref(20);

  const fetchBrands = async () => {
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

      if (filters.value.is_popular !== undefined) {
        params.is_popular = filters.value.is_popular;
      }

      const response = await $api<
        IBaseResponse<{ brands: IBrand[]; pagination: IPagination }>
      >("/admin/brands", { params });

      if (response.data) {
        brands.value = response.data.brands;
        pagination.value = response.data.pagination;
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки брендов";
      console.error("Error fetching brands:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchBrandById = async (id: number): Promise<IBrand | null> => {
    try {
      const response = await $api<IBaseResponse<IBrand>>(`/admin/brands/${id}`);
      return response.data || null;
    } catch (err: any) {
      console.error("Error fetching brand:", err);
      return null;
    }
  };

  const createBrand = async (
    data: IBrandCreatePayload,
    logoFile?: File
  ): Promise<IBrand> => {
    const formData = new FormData();
    formData.append("name", data.name);

    if (data.is_popular !== undefined) {
      formData.append("is_popular", String(data.is_popular));
    }

    if (data.alias) {
      formData.append("alias", data.alias);
    }

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const response = await $api<IBaseResponse<IBrand>>("/admin/brands", {
      method: "POST",
      body: formData,
    });

    if (response.data) {
      // Add to local state
      brands.value.unshift(response.data);
      if (pagination.value) {
        pagination.value.total += 1;
      }
      return response.data;
    }

    throw new Error("Не удалось создать бренд");
  };

  const updateBrand = async (
    id: number,
    data: IBrandUpdatePayload
  ): Promise<IBrand> => {
    const response = await $api<IBaseResponse<IBrand>>(`/admin/brands/${id}`, {
      method: "PUT",
      body: data,
    });

    if (response.data) {
      // Update local state
      const index = brands.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        brands.value[index] = response.data;
      }
      return response.data;
    }

    throw new Error("Не удалось обновить бренд");
  };

  const deleteBrand = async (id: number): Promise<boolean> => {
    await $api(`/admin/brands/${id}`, {
      method: "DELETE",
    });

    // Remove from local state
    brands.value = brands.value.filter((b) => b.id !== id);
    if (pagination.value) {
      pagination.value.total -= 1;
    }

    return true;
  };

  const uploadLogo = async (id: number, file: File): Promise<IBrand> => {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await $api<IBaseResponse<IBrand>>(
      `/admin/brands/${id}/logo`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.data) {
      // Update local state
      const index = brands.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        brands.value[index] = response.data;
      }
      return response.data;
    }

    throw new Error("Не удалось загрузить логотип");
  };

  const deleteLogo = async (id: number): Promise<IBrand> => {
    const response = await $api<IBaseResponse<IBrand>>(
      `/admin/brands/${id}/logo`,
      {
        method: "DELETE",
      }
    );

    if (response.data) {
      // Update local state
      const index = brands.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        brands.value[index] = response.data;
      }
      return response.data;
    }

    throw new Error("Не удалось удалить логотип");
  };

  const resetFilters = () => {
    filters.value = { ...defaultFilters };
    page.value = 1;
  };

  const applyFilters = () => {
    page.value = 1;
    fetchBrands();
  };

  return {
    brands,
    pagination,
    loading,
    error,
    filters,
    page,
    limit,
    fetchBrands,
    fetchBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadLogo,
    deleteLogo,
    resetFilters,
    applyFilters,
  };
};
