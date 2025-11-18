<script setup lang="ts">
import type { IListing } from "~/types/ads";
import {
  ChatDotRound,
  Phone,
  ChatLineRound,
  InfoFilled,
} from "@element-plus/icons-vue";

const { listing } = defineProps<{ listing: IListing }>();

const emit = defineEmits<{
  "open-chat": [];
}>();

const seller = computed(() => listing.user);

// Состояние отображения контактов
const showContacts = ref(false);

// Форматирование времени последней активности
const lastActivityText = computed(() => {
  if (!seller.value.last_entered_at) return "Не в сети";

  const lastActivity = new Date(seller.value.last_entered_at);
  const now = new Date();
  const diffMs = now.getTime() - lastActivity.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return "В сети";
  if (diffMins < 60) return `Был(а) ${diffMins} мин. назад`;
  if (diffHours < 24) return `Был(а) ${diffHours} ч. назад`;
  if (diffDays === 1) return "Был(а) вчера";
  if (diffDays < 7) return `Был(а) ${diffDays} дн. назад`;

  return `Был(а) ${lastActivity.toLocaleDateString("ru-RU")}`;
});

// Год регистрации пользователя
const registrationYear = computed(() => {
  return new Date(seller.value.created_at).getFullYear();
});

const handleMessage = () => {
  emit("open-chat");
};

const handleShowContacts = () => {
  showContacts.value = true;
};

const handleCall = () => {
  if (listing.phone_number) {
    window.location.href = `tel:${listing.phone_number}`;
  }
};

const handleTelegram = () => {
  if (listing.telegram_link) {
    window.open(listing.telegram_link, "_blank");
  }
};

// Проверка наличия контактов
const hasContacts = computed(() => {
  return !!(listing.phone_number || listing.telegram_link);
});

// Форматированный номер телефона для отображения
const formattedPhone = computed(() => {
  if (!listing.phone_number) return "";
  const phone = listing.phone_number.replace(/\D/g, "");
  // Форматируем как +X XXX XXX XX XX
  if (phone.length === 12) {
    return `+${phone[0]} ${phone.slice(1, 4)} ${phone.slice(
      4,
      7
    )} ${phone.slice(7, 9)} ${phone.slice(9)}`;
  }
  return listing.phone_number;
});
</script>

<template>
  <div class="seller-section">
    <h2 class="section-title">Продавец</h2>

    <nuxt-link :to="`/user/${seller.id}`" class="seller-info">
      <div class="user-avatar-wrapper">
        <el-avatar v-if="seller?.avatar" :src="seller.avatar.url" :size="64" />
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
            :class="{ online: lastActivityText === 'В сети' }"
          >
            {{ lastActivityText }}
          </span>
        </div>
        <div class="seller-meta">На сайте с {{ registrationYear }} года</div>
      </div>
    </nuxt-link>

    <div class="contact-actions">
      <div class="action-buttons">
        <el-button
          type="primary"
          size="large"
          :icon="ChatDotRound"
          @click="handleMessage"
        >
          Написать сообщение
        </el-button>
        <el-button
          v-if="seller.show_contacts && hasContacts && !showContacts"
          type="default"
          size="large"
          :icon="Phone"
          @click="handleShowContacts"
        >
          Показать контакты
        </el-button>
      </div>

      <!-- Блок с контактами после раскрытия -->
      <transition name="slide-fade">
        <div v-if="showContacts" class="contacts-reveal">
          <div class="contacts-header">
            <el-icon class="contacts-icon"><InfoFilled /></el-icon>
            <span>Контактная информация</span>
          </div>

          <div class="contacts-list">
            <div v-if="listing.phone_number" class="contact-item phone-item">
              <div class="contact-label">
                <el-icon><Phone /></el-icon>
                <span>Телефон</span>
              </div>
              <div class="contact-value">
                <a :href="`tel:${listing.phone_number}`" class="contact-link">
                  {{ formattedPhone }}
                </a>
                <el-button
                  text
                  :icon="Phone"
                  size="small"
                  class="call-btn"
                  @click="handleCall"
                >
                  Позвонить
                </el-button>
              </div>
            </div>

            <div
              v-if="listing.telegram_link"
              class="contact-item telegram-item"
            >
              <div class="contact-label">
                <el-icon><ChatLineRound /></el-icon>
                <span>Telegram</span>
              </div>
              <div class="contact-value">
                <a
                  :href="listing.telegram_link"
                  target="_blank"
                  class="contact-link telegram-link"
                >
                  {{ listing.telegram_link.replace("https://t.me/", "@") }}
                </a>
                <el-button
                  text
                  :icon="ChatLineRound"
                  size="small"
                  class="telegram-btn"
                  @click="handleTelegram"
                >
                  Открыть
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
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

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

// Блок раскрытия контактов
.contacts-reveal {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 16px;
  border: 2px solid var(--el-border-color-lighter);
}

.contacts-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.contacts-icon {
  color: var(--el-color-primary);
  font-size: 18px;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  background: white;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.contact-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.contact-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.contact-link {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-decoration: none;
  flex: 1;

  &:hover {
    color: var(--el-color-primary);
  }
}

.telegram-link {
  color: #0088cc;

  &:hover {
    color: #006699;
  }
}

.call-btn,
.telegram-btn {
  font-weight: 600;
}

.call-btn {
  color: var(--el-color-success);

  &:hover {
    color: var(--el-color-success);
    background: var(--el-color-success-light-9);
  }
}

.telegram-btn {
  color: #0088cc;

  &:hover {
    color: #0088cc;
    background: rgba(0, 136, 204, 0.1);
  }
}

// Анимация появления контактов
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
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

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .contact-value {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .call-btn,
  .telegram-btn {
    align-self: stretch;
  }
}
</style>
