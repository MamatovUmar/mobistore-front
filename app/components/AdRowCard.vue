<script setup lang="ts">
import { ref, computed } from "vue";
import {
  LocationInformation,
  Picture,
  StarFilled,
  Loading,
} from "@element-plus/icons-vue";
import type { IListing } from "~/types/ads";
import { formatCurrency } from "~/utils/formatters";
import StatusTag from "~/components/ad/StatusTag.vue";
import { useRootStore } from "~/store/root";

const props = defineProps<{
  listing: IListing;
}>();

const emit = defineEmits(["favoriteChanged"]);

const { addToFavorite, removeFavorite } = useFavorite();
const root = useRootStore();
const { locale } = useI18n();
const localePath = useLocalePath();

const favorites = computed(() => root.user?.favorites || []);

const image = computed(() => {
  if (props.listing.images.length > 0) {
    return props.listing.images[0]?.url;
  }
  return "";
});

const hasImage = computed(() => props.listing.images.length > 0);

const toggleFavorite = async (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (favorites.value.includes(props.listing.id)) {
    await removeFavorite(props.listing.id);
  } else {
    await addToFavorite(props.listing.id);
  }
  emit("favoriteChanged");
};

// Format date based on current locale
const postDate = computed(() => {
  const localeMap: Record<string, string> = { ru: 'ru-RU', uz: 'uz-UZ' };
  return new Date(props.listing?.published_at ?? new Date()).toLocaleDateString(
    localeMap[locale.value] || 'ru-RU'
  );
});
</script>

<template>
  <NuxtLink class="listing-row-card" :to="localePath(`/${listing.alias}`)">
    <div class="card-glow" />

    <!-- Image Container -->
    <div class="image-wrapper">
      <div v-if="hasImage" class="image-inner" @click.stop.prevent>
        <el-image
          class="card-image"
          :src="image"
          :preview-src-list="listing.images.map((img) => img.url)"
          fit="cover"
          loading="lazy"
          :preview-teleported="true"
        >
          <template #placeholder>
            <div class="image-placeholder">
              <el-icon class="is-loading"><Loading /></el-icon>
            </div>
          </template>
          <template #error>
            <div class="image-placeholder">
              <el-icon :size="24" color="#cbd5e1"><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>

      <div v-else class="card-image no-image">
        <el-icon :size="24" color="#cbd5e1"><Picture /></el-icon>
      </div>

      <!-- Status Badge -->
      <div class="top-badges">
        <StatusTag :state="listing.state" size="small" />
      </div>
    </div>

    <!-- Content -->
    <div class="card-body">
      <div class="main-info">
        <!-- Title & Brand -->
        <div class="title-row">
          <h3 class="title">{{ listing.title }}</h3>
          <span class="brand">{{ listing.brand.name }}</span>
        </div>

        <!-- Location & Date -->
        <div class="meta-info">
          <div class="location-row">
            <el-icon class="location-icon"><LocationInformation /></el-icon>
            <span>{{ listing.region.name_ru }}</span>
          </div>
          <span class="separator">•</span>
          <span class="date">{{ postDate }}</span>
        </div>
      </div>

      <!-- Price & Actions -->
      <div class="price-actions">
        <div class="price-tag">
          {{ formatCurrency(listing.price, listing.currency) }}
        </div>

        <button
          class="fav-button"
          :class="{ active: favorites.includes(listing.id) }"
          @click="toggleFavorite"
        >
          <el-icon><StarFilled /></el-icon>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.listing-row-card {
  position: relative;
  display: flex;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid var(--color-border-light);
  height: 120px;
  width: 100%;

  &:hover {
    border-color: rgba(59, 130, 246, 0.2);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.05);

    .card-glow {
      opacity: 1;
    }

    .fav-button {
      opacity: 1;
      transform: scale(1);
    }
  }
}

.image-wrapper {
  position: relative;
  width: 160px;
  flex-shrink: 0;
  height: 100%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  cursor: default;
}

.image-inner {
  width: 100%;
  height: 100%;
  cursor: zoom-in;
}

.card-image {
  width: 100%;
  height: 100%;
  display: block;

  &.no-image {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(img) {
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.listing-row-card:hover .card-image :deep(img) {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
}

.top-badges {
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 3;
}

.card-body {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 16px;
}

.main-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.title-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.brand {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 2px 6px;
  background: #f1f5f9;
  border-radius: 4px;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 12px;
  margin-top: auto;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 4px;

  .location-icon {
    color: #3b82f6;
    font-size: 13px;
  }
}

.price-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  min-width: 130px;
  padding-left: 16px;
  border-left: 1px solid #f1f5f9;
  height: 100%;
  justify-content: space-between;
}

.price-tag {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.fav-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #94a3b8;

  &:hover {
    background: #fff;
    border-color: #f59e0b;
    color: #f59e0b;
    transform: scale(1.05);
  }

  &.active {
    background: #fff7ed;
    border-color: #f59e0b;
    color: #f59e0b;
  }

  .el-icon {
    font-size: 16px;
  }
}

// Адаптивность
@media (max-width: 900px) {
  .listing-row-card {
    height: auto;
    flex-direction: column;
    min-height: 280px; /* Ensure consistent height */
  }

  .image-wrapper {
    width: 100%;
    height: 140px; /* Reduced height for 2-column grid */
    flex-shrink: 0;
  }

  .card-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 10px;
    flex: 1;
  }

  .main-info {
    width: 100%;
    gap: 4px;
  }

  .title {
    font-size: 14px; /* Smaller title */
    line-height: 18px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .brand {
    font-size: 9px;
    padding: 2px 4px;
    margin-bottom: 4px;
  }

  .meta-info {
    flex-wrap: wrap;
    font-size: 11px;
    margin-top: 4px;
  }

  .price-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    padding-left: 0;
    border-left: none;
    border-top: none;
    padding-top: 0;
    margin-top: auto; /* Push to bottom */
  }

  .price-tag {
    font-size: 16px;
  }

  .fav-button {
    width: 28px;
    height: 28px;

    .el-icon {
      font-size: 14px;
    }
  }
}
</style>
