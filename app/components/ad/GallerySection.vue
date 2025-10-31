<script setup lang="ts"></script>

<template>
  <div class="gallery-section">
    <div class="main-image">
      📱
      <span class="image-badge">Новый</span>
    </div>
    <div class="thumbnail-grid">
      <div class="thumbnail active">📱</div>
      <div class="thumbnail">📱</div>
      <div class="thumbnail">📱</div>
      <div class="thumbnail">📱</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gallery-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.main-image {
  width: 100%;
  height: 500px;
  background: linear-gradient(
    135deg,
    #f3f4f6 0%,
    var(--color-border-light) 100%
  );
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
  margin-bottom: 16px;
  position: relative;
}

.image-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: linear-gradient(135deg, var(--color-success) 0%, #0d9668 100%);
  color: var(--color-bg-primary);
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.thumbnail {
  height: 100px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.thumbnail:hover {
  border-color: var(--color-primary);
}

.thumbnail.active {
  border-color: var(--color-primary);
  background: var(--color-bg-primary);
}
</style>
