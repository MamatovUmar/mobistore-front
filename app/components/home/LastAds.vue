<script setup lang="ts">
import { Right } from "@element-plus/icons-vue";
import type { IBaseResponse } from "~/types";
import type { IListing } from "~/types/ads";
import AdCard from "~/components/AdCard.vue";

const { $api } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();

// Fetch latest ads
const { data: listings } = await useAsyncData(
  "latest-ads",
  async () => {
    try {
      const res = await $api<IBaseResponse<IListing[]>>("/ads/latest", {
        params: {
          limit: 9, // Increased limit for better grid fill
        },
      });
      return res.data || [];
    } catch (error) {
      console.error("Error fetching latest ads:", error);
      return [];
    }
  },
  {
    default: () => [],
  }
);
</script>

<template>
  <section id="listings" class="listings-section">
    <div class="container">
      <div class="section-header">
        <div class="header-content">
          <h2 class="section-title">{{ t('home.latestAds.title') }}</h2>
          <div class="section-subtitle">
            {{ t('home.latestAds.subtitle') }}
          </div>
        </div>

        <NuxtLink :to="localePath('/search')" class="view-all-link">
          <span>{{ t('home.latestAds.viewAll') }}</span>
          <el-icon><Right /></el-icon>
        </NuxtLink>
      </div>

      <div class="listings-grid">
        <AdCard
          v-for="listing in listings"
          :key="listing.id"
          :listing="listing"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.listings-section {
  padding: 60px 0 80px;
  background: #f8fafc; /* Light background to contrast with white cards */
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.03em;
}

.section-subtitle {
  font-size: 16px;
  color: #64748b;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.3s ease;
  padding-bottom: 4px;

  &:hover {
    color: #2563eb;
    transform: translateX(4px);
  }

  .el-icon {
    font-size: 18px;
  }
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

@media (max-width: 768px) {
  .listings-section {
    padding: 40px 0 60px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .section-title {
    font-size: 28px;
  }

  .listings-grid {
    grid-template-columns: repeat(2, 1fr); /* Force 2 columns on mobile */
    gap: 12px;
  }
}

@media (max-width: 375px) {
  .listings-grid {
    gap: 10px;
  }
}
</style>
