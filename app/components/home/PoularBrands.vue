<script setup lang="ts">
import { ref } from "vue";
import type { IBrand } from "~/types/brand";
import type { IBaseResponse } from "~/types";

const { $api } = useNuxtApp();

const loading = ref(false);
const brands = ref<IBrand[]>([]);

const getPopularBrands = async () => {
  loading.value = true;
  try {
    const res = await $api<IBaseResponse<IBrand[]>>(`/brands/popular`);
    brands.value = res.data || [];
  } catch (error) {
    console.error("Error searching brands:", error);
    brands.value = [];
  } finally {
    loading.value = false;
  }
};

getPopularBrands();

</script>

<template>
  <section class="brands">
    <div class="container">
      <h2 class="section-title">Популярные бренды</h2>
      <p class="section-subtitle">
        Выберите бренд, чтобы увидеть актуальные предложения
      </p>

      <div class="carousel-wrapper">
        <el-carousel
          :interval="3000"
          type="card"
          height="240px"
          arrow="never"
          :autoplay="true"
          :indicator-position="'none'"
        >
          <el-carousel-item v-for="brand in brands" :key="brand.name">
            <div class="brand-card">
              <div class="brand-logo-container">
                <img
                  v-if="brand.logo"
                  :src="brand.logo"
                  :alt="brand.name"
                  class="brand-logo"
                >
                <div v-else class="brand-logo-placeholder">
                  <span class="brand-initial">{{ brand.name.charAt(0) }}</span>
                </div>
              </div>
              <h3 class="brand-name">{{ brand.name }}</h3>
              <div class="brand-count">
                <span class="count-number">{{ brand.ads_count }}</span>
                <span class="count-label">объявлений</span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.brands {
  background: var(--color-bg-primary);
  padding: 60px 20px 40px;
  margin: 40px 0 0;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.section-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 16px;
  margin-bottom: 48px;
}

.carousel-wrapper {
  overflow: hidden;
  margin: 0 -20px;
  padding: 0 20px;
}

.brand-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: var(--color-primary);
    background: #ffffff;
    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.12);
    transform: translateY(-4px);

    .brand-logo-container {
      transform: scale(1.05);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
    }

    .brand-name {
      color: var(--color-primary);
    }

    .count-number {
      color: var(--color-primary);
    }
  }
}

.brand-logo-container {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 16px;
  margin-bottom: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

.brand-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.brand-logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.brand-initial {
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
  text-align: center;
  transition: color 0.3s ease;
  line-height: 1.3;
}

.brand-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  text-align: center;
}

.count-number {
  font-weight: 700;
  color: var(--color-text-primary);
  font-size: 16px;
  transition: color 0.3s ease;
}

.count-label {
  color: var(--color-text-secondary);
  font-weight: 500;
}

:deep(.el-carousel__container) {
  max-width: 1200px;
  margin: 0 auto;
}

:deep(.el-carousel__item) {
  padding: 0 12px;
}

:deep(.el-carousel__item--card) {
  width: 48%;
}

:deep(.el-carousel__item.is-active) {
  z-index: 2;
}

@media (max-width: 768px) {
  .brands {
    padding: 40px 20px 0;
  }

  .section-title {
    font-size: 28px;
  }

  .section-subtitle {
    font-size: 14px;
    margin-bottom: 32px;
  }

  .carousel-wrapper {
    margin: 0 -10px;
    padding: 0 10px;
  }

  .brand-card {
    padding: 24px 20px;
  }

  .brand-logo-container {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
  }

  .brand-initial {
    font-size: 32px;
  }

  .brand-name {
    font-size: 18px;
  }

  .count-number {
    font-size: 14px;
  }

  .count-label {
    font-size: 12px;
  }

  :deep(.el-carousel) {
    height: 200px !important;
  }

  :deep(.el-carousel__item) {
    padding: 0 8px;
  }

  :deep(.el-carousel__item--card) {
    width: 45%;
  }
}
</style>
