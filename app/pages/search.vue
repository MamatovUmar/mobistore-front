<script setup lang="ts">
import FilterForm from "@/components/results/FilterForm.vue";
import AdCard from "@/components/AdCard.vue";
import type { IBaseResponse, IPagination } from "~/types";
import type { IListing, IAdsResponse } from "~/types/ads";

const route = useRoute();
const { $api } = useNuxtApp();


const ads = ref<IListing[]>([]);
const pagination = ref<IPagination>()


const getAds = async () => {
  const res = await $api<IBaseResponse<IAdsResponse>>(`/ads`, {
    params: route.query,
  });
  ads.value = res.data?.ads ?? [];
  pagination.value = res.data?.pagination;
  console.log(res);
  
}

watch(() => route.query, () => {
  getAds()
}, { deep: true })



getAds()

</script>

<template>
  <main class="results-page">
    <div class="breadcrumbs">
      <div class="container">
        <el-breadcrumb>
          <el-breadcrumb-item to="/">Главная</el-breadcrumb-item>
          <el-breadcrumb-item>Результаты поиска</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="filter-form">
      <div class="container">
        <div class="filter-form__inner">
          <FilterForm />

          <div class="results">
            <pre>
              {{ route.query }}
              {{ ads }}
            </pre>
            <AdCard v-for="ad in ads" :key="ad.id" :listing="ad" />
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
