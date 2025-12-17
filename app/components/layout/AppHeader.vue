<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Monitor, Menu, Plus } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";
import HeaderNotifications from "./header/HeaderNotifications.vue";
import HeaderChat from "./header/HeaderChat.vue";
import HeaderUserMenu from "./header/HeaderUserMenu.vue";
import HeaderAuthModal from "./header/HeaderAuthModal.vue";
import HeaderMobileDrawer from "./header/HeaderMobileDrawer.vue";
import LanguageSwitcher from "./header/LanguageSwitcher.vue";

const rootStore = useRootStore();
const router = useRouter();

const showAuthDialog = ref(false);
const showMobileDrawer = ref(false);
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

const handleCreateAd = () => {
  if (rootStore.user) {
    router.push("/create");
  } else {
    showAuthDialog.value = true;
  }
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

        <!-- Desktop Actions -->
        <div class="header-actions desktop-only">
          <button class="btn-create" @click="handleCreateAd">
            <el-icon class="btn-icon"><Plus /></el-icon>
            <span class="btn-text">Подать объявление</span>
          </button>

          <LanguageSwitcher />

          <el-tooltip
            v-if="rootStore.isAdmin || rootStore.isModerator"
            content="Админ панель"
            placement="bottom"
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

        <!-- Mobile Actions -->
        <div class="header-actions mobile-only">
          <template v-if="rootStore.user">
            <HeaderNotifications />
          </template>

          <el-button
            circle
            class="action-btn burger-btn"
            @click="showMobileDrawer = true"
          >
            <el-icon><Menu /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- Auth Dialog -->
    <HeaderAuthModal v-model="showAuthDialog" />

    <!-- Mobile Drawer -->
    <HeaderMobileDrawer
      v-model="showMobileDrawer"
      @login="goToLogin"
      @signup="
        () => {
          showAuthDialog = true;
          showMobileDrawer = false;
        }
      "
    />
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

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  margin-right: 12px;

  .btn-icon {
    font-size: 18px;
    font-weight: bold;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-login {
  border-radius: 6px;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px);
  }
}

.action-btn {
  width: 40px;
  height: 40px;
  min-width: 40px;
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

.mobile-only {
  display: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-content {
    height: 64px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .logo img {
    height: 32px;
  }
}
</style>
