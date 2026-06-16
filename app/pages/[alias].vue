<script setup lang="ts">
import AdGallery from "~/components/ad/GallerySection.vue";
import InfoSection from "~/components/ad/InfoSection.vue";
import CharacterSection from "~/components/ad/CharacterSection.vue";
import SellerSection from "~/components/ad/SellerSection.vue";
import SidebarSection from "~/components/ad/SidebarSection.vue";
import ModelSpecsCard from "~/components/ad/ModelSpecsCard.vue";
import ModelSpecsModal from "~/components/ad/ModelSpecsModal.vue";
import ListingChat from "~/components/ad/ListingChat.vue";
import type { IListing } from "~/types/ads";
import type { IBaseResponse } from "~/types";
import NeedAuth from "~/components/layout/NeedAuth.vue";
import { useRootStore } from "~/store/root";
import SimilarAds from "~/components/ad/SimilarAds.vue";

const route = useRoute();
const { $api } = useNuxtApp();
const root = useRootStore();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const {
  data,
  error,
  pending: loading,
  refresh,
} = await useAsyncData(`listing-${route.params.alias}`, () =>
  $api<IBaseResponse<IListing>>(`/ads/alias/${route.params.alias}`)
);

const listing = computed(() => data.value?.data);
const showChat = ref(false);
const showModelSpecs = ref(false);

const config = useRuntimeConfig();
const siteUrl = config.public.siteUrl || "https://mobistore.uz";

useSeoMeta({
  title: () =>
    listing.value?.title
      ? `${listing.value.title} — Mobistore`
      : t("listing.seo.defaultTitle"),
  description: () =>
    listing.value
      ? `${listing.value.brand?.name} ${
          listing.value.model?.name
        } за ${listing.value.price?.toLocaleString("ru-RU")} ${
          listing.value.currency
        }. ${listing.value.description?.slice(0, 150)}...`
      : t("listing.seo.defaultDesc"),
  ogTitle: () => listing.value?.title || t("listing.seo.defaultTitle"),
  ogDescription: () =>
    listing.value
      ? `${listing.value.brand?.name} ${
          listing.value.model?.name
        } • ${listing.value.price?.toLocaleString("ru-RU")} ${
          listing.value.currency
        } • ${
          listing.value.region?.[`name_${locale.value}`] ||
          listing.value.region.name_ru
        }`
      : t("listing.seo.defaultDesc"),
  ogImage: () =>
    listing.value?.images?.[0]?.url || "https://mobistore.uz/og-default.png",
  ogUrl: () => `${siteUrl}/${listing.value?.alias}`,
  ogType: "website",
  ogSiteName: "Mobistore",
  ogLocale: () => (locale.value === "ru" ? "ru_RU" : "uz_UZ"),
  twitterCard: "summary_large_image",
  twitterTitle: () => listing.value?.title || t("listing.seo.defaultTitle"),
  twitterDescription: () =>
    listing.value
      ? `${listing.value.brand?.name} ${
          listing.value.model?.name
        } • ${listing.value.price?.toLocaleString("ru-RU")} ${
          listing.value.currency
        }`
      : t("listing.seo.defaultDesc"),
  twitterImage: () => listing.value?.images?.[0]?.url || "/og-default.png",
});

useHead({
  link: [
    { rel: "canonical", href: () => `${siteUrl}/${listing.value?.alias}` },
  ],
});

if (error.value) {
  if (import.meta.client) {
    ElMessage.error(t("listing.loadError"));
  }
}

const handleUpdate = async () => {
  await refresh();
};

const openChat = () => {
  showChat.value = true;
};

const statusAlert = computed(() => {
  const alerts: Record<
    string,
    {
      title: string;
      description: string;
      type: "warning" | "error" | "success";
    }
  > = {
    moderation: {
      title: t("listing.moderation.title"),
      description: t("listing.moderation.description"),
      type: "warning",
    },
    rejected: {
      title: t("listing.rejected.title"),
      description: t("listing.rejected.description"),
      type: "error",
    },
    archived: {
      title: t("listing.archived.title"),
      description: t("listing.archived.description"),
      type: "error",
    },
    sold: {
      title: t("listing.sold.title"),
      description: t("listing.sold.description"),
      type: "success",
    },
  };
  return listing.value?.status ? alerts[listing.value.status] : null;
});
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
            <el-breadcrumb-item :to="localePath('/')">{{
              t("search.breadcrumbs.home")
            }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ listing?.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-alert
          v-if="statusAlert"
          :title="statusAlert.title"
          :description="statusAlert.description"
          :type="statusAlert.type"
          :closable="false"
          style="margin-bottom: 20px"
        />

        <div class="listing-grid">
          <div v-if="listing">
            <AdGallery :listing="listing" />
            <InfoSection :listing="listing" />
            <CharacterSection
              :listing="listing"
              @open-specs="showModelSpecs = true"
            />
            <SellerSection :listing="listing" />
          </div>
          <div v-if="listing" class="sidebar-col">
            <SidebarSection
              :listing="listing"
              :is-archived="
                listing.status === 'archived' || listing.status === 'sold'
              "
              @update="handleUpdate"
              @open-chat="openChat"
            />
            <ModelSpecsCard
              v-if="listing.model"
              :model="listing.model"
              :brand="listing.brand"
              @open="showModelSpecs = true"
            />
          </div>
        </div>

        <ModelSpecsModal
          v-if="listing.model && listing.brand"
          v-model:model-visible="showModelSpecs"
          :model-data="listing.model"
          :brand="listing.brand"
        />

        <ListingChat
          v-if="root.user"
          v-model:visible="showChat"
          :listing="listing"
        />
        <NeedAuth v-else v-model="showChat" />

        <SimilarAds :id="listing.id" />
      </template>

      <div v-else class="error-state">
        <el-empty :description="t('listing.notFound')" />
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

  .sidebar-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    // Липким делаем весь столбец как единый блок, а внутренний sticky
    // у SidebarSection гасим — иначе карточка характеристик уезжает под него.
    align-self: start;
    position: sticky;
    top: 10px;

    :deep(.info-section) {
      position: static;
      top: auto;
    }

    @media (max-width: 1024px) {
      position: static;
      top: auto;
    }
  }

  .listing-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 420px;
    gap: 20px;
    margin-bottom: 50px;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      grid-auto-flow: dense;

      & > div:nth-child(1) {
        order: 2;
      }

      & > div:nth-child(2) {
        order: 1;
      }
    }
  }
}
</style>
