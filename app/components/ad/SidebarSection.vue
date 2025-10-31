<script setup lang="ts">
</script>

<template>
  <div class="info-section">
    <div class="listing-badges">
      <span class="listing-brand">Samsung</span>
    </div>

    <h1 class="listing-title"> Galaxy S24 Ultra 256GB </h1>

    <div class="listing-price">12 500 000 сум</div>

    <div class="listing-actions">
      <el-button size="large" type="primary"> Показать телефон</el-button>
      <el-button size="large"> Добавить в избранное</el-button>
    </div>

    <div class="listing-meta">
      <div class="meta-item">
        <span class="meta-label">Состояние</span>
        <span class="meta-value">Новый</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Локация</span>
        <span class="meta-value">Ташкент, Мирабадский район</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Дата публикации</span>
        <span class="meta-value">31 октября 2025</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Просмотры</span>
        <span class="meta-value">247 просмотров</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">ID объявления</span>
        <span class="meta-value">#SM-24-00847</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 10px;
}

.listing-badges {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.listing-brand {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-primary);
  text-transform: uppercase;
}

.listing-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.listing-price {
  font-size: 30px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.listing-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  .el-button+.el-button {
    margin-left: 0;
  }
}

.btn-contact {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.btn-contact:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-secondary:hover {
  background: var(--color-border-medium);
}

.listing-meta {
  padding-top: 24px;
  border-top: 2px solid var(--color-border-light);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-label {
  color: var(--color-text-secondary);
  font-size: 15px;
}

.meta-value {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 15px;
}
</style>
