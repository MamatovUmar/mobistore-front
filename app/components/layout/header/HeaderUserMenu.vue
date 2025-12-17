<script setup lang="ts">
import {
  User,
  Document,
  Star,
  MessageBox,
  SwitchButton,
} from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";

const rootStore = useRootStore();
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <el-dropdown trigger="click" class="user-menu">
    <div class="user-trigger">
      <el-avatar
        v-if="rootStore.user?.avatar"
        :src="rootStore.user.avatar"
        :size="40"
      />
      <el-avatar v-else :size="40" class="user-avatar">
        {{
          `${rootStore.user?.first_name?.charAt(
            0
          )}${rootStore.user?.last_name?.charAt(0)}`.trim()
        }}
      </el-avatar>
    </div>

    <template #dropdown>
      <el-dropdown-menu class="user-dropdown">
        <el-dropdown-item @click="router.push(localePath('/account'))">
          <el-icon><User /></el-icon>
          <span>{{ t('userMenu.profile') }}</span>
        </el-dropdown-item>
        <el-dropdown-item @click="router.push(localePath('/account/listings'))">
          <el-icon><Document /></el-icon>
          <span>{{ t('userMenu.myListings') }}</span>
        </el-dropdown-item>
        <el-dropdown-item @click="router.push(localePath('/account/favorites'))">
          <el-icon><Star /></el-icon>
          <span>{{ t('userMenu.favorites') }}</span>
        </el-dropdown-item>
        <el-dropdown-item @click="router.push(localePath('/account/conversations'))">
          <el-icon><MessageBox /></el-icon>
          <span>{{ t('userMenu.conversations') }}</span>
        </el-dropdown-item>
        <el-dropdown-item divided @click="rootStore.logout()">
          <el-icon><SwitchButton /></el-icon>
          <span>{{ t('userMenu.logout') }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
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
</style>
