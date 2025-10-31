<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
</script>

<template>
  <section class="cta">
    <div class="container">
      <h2>Разместите объявление бесплатно</h2>
      <p>Продайте свой смартфон за несколько минут. Это просто и быстро!</p>
      <el-button size="large" round :icon="Plus">Разместить объявление</el-button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: var(--color-bg-primary);
  padding: 80px 20px;
  text-align: center;
}

.cta h2 {
  font-size: 40px;
  margin-bottom: 16px;
  font-weight: 700;
}

.cta p {
  font-size: 18px;
  margin-bottom: 32px;
  opacity: 0.95;
}
</style>
