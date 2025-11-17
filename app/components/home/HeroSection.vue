<script setup lang="ts">
</script>

<template>
  <section class="hero">
    <div class="container">
      <h1>Смартфоны в Узбекистане - покупка и продажа телефонов</h1>
      <p>
        Большой выбор моделей, выгодные цены и актуальные объявления от частных продавцов и магазинов.
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  background: #e8e8ed;
  color: #1d1d1f;
  padding: 50px 20px 100px;
  text-align: center;

  .container {
    max-width: 900px;
    margin: 0 auto;
  }
}

.hero h1 {
  font-size: 40px;
  margin-bottom: 16px;
  font-weight: 700;
}

.hero p {
  font-size: 20px;
  color: #6e6e73;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 20px;
  }

  .hero h1 {
    font-size: 32px;
  }

  .hero p {
    font-size: 16px;
  }
}
</style>
