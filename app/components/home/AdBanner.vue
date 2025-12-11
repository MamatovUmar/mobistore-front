<script setup lang="ts">
import {
  Right,
  Money,
  CircleCheckFilled,
  TrendCharts,
  Iphone,
} from "@element-plus/icons-vue";

const benefits = [
  "Бесплатное размещение за 2 минуты",
  "Тысячи реальных покупателей",
];
</script>

<template>
  <section class="promo-section">
    <div class="container">
      <div class="promo-grid">
        <!-- Left Content -->
        <div class="promo-content">
          <div class="promo-badge">
            <span class="pulse"></span>
            MobiStore
          </div>
          
          <h2 class="promo-title">
            Превратите старый гаджет в 
            <span class="gradient-text">новые возможности</span>
          </h2>
          
          <p class="promo-description">
            Не дайте вашему смартфону пылиться на полке. Продайте его выгодно 
            на главной площадке Узбекистана.
          </p>

          <ul class="promo-benefits">
            <li v-for="(benefit, index) in benefits" :key="index">
              <el-icon class="check-icon"><CircleCheckFilled /></el-icon>
              {{ benefit }}
            </li>
          </ul>

          <div class="promo-actions">
            <el-button
              type="primary"
              size="large"
              class="main-btn"
              @click="navigateTo('/create')"
            >
              Начать продажу
              <el-icon class="el-icon--right"><Right /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- Right Visuals -->
        <div class="promo-visuals">
          <div class="visual-card card-main">
            <div class="card-header">
              <div class="user-info">
                <div class="user-avatar"></div>
                <div class="user-text">
                  <div class="line line-short"></div>
                  <div class="line line-long"></div>
                </div>
              </div>
              <div class="status-badge">Продано</div>
            </div>
            <div class="card-image-placeholder">
              <el-icon><Iphone /></el-icon>
            </div>
            <div class="card-price">
              <span>iPhone 13 Pro</span>
              <strong>8 500 000 UZS</strong>
            </div>
          </div>

          <!-- Floating Elements -->
          <div class="float-card float-1">
            <el-icon><Money /></el-icon>
            <span>Выгодно</span>
          </div>
          
          <div class="float-card float-2">
            <el-icon><TrendCharts /></el-icon>
            <span>Быстро</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.promo-section {
  background: #0f172a; /* Dark Slate 900 */
  padding: 100px 0;
  color: #ffffff;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
    filter: blur(60px);
    z-index: 0;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.promo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

/* Left Content Styles */
.promo-content {
  max-width: 540px;
}

.promo-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #60a5fa;
  margin-bottom: 24px;

  .pulse {
    width: 8px;
    height: 8px;
    background: #60a5fa;
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);
    animation: pulse-blue 2s infinite;
  }
}

.promo-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;

  .gradient-text {
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.promo-description {
  font-size: 18px;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 32px;
}

.promo-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 16px;
    color: #e2e8f0;

    .check-icon {
      color: #10b981;
      font-size: 20px;
    }
  }
}

.promo-actions {
  display: flex;
  align-items: center;
  gap: 32px;

  .main-btn {
    height: 56px;
    padding: 0 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    background: #3b82f6;
    border: none;
    transition: all 0.3s ease;

    &:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
    }
  }
}

/* Right Visuals Styles */
.promo-visuals {
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 24px;
  width: 320px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: rotate(-3deg);
  transition: transform 0.5s ease;

  &:hover {
    transform: rotate(0) scale(1.02);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #475569;
  }

  .user-text {
    display: flex;
    flex-direction: column;
    gap: 6px;

    .line {
      height: 6px;
      background: #334155;
      border-radius: 4px;
    }
    .line-short { width: 60px; }
    .line-long { width: 100px; }
  }

  .status-badge {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }
}

.card-image-placeholder {
  height: 180px;
  background: #1e293b;
  border-radius: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-icon {
    font-size: 64px;
    color: #334155;
  }
}

.card-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    color: #94a3b8;
    font-size: 14px;
  }
  
  strong {
    color: #ffffff;
    font-size: 18px;
  }
}

.float-card {
  position: absolute;
  background: #ffffff;
  color: #0f172a;
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  animation: float 6s ease-in-out infinite;

  .el-icon {
    font-size: 18px;
    color: #3b82f6;
  }

  &.float-1 {
    top: 20%;
    right: 10%;
    animation-delay: 0s;
  }

  &.float-2 {
    bottom: 20%;
    left: 10%;
    animation-delay: 3s;
  }
}

@keyframes pulse-blue {
  0% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(96, 165, 250, 0); }
  100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 992px) {
  .promo-grid {
    grid-template-columns: 1fr;
    gap: 60px;
    text-align: center;
  }

  .promo-content {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .promo-benefits {
    align-items: flex-start;
    display: inline-flex;
    flex-direction: column;
  }

  .promo-visuals {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .promo-section {
    padding: 60px 0;
  }

  .promo-title {
    font-size: 32px;
  }

  .promo-actions {
    flex-direction: column;
    gap: 20px;
    width: 100%;

    .main-btn {
      width: 100%;
    }
  }

  .visual-card {
    width: 280px;
  }
}
</style>
