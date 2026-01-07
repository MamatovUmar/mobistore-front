<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ChatDotRound } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";
import { useChat } from "~/composables/useChat";
import type { IConversation } from "~/types/chat";

const rootStore = useRootStore();
const chatStore = useChat();

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
  <NuxtLink to="/account/conversations" class="action-link">
    <el-badge
      :value="unreadChatCount"
      :hidden="unreadChatCount === 0"
      class="action-badge"
    >
      <el-button circle class="action-btn">
        <el-icon><ChatDotRound /></el-icon>
      </el-button>
    </el-badge>
  </NuxtLink>
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
</style>
