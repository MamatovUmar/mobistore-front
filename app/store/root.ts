import type { IUser, IUpdateProfilePayload } from "~/types/user";
import { defineStore } from "pinia";
import { ref } from "#imports";
import { catcher } from "~/utils/catcher";
import type { IBaseResponse } from "~/types";
import { getErrorMessage } from "~/utils/error";
import { useLocalePath } from "#i18n";

export const useRootStore = defineStore('root', () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie("token");
  const localePath = useLocalePath();

  const user = ref<IUser>();

  const isAdmin = computed(() => user.value?.role === 'admin');
  const isModerator = computed(() => user.value?.role === 'moderator');

  const fetchUser = catcher(async (token?: string) => {
    if (token) {
      tokenCookie.value = token;
    }
    const authToken = token || tokenCookie.value;
    if (!authToken) return;
    
    const { data } = await $api<IBaseResponse<IUser>>("/user/profile", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
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
    navigateTo(localePath('/'));
  });

  return {
    user,
    fetchUser,
    updateProfile,
    logout,
    isAdmin,
    isModerator
  }
})