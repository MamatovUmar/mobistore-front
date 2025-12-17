<script setup lang="ts">
import {
  User,
  Document,
  Coin,
  DataLine,
  Setting,
  HomeFilled,
  MessageBox,
  Memo,
  Iphone,
  Collection,
  Calendar,
} from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";

defineProps<{
  collapsed: boolean;
}>();

const route = useRoute();
const root = useRootStore();

const menuItems = [
  {
    title: "Главная",
    icon: HomeFilled,
    path: "/admin",
    roles: ["admin", "moderator"],
  },
  {
    title: "Пользователи",
    icon: User,
    path: "/admin/users",
    roles: ["admin"],
  },
  {
    title: "Объявления",
    icon: MessageBox,
    path: "/admin/listings",
    roles: ["admin", "moderator"],
  },
  {
    title: "Логи",
    icon: Memo,
    path: "/admin/logs",
    roles: ["admin"],
  },
  {
    title: "Кеш",
    icon: Coin,
    path: "/admin/cache",
    roles: ["admin"],
  },
  {
    title: "Сотрудники",
    icon: User,
    path: "/admin/staff",
    roles: ["admin"],
  },
  {
    title: "Заявки",
    icon: Document,
    path: "/admin/applications",
    roles: ["admin", "moderator"],
  },
  {
    title: "Бренды",
    icon: Collection,
    path: "/admin/brands",
    roles: ["admin", "moderator"],
  },
  {
    title: "Модели",
    icon: Iphone,
    path: "/admin/models",
    roles: ["admin", "moderator"],
  },
  {
    title: "AI Парсер",
    icon: Calendar,
    path: "/admin/parser",
    roles: ["admin", "moderator"],
  },
];

const isActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin";
  }
  return route.path.startsWith(path);
};
</script>

<template>
  <aside
    class="admin-sidebar"
    :class="{ 'admin-sidebar--collapsed': collapsed }"
  >
    <div class="sidebar-header">
      <div class="logo">
        <el-icon :size="28" color="#3b82f6">
          <Setting />
        </el-icon>
        <span v-show="!collapsed" class="logo-text">Admin Panel</span>
      </div>
    </div>

    <el-scrollbar class="sidebar-menu">
      <nav class="menu-nav">
        <template v-for="item in menuItems" :key="item.path">
          <NuxtLink
            v-if="item.roles.includes(root.user?.role || '')"
            :to="item.path"
            class="menu-item"
            :class="{ 'menu-item--active': isActive(item.path) }"
          >
            <el-icon :size="20">
              <component :is="item.icon" />
            </el-icon>
            <span v-show="!collapsed" class="menu-text">{{ item.title }}</span>
            <el-tooltip
              v-if="collapsed"
              :content="item.title"
              placement="right"
              :show-after="100"
            >
              <span class="menu-tooltip-trigger" />
            </el-tooltip>
          </NuxtLink>
        </template>
      </nav>
    </el-scrollbar>

    <div class="sidebar-footer">
      <NuxtLink to="/" class="back-link">
        <el-icon :size="18">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M19 11H7.83l4.88-4.88a1 1 0 0 0-1.42-1.42l-6.59 6.59a1 1 0 0 0 0 1.42l6.59 6.59a1 1 0 0 0 1.42-1.42L7.83 13H19a1 1 0 0 0 0-2z"
            />
          </svg>
        </el-icon>
        <span v-show="!collapsed">На сайт</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.admin-sidebar {
  width: 240px;
  height: 100vh;
  background: var(--color-bg-primary);
  border-right: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: width 0.3s ease;

  &--collapsed {
    width: 64px;

    .logo-text {
      display: none;
    }
  }
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  padding: 12px 8px;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  &--active {
    background: rgba(59, 130, 246, 0.1);
    color: var(--color-primary);

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 24px;
      background: var(--color-primary);
      border-radius: 0 4px 4px 0;
    }

    .el-icon {
      color: var(--color-primary);
    }
  }
}

.menu-text {
  white-space: nowrap;
}

.menu-tooltip-trigger {
  position: absolute;
  inset: 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--color-border-light);
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);

    &--collapsed {
      transform: translateX(0);
      width: 240px;
    }
  }
}
</style>
