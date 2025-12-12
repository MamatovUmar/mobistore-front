<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Monitor } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";
import HeaderNotifications from "./header/HeaderNotifications.vue";
import HeaderChat from "./header/HeaderChat.vue";
import HeaderUserMenu from "./header/HeaderUserMenu.vue";
import HeaderAuthModal from "./header/HeaderAuthModal.vue";

const rootStore = useRootStore();
const router = useRouter();

const showAuthDialog = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const goToLogin = () => {
  showAuthDialog.value = false;
  router.push("/login");
};
</script>

<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="header-container">
      <div class="header-content">
        <!-- Logo -->
        <NuxtLink to="/" class="logo-link">
          <div class="logo">
            <img src="/logo.png" alt="MobiStore" />
          </div>
        </NuxtLink>

        <!-- Actions -->
        <div class="header-actions">
          <el-tooltip
            content="Админ панель"
            placement="bottom"
            v-if="rootStore.isAdmin || rootStore.isModerator"
          >
            <el-button circle class="action-btn" @click="navigateTo('/admin')">
              <el-icon><Monitor /></el-icon>
            </el-button>
          </el-tooltip>

          <template v-if="rootStore.user">
            <!-- Chat -->
            <HeaderChat />

            <!-- Notifications -->
            <HeaderNotifications />
          </template>

          <el-button
            v-if="!rootStore.user"
            class="btn-login"
            size="large"
            @click="goToLogin"
          >
            Войти
          </el-button>

          <!-- User Menu -->
          <HeaderUserMenu v-else />
        </div>
      </div>
    </div>

    <!-- Auth Dialog -->
    <HeaderAuthModal v-model="showAuthDialog" />
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.scrolled {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05),
      0 4px 12px rgba(15, 23, 42, 0.08);
  }
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 24px;
}

/* Logo */
.logo-link {
  text-decoration: none;
  display: flex;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  img {
    height: 40px;
  }
}

/* Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-login {
  border-radius: 12px;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-content {
    height: 64px;
  }
}

.action-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    color: #3b82f6;
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .el-icon {
    font-size: 18px;
  }
}
</style>
