<script setup lang="ts"></script>

<template>
  <div class="specs-section">
    <h2 class="section-title">Характеристики</h2>
    <div class="specs-grid">
      <div class="spec-item">
        <div class="spec-label">Процессор</div>
        <div class="spec-value">Snapdragon 8 Gen 3</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Память</div>
        <div class="spec-value">12 GB / 256 GB</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Экран</div>
        <div class="spec-value">6.8" Dynamic AMOLED</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Камера</div>
        <div class="spec-value">200 MP + 50 MP + 12 MP</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Батарея</div>
        <div class="spec-value">5000 mAh</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Цвет</div>
        <div class="spec-value">Titanium Black</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.specs-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.spec-item {
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
}

.spec-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.spec-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
