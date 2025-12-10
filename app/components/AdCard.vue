<script setup lang="ts">
import { computed } from "vue";
import { LocationInformation, Picture, StarFilled } from "@element-plus/icons-vue";
import type { IListing } from "~/types/ads";
import { formatCurrency } from "~/utils/formatters";
import StatusTag from "~/components/ad/StatusTag.vue";
import { useRootStore } from "~/store/root";

const props = defineProps<{
  listing: IListing;
}>();

const root = useRootStore()
const { addToFavorite, removeFavorite } = useFavorite();

const image = computed(() => {
  if (props.listing.images.length > 0) {
    return props.listing.images[0]?.url;
  }
  return "";
});

const hasImage = computed(() => props.listing.images.length > 0);
const favorites = computed(() => root.user?.favorites || []);

const toggleFavorite = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (favorites.value.includes(props.listing.id)) {
    removeFavorite(props.listing.id);
  } else {
    addToFavorite(props.listing.id);
  }
};

// Format date (placeholder - replace with actual date from listing)
const postDate = "Сегодня";
</script>

<template>
  <NuxtLink class="listing-card" :to="`/${listing.alias}`">
    <div class="card-glow"></div>
    
    <!-- Image Container -->
    <div class="image-wrapper">
      <div
        class="card-image"
        :class="{ 'no-image': !hasImage }"
        :style="hasImage ? { backgroundImage: `url(${image})` } : {}"
      >
        <div v-if="!hasImage" class="placeholder">
          <el-icon :size="40" color="#cbd5e1"><Picture /></el-icon>
          <span> Нет фото </span>
        </div>
        
        <!-- Gradient Overlay -->
        <div v-if="hasImage" class="image-overlay"></div>
      </div>
      
      <!-- Status Badge -->
      <div class="top-badges">
        <StatusTag :state="listing.state" />
      </div>

      <!-- Favorite Button -->
      <button
        class="fav-button"
        :class="{ active: favorites.includes(listing.id) }"
        @click.stop="toggleFavorite"
      >
        <el-icon><StarFilled /></el-icon>
      </button>
    </div>

    <!-- Content -->
    <div class="card-body">
      <!-- Brand & Date -->
      <div class="meta-row">
        <span class="brand">{{ listing.brand.name }}</span>
        <span class="date">{{ postDate }}</span>
      </div>

      <!-- Title -->
      <h3 class="title">{{ listing.title }}</h3>

      <!-- Price with gradient -->
      <div class="price-tag">
        {{ formatCurrency(listing.price, listing.currency) }}
      </div>

      <!-- Location -->
      <div class="location-row">
        <el-icon class="location-icon"><LocationInformation /></el-icon>
        <span>{{ listing.region.name_ru }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.listing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid var(--color-border-light);
  height: 100%;

  &:hover {
    border-color: rgba(59, 130, 246, 0.2);

    &::before {
      opacity: 1;
    }

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
  width: 100%;
  padding-top: 75%; /* 4:3 */
  overflow: hidden;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 8px 8px 0 0;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.no-image {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(15, 23, 42, 0.05) 50%,
    rgba(15, 23, 42, 0.15) 100%
  );
  opacity: 0.6;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.top-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  display: flex;
  gap: 8px;
}

.fav-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #64748b;
  opacity: 0;
  transform: scale(0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    background: #fff;
    transform: scale(1.15) rotate(12deg);
    color: #f59e0b;
    border-color: rgba(245, 158, 11, 0.3);
    box-shadow: 0 8px 16px -4px rgba(245, 158, 11, 0.3);
  }

  &.active {
    opacity: 1;
    transform: scale(1);
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    color: #fff;
    border-color: transparent;
    
    &:hover {
      transform: scale(1.15);
      box-shadow: 0 8px 20px -4px rgba(245, 158, 11, 0.5);
    }
  }

  .el-icon {
    font-size: 20px;
  }
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;
  flex: 1;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  padding: 4px 10px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 6px;
}

.date {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.title {
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 48px;
  transition: color 0.3s ease;
}

.price-tag {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-block;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);

  .location-icon {
    color: #3b82f6;
    font-size: 16px;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 768px) {
  .card-body {
    padding: 16px;
  }

  .title {
    font-size: 15px;
  }

  .price-tag {
    font-size: 20px;
  }
}
</style>
