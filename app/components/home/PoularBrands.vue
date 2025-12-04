<script setup lang="ts">
import type { IBrand } from "~/types/brand";
import type { IBaseResponse } from "~/types";

const { $api } = useNuxtApp();

// Fetch brands
const { data: brands } = await useAsyncData(
  "popular-brands",
  async () => {
    try {
      const res = await $api<IBaseResponse<IBrand[]>>("/brands/popular");
      return res.data || [];
    } catch (error) {
      console.error("Error fetching popular brands:", error);
      return [];
    }
  },
  {
    default: () => [],
  }
);

// Duplicate brands to ensure smooth infinite scroll even with few items
const marqueeBrands = computed(() => {
  const list = brands.value || [];
  if (list.length === 0) return [];
  // Repeat list enough times to fill width
  return [...list, ...list, ...list, ...list]; 
});
</script>

<template>
  <section class="brands-showcase">
    <div class="ambient-light"></div>
    
    <div class="container">
      <div class="header-content">
        <h2 class="title">
          Топ <span class="highlight">Бренды</span>
        </h2>
        <p class="subtitle">Выбор миллионов пользователей</p>
      </div>
    </div>

    <div class="marquee-wrapper">
      <!-- Row 1: Left to Right -->
      <div class="marquee-track scroll-left">
        <div class="marquee-content">
          <div
            v-for="(brand, index) in marqueeBrands"
            :key="`${brand.name}-1-${index}`"
            class="brand-card glass-card"
            @click="navigateTo(`/search?brandId=${brand.id}`)"
          >
            <div class="card-inner">
              <div class="logo-box">
                <img
                  v-if="brand.logo"
                  :src="brand.logo"
                  :alt="brand.name"
                  class="brand-logo"
                />
                <span v-else class="brand-text">{{ brand.name }}</span>
              </div>
              <div class="brand-meta">
                <span class="name">{{ brand.name }}</span>
                <span class="count">{{ brand.ads_count }} объявлений</span>
              </div>
            </div>
            <div class="glow-effect"></div>
          </div>
        </div>
      </div>

      <!-- Row 2: Right to Left -->
      <div class="marquee-track scroll-right">
        <div class="marquee-content">
          <div
            v-for="(brand, index) in marqueeBrands"
            :key="`${brand.name}-2-${index}`"
            class="brand-card glass-card"
            @click="navigateTo(`/search?brandId=${brand.id}`)"
          >
            <div class="card-inner">
              <div class="logo-box">
                <img
                  v-if="brand.logo"
                  :src="brand.logo"
                  :alt="brand.name"
                  class="brand-logo"
                />
                <span v-else class="brand-text">{{ brand.name }}</span>
              </div>
              <div class="brand-meta">
                <span class="name">{{ brand.name }}</span>
                <span class="count">{{ brand.ads_count }} объявлений</span>
              </div>
            </div>
            <div class="glow-effect"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.brands-showcase {
  position: relative;
  padding: 100px 0;
  background: #020617; /* Deepest Slate */
  overflow: hidden;
  color: #fff;
}

.ambient-light {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(56, 189, 248, 0.08) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  margin-bottom: 60px;
}

.title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
  
  .highlight {
    background: linear-gradient(to right, #38bdf8, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.subtitle {
  font-size: 18px;
  color: #94a3b8;
}

.marquee-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 32px;
  
  /* Fade edges */
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-track {
  display: flex;
  width: 100%;
  overflow: hidden;
  
  &:hover .marquee-content {
    animation-play-state: paused;
  }
}

.marquee-content {
  display: flex;
  gap: 24px;
  padding: 10px 0; /* Space for shadows */
}

.scroll-left .marquee-content {
  animation: scroll-left 60s linear infinite;
}

.scroll-right .marquee-content {
  animation: scroll-right 60s linear infinite;
}

.brand-card {
  flex: 0 0 240px;
  height: 140px;
  position: relative;
  cursor: pointer;
  border-radius: 20px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    z-index: 10;
    
    .glow-effect {
      opacity: 1;
    }
    
    .card-inner {
      border-color: rgba(56, 189, 248, 0.5);
      background: rgba(255, 255, 255, 0.08);
    }

    .brand-logo {
      filter: grayscale(0) brightness(1.1);
      transform: scale(1.1);
    }
  }
}

.glass-card .card-inner {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: all 0.3s ease;
}

.logo-box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.brand-logo {
  max-height: 100%;
  max-width: 100%;
  filter: grayscale(100%) brightness(1.5); /* Monochrome by default */
  transition: all 0.3s ease;
  opacity: 0.8;
}

.brand-text {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.brand-meta {
  text-align: center;
}

.name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.count {
  display: block;
  font-size: 12px;
  color: #94a3b8;
}

.glow-effect {
  position: absolute;
  inset: -1px;
  border-radius: 20px;
  background: linear-gradient(135deg, #38bdf8, #818cf8);
  opacity: 0;
  filter: blur(15px);
  z-index: -1;
  transition: opacity 0.3s ease;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes scroll-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

@media (max-width: 768px) {
  .brands-showcase {
    padding: 60px 0;
  }
  
  .title {
    font-size: 32px;
  }
  
  .brand-card {
    flex: 0 0 180px;
    height: 110px;
  }
  
  .logo-box {
    height: 40px;
  }
  
  .name {
    font-size: 14px;
  }
}
</style>
