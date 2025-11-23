<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<template>
  <div class="hero-wrapper">
    <section class="hero" :class="{ 'is-visible': isVisible }">
      <div class="ambient-light"></div>
      <div class="container">
        <div class="hero-content">
          <div class="text-content">
            <h1 class="hero-title">
              <span class="line">Технологии</span>
              <span class="line gradient-text">в твоих руках</span>
            </h1>
            <p class="hero-subtitle">
              Откройте мир лучших смартфонов в Узбекистане. Покупайте, продавайте и открывайте новое на Smart Market.
            </p>
            <div class="hero-actions">
              <NuxtLink to="/search" class="btn btn-primary">
                Найти смартфон
              </NuxtLink>
              <NuxtLink to="/create" class="btn btn-secondary">
                Продать устройство
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>


.hero-wrapper {
  background-color: #ffffff; // White background
}

.hero {
  position: relative;
  text-align: center;
  overflow: hidden;
  padding: 20px 0 60px;
  
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.ambient-light {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 55%);
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 1.5s ease 0.5s;

  .is-visible & {
    opacity: 1;
  }
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 40px;
  position: relative;
  z-index: 2;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.text-content {
  max-width: 750px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;

  .is-visible & {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 72px;
  font-weight: 800;
  color: #1e293b; // Dark Slate 800
  line-height: 1.1;
  margin: 0 0 24px;
  letter-spacing: -2.5px;

  .line {
    display: block;
  }

  .gradient-text {
    background: linear-gradient(90deg, var(--color-primary), #63e2b7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}

.hero-subtitle {
  font-size: 20px;
  color: #64748b; // Slate 500
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s;

  .is-visible & {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 5px 20px rgba(59, 130, 246, 0.25);

  &:hover {
    background-color: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.35);
  }
}

.btn-secondary {
  background-color: white;
  color: #475569; // Slate 600
  border: 1px solid #e2e8f0; // Slate 200
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  &:hover {
    background-color: #f8fafc; // Slate 50
    border-color: #cbd5e1; // Slate 300
    color: #1e293b; // Slate 800
    transform: translateY(-2px);
  }
}


@media (max-width: 768px) {
  .hero-wrapper {
    padding: 30px 0;
  }

  .container {
    padding: 60px 20px;
  }

  .hero-title {
    font-size: 48px;
    letter-spacing: -1.5px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .btn {
      width: 100%;
      max-width: 300px;
    }
  }
}
</style>
