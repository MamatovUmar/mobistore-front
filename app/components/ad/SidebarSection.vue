<script setup lang="ts">
import {
  ListingStatus,
  type IListing,
  type IListingContacts,
} from "~/types/ads";
import {
  ChatDotRound,
  Phone,
  ChatLineRound,
  Star,
  StarFilled,
} from "@element-plus/icons-vue";
import StatusTag from "~/components/ad/StatusTag.vue";
import ContactsInfo from "~/components/ad/ContactsInfo.vue";
import ComplaintButton from "~/components/ad/ComplaintButton.vue";
import { useFavorite } from "#imports";
import { useRootStore } from "~/store/root";

const { listing } = defineProps<{ listing: IListing }>();

const emit = defineEmits<{
  update: [];
  "open-chat": [];
}>();

const root = useRootStore();
const { t, locale } = useI18n();
const { changeStatus, bumpAd, bumpLoading } = useAds();
const { addToFavorite, addLoading, removeFavorite, removeLoading } =
  useFavorite();

// Состояние отображения контактов
const showContacts = ref(false);
const isFavorite = ref(false);
const publishLoading = ref(false);
const contacts = ref<IListingContacts>();

const favorites = computed(() => root.user?.favorites || []);

// Форматирование цены
const formattedPrice = computed(() => {
  return new Intl.NumberFormat("ru-RU").format(listing.price);
});

