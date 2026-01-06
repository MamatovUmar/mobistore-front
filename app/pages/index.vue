<script setup lang="ts">
import HeroSection from "@/components/home/HeroSection.vue";
import FilterBlock from "@/components/home/FilterBlock.vue";
import LastAds from "@/components/home/LastAds.vue";
import PoularBrands from "@/components/home/PoularBrands.vue";
import AdBanner from "@/components/home/AdBanner.vue";

const { t } = useI18n();

// SEO метаданные для главной страницы
useSeoMeta({
  title: () => t('seo.home.title'),
  description: () => t('seo.home.description'),
  ogTitle: () => t('seo.home.ogTitle'),
  ogDescription: () => t('seo.home.ogDescription'),
  ogImage: "/home.png",
  ogImageHeight: 630,
  ogImageWidth: 1200,
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: () => t('seo.home.twitterTitle'),
  twitterDescription: () => t('seo.home.twitterDescription'),
  robots: "index, follow",
});

</script>

<template>
  <div>
    <HeroSection />
    <FilterBlock />
    <LastAds />
    <PoularBrands />
    <AdBanner />
  </div>
</template>

<style scoped></style>