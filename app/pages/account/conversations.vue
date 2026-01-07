<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("account.meta.conversations"),
  robots: "noindex, nofollow",
});
</script>

<template>
  <main class="page-account">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ $t("account.conversations.title") }}</h1>
      </div>

      <div class="account-layout">
        <!-- Сайдбар с навигацией -->
        <AccountSidebar />

        <AccountChat />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page-account {
  min-height: 60vh;
  padding: 40px 0;
  .page-header {
    margin-bottom: 32px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .account-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    align-items: start;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>