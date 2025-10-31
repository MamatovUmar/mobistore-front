<script setup lang="ts">
import AppHeader from "./components/layout/AppHeader.vue";
import AppFooter from "./components/layout/AppFooter.vue";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <AppHeader />
      <NuxtPage />
      <AppFooter />
    </NuxtLayout>
  </div>
</template>
