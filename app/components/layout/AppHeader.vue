<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { MessageBox, Plus, User, Document, Star, SwitchButton, Lock } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";

const rootStore = useRootStore();
const router = useRouter();

const showAuthDialog = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const goToLogin = () => {
  showAuthDialog.value = false;
  router.push("/login");
};

const goToSignup = () => {
  showAuthDialog.value = false;
  router.push("/signup");
};

</script>

<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <div class="header-container">
      <div class="header-content">
        <!-- Logo -->
        <NuxtLink to="/" class="logo-link">
          <div class="logo">
            <img src="@/assets/images/logo.png" alt="">
          </div>
        </NuxtLink>

        <!-- Actions -->
        <div class="header-actions">
          <!-- Login Button or User Menu -->
          <el-button
            v-if="!rootStore.user"
            class="btn-login"
            size="large"
            @click="goToLogin"
          >
            Войти
          </el-button>

          <el-dropdown v-else trigger="click" class="user-menu">
            <div class="user-trigger">
              <el-avatar
                v-if="rootStore.user?.avatar"
                :src="rootStore.user.avatar"
                :size="40"
              />
              <el-avatar v-else :size="40" class="user-avatar">
                {{ `${rootStore.user.first_name?.charAt(0)}${rootStore.user.last_name?.charAt(0)}`.trim() }}
              </el-avatar>
            </div>

            <template #dropdown>
              <el-dropdown-menu class="user-dropdown">
                <el-dropdown-item @click="router.push('/account')">
                  <el-icon><User /></el-icon>
                  <span>Личные данные</span>
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/account/listings')">
                  <el-icon><Document /></el-icon>
                  <span>Мои объявления</span>
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/account/favorites')">
                  <el-icon><Star /></el-icon>
                  <span>Избранное</span>
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/account/conversations')">
                  <el-icon><MessageBox /></el-icon>
                  <span>Переписки</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="rootStore.logout()">
                  <el-icon><SwitchButton /></el-icon>
                  <span>Выйти</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- Auth Dialog -->
    <el-dialog
      v-model="showAuthDialog"
      width="450px"
      align-center
      :show-close="false"
    >
      <div class="auth-dialog">
        <div class="dialog-icon">
          <el-icon :size="48"><Lock /></el-icon>
        </div>
        <h3 class="dialog-title">Требуется авторизация</h3>
        <p class="dialog-text">
          Для размещения объявлений необходимо войти в систему или создать новый аккаунт.
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="showAuthDialog = false">Отмена</el-button>
          <el-button size="large" @click="goToSignup">Регистрация</el-button>
          <el-button type="primary" size="large" @click="goToLogin">Войти</el-button>
        </div>
      </template>
    </el-dialog>
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
    box-shadow: 
      0 1px 3px rgba(15, 23, 42, 0.05),
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
  gap: 12px;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

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
  border-radius: 12px;
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
  }
}

/* User Menu */
.user-trigger {
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.user-avatar {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

:deep(.user-dropdown) {
  min-width: 220px;
  margin-top: 8px;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;

    .el-icon {
      font-size: 18px;
      color: #64748b;
    }

    span {
      color: #0f172a;
    }

    &:hover {
      background: #f8fafc;

      .el-icon {
        color: #3b82f6;
      }

      span {
        color: #3b82f6;
      }
    }

    &.is-divided {
      border-top: 1px solid #f1f5f9;
      margin-top: 4px;
      padding-top: 12px;

      .el-icon {
        color: #ef4444;
      }

      span {
        color: #ef4444;
      }

      &:hover {
        background: rgba(239, 68, 68, 0.08);
      }
    }
  }
}

/* Auth Dialog */
.auth-dialog {
  text-align: center;
  padding: 20px 0;
}

.dialog-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

.dialog-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;
}

.dialog-text {
  font-size: 15px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-content {
    height: 64px;
  }

  .btn-create {
    padding: 12px;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    justify-content: center;

    .btn-text {
      display: none;
    }
  }

  .logo-subtitle {
    display: none;
  }

  .logo-title {
    font-size: 18px;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
}
</style>
