<script setup lang="ts">
import HeroSection from "@/components/home/HeroSection.vue";
import FilterBlock from "@/components/home/FilterBlock.vue";
import LastAds from "@/components/home/LastAds.vue";
import PoularBrands from "@/components/home/PoularBrands.vue";
import AdBanner from "@/components/home/AdBanner.vue";

// SEO метаданные для главной страницы
useSeoMeta({
  title: "MobiStore - Купить и продать смартфоны в Узбекистане | Доска объявлений",
  description:
    "Крупнейшая доска объявлений по продаже смартфонов, планшетов и мобильных устройств в Узбекистане. Тысячи объявлений от частных лиц и магазинов. Быстрая продажа, безопасные сделки. Бесплатное размещение объявлений.",
  ogTitle: "MobiStore - Купить и продать смартфоны в Узбекистане",
  ogDescription:
    "Найдите свой идеальный смартфон среди тысяч объявлений. Популярные бренды: iPhone, Samsung, Xiaomi. Бесплатное размещение объявлений.",
  ogImage: "/og-image.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "MobiStore - Купить и продать смартфоны в Узбекистане",
  twitterDescription:
    "Крупнейшая доска объявлений по продаже смартфонов в Узбекистане. Бесплатное размещение, безопасные сделки.",
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