<script setup lang="ts">
import { Fold, Expand, Bell, User, SwitchButton } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";
import type { UserRole } from "~/types/admin-staff";

const props = defineProps<{
  collapsed: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-sidebar"): void;
}>();

const root = useRootStore();

const role: Partial<Record<UserRole, string>> = {
  admin: 'Администратор',
  moderator: 'Модератор',
};

const getPageTitle = () => {
  const route = useRoute();
  const titles: Record<string, string> = {
    "/admin": "Главная",
    "/admin/users": "Пользователи",
    "/admin/listings": "Объявления",
    "/admin/logs": "Логи",
    "/admin/cache": "Кеш",
  };
  return titles[route.path] || "Админ-панель";
};

const handleCommand = (command: string) => {
  if (command === "logout") {
    root.logout();
  }
};
</script>

<template>
  <header class="admin-header">
    <div class="header-left">
      <el-button
        class="collapse-btn"
        :icon="collapsed ? Expand : Fold"
        text
        @click="emit('toggle-sidebar')"
      />
      <h1 class="page-title">{{ getPageTitle() }}</h1>
    </div>

    <div class="header-right">
      <el-badge :value="3" :max="99" class="notification-badge">
        <el-button :icon="Bell" text circle />
      </el-badge>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="36" class="user-avatar">
            <el-icon :size="20">
              <User />
            </el-icon>
          </el-avatar>
          <div v-if="root.user" class="user-details">
            <span class="user-name">{{ root.user.email }}</span>
            <span class="user-role">{{ role[root.user.role] || root.user.role }}</span>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><User /></el-icon>
              Профиль
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              Выйти
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.admin-header {
  height: 64px;
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  color: var(--color-text-secondary);

  &:hover {
    color: var(--color-text-primary);
  }
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-badge {
  :deep(.el-badge__content) {
    background: var(--color-danger);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: var(--color-bg-secondary);
  }
}

.user-avatar {
  background: var(--color-primary);
  color: white;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.2;
}

@media (max-width: 768px) {
  .user-details {
    display: none;
  }
}
</style>
