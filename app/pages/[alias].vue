<script setup lang="ts">
import AdGallery from "~/components/ad/GallerySection.vue";
import InfoSection from "~/components/ad/InfoSection.vue";
import CharacterSection from "~/components/ad/CharacterSection.vue";
import SellerSection from "~/components/ad/SellerSection.vue";
import SidebarSection from "~/components/ad/SidebarSection.vue";
</script>

<template>
  <main class="page">
    <div class="container">
      <div class="breadcrumbs">
        <el-breadcrumb>
          <el-breadcrumb-item>Главная</el-breadcrumb-item>
          <el-breadcrumb-item>Результаты поиска</el-breadcrumb-item>
          <el-breadcrumb-item>iPhone 15 Pro Max</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="listing-grid">
        <div>
          <AdGallery />
          <InfoSection />
          <CharacterSection />
          <SellerSection />
        </div>
        <div> 
          <SidebarSection />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page {
  min-height: 60vh;
  .breadcrumbs {
    padding: 20px 0;
  }
  .listing-grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 20px;
    margin-bottom: 50px;
  }
}
</style>
