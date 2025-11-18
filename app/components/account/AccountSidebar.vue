<script setup lang="ts">
import { User, Document, Star, SwitchButton, MessageBox } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";
import ProfileImage from "./ProfileImage.vue";

const root = useRootStore();

const menuItems = [
  { title: "Личные данные", icon: User, path: "/account" },
  { title: "Мои объявления", icon: Document, path: "/account/listings" },
  { title: "Избранные", icon: Star, path: "/account/favorites" },
  { title: "Переписки", icon: MessageBox, path: "/account/conversations" },
];
</script>

<template>
  <aside class="account-sidebar">
    <ProfileImage />
    
    <nav class="sidebar-nav">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="nav-item--active"
      >
        <el-icon class="nav-icon">
          <component :is="item.icon" />
        </el-icon>
        <span class="nav-text">{{ item.title }}</span>
      </NuxtLink>

      <div class="sidebar-divider" />

      <button class="nav-item nav-item--logout" @click="root.logout()">
        <el-icon class="nav-icon">
          <SwitchButton />
        </el-icon>
        <span class="nav-text">Выйти</span>
      </button>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
.account-sidebar {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 10px;

  @media (max-width: 768px) {
    position: static;
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  &--active {
    background: rgba(59, 130, 246, 0.1);
    color: var(--color-primary);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--color-primary);
      border-radius: 0 4px 4px 0;
    }

    .nav-icon {
      color: var(--color-primary);
    }
  }

  &--logout {
    color: var(--color-danger);

    .nav-icon {
      color: var(--color-danger);
    }

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--color-danger);
    }
  }
}

.nav-icon {
  font-size: 20px;
  color: var(--color-text-secondary);
}

.nav-text {
  flex: 1;
  text-align: left;
}

.sidebar-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 8px 0;
}
</style>
