<script setup lang="ts">
import AppHeader from "./components/layout/AppHeader.vue";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <AppHeader />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
