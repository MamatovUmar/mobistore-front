<script setup lang="ts"></script>

<template>
  <section id="listings" class="listings">
    <div class="container">
      <h2 class="section-title">Последние объявления</h2>

      <div class="listings-grid">
        <AdCard />
        <AdCard />
        <AdCard />
        <AdCard />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.listings {
  padding: 0 0 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 32px;
  color: var(--color-text-primary);
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

</style>
