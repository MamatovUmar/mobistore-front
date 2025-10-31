<script setup lang="ts">
import FilterForm from "@/components/results/FilterForm.vue";
import AdCard from "@/components/AdCard.vue";
</script>

<template>
  <main class="results-page">
    <div class="breadcrumbs">
      <div class="container">
        <el-breadcrumb>
          <el-breadcrumb-item>Главная</el-breadcrumb-item>
          <el-breadcrumb-item>Результаты поиска</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="filter-form">
      <div class="container">
        <div class="filter-form__inner">
          <FilterForm />

          <div class="results">
            <AdCard v-for="ad in 9" :key="ad" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.results-page {
  min-height: 60vh;
  .breadcrumbs {
    padding: 20px 0;
  }
  .filter-form {
    padding: 10px 0 60px;
    background: var(--color-bg-secondary);
    min-height: calc(100vh - 200px);
  }

  .filter-form__inner {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
    align-items: start;
  }
  .results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}
</style>
