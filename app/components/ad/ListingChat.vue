<script setup lang="ts">
import { Right, Position, Check } from "@element-plus/icons-vue";
import type { IListing } from "~/types/ads";
import type { IConversationMessage } from "~/types/chat";
import { useChat } from "~/composables/useChat";
import { useRootStore } from "~/store/root";

const props = defineProps<{
  visible: boolean;
  listing: IListing;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const { sendConversationMessage, setMessagesAsRead, createOrGetConversation, getConversationMessages } = useChat();
const root = useRootStore();

const messageInput = ref("");
const isInputFocused = ref(false);
const textareaRef = ref<HTMLTextAreaElement>();
const conversationId = ref<number | null>(null);
const messages = ref<IConversationMessage[]>([]);
const isLoadingMessages = ref(false);

const messagesContainer = ref<HTMLElement>();

const seller = computed(() => props.listing.user);

const sellerActivityStatus = computed(() => {
  if (!seller.value?.last_entered_at) return "Не в сети";

  const lastActivity = new Date(seller.value.last_entered_at);
  const now = new Date();
  const diffMs = now.getTime() - lastActivity.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return "В сети";
  if (diffMins < 60) return `Был(а) ${diffMins}м назад`;
  if (diffHours < 24) return `Был(а) ${diffHours}ч назад`;
  if (diffDays === 1) return "Был(а) вчера";
  if (diffDays < 7) return `Был(а) ${diffDays}д назад`;

  return `Был(а) ${lastActivity.toLocaleDateString("ru-RU")}`;
});

const formattedMessages = computed(() => {
  return messages.value.map((msg) => ({
    ...msg,
    time: formatTime(new Date(msg.created_at)),
    sender: msg.sender_id === root.user?.id ? "user" : "seller",
  }));
});

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Только что";
  if (mins < 60) return `${mins}м назад`;
  if (hours < 24) return `${hours}ч назад`;
  if (days === 1) return "Вчера";
  if (days < 7) return `${days}д назад`;

  return date.toLocaleDateString("ru-RU");
};

const autoResize = () => {
  if (!textareaRef.value) return;

  textareaRef.value.style.height = "auto";
  const newHeight = Math.min(textareaRef.value.scrollHeight, 120);
  textareaRef.value.style.height = `${newHeight}px`;
};

