import type { IUser } from "~/types/user";
import { defineStore } from "pinia";
import { ref } from "#imports";
import { catcher } from "~/utils/catcher";
import type { IBaseResponse } from "~/types";

export const useRootStore = defineStore('root', () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie("token");

  const user = ref<IUser>();

  const fetchUser = catcher(async () => {
    if (!tokenCookie.value) return;
    const { data } = await $api<IBaseResponse<IUser>>("/me");
    user.value = data;
  });

  const logout = catcher(async () => {
    user.value = undefined;
    tokenCookie.value = undefined;
    navigateTo('/');
  });

  return {
    user,
    fetchUser,
    logout
  }
})