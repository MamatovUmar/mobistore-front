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

  const createModel = async (data: IModelCreatePayload): Promise<IModel> => {
    try {
      const response = await $api<IBaseResponse<IModel>>("/admin/models", {
        method: "POST",
        body: data,
      });
      if (!response.data) throw new Error("Нет данных");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Ошибка при создании модели"
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

  // Image Management
  const getModelImages = async (id: number): Promise<IModelImage[]> => {
    try {
      // API doc says array, but system uses IBaseResponse usually.
      // We'll type as `unknown` and inspect, or generic `any`.
      // But strictly following prompt "Response для списка изображений" -> Array
      // Let's assume it *might* be wrapped.
      const response = await $api<any>(`/admin/models/${id}/images`);

      if (Array.isArray(response)) return response;
      if (response.data && Array.isArray(response.data)) return response.data;
      if (response.data && response.data.images) return response.data.images;

      return [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Ошибка при получении изображений"
      );
    }
  };

  const uploadModelImages = async (
    id: number,
    files: File[]
  ): Promise<IModelImagesResponse> => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      // Prompt says response is { images: [], count: 2 }
      // This looks like it might be the `data` part of response.
      const response = await $api<IBaseResponse<IModelImagesResponse>>(
        `/admin/models/${id}/images`,
        {
          method: "POST",
          body: formData,
          // content-type is usually handled auto by fetch when body is FormData
        }
      );

      if (response.data) return response.data;
      // Fallback if not wrapped?
      // API client usually returns body.
      // If body IS the object (images, count), then `response.data` is undefined unless the object has a property `data`.
      // Let's assume wrapper.
      if ((response as any).images) return response as any; // If not wrapped

      throw new Error("Некорректный ответ сервера");
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Ошибка при загрузке изображений"
      );
    }
  };

  const deleteModelImage = async (
    modelId: number,
    imageId: number
  ): Promise<void> => {
    try {
      await $api(`/admin/models/${modelId}/images/${imageId}`, {
        method: "DELETE",
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Ошибка при удалении изображения"
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
    createModel,
    updateModel,
    deleteModel,
    getModelImages,
    uploadModelImages,
    deleteModelImage,
    resetFilters,
    applyFilters,
  };
};
