<script setup lang="ts">
import AdGallery from "~/components/ad/GallerySection.vue";
import InfoSection from "~/components/ad/InfoSection.vue";
import CharacterSection from "~/components/ad/CharacterSection.vue";
import SellerSection from "~/components/ad/SellerSection.vue";
import SidebarSection from "~/components/ad/SidebarSection.vue";
import ListingChat from "~/components/ad/ListingChat.vue";
import type { IListing } from "~/types/ads";
import type { IBaseResponse } from "~/types";
import NeedAuth from "~/components/layout/NeedAuth.vue";
import { useRootStore } from "~/store/root";

const route = useRoute();
const { $api } = useNuxtApp();
const root = useRootStore();

const { data, error, pending: loading, refresh } = await useAsyncData(
  `listing-${route.params.alias}`,
  () => $api<IBaseResponse<IListing>>(`/ads/alias/${route.params.alias}`)
);

const listing = computed(() => data.value?.data);
const showChat = ref(false);

if (error.value) {
  if (import.meta.client) {
    ElMessage.error("Ошибка при загрузке объявления");
  }
}

const handleUpdate = async () => {
  await refresh();
};

const openChat = () => {
  showChat.value = true;
};

</script>

<template>
  <main class="page">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>

      <template v-else-if="listing">
        <div class="breadcrumbs">
          <el-breadcrumb>
            <el-breadcrumb-item to="/">Главная</el-breadcrumb-item>
            <el-breadcrumb-item>{{ listing?.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="listing-grid">
          <div v-if="listing">
            <AdGallery :listing="listing" />
            <InfoSection :listing="listing" />
            <CharacterSection :listing="listing" />
            <SellerSection :listing="listing" @open-chat="openChat" />
          </div>
          <div v-if="listing"> 
            <SidebarSection :listing="listing" @update="handleUpdate" @open-chat="openChat" />
          </div>
        </div>

        <ListingChat v-if="root.user" v-model:visible="showChat" :listing="listing" />
        <NeedAuth v-else v-model="showChat" />
      </template>

      <div v-else class="error-state">
        <el-empty description="Объявление не найдено" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page {
  min-height: 60vh;
  
  .loading-state,
  .error-state {
    padding: 40px 0;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .breadcrumbs {
    padding: 20px 0;
  }
  
  .listing-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 420px;
    gap: 20px;
    margin-bottom: 50px;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
