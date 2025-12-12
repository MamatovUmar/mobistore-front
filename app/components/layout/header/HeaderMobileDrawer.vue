<script setup lang="ts">
import {
  User,
  Document,
  Star,
  MessageBox,
  SwitchButton,
  Monitor,
  ChatDotRound,
  Bell,
  Close,
  Right,
  Plus,
} from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";
import { useChat } from "~/composables/useChat";
import { useNotifications } from "~/composables/useNotifications";
import type { IConversation } from "~/types/chat";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "login", "signup"]);

const rootStore = useRootStore();
const router = useRouter();
const chatStore = useChat();
const { unreadCount: unreadNotificationsCount } = useNotifications();

const conversations = ref<IConversation[]>([]);

const unreadChatCount = computed(() => {
  if (!conversations.value || conversations.value.length === 0) return 0;
  return conversations.value.reduce((total, conv) => {
    const count =
      rootStore.user?.id === conv.buyer_id
        ? conv.unread_for_buyer
        : conv.unread_for_seller;
    return total + (count || 0);
  }, 0);
});

const handleClose = () => {
  emit("update:modelValue", false);
};

const handleNavigation = (path: string) => {
  handleClose();
  router.push(path);
};

const handleCreateAd = () => {
  handleClose();
  if (rootStore.user) {
    router.push("/new");
  } else {
    emit("login"); // Trigger login flow (or signup if preferred, but existing flow uses header's auth dialog which listens to login/signup events)
    // Actually, AppHeader listens to @login="goToLogin". So emitting login will open the login page directly.
    // Ideally we want to show the Auth Dialog.
    // HeaderMobileDrawer emits 'login' -> AppHeader calls goToLogin -> router.push('/login').
    // So for guest, it will go to login page. That's acceptable as per plan "Trigger showAuthDialog" but going to page is also fine.
    // Let's stick to the emitted events.
  }
};

const handleLogout = () => {
  handleClose();
  rootStore.logout();
};

const handleLogin = () => {
  handleClose();
  emit("login");
};

const handleSignup = () => {
  handleClose();
  emit("signup");
};

onMounted(async () => {
  if (rootStore.user) {
    try {
      const data = await chatStore.getAllConversations();
      if (data) {
        conversations.value = data;
      }
    } catch (e) {
      console.error("Failed to load conversations", e);
    }
  }
});
</script>

<template>
  <el-drawer
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    direction="rtl"
    size="85%"
    :with-header="false"
    class="mobile-drawer"
    append-to-body
    :z-index="2001"
  >
    <div class="drawer-content">
      <!-- Header -->
      <div class="drawer-header">
        <div class="user-info" v-if="rootStore.user">
          <el-avatar
            v-if="rootStore.user.avatar"
            :src="rootStore.user.avatar"
            :size="50"
          />
          <el-avatar v-else :size="50" class="user-avatar">
            {{
              `${rootStore.user.first_name?.charAt(
                0
              )}${rootStore.user.last_name?.charAt(0)}`.trim()
            }}
          </el-avatar>
          <div class="user-details">
            <div class="user-name">
              {{ rootStore.user.first_name }} {{ rootStore.user.last_name }}
            </div>
            <div class="user-email">{{ rootStore.user.email }}</div>
          </div>
        </div>
        <div class="guest-info" v-else>
          <div class="welcome-text">Добро пожаловать!</div>
          <div class="sub-text">Войдите или создайте аккаунт</div>
        </div>
        <el-button link class="close-btn" @click="handleClose">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>

      <!-- Navigation -->
      <div class="drawer-nav">
        <!-- Create Ad Action (Always visible or just for users? "Create Ad" usually visible to all to entice) -->
        <div class="nav-group">
          <div class="nav-item create-ad" @click="handleCreateAd">
            <div class="nav-icon">
              <el-icon><Plus /></el-icon>
            </div>
            <span>Подать объявление</span>
          </div>
        </div>

        <template v-if="rootStore.user">
          <div class="nav-group">
            <div class="nav-title">Аккаунт</div>
            <div class="nav-item" @click="handleNavigation('/account')">
              <div class="nav-icon">
                <el-icon><User /></el-icon>
              </div>
              <span>Личные данные</span>
            </div>
            <div
              class="nav-item"
              @click="handleNavigation('/account/listings')"
            >
              <div class="nav-icon">
                <el-icon><Document /></el-icon>
              </div>
              <span>Мои объявления</span>
            </div>
            <div
              class="nav-item"
              @click="handleNavigation('/account/favorites')"
            >
              <div class="nav-icon">
                <el-icon><Star /></el-icon>
              </div>
              <span>Избранное</span>
            </div>
            <div
              class="nav-item"
              @click="handleNavigation('/account/conversations')"
            >
              <div class="nav-icon">
                <el-badge
                  :value="unreadChatCount"
                  :hidden="unreadChatCount === 0"
                  is-dot
                >
                  <el-icon><ChatDotRound /></el-icon>
                </el-badge>
              </div>
              <span>Сообщения</span>
            </div>
          </div>

          <div
            class="nav-group"
            v-if="rootStore.isAdmin || rootStore.isModerator"
          >
            <div class="nav-title">Администрирование</div>
            <div class="nav-item" @click="handleNavigation('/admin')">
              <div class="nav-icon">
                <el-icon><Monitor /></el-icon>
              </div>
              <span>Админ панель</span>
            </div>
          </div>

          <div class="nav-group">
            <div class="nav-item logout" @click="handleLogout">
              <div class="nav-icon">
                <el-icon><SwitchButton /></el-icon>
              </div>
              <span>Выйти</span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="guest-actions">
            <el-button
              type="primary"
              size="large"
              class="w-full"
              @click="handleLogin"
            >
              Войти
            </el-button>
            <el-button
              size="large"
              class="w-full mt-3 ml-0"
              @click="handleSignup"
            >
              Регистрация
            </el-button>
          </div>
        </template>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss">
.mobile-drawer {
  .el-drawer__body {
    padding: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
/* Removed .mobile-drawer :deep rule as it is now in unscoped block */

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.drawer-header {
  padding: 24px 20px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: #fff;
  font-weight: 700;
  font-size: 18px;
}

.user-details {
  .user-name {
    font-weight: 700;
    color: #0f172a;
    font-size: 16px;
    margin-bottom: 4px;
  }
  .user-email {
    font-size: 13px;
    color: #64748b;
  }
}

.guest-info {
  .welcome-text {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 4px;
  }
  .sub-text {
    font-size: 14px;
    color: #64748b;
  }
}

.close-btn {
  font-size: 24px;
  color: #64748b;
}

.drawer-nav {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 32px;
}

.nav-title {
  font-size: 12px;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding-left: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;
  color: #0f172a;

  &:hover {
    background: #f1f5f9;
  }

  .nav-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eff6ff;
    color: #3b82f6;
    border-radius: 10px;
    margin-right: 16px;
    font-size: 18px;
  }

  span {
    font-weight: 600;
    font-size: 15px;
    flex: 1;
  }

  .arrow {
    color: #cbd5e1;
    font-size: 14px;
  }

  &.logout {
    .nav-icon {
      background: #fef2f2;
      color: #ef4444;
    }
    span {
      color: #ef4444;
    }
  }

  &.create-ad {
    margin-bottom: 24px;
    background: #f0f9ff;

    .nav-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
    }

    span {
      color: #3b82f6;
      font-weight: 700;
    }
  }
}

.guest-actions {
  margin-top: 20px;
  .w-full {
    width: 100%;
  }
  .mt-3 {
    margin-top: 12px;
  }
  .ml-0 {
    margin-left: 0;
  }
}
</style>
