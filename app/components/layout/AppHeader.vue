<script setup lang="ts">
import { ref } from "vue";
import { MessageBox, Plus, Lock, User, Document, Star, SwitchButton } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";

const rootStore = useRootStore();
const router = useRouter();

const showAuthDialog = ref(false);

const goToLogin = () => {
  showAuthDialog.value = false;
  router.push("/login");
};

const goToSignup = () => {
  showAuthDialog.value = false;
  router.push("/signup");
};

const handleCreateListing = () => {
  if (rootStore.user) {
    router.push("/create");
  } else {
    showAuthDialog.value = true;
  }
};
</script>

<template>
  <header class="header">
    <div class="header-top">
      🎉 Специальное предложение: бесплатное размещение объявлений весь месяц!
    </div>
    <div class="header-main">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <div class="logo-text">
            <span class="logo-title">SmartMarket</span>
            <span class="logo-subtitle">МАРКЕТПЛЕЙС СМАРТФОНОВ</span>
          </div>
        </NuxtLink>

        <div class="header-actions">
          <button
            class="create-listing-btn"
            @click="handleCreateListing"
          >
            <el-icon class="btn-icon"><Plus /></el-icon>
            <span class="btn-text">Подать объявление</span>
          </button>

          <el-button
            v-if="!rootStore.user"
            type="default"
            size="large"
            @click="goToLogin"
          >
            Войти
          </el-button>

          <el-dropdown v-else trigger="click" class="user-dropdown">
            <div class="user-avatar-wrapper">
              <el-avatar
                v-if="rootStore.user?.avatar"
                :src="rootStore.user.avatar.url"
                :size="40"
              />
              <el-avatar v-else :size="40" class="user-avatar">
                {{ `${rootStore.user.first_name?.charAt(0)}${rootStore.user.last_name?.charAt(0)}`.trim() }}
              </el-avatar>
            </div>

            <template #dropdown>
              <el-dropdown-menu class="user-dropdown-menu">
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

    <el-dialog
      v-model="showAuthDialog"
      width="450px"
      align-center
      :show-close="false"
    >
      <div class="auth-dialog-content">
        <div class="dialog-icon">
          <el-icon :size="48">
            <Lock />
          </el-icon>
        </div>
        <h3 class="dialog-title">Требуется авторизация</h3>
        <p class="dialog-text">
          Для размещения объявлений необходимо войти в систему или создать новый
          аккаунт.
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="showAuthDialog = false"
            >Отмена</el-button
          >
          <el-button size="large" @click="goToSignup"> Регистрация </el-button>
          <el-button type="primary" size="large" @click="goToLogin">
            Войти
          </el-button>
        </div>
      </template>
    </el-dialog>
  </header>
</template>

<style lang="scss" scoped>
.header {
  background: var(--color-bg-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid var(--color-border-light);
}

.header-top {
  background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
  padding: 8px 0;
  color: var(--color-bg-primary);
  font-size: 13px;
  text-align: center;
}

.header-main {
  padding: 20px 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.logo-subtitle {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.search-box {
  flex: 1;
  max-width: 600px;
  position: relative;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.create-listing-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .btn-icon,
  .btn-text {
    position: relative;
    z-index: 1;
  }

  .btn-icon {
    font-size: 18px;
    font-weight: bold;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
  }
}

@media (max-width: 768px) {
  .create-listing-btn {
    .btn-text {
      display: none;
    }

    padding: 12px;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    justify-content: center;
  }
}

.auth-dialog-content {
  text-align: center;
  padding: 20px 0;

  .dialog-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  }

  .dialog-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 12px 0;
  }

  .dialog-text {
    font-size: 15px;
    line-height: 1.6;
    color: var(--color-text-secondary);
    margin: 0;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 10px;
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
  cursor: pointer;
}

:deep(.user-dropdown-menu) {
  min-width: 240px;
  padding: 0;
  margin-top: 12px;

  .dropdown-header {
    padding: 16px;
    background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
    border-radius: 4px 4px 0 0;
    margin-bottom: 8px;
  }

  .user-info {
    .user-name {
      font-size: 16px;
      font-weight: 600;
      color: white;
      margin-bottom: 4px;
    }

    .user-email {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.2s;

    .el-icon {
      font-size: 18px;
      color: var(--color-text-secondary);
    }

    span {
      color: var(--color-text-primary);
    }

    &:hover {
      background: var(--color-bg-secondary);

      .el-icon {
        color: var(--color-primary);
      }

      span {
        color: var(--color-primary);
      }
    }

    &.is-divided {
      border-top: 1px solid var(--color-border);
      margin-top: 8px;

      .el-icon {
        color: #f56c6c;
      }

      span {
        color: #f56c6c;
      }

      &:hover {
        background: rgba(245, 108, 108, 0.1);
      }
    }
  }
}
</style>
