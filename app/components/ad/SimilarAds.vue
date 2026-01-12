<script setup lang="ts">
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import type { IListing } from "~/types/ads";
import AdCard from "~/components/AdCard.vue";
import type { IBaseResponse } from "~/types";

const props = defineProps<{
  id: number;
}>();

const { $api } = useNuxtApp();
const { t } = useI18n();

const similarListings = ref<IListing[]>([]);
const loading = ref(false);
const carouselRef = ref();

const fetchSimilarListings = async () => {
  loading.value = true;
  try {
    const response = await $api<IBaseResponse<IListing[]>>(
      `/ads/${props.id}/similar`,
      {
        params: { limit: 30 },
      }
    );
    similarListings.value = response.data || [];
  } catch (error) {
    console.error("Failed to fetch similar listings:", error);
  } finally {
    loading.value = false;
  }
};

const scrollLeft = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: -320, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: 320, behavior: "smooth" });
  }
};

onMounted(() => {
  fetchSimilarListings();
});

watch(
  () => props.id,
  () => {
    fetchSimilarListings();
  }
);
</script>

<template>
  <section v-if="similarListings.length > 0 || loading" class="similar-section">
    <div class="section-header">
      <h2 class="section-title">{{ t("listingDetails.similarListings") }}</h2>
      <div class="carousel-controls">
        <button class="control-btn" @click="scrollLeft">
          <el-icon><ArrowLeft /></el-icon>
        </button>
        <button class="control-btn" @click="scrollRight">
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <el-skeleton animated>
        <template #template>
          <div class="skeleton-grid">
            <el-skeleton-item
              v-for="i in 4"
              :key="i"
              variant="rect"
              class="skeleton-card"
            />
          </div>
        </template>
      </el-skeleton>
    </div>

    <div v-else ref="carouselRef" class="carousel-container">
      <div class="carousel-track">
        <div
          v-for="listing in similarListings"
          :key="listing.id"
          class="carousel-item"
        >
          <AdCard :listing="listing" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.similar-section {
  margin-top: 48px;
  margin-bottom: 48px;
  padding: 32px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 48px;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--color-primary) 0%,
      var(--color-primary-light) 100%
    );
    border-radius: 2px;
  }
}

.carousel-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-primary);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
    transform: scale(1.05);
  }

  .el-icon {
    font-size: 20px;
  }
}

.carousel-container {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
  padding: 0 24px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.carousel-track {
  display: flex;
  gap: 20px;
  padding-bottom: 8px;
}

.carousel-item {
  flex: 0 0 280px;
  scroll-snap-align: start;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
}

.loading-state {
  padding: 0 24px;
}

.skeleton-grid {
  display: flex;
  gap: 20px;
  overflow: hidden;
}

.skeleton-card {
  flex: 0 0 280px;
  height: 360px;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .similar-section {
    margin-top: 32px;
    padding: 24px 0;
    border-radius: 16px;
  }

  .section-header {
    padding: 0 16px;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 18px;

    &::after {
      width: 32px;
      height: 2px;
      bottom: -4px;
    }
  }

  .carousel-controls {
    display: none;
  }

  .carousel-container {
    padding: 0 16px;
  }

  .carousel-track {
    gap: 12px;
  }

  .carousel-item {
    flex: 0 0 220px;
  }

  .skeleton-card {
    flex: 0 0 220px;
    height: 300px;
  }
}
</style>
