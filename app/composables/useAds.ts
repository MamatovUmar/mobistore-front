import { ListingStatus, type IState } from "~/types/ads";
import type { IBaseResponse } from "~/types";

export const useAds = () => {

  const {$api} = useNuxtApp();
  const { t } = useI18n();

  const bumpLoading = ref(false);

  const getStatusLabel = (status: ListingStatus) => {
    const labels: Record<ListingStatus, string> = {
      [ListingStatus.ACTIVE]: t("ads.status.active"),
      [ListingStatus.DRAFT]: t("ads.status.draft"),
      [ListingStatus.ARCHIVED]: t("ads.status.archived"),
      [ListingStatus.SOLD]: t("ads.status.sold"),
      [ListingStatus.MODERATION]: t("ads.status.moderation"),
      [ListingStatus.REJECTED]: t("ads.status.rejected"),
    };
    return labels[status] || status;
  };

  const getStatusType = (status: ListingStatus) => {
    const types: Record<
      ListingStatus,
      "success" | "warning" | "info" | "danger"
    > = {
      [ListingStatus.ACTIVE]: "success",
      [ListingStatus.DRAFT]: "warning",
      [ListingStatus.ARCHIVED]: "info",
      [ListingStatus.SOLD]: "info",
      [ListingStatus.MODERATION]: "warning",
      [ListingStatus.REJECTED]: "danger",
    };
    return types[status] || "info";
  };

  const getStateLabel = (state: IState) => {
    const labels: Record<IState, string> = {
      new: t("ads.state.new"),
      used: t("ads.state.used"),
      restored: t("ads.state.restored"),
    };
    return labels[state] || state;
  };

  const changeStatus = catcher(async (id: number, status: ListingStatus) => {
    const result = await $api<IBaseResponse<{}>>(`/ads/${id}/status`, {
      method: "PATCH",
      body: {
        status,
      },
    });
    
    ElMessage.success(result.message);
  }, (error: any) => {
    const message = getErrorMessage(error)
    ElMessage.error(message || t("ads.actions.changeStatusError"));
  });

  const bumpAd = catcher(async (id: number) => {
    bumpLoading.value = true;
    const result = await $api<IBaseResponse<any>>(`/ads/${id}/bump`, {
      method: "POST",
      body: { id }
    });
    
    ElMessage.success(result.message);
    bumpLoading.value = false;
  }, (error: any) => {
    bumpLoading.value = false
    const message = error?.response?._data?.message
    ElMessage.error(message || t("ads.actions.bumpError"));
  });

  return {
    getStatusLabel,
    getStatusType,
    getStateLabel,
    changeStatus,
    bumpAd,
    bumpLoading,
  };
};
