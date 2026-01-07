<script setup lang="ts">
import type { IListing } from "~/types/ads";
import { lastActivity } from "~/utils/formatters";

const { listing } = defineProps<{ listing: IListing }>();
const localePath = useLocalePath();
const { t } = useI18n();

const seller = computed(() => listing.user);

const lastActivityText = computed(() => {
  return lastActivity(seller.value.last_entered_at);
});

// Год регистрации пользователя
const registrationYear = computed(() => {
  return new Date(seller.value.created_at).getFullYear();
});

</script>

<template>
  <div class="seller-section">
    <h2 class="section-title">{{ t('listingDetails.seller') }}</h2>

    <nuxt-link :to="localePath(`/user/${seller.id}`)" class="seller-info">
      <div class="user-avatar-wrapper">
        <el-avatar v-if="seller?.avatar" :src="seller.avatar" :size="64" />
        <el-avatar v-else :size="64" class="user-avatar">
          {{
            `${seller.first_name?.charAt(0)}${seller.last_name?.charAt(
              0
            )}`.trim()
          }}
        </el-avatar>
      </div>
      <div class="seller-details">
        <div class="seller-name">
          {{ seller.first_name }} {{ seller.last_name }}
        </div>
        <div class="seller-stats">
          <span
            class="activity-status"
            :class="{ online: lastActivityText === t('formatters.activity.online') }"
          >
            {{ lastActivityText }}
          </span>
        </div>
        <div class="seller-meta">{{ t('listingDetails.onSiteSince', { year: registrationYear }) }}</div>
      </div>
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.seller-section {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  margin-top: 10px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  text-decoration: none;
  width: fit-content;
}

.user-avatar-wrapper {
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
}

.user-avatar {
  background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
  font-weight: 600;
  font-size: 24px;
  cursor: pointer;
}

.seller-details {
  flex: 1;
}

.seller-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.seller-stats {
  margin-bottom: 4px;
}

.activity-status {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 500;

  &.online {
    color: #52c41a;

    &::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #52c41a;
      border-radius: 50%;
      margin-right: 6px;
      animation: pulse 2s infinite;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.seller-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .seller-avatar {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }

  .seller-name {
    font-size: 16px;
  }
}
</style>
