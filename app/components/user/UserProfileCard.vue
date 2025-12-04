<script setup lang="ts">
import {
  User,
  Phone,
  Location,
  Calendar,
  ChatLineRound,
} from "@element-plus/icons-vue";
import type { IUser } from "~/types/user";

export interface IUserContacts {
  phone_number: string | null;
  telegram: string | null;
}

const props = defineProps<{
  user: IUser;
  contacts?: IUserContacts | null;
  showContacts?: boolean;
  contactsLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "show-contacts"): void;
}>();

const avatarUrl = computed(() => props.user.avatar || "/no-image.png");

const telegramUsername = computed(() => {
  if (!props.contacts?.telegram) return null;
  return props.contacts.telegram.replace(/^@/, "");
});

const fullName = computed(() => {
  return `${props.user.first_name} ${props.user.last_name}`.trim() || "Пользователь";
});

const userLocation = computed(() => {
  const parts = [];
  if (props.user.region?.name_ru) parts.push(props.user.region.name_ru);
  if (props.user.city?.name_ru) parts.push(props.user.city.name_ru);
  return parts.join(", ") || null;
});

const memberSince = computed(() => {
  return new Date(props.user.created_at).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
  });
});

const lastSeen = computed(() => {
  const date = new Date(props.user.last_entered_at);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Сегодня";
  if (days === 1) return "Вчера";
  if (days < 7) return `${days} дн. назад`;
  return date.toLocaleDateString("ru-RU");
});

const hasContacts = computed(() => {
  return props.contacts?.phone_number || props.contacts?.telegram;
});
</script>

<template>
  <div class="user-profile-card">
    <!-- Аватар и основная информация -->
    <div class="profile-header">
      <div class="avatar-wrapper">
        <el-avatar :size="100" :src="avatarUrl" fit="cover">
          <el-icon :size="40"><User /></el-icon>
        </el-avatar>
      </div>

      <div class="profile-info">
        <h1 class="user-name">{{ fullName }}</h1>
        <p class="member-since">
          <el-icon><Calendar /></el-icon>
          На сайте с {{ memberSince }}
        </p>
        <div class="last-seen-row">
          <span>Был(а) в сети: {{ lastSeen }}</span>
        </div>
      </div>
    </div>

    <!-- Местоположение -->
    <div v-if="userLocation" class="location-section">
      <div class="location-item">
        <el-icon class="location-icon"><Location /></el-icon>
        <span>{{ userLocation }}</span>
      </div>
    </div>

    <!-- Кнопка показать контакты -->
    <div class="actions-section">
      <el-button
        v-if="!showContacts"
        type="primary"
        class="contact-btn"
        :loading="contactsLoading"
        :icon="Phone"
        @click="emit('show-contacts')"
      >
        Показать контакты
      </el-button>

      <!-- Контактная информация -->
      <transition name="contacts-slide">
        <div v-if="showContacts && hasContacts" class="contacts-compact">
          <div v-if="contacts?.phone_number" class="contact-compact">
            <a :href="`tel:${contacts.phone_number}`" class="contact-compact-link">
              <el-icon><Phone /></el-icon>
              <span>{{ contacts.phone_number }}</span>
            </a>
          </div>
          <div v-if="telegramUsername" class="contact-compact">
            <a
              :href="`https://t.me/${telegramUsername}`"
              target="_blank"
              class="contact-compact-link telegram"
            >
              <el-icon><ChatLineRound /></el-icon>
              <span>@{{ telegramUsername }}</span>
            </a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-profile-card {
  background: var(--color-bg-primary);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
  word-break: break-word;
}

.member-since {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;

  .el-icon {
    color: #3b82f6;
    flex-shrink: 0;
  }
}

.last-seen-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.location-section {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.location-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.location-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef3c7;
  border-radius: 8px;
  color: #f59e0b;
  font-size: 16px;
  flex-shrink: 0;
}

.contact-btn {
  width: 100%;
  height: 44px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
}

// Компактный блок контактов
.contacts-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
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
    flex-shrink: 0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
</style>
