import { ElMessage } from "#imports";
import { useRootStore } from "~/store/root";
import type { IBaseResponse } from "~/types";
import type { IListing } from "~/types/ads";

export const useFavorite = () => {
  const { $api } = useNuxtApp();
  const root = useRootStore()
  const { t } = useI18n();

  const addLoading = ref(false);
  const removeLoading = ref(false);
  const favorites = ref<IListing[]>([]);
  const listLoading = ref(false);

  const addToFavorite = catcher(
    async (adId: number) => {
      addLoading.value = true;
      await $api("/favorites", {
        method: "POST",
        body: { adId },
      });
      root.fetchUser();
      ElMessage.success(t("favorites.addSuccess"));
      addLoading.value = false;
    },
    () => {
      ElMessage.error(t("favorites.addError"));
      addLoading.value = false;
    }
  );

  const removeFavorite = catcher(
    async (adId: number) => {
      removeLoading.value = true;
      await $api(`/favorites/${adId}`, {
        method: "DELETE",
      });
      root.fetchUser();
      ElMessage.success(t("favorites.removeSuccess"));
      removeLoading.value = false;
    },
    () => {
      ElMessage.error(t("favorites.removeError"));
      removeLoading.value = false;
    }
  );

  const getProfileFavorites = catcher(async () => {
    listLoading.value = true;
    const result = await $api<IBaseResponse<IListing[]>>('/favorites')
    favorites.value = result.data || []
    listLoading.value = false;
    return result.data    
  }, () => {
    listLoading.value = false;
  })

  return {
    addToFavorite,
    removeFavorite,
    addLoading,
    removeLoading,
    getProfileFavorites,
    favorites,
    listLoading
  };
};
