<script setup lang="ts">
import type { IListing, IListingContacts } from "~/types/ads";
import { Phone } from "@element-plus/icons-vue";
import type { IBaseResponse } from "~/types";

const props = defineProps<{
  listing: IListing;
}>();

const emit = defineEmits<{
  (e: "contacts-shown", contacts: IListingContacts): void;
}>();

const { $api } = useNuxtApp();

const loading = ref(false);

const handleShowContacts = catcher(async () => {
  loading.value = true;
  const { data } = await $api<IBaseResponse<IListingContacts>>(
    `/ads/${props.listing.id}/contacts`
  );
  console.log(data);

  if (data) {
    emit("contacts-shown", {
      phone_number: data.phone_number || "",
      telegram_link: data.telegram_link || "",
    });
  }
  loading.value = false;
}, () => {
  loading.value = false;
});
</script>

<template>
  <el-button
    v-if="props.listing.show_phone"
    size="large"
    :icon="Phone"
    plain
    type="warning"
    :loading="loading"
    @click="handleShowContacts"
  />
</template>

<style lang="scss" scoped></style>

