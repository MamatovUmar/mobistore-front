<script setup lang="ts">
import { ref } from "vue";
import { LocationInformation } from "@element-plus/icons-vue";

const image = "https://frankfurt.apollo.olxcdn.com/v1/files/htop2ltrgevj3-UZ/image;s=1000x700";

const isFavorite = ref(false);

const toggleFavorite = (event: MouseEvent) => {
  event.stopPropagation();
  isFavorite.value = !isFavorite.value;
};
</script>

<template>
  <div class="listing-card">
    <div class="listing-image" :style="{ backgroundImage: `url(${image})` }">
      <button 
        class="favorite-button" 
        :class="{ active: isFavorite }"
        @click="toggleFavorite"
      >
        <svg 
          v-if="!isFavorite"
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <svg 
          v-else
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
    </div>
    <div class="listing-info">
      <div class="listing-brand">Samsung</div>
      <h3 class="listing-title">Galaxy Z Flip5 256GB</h3>
      <div class="listing-price">9 300 000 сум</div>
      <div class="listing-footer">
        <div class="listing-location">
          <el-icon><LocationInformation /></el-icon> Фергана
        </div>
        <span class="listing-condition used">Б/У</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.listing-card {
  background: var(--color-bg-primary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-1px);

    .favorite-button {
      opacity: 1;
    }
  }
}

.listing-image {
  width: 100%;
  height: 220px;
  background-color: var(--color-bg-primary);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  position: relative;
}

.favorite-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-bg-primary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: var(--color-text-secondary);

  &:hover {
    transform: scale(1.1);
    color: var(--color-danger);
  }

  &:active {
    transform: scale(0.95);
  }

  &.active {
    opacity: 1;
    color: var(--color-danger);
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.listing-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.listing-brand {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.listing-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.listing-price {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
}

.listing-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid var(--color-border-light);
  margin-top: auto;
}

.listing-location {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;

  .el-icon {
    font-size: 16px;
  }
}

.listing-condition {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--color-success);
  color: var(--color-bg-primary);
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &.used {
    background: var(--color-warning);
  }
}
</style>
