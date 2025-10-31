<script setup lang="ts"></script>

<template>
  <div class="seller-section">
    <h2 class="section-title">Продавец</h2>
    <div class="seller-info">
      <el-avatar>
        MA
      </el-avatar>
      <div class="seller-details">
        <div class="seller-name">Алексей М.</div>
        <div class="seller-stats">На сайте с 2023 года • 47 объявлений</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.seller-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.seller-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.seller-details {
  flex: 1;
}

.seller-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.seller-stats {
  color: var(--color-text-secondary);
  font-size: 14px;
}
</style>
