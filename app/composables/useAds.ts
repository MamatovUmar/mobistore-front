import { ListingStatus, type IState } from "~/types/ads";
import type { IBaseResponse } from "~/types";

export const useAds = () => {

  const {$api} = useNuxtApp();

  const getStatusLabel = (status: ListingStatus) => {
    const labels: Record<ListingStatus, string> = {
      [ListingStatus.ACTIVE]: "Активно",
      [ListingStatus.DRAFT]: "Черновик",
      [ListingStatus.ARCHIVED]: "Архивировано",
      [ListingStatus.SOLD]: "Продано",
      [ListingStatus.MODERATION]: "На модерации",
      [ListingStatus.REJECTED]: "Отклонено",
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
      new: "Новый",
      used: "Б/У",
      restored: "Восстановлен",
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
    ElMessage.error(message || "Не удалось изменить статус");
  });

  return {
    getStatusLabel,
    getStatusType,
    getStateLabel,
    changeStatus,
  };
};
