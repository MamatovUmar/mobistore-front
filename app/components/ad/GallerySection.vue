<script setup lang="ts">
import type { IListing } from "~/types/ads";
import {
  ArrowLeftBold,
  ArrowRightBold,
  Picture,
} from "@element-plus/icons-vue";

const { listing } = defineProps<{
  listing: IListing;
}>();

const hasImages = computed(() => listing.images && listing.images.length > 0);
const currentImageIndex = ref(0);
const currentImage = computed(
  () => listing.images?.[currentImageIndex.value] || listing.images?.[0]
);
const thumbnailsContainer = ref<HTMLElement>();
const isTransitioning = ref(false);
const showViewer = ref(false);
const imageLoaded = ref(false);

const selectImage = (index: number) => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  imageLoaded.value = false;
  currentImageIndex.value = index;
  scrollToThumbnail(index);
  setTimeout(() => (isTransitioning.value = false), 300);
};

const nextImage = () => {
  if (currentImageIndex.value < listing.images.length - 1) {
    selectImage(currentImageIndex.value + 1);
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    selectImage(currentImageIndex.value - 1);
  }
};

const scrollToThumbnail = (index: number) => {
  if (!thumbnailsContainer.value) return;
  const thumbnail = thumbnailsContainer.value.children[index] as HTMLElement;
  if (thumbnail) {
    thumbnail.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
};

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  };
  window.addEventListener("keydown", handleKeydown);
  onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
});
</script>

<template>
  <div v-if="hasImages" class="gallery-section">
    <div class="main-image-wrapper">
      <Transition name="fade" mode="out-in">
        <div :key="currentImageIndex" class="image-container">
          <NuxtImg
            class="main-image"
            :src="currentImage?.url"
            :alt="listing.title"
            fit="cover"
            :loading="currentImageIndex === 0 ? 'eager' : 'lazy'"
            :fetchpriority="currentImageIndex === 0 ? 'high' : 'auto'"
            :preload="currentImageIndex === 0"
            @click="showViewer = true"
            @load="imageLoaded = true"
          />
          <div v-if="!imageLoaded" class="image-placeholder">
            <el-icon :size="48" color="#cbd5e1"><Picture /></el-icon>
          </div>

          <div v-if="listing.images.length > 1" class="image-counter">
            {{ currentImageIndex + 1 }} / {{ listing.images.length }}
          </div>
        </div>
      </Transition>

      <!-- Image Viewer -->
      <el-image-viewer
        v-if="showViewer"
        :url-list="listing.images.map((img) => img.url)"
        :initial-index="currentImageIndex"
        teleported
        @close="showViewer = false"
      />

      <!-- Navigation Buttons -->
      <button
        v-if="listing.images.length > 1 && currentImageIndex > 0"
        aria-label="Предыдущее изображение"
        class="nav-button prev"
        @click="prevImage"
      >
        <el-icon :size="24"><ArrowLeftBold /></el-icon>
      </button>
      <button
        v-if="
          listing.images.length > 1 &&
          currentImageIndex < listing.images.length - 1
        "
        aria-label="Следующее изображение"
        class="nav-button next"
        @click="nextImage"
      >
        <el-icon :size="24"><ArrowRightBold /></el-icon>
      </button>
    </div>

    <!-- Thumbnails -->
    <div v-if="listing.images.length > 1" class="thumbnail-wrapper">
      <div ref="thumbnailsContainer" class="thumbnail-grid">
        <div
          v-for="(image, index) in listing.images"
          :key="image.id"
          class="thumbnail"
          :class="{ active: index === currentImageIndex }"
          :style="{ backgroundImage: `url(${image.url})` }"
          @click="selectImage(index)"
        >
          <div class="thumbnail-overlay" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Fade transition animation
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

.gallery-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  contain: layout;
}

.main-image-wrapper {
  position: relative;
  margin-bottom: 16px;
  overflow: hidden;
}

.image-container {
  position: relative;
}

.main-image {
  width: 100%;
  height: 500px;
  display: block;
  border-radius: 12px;
  object-fit: cover;
  cursor: pointer;
}

.image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  border-radius: 12px;
}

.image-badge {
  position: absolute;
  top: 16px;
  left: 16px;
}

.image-counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: var(--color-bg-primary);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
}

// Navigation buttons
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;

  &:hover {
    background: var(--color-bg-primary);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.prev {
    left: 16px;
  }

  &.next {
    right: 16px;
  }
}

// Thumbnails wrapper
.thumbnail-wrapper {
  position: relative;
  width: 100%;
}

.thumbnail-grid {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 2px 12px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 4px;
    transition: background 0.3s;

    &:hover {
      background: var(--color-text-tertiary);
    }
  }
}

.thumbnail {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  background: var(--color-bg-secondary);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid transparent;
  overflow: hidden;
  position: relative;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);

    .thumbnail-overlay {
      opacity: 0;
    }
  }

  &.active {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-light),
      0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);

    .thumbnail-overlay {
      opacity: 0;
    }
  }
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s;
  pointer-events: none;
}

// Responsive adjustments
@media (max-width: 768px) {
  .main-image {
    height: 300px;
  }

  .nav-button {
    width: 40px;
    height: 40px;

    &.prev {
      left: 8px;
    }

    &.next {
      right: 8px;
    }

    :deep(.el-icon) {
      font-size: 20px;
    }
  }

  .thumbnail {
    width: 80px;
    height: 80px;
  }

  .image-badge {
    font-size: 11px;
    padding: 6px 12px;
  }

  .image-counter {
    font-size: 12px;
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .gallery-section {
    padding: 12px;
  }

  .main-image {
    height: 250px;
    border-radius: 8px;
  }

  .nav-button {
    width: 36px;
    height: 36px;
  }

  .thumbnail {
    width: 70px;
    height: 70px;
  }
}
</style>