// Форматирование даты
const formattedDate = computed(() => {
  if (!listing.published_at) return t('listingSidebar.notPublished');
  const localeMap: Record<string, string> = { ru: 'ru-RU', uz: 'uz-UZ' };
  return new Date(listing.published_at).toLocaleDateString(localeMap[locale.value] || 'ru-RU', {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

// Информация о памяти
const memoryInfo = computed(() => {
  const parts = [];
  if (listing.storage) parts.push(`${listing.storage} ГБ`);
  if (listing.ram) parts.push(`${listing.ram} ГБ RAM`);
  return parts.length ? parts.join(" / ") : null;
});

// Форматированный номер телефона
const formattedPhone = computed(() => {
  if (!contacts.value?.phone_number) return "";
  const phone = contacts.value.phone_number.replace(/\D/g, "");
  if (phone.length === 12) {
    return `+${phone[0]} ${phone.slice(1, 4)} ${phone.slice(
      4,
      7
    )} ${phone.slice(7, 9)} ${phone.slice(9)}`;
  }
  return contacts.value.phone_number;
});

const handleShowContacts = (data: IListingContacts) => {
  contacts.value = data;
  showContacts.value = true;
};

const handleMessage = () => {
  emit("open-chat");
};

const publishListing = catcher(
  async () => {
    publishLoading.value = true;
    await changeStatus(listing.id, ListingStatus.ACTIVE);
    emit("update");
    publishLoading.value = false;
  },
  () => {
    publishLoading.value = false;
  }
);
</script>

<template>
  <div class="info-section">
    <div class="listing-badges">
      <span class="listing-brand">{{ listing.brand.name }}</span>
      <span v-if="listing.allow_trade_in" class="badge-trade">
        {{ t('listingSidebar.exchange') }}
      </span>
    </div>

    <h1 class="listing-title">{{ listing.title }}</h1>

    <div class="listing-price">{{ formattedPrice }} {{ listing.currency }}</div>

    <div class="listing-actions">
      <el-button
        v-if="listing.user_id !== root.user?.id"
        size="large"
        type="primary"
        :icon="ChatDotRound"
        @click="handleMessage"
      />
      <ContactsInfo :listing="listing" @contacts-shown="handleShowContacts" />

      <el-button
        v-if="listing.user_id !== root.user?.id"
        size="large"
        :icon="favorites.includes(listing.id) ? StarFilled : Star"
        :type="favorites.includes(listing.id) ? 'warning' : 'default'"
        :loading="addLoading || removeLoading"
        @click="
          favorites.includes(listing.id)
            ? removeFavorite(listing.id)
            : addToFavorite(listing.id)
        "
      />
    </div>

    <!-- Компактный блок контактов -->
    <transition name="contacts-slide">
      <div v-if="showContacts" class="contacts-compact">
        <div v-if="contacts?.phone_number" class="contact-compact">
          <a
            :href="`tel:${contacts.phone_number}`"
            class="contact-compact-link"
          >
            <el-icon><Phone /></el-icon>
            <span>{{ formattedPhone }}</span>
          </a>
        </div>
        <div v-if="contacts?.telegram_link" class="contact-compact">
          <a
            :href="contacts?.telegram_link"
            target="_blank"
            class="contact-compact-link telegram"
          >
            <el-icon><ChatLineRound /></el-icon>
            <span>
              {{ contacts?.telegram_link?.replace("https://t.me/", "@") }}
            </span>
          </a>
        </div>
      </div>
    </transition>

    <div class="listing-meta">
      <div class="meta-item">
        <span class="meta-label">{{ t('listingSidebar.state') }}</span>
        <span class="meta-value">
          <StatusTag :state="listing.state" />
        </span>
      </div>
      <div v-if="listing.color" class="meta-item">
        <span class="meta-label">{{ t('listingSidebar.color') }}</span>
        <span class="meta-value">{{ listing.color }}</span>
      </div>
      <div v-if="memoryInfo" class="meta-item">
        <span class="meta-label">{{ t('listingSidebar.memory') }}</span>
        <span class="meta-value">{{ memoryInfo }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">{{ t('listingSidebar.location') }}</span>
        <span class="meta-value"
          >{{ listing.city[`name_${locale}`] || listing.city.name_ru }}, {{ listing.region[`name_${locale}`] || listing.region.name_ru }}</span
        >
      </div>
      <div class="meta-item">
        <span class="meta-label">{{ t('listingSidebar.publishDate') }}</span>
        <span class="meta-value">{{ formattedDate }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">{{ t('listingSidebar.views') }}</span>
        <span class="meta-value">{{ listing.views_count }} {{ t('listingSidebar.viewsCount') }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">{{ t('listingSidebar.adId') }}</span>
        <span class="meta-value">#MS-{{ listing.id }}</span>
      </div>
    </div>

    <el-button
      v-if="listing.status === 'draft'"
      type="primary"
      class="mt-20 w-full"
      :loading="publishLoading"
      size="large"
      @click="publishListing"
    >
      {{ t('listingSidebar.publish') }}
    </el-button>

    <el-button
      v-else-if="listing.user_id === root.user?.id"
      type="primary"
      class="mt-20 w-full"
      :loading="bumpLoading"
      size="large"
      @click="bumpAd(listing.id)"
    >
      {{ t('listingSidebar.bump') }}
    </el-button>

    <!-- Кнопка жалобы (только для посетителей) -->
    <div v-if="listing.user_id !== root.user?.id" class="complaint-section">
      <ComplaintButton :listing="listing" />
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
  flex-wrap: wrap;
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

.badge-trade {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: white;
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
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
  .el-button {
    flex: 1;
  }
}

// Компактный блок контактов
.contacts-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
  margin-bottom: 24px;
}

.contact-compact {
  display: flex;
}

.contact-compact-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  transition: all 0.2s;

  .el-icon {
    color: var(--el-color-success);
    font-size: 18px;
  }

  &:hover {
    background: var(--el-color-success-light-9);
    transform: translateX(4px);
  }

  &.telegram {
    .el-icon {
      color: #0088cc;
    }

    &:hover {
      background: rgba(0, 136, 204, 0.1);
    }
  }
}

// Анимация контактов
.contacts-slide-enter-active,
.contacts-slide-leave-active {
  transition: all 0.3s ease;
}

.contacts-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.contacts-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
  padding-top: 20px;
  border-top: 2px solid var(--color-border-light);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border-light);
  gap: 10px;
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
  text-align: right;
}

.complaint-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: center;
}
</style>
