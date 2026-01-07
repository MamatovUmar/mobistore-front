<template>
  <div class="skeleton-container">
    <div class="skeleton-filters">
      <div class="skeleton-grid">
        <!-- 4 Inputs -->
        <div class="skeleton-item" v-for="i in 4" :key="i">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>

        <!-- Button -->
        <div class="skeleton-item skeleton-button-wrapper">
          <div class="skeleton-button"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  align-items: flex-end;
}

.skeleton-item {
  width: 100%;
}

.skeleton-label {
  height: 22px;
  width: 80px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-input {
  height: 40px;
  width: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-button-wrapper {
  display: block;
}

.skeleton-button {
  height: 40px;
  width: 100%;
  border-radius: 4px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive (Matching FilterBlock) */
@media (max-width: 1024px) {
  .skeleton-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .skeleton-button-wrapper {
    grid-column: span 3;
  }

  .skeleton-filters {
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .skeleton-filters {
    padding: 24px 20px;
    margin: 20px 20px 32px;
    border-radius: 20px;
  }

  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .skeleton-button-wrapper {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .skeleton-filters {
    padding: 20px 16px;
    margin: 16px;
    border-radius: 16px;
  }

  .skeleton-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .skeleton-button-wrapper {
    grid-column: 1;
  }
}
</style>
