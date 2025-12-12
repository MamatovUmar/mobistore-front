<script setup lang="ts">
import { ref } from "vue";
import { Cellphone, Lightning, Wallet } from "@element-plus/icons-vue";

const router = useRouter();
</script>

<template>
  <div class="hero-wrapper">
    <!-- Animated Background -->
    <div class="hero-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="container">
      <!-- Floating Elements (Background Layer) -->
      <div class="floating-elements">
        <div class="float-card card-1">
          <div class="icon-box blue">
            <el-icon><Cellphone /></el-icon>
          </div>
          <span>Смартфоны</span>
        </div>
        <div class="float-card card-2">
          <div class="icon-box purple">
            <el-icon><Wallet /></el-icon>
          </div>
          <span>Выгодно</span>
        </div>
        <div class="float-card card-3">
          <div class="icon-box orange">
            <el-icon><Lightning /></el-icon>
          </div>
          <span>Быстро</span>
        </div>
      </div>

      <div class="hero-content">
        <!-- Main Content -->
        <div class="text-content">
          <div class="badge slide-up">
            <span class="badge-dot"></span>
            Платформа №1 в Узбекистане
          </div>

          <h1 class="hero-title slide-up delay-1">
            Технологии
            <span class="gradient-text">в твоих руках</span>
          </h1>

          <p class="hero-subtitle slide-up delay-2">
            Покупайте и продавайте смартфоны выгодно. Тысячи проверенных
            объявлений, безопасные сделки и удобный поиск в вашем городе.
          </p>

          <!-- Quick Stats -->
          <div class="hero-stats slide-up delay-4" v-if="false">
            <div class="stat-item">
              <span class="stat-count">10k+</span>
              <span class="stat-label">Объявлений</span>
            </div>
            <div class="stat-separator"></div>
            <div class="stat-item">
              <span class="stat-count">5k+</span>
              <span class="stat-label">Пользователей</span>
            </div>
            <div class="stat-separator"></div>
            <div class="stat-item">
              <span class="stat-count">24/7</span>
              <span class="stat-label">Поддержка</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero-wrapper {
  position: relative;
  background-color: #f8fafc;
  overflow: hidden;
  min-height: 450px;
  display: flex;
  align-items: center;
  .container {
    height: -webkit-fill-available;
  }
}

/* Background Effects */
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #60a5fa30 0%, #3b82f610 70%);
  top: -100px;
  left: -100px;
}

.blob-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #a78bfa30 0%, #8b5cf610 70%);
  bottom: -150px;
  right: -100px;
  animation-delay: -10s;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  width: 100%;
}

.hero-content {
  position: relative;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
  display: flex;
  height: -webkit-fill-available;
  flex-direction: column;
  justify-content: center;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
  margin-bottom: 32px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #dcfce7;
}

/* Typography */
.hero-title {
  font-size: 64px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.1;
  margin: 0 0 24px;
  letter-spacing: -2px;

  .gradient-text {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.hero-subtitle {
  font-size: 20px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 auto 48px;
  max-width: 800px;
}

/* Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-count {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-separator {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

/* Floating Elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 10%;
  width: 80%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.float-card {
  position: absolute;
  background: white;
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
  animation: float 6s infinite ease-in-out;
}

.icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;

  &.blue {
    background: #3b82f6;
  }

  &.purple {
    background: #8b5cf6;
  }

  &.orange {
    background: #f97316;
  }
}

.card-1 {
  top: 10%;
  left: 2%;
  transform: rotate(-5deg);
  animation-delay: 0s;
}

.card-2 {
  top: 15%;
  right: 2%;
  transform: rotate(5deg);
  animation-delay: -2s;
}

.card-3 {
  bottom: 10%;
  left: 5%;
  transform: rotate(3deg);
  animation-delay: -4s;
}

@media (max-width: 1200px) {
  .float-card {
    scale: 0.9;
  }
  .card-1 {
    left: -20px;
  }
  .card-2 {
    right: -20px;
  }
}

@media (max-width: 900px) {
  .floating-elements {
    display: none;
  }
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(var(--r, 0deg));
  }
  50% {
    transform: translateY(-20px) rotate(var(--r, 0deg));
  }
}

.slide-up {
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-1 {
  animation-delay: 0.1s;
}
.delay-2 {
  animation-delay: 0.2s;
}
.delay-3 {
  animation-delay: 0.3s;
}
.delay-4 {
  animation-delay: 0.4s;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-wrapper {
    min-height: auto;
    padding: 40px 0;
  }

  .hero-content {
    padding: 20px 0;
  }

  .hero-title {
    font-size: 40px;
    letter-spacing: -1px;
  }

  .hero-subtitle {
    font-size: 16px;
    padding: 0 10px;
  }

  .stat-separator {
    display: none;
  }

  .hero-stats {
    gap: 20px;
  }

  .floating-elements {
    display: none; /* Hide floating cards on mobile to avoid clutter */
  }
}
</style>
