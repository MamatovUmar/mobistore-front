<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <main class="page-account">
        <div class="container">
          <div class="page-header">
            <h1 class="page-title">Мой аккаунт</h1>
          </div>

          <div class="account-layout">
            <!-- Сайдбар с навигацией -->
            <AccountSidebar />

            <!-- Основной контент -->
            <div class="account-content">
              <div class="content-placeholder">
                <p>Выберите раздел из меню</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </NuxtLayout>
  </div>
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

  /* === КОНТЕНТ === */
  .account-content {
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    min-height: 400px;

    @media (max-width: 768px) {
      padding: 20px;
    }
  }

  .content-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: var(--color-text-muted);
    font-size: 16px;
  }
}
</style>
