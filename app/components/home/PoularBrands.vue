<script setup lang="ts">
import { ref } from "vue";

const brands = ref([
  { name: "Samsung", icon: "📱", color: "#1428A0" },
  { name: "Apple", icon: "", color: "#000000" },
  { name: "Xiaomi", icon: "📱", color: "#FF6900" },
  { name: "Huawei", icon: "📱", color: "#ED1C24" },
  { name: "Oppo", icon: "📱", color: "#00A862" },
  { name: "Vivo", icon: "📱", color: "#0066CC" },
  { name: "Realme", icon: "📱", color: "#FFC900" },
  { name: "OnePlus", icon: "📱", color: "#F5010C" },
  { name: "Nokia", icon: "📱", color: "#124191" },
  { name: "Motorola", icon: "📱", color: "#5C92FA" },
  { name: "Sony", icon: "📱", color: "#000000" },
  { name: "Honor", icon: "📱", color: "#0075C9" },
]);
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
          :interval="30000"
          type="card"
          height="200px"
          arrow="never"
          :autoplay="true"
          :indicator-position="'none'"
        >
          <el-carousel-item v-for="brand in brands" :key="brand.name">
            <div class="brand-card">
              <div class="brand-icon">{{ brand.icon }}</div>
              <h3 class="brand-name">{{ brand.name }}</h3>
              <div class="brand-count">1250+ объявлений</div>
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
  padding: 60px 20px 0;
  margin: 40px 0;
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
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 16px;
  border: 2px solid var(--color-border-light);
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-primary);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.15);

    .brand-icon {
      transform: scale(1.08);
    }

    .brand-name {
      color: var(--color-primary);
    }
  }
}

.brand-icon {
  font-size: 52px;
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
  text-align: center;
}

.brand-count {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;
  text-align: center;
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
    padding: 20px 16px;
  }

  .brand-icon {
    font-size: 44px;
  }

  .brand-name {
    font-size: 18px;
  }

  .brand-count {
    font-size: 12px;
  }

  :deep(.el-carousel) {
    height: 160px !important;
  }

  :deep(.el-carousel__item) {
    padding: 0 8px;
  }

  :deep(.el-carousel__item--card) {
    width: 45%;
  }
}
</style>
