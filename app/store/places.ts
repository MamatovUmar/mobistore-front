import { defineStore } from "pinia";
import { ref } from "vue";
import type { IRegion } from "~/types/place";
import type { IBaseResponse } from "~/types";

export const usePlacesStore = defineStore("places", () => {
  const { $api } = useNuxtApp();

  const regions = ref<IRegion[]>([]);
  const regionsLoading = ref(false);
  const regionsLoaded = ref(false);

  const fetchRegions = async () => {
    if (regionsLoaded.value) {
      return; // Уже загружены, не запрашиваем повторно
    }

    regionsLoading.value = true;
    try {
      const res = await $api<IBaseResponse<IRegion[]>>("/places/regions");
      regions.value = res.data || [];
      regionsLoaded.value = true;
    } catch (error) {
      console.error("Error fetching regions:", error);
    } finally {
      regionsLoading.value = false;
    }
  };

  return {
    regions,
    regionsLoading,
    regionsLoaded,
    fetchRegions,
  };
});