const sendMessage = async () => {
  if (!messageInput.value.trim() || !conversationId.value) return;

  const messageText = messageInput.value;
  messageInput.value = "";

  try {
    const newMessage = await sendConversationMessage(conversationId.value, messageText);
    if (newMessage) {
      messages.value.push(newMessage);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    messageInput.value = messageText;
  }

  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = "auto";
    }
    scrollToBottom();
  });
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const handleClose = () => {
  emit("update:visible", false);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const loadConversation = async () => {
  try {
    const conversation = await createOrGetConversation(props.listing.id, props.listing.user.id);
    if (conversation) {
      conversationId.value = conversation.id;
    }
  } catch (error) {
    console.error("Error creating/getting conversation:", error);
  }
};

const loadMessages = async () => {
  if (!conversationId.value) return;
  
  isLoadingMessages.value = true;
  try {
    const msgs = await getConversationMessages(conversationId.value);
    if (msgs) {
      messages.value = msgs;
    }
    await setMessagesAsRead(conversationId.value);
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error("Error loading messages:", error);
  } finally {
    isLoadingMessages.value = false;
  }
};

watch(
  () => props.visible,
  async (newVal) => {
    if (newVal) {
      if (!conversationId.value) {
        await loadConversation();
      }
      await loadMessages();
    }
  }
);


</script>

<template>
  <el-drawer
    class="chat-drawer"
    :model-value="visible"
    direction="rtl"
    size="500px"
    :show-close="true"
    @update:model-value="handleClose"
  >
    <template #header>
      <div class="drawer-header">
        <div class="seller-info">
          <div class="seller-avatar-wrapper">
            <el-avatar
              v-if="seller?.avatar"
              :src="seller.avatar.url"
              :size="48"
            />
            <el-avatar v-else :size="48" class="seller-avatar">
              {{
                `${seller.first_name?.charAt(0)}${seller.last_name?.charAt(
                  0
                )}`.trim()
              }}
            </el-avatar>
          </div>
          <div class="seller-details">
            <h3 class="seller-name">
              {{ seller.first_name }} {{ seller.last_name }}
            </h3>
            <div class="seller-status">
              <span>{{ sellerActivityStatus }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="chat-content">
      <div ref="messagesContainer" class="messages-container">
        <!-- Скелетон лоадер -->
        <template v-if="isLoadingMessages">
          <div v-for="i in 3" :key="`skeleton-${i}`" class="message-wrapper" :class="{ 'message-wrapper--user': i % 2 === 0 }">
            <div class="message-bubble skeleton-bubble">
              <el-skeleton :rows="1" animated style="width: 100%" />
            </div>
          </div>
        </template>

        <!-- Сообщения -->
        <template v-else>
          <div
            v-for="message in formattedMessages"
            :key="message.id"
            class="message-wrapper"
            :class="{ 'message-wrapper--user': message.sender === 'user' }"
          >
            <div class="message-bubble">
              <p class="message-text">{{ message.content }}</p>
              <span class="message-time">{{ message.time }}</span>
            </div>
            <span v-if="message.sender === 'user'" class="message-status" :class="{ 'status-read': message.is_read }">
              <el-icon>
                <Check />
              </el-icon>
            </span>
          </div>
        </template>
      </div>

      <div class="message-input-area">
        <div class="input-wrapper" :class="{ 'input-wrapper--focused': isInputFocused }">
          <textarea
            ref="textareaRef"
            v-model="messageInput"
            class="message-input"
            placeholder="Напишите сообщение..."
            rows="1"
            @input="autoResize"
            @keydown="handleKeydown"
            @focus="isInputFocused = true"
            @blur="isInputFocused = false"
          />
          <button
            :class="{ 'send-btn--active': messageInput.trim() }"
            :disabled="!messageInput.trim()"
            class="send-btn"
            @click="sendMessage"
          >
            <el-icon>
              <Position />
            </el-icon>
          </button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
:deep(.el-drawer) {
  .el-drawer__header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--color-border-light);
    margin-bottom: 0;
  }

  .el-drawer__body {
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}

.drawer-header {
  width: 100%;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-avatar-wrapper {
  flex-shrink: 0;
}

.seller-avatar {
  background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
  font-weight: 600;
  font-size: 20px;
  color: white;
}

.seller-details {
  flex: 1;
  min-width: 0;
}

.seller-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.seller-status {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;

  .status-icon {
    font-size: 12px;
  }
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-light);
    border-radius: 3px;

    &:hover {
      background: var(--color-border);
    }
  }
}

.message-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 6px;
  animation: slideIn 0.3s ease-out;

  &--user {
    justify-content: flex-end;

    .message-status {
      order: -1;
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--color-bg-secondary);
  word-wrap: break-word;
  word-break: break-word;

  .message-wrapper--user & {
    background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
    color: white;
  }
}

.message-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.message-time {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.7;
}

.message-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0.5;
  transition: opacity 0.2s;
  flex-shrink: 0;

  &.status-read {
    opacity: 1;
    color: var(--color-primary);
  }
}

.skeleton-bubble {
  min-width: 120px;
  max-width: 200px;
}

.message-input-area {
  padding: 20px 0 24px;
  border-top: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: #ffffff;
  border-radius: 16px;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.message-input {
  flex: 1;
  padding: 8px 6px;
  border: none;
  background: transparent;
  font-size: 16px;
  font-family: inherit;
  line-height: 1.6;
  resize: none;
  max-height: 120px;
  min-height: 24px;
  height: auto;
  color: var(--color-text-primary);
  outline: none;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-light);
    border-radius: 3px;

    &:hover {
      background: var(--color-border);
    }
  }

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
    font-size: 15px;
  }
}

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .el-icon {
    position: relative;
    z-index: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &--active {
    background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
    color: white;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(59, 130, 246, 0.2);

    &::before {
      opacity: 1;
    }

    &:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.08);
      box-shadow: 0 12px 28px rgba(59, 130, 246, 0.5), 0 4px 8px rgba(59, 130, 246, 0.3);

      &::after {
        opacity: 1;
      }

      .el-icon {
        transform: rotate(-45deg) scale(1.15);
      }
    }

    &:active:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35), 0 2px 4px rgba(59, 130, 246, 0.2);
    }
  }

  &:disabled {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  :deep(.el-drawer) {
    width: 100% !important;
  }

  .message-bubble {
    max-width: 90%;
  }

  .seller-name {
    font-size: 15px;
  }
}
</style>
