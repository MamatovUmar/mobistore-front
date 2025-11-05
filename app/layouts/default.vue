<script setup lang="ts">
import AppHeader from "../components/layout/AppHeader.vue";
import AppFooter from "../components/layout/AppFooter.vue";
import { useRootStore } from "~/store/root";

const rootStore = useRootStore();

onMounted(() => {
  rootStore.fetchUser();
});

</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<style lang="scss" scoped></style>
