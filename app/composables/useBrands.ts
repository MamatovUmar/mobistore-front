import type { IBrand } from "@/types/brand";
import type { IBaseResponse } from "@/types";

export const useBrands = () => {
  const { $api } = useNuxtApp();

  const brands = ref<IBrand[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchBrands = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $api<IBaseResponse<IBrand[]>>("/brands");

      if (response.data) {
        brands.value = response.data;
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки брендов";
      console.error("Error fetching brands:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchPopularBrands = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $api<IBaseResponse<IBrand[]>>("/brands/popular");

      if (response.data) {
        brands.value = response.data;
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка загрузки популярных брендов";
      console.error("Error fetching popular brands:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    brands,
    loading,
    error,
    fetchBrands,
    fetchPopularBrands,
  };
};
