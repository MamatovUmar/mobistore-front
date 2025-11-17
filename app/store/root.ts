import type { IUser, IUpdateProfilePayload } from "~/types/user";
import { defineStore } from "pinia";
import { ref } from "#imports";
import { catcher } from "~/utils/catcher";
import type { IBaseResponse } from "~/types";
import { getErrorMessage } from "~/utils/error";

export const useRootStore = defineStore('root', () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie("token");

  const user = ref<IUser>();

  const fetchUser = catcher(async () => {
    if (!tokenCookie.value) return;
    const { data } = await $api<IBaseResponse<IUser>>("/user/profile");
    user.value = data;
  });

  const updateProfile = catcher(async (payload: IUpdateProfilePayload) => {
    const { data } = await $api<IBaseResponse<IUser>>("/user/profile", {
      method: "PUT",
      body: payload
    });
    user.value = data;
    return data;
  }, (error: any) => {
    ElMessage.error(getErrorMessage(error));
  });

  const logout = catcher(async () => {
    user.value = undefined;
    tokenCookie.value = undefined;
    navigateTo('/');
  });

  return {
    user,
    fetchUser,
    updateProfile,
    logout
  }
})