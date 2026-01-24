import type { IModelListResponse } from "@/types/model";
import type { IBaseResponse } from "@/types";

export const useModels = () => {
  const { $api } = useNuxtApp();

  const models = ref<IModelListResponse["models"]>([]);
  const pagination = ref<IModelListResponse["pagination"] | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchModelsByBrandAlias = async (
    brandAlias: string,
    page: number = 1,
    limit: number = 20
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $api<IBaseResponse<IModelListResponse>>(
        `/models/brand/alias/${brandAlias}`,
        {
          params: { page, limit },
        }
      );

      if (response.data) {
        models.value = response.data.models;
        pagination.value = response.data.pagination;
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки моделей";
      console.error("Error fetching models:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    models,
    pagination,
    loading,
    error,
    fetchModelsByBrandAlias,
  };
};
