import type {
  IModel,
  IModelResponse,
  IModelCreatePayload,
  IModelUpdatePayload,
  IModelImage,
  IModelImagesResponse,
} from "@/types/model";
import type { IPagination, IBaseResponse } from "@/types";

export const useAdminModels = () => {
  const { $api } = useNuxtApp();

  // State
  const models = ref<IModel[]>([]);
  const pagination = ref<IPagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const loading = ref(false);
  const filters = ref({
    search: "",
    brandId: undefined as number | undefined,
    sortBy: "id",
    sortOrder: "desc" as "asc" | "desc",
  });
  const page = ref(1);
  const limit = ref(20);

  // Methods
  const fetchModels = async () => {
    loading.value = true;
    try {
      const params = {
        page: page.value,
        limit: limit.value,
        search: filters.value.search || undefined,
        brandId: filters.value.brandId,
        sortBy: filters.value.sortBy,
        sortOrder: filters.value.sortOrder,
      };

      const response = await $api<IBaseResponse<IModelResponse>>(
        "/admin/models",
        {
          params,
        }
      );

      if (response.data) {
        models.value = response.data.models;
        pagination.value = response.data.pagination;
      }
    } catch (error) {
      ElMessage.error("Ошибка при загрузке моделей");
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const getModel = async (id: number): Promise<IModel> => {
    try {
      const response = await $api<IBaseResponse<IModel>>(`/admin/models/${id}`);
      if (!response.data) throw new Error("Нет данных");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Ошибка при получении модели"
      );
    }
  };

  const updateModel = async (
    id: number,
    data: IModelUpdatePayload
  ): Promise<IModel> => {
    try {
      const response = await $api<IBaseResponse<IModel>>(
        `/admin/models/${id}`,
        {
          method: "PUT",
          body: data,
        }
      );
      if (!response.data) throw new Error("Нет данных");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Ошибка при обновлении модели"
      );
    }
  };

  const deleteModel = async (id: number): Promise<void> => {
    try {
      await $api(`/admin/models/${id}`, {
        method: "DELETE",
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Ошибка при удалении модели"
      );
    }
  };

  const resetFilters = () => {
    filters.value = {
      search: "",
      brandId: undefined,
      sortBy: "id",
      sortOrder: "desc",
    };
    page.value = 1;
  };

  const applyFilters = (newFilters: any) => {
    filters.value = { ...filters.value, ...newFilters };
    page.value = 1;
    fetchModels();
  };

  return {
    // State
    models,
    pagination,
    loading,
    filters,
    page,
    limit,

    // Methods
    fetchModels,
    getModel,
    updateModel,
    deleteModel,
    resetFilters,
    applyFilters,
  };
};
