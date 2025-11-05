import type { IUser } from "~/types/user";
import { defineStore } from "pinia";
import { ref } from "#imports";
import { catcher } from "~/utils/catcher";
import type { IBaseResponse } from "~/types";

export const useRootStore = defineStore('root', () => {
  const { $api } = useNuxtApp();
  const cookie = useCookie("token");

  const user = ref<IUser>();

  const fetchUser = catcher(async () => {
    const { data } = await $api<IBaseResponse<IUser>>("/me");
    user.value = data;
  });

  const logout = catcher(async () => {
    user.value = undefined;
    cookie.value = undefined;
    navigateTo('/');
  });

  return {
    user,
    fetchUser,
    logout
  }
})