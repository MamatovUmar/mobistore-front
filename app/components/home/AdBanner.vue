<script setup lang="ts">
import { Plus, Clock, Medal, Discount, Check } from "@element-plus/icons-vue";

const features = [
  {
    icon: Clock,
    title: "Быстрое размещение",
    description: "Создайте объявление за 2 минуты",
  },
  {
    icon: Medal,
    title: "Бесплатно навсегда",
    description: "Без скрытых платежей и комиссий",
  },
  {
    icon: Discount,
    title: "Широкая аудитория",
    description: "Тысячи покупателей каждый день",
  },
];
</script>

<template>
  <section class="cta">
    <div class="container">
      <div class="cta-content">
        <div class="cta-header">
          <span class="cta-badge">
            <el-icon><Check /></el-icon>
            Проверенная платформа
          </span>
          <h2 class="cta-title">
            Продайте свой смартфон быстро и выгодно
          </h2>
          <p class="cta-description">
            Разместите бесплатное объявление о продаже смартфона, планшета или
            другой техники. Найдите покупателя среди тысяч активных пользователей
            нашей платформы. Простое размещение, безопасные сделки, оперативная
            продажа.
          </p>
        </div>

        <div class="features-grid">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="feature-card"
          >
            <div class="feature-icon">
              <el-icon><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>

        <div class="cta-actions">
          <el-button
            type="primary"
            size="large"
            round
            class="cta-button"
            :icon="Plus"
            @click="navigateTo('/create')"
          >
            Разместить объявление бесплатно
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding: 100px 20px;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>');
    background-size: 40px 40px;
    opacity: 0.3;
  }
}

.cta-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.cta-header {
  margin-bottom: 56px;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  .el-icon {
    font-size: 16px;
  }
}

.cta-title {
  font-size: 48px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}

.cta-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.7;
  max-width: 700px;
  margin: 0 auto;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 32px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);

  .el-icon {
    font-size: 28px;
    color: #ffffff;
  }
}

.feature-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.feature-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.cta-button {
  font-size: 18px;
  font-weight: 600;
  padding: 28px 48px;
  height: auto;
  background: #ffffff;
  color: #667eea;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: #ffffff;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(0);
  }

  :deep(.el-icon) {
    font-size: 20px;
  }
}

.cta-note {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

@media (max-width: 768px) {
  .cta {
    padding: 60px 20px;
  }

  .cta-header {
    margin-bottom: 40px;
  }

  .cta-badge {
    font-size: 13px;
    padding: 6px 16px;
  }

  .cta-title {
    font-size: 32px;
    margin-bottom: 16px;
  }

  .cta-description {
    font-size: 16px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 40px;
  }

  .feature-card {
    padding: 24px 20px;
  }

  .feature-icon {
    width: 48px;
    height: 48px;

    .el-icon {
      font-size: 24px;
    }
  }

  .feature-title {
    font-size: 16px;
  }

  .feature-description {
    font-size: 13px;
  }

  .cta-button {
    font-size: 16px;
    padding: 22px 36px;
    width: 100%;
    max-width: 400px;
  }

  .cta-note {
    font-size: 13px;
  }
}
</style>
