<script setup lang="ts">
import type { IBaseResponse } from "~/types";
import type { IListing } from "~/types/ads";
import AdCard from "~/components/AdCard.vue";

const {$api} = useNuxtApp();

const listings = ref<IListing[]>([]);

const getLatest = catcher(async () => {
  const res = await $api<IBaseResponse<IListing[]>>("/ads/latest", {
    params: {
      limit: 8,
    },
  });
  listings.value = res.data || [];
});

getLatest();

</script>

<template>
  <section id="listings" class="listings">
    <div class="container">
      <h2 class="section-title">Последние объявления</h2>

      <div class="listings-grid">
        <AdCard v-for="listing in listings" :key="listing.id" :listing="listing" />
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
