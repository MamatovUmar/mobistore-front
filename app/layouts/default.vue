<script setup lang="ts">
import AppHeader from "../components/layout/AppHeader.vue";
import AppFooter from "../components/layout/AppFooter.vue";
// Инициализация пользователя теперь происходит в plugins/auth.ts
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
