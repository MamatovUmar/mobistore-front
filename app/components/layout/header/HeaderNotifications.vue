<script setup lang="ts">
import {
  Bell,
  InfoFilled,
  ShoppingCart,
  ChatDotRound,
} from "@element-plus/icons-vue";
import { useNotifications } from "~/composables/useNotifications";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("ru");

const {
  notifications,
  unreadCount: unreadNotificationsCount,
  markAsRead,
  markAllAsRead,
} = useNotifications();

const formatDate = (date: string) => {
  return dayjs(date).fromNow();
};
</script>

<template>
  <el-dropdown trigger="click" class="notifications-dropdown">
    <div class="action-trigger">
      <el-badge
        :value="unreadNotificationsCount"
        :hidden="unreadNotificationsCount === 0"
        is-dot
        class="action-badge"
      >
        <el-button circle class="action-btn">
          <el-icon><Bell /></el-icon>
        </el-button>
      </el-badge>
    </div>
    <template #dropdown>
      <div class="notifications-list">
        <div class="notifications-header">
          <span>Уведомления</span>
          <el-button
            v-if="unreadNotificationsCount > 0"
            link
            type="primary"
            size="small"
            @click="markAllAsRead"
          >
            Прочитать все
          </el-button>
        </div>
        <div v-if="notifications.length === 0" class="empty-notifications">
          Нет новых уведомлений
        </div>
        <el-scrollbar max-height="300px" v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'is-unread': !notification.isRead }"
            @click="markAsRead(notification.id)"
          >
            <div class="notification-icon">
              <el-icon v-if="notification.type === 'system'"
                ><InfoFilled
              /></el-icon>
              <el-icon v-else-if="notification.type === 'order'"
                ><ShoppingCart
              /></el-icon>
              <el-icon v-else><ChatDotRound /></el-icon>
            </div>
            <div class="notification-content">
              <div class="notification-title">
                {{ notification.title }}
              </div>
              <div class="notification-text">
                {{ notification.message }}
              </div>
              <div class="notification-time">
                {{ formatDate(notification.createdAt) }}
              </div>
            </div>
            <div class="notification-dot" v-if="!notification.isRead"></div>
          </div>
        </el-scrollbar>
      </div>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.action-btn {
  width: 40px;
  min-width: 40px;
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

.notifications-list {
  width: 320px;
  padding: 8px 0;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 8px;

  span {
    font-weight: 600;
    color: #0f172a;
  }
}

.empty-notifications {
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: #f8fafc;
  }

  &.is-unread {
    background: #eff6ff;

    &:hover {
      background: #e0e7ff;
    }
  }
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #64748b;
}

.is-unread .notification-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.notification-text {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-time {
  font-size: 11px;
  color: #94a3b8;
}

.notification-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
