<script setup lang="ts">
import {
  Check,
  Position,
  Search,
  ChatLineSquare,
  Close,
} from "@element-plus/icons-vue";
import { useChat } from "~/composables/useChat";
import type { IConversation, IConversationMessage } from "~/types/chat";
import type { IUser } from "~/types/user";
import { useRootStore } from "~/store/root";

const {
  getAllConversations,
  getConversationMessages,
  sendConversationMessage,
  setMessagesAsRead,
} = useChat();
const root = useRootStore();

const conversations = ref<IConversation[]>([]);
const conversationsLoading = ref(false);
const selectedConversationId = ref<number | null>(null);
const messages = ref<IConversationMessage[]>([]);
const isMessagesLoading = ref(false);
const isSending = ref(false);

const searchTerm = ref("");
const messageInput = ref("");
const textareaRef = ref<HTMLTextAreaElement>();
const messagesContainer = ref<HTMLDivElement>();
const isInputFocused = ref(false);
const isMobilePanelOpen = ref(false);

const toggleMobilePanel = () => {
  isMobilePanelOpen.value = !isMobilePanelOpen.value;
};

const currentUserId = computed(() => root.user?.id ?? null);

const selectedConversation = computed(() => {
  if (!selectedConversationId.value) return null;
  return (
    conversations.value.find(
      (conversation) => conversation.id === selectedConversationId.value
    ) ?? null
  );
});

const counterpart = computed(() =>
  selectedConversation.value ? getCounterpart(selectedConversation.value) : null
);
const selectedAd = computed(() => selectedConversation.value?.ad ?? null);

const filteredConversations = computed(() => {
  const query = searchTerm.value.trim().toLowerCase();
  const sorted = [...conversations.value].sort((a, b) => {
    const dateA = a.last_message_at || a.updated_at;
    const dateB = b.last_message_at || b.updated_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  if (!query) return sorted;

  return sorted.filter((conversation) => {
    const companion = getCounterpart(conversation);
    const name = `${companion?.first_name ?? ""} ${companion?.last_name ?? ""}`
      .trim()
      .toLowerCase();
    const adTitle = conversation.ad?.title?.toLowerCase() ?? "";
    return name.includes(query) || adTitle.includes(query);
  });
});

const formattedMessages = computed(() =>
  messages.value.map((message) => ({
    ...message,
    time: formatRelativeTime(message.created_at),
    isOwn: message.sender_id === currentUserId.value,
  }))
);

const counterpartStatus = computed(() =>
  getActivityStatus(counterpart.value?.last_entered_at)
);

onMounted(() => {
  loadConversations();
});

watch(selectedConversationId, async (conversationId, previousValue) => {
  if (!conversationId) {
    messages.value = [];
    return;
  }

  if (conversationId === previousValue) return;

  await loadMessages(conversationId);
});

const loadConversations = async () => {
  conversationsLoading.value = true;
  try {
    const data = await getAllConversations();
    conversations.value = data ?? [];

    if (!conversations.value.length) {
      selectedConversationId.value = null;
      return;
    }

    if (!selectedConversationId.value) {
      selectedConversationId.value = conversations.value[0]?.id ?? null;
      return;
    }

    const exists = conversations.value.some(
      (conversation) => conversation.id === selectedConversationId.value
    );
    if (!exists) {
      selectedConversationId.value = conversations.value[0]?.id ?? null;
    }
  } catch {
    ElMessage.error("Не удалось загрузить переписки");
  } finally {
    conversationsLoading.value = false;
  }
};

const loadMessages = async (conversationId: number) => {
  isMessagesLoading.value = true;
  try {
    const data = await getConversationMessages(conversationId);
    messages.value = data ?? [];
    await setMessagesAsRead(conversationId);
    resetUnreadState(conversationId);

    nextTick(() => {
      scrollToBottom();
    });
  } catch {
    ElMessage.error("Не удалось загрузить сообщения");
  } finally {
    isMessagesLoading.value = false;
  }
};

const handleSelectConversation = (conversation: IConversation) => {
  if (selectedConversationId.value === conversation.id) {
    isMobilePanelOpen.value = false;
    return;
  }
  selectedConversationId.value = conversation.id;
  isMobilePanelOpen.value = false;
};

const handleSendMessage = async () => {
  if (
    !selectedConversationId.value ||
    !messageInput.value.trim() ||
    isSending.value
  )
    return;

  const text = messageInput.value.trim();
  messageInput.value = "";
  autoResize();

  isSending.value = true;
  try {
    const newMessage = await sendConversationMessage(
      selectedConversationId.value,
      text
    );
    if (!newMessage) return;

    messages.value.push(newMessage);
    applyMessageMeta(selectedConversationId.value, newMessage);

    nextTick(() => {
      scrollToBottom();
    });
  } catch {
    messageInput.value = text;
    autoResize();
    ElMessage.error("Не удалось отправить сообщение");
  } finally {
    isSending.value = false;
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
};

const scrollToBottom = () => {
  if (!messagesContainer.value) return;
  requestAnimationFrame(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const autoResize = () => {
  if (!textareaRef.value) return;
  textareaRef.value.style.height = "auto";
  const newHeight = Math.min(textareaRef.value.scrollHeight, 160);
  textareaRef.value.style.height = `${newHeight}px`;
};

const getCounterpart = (conversation: IConversation): IUser | null => {
  const userId = currentUserId.value;
  if (!userId) {
    return conversation.seller ?? conversation.buyer ?? null;
  }
  return conversation.buyer_id === userId
    ? conversation.seller ?? null
    : conversation.buyer ?? null;
};

const resetUnreadState = (conversationId: number) => {
  const index = conversations.value.findIndex(
    (conversation) => conversation.id === conversationId
  );
  const conversation = conversations.value[index];
  if (index === -1 || !conversation || !currentUserId.value) return;

  const updated: IConversation = { ...conversation };
  if (updated.buyer_id === currentUserId.value) {
    updated.unread_for_buyer = 0;
  } else {
    updated.unread_for_seller = 0;
  }

  conversations.value[index] = updated;
};

const applyMessageMeta = (
  conversationId: number,
  message: IConversationMessage
) => {
  const index = conversations.value.findIndex(
    (conversation) => conversation.id === conversationId
  );
  const conversation = conversations.value[index];
  if (index === -1 || !conversation) return;

  const updated: IConversation = {
    ...conversation,
    last_message: message.content,
    last_message_at: message.created_at,
  };

  if (currentUserId.value) {
    if (updated.buyer_id === currentUserId.value) {
      updated.unread_for_buyer = 0;
    } else {
      updated.unread_for_seller = 0;
    }
  }

  conversations.value.splice(index, 1);
  conversations.value.unshift(updated);
};

const getUnreadCount = (conversation: IConversation) => {
  if (!currentUserId.value) return 0;
  return conversation.buyer_id === currentUserId.value
    ? conversation.unread_for_buyer
    : conversation.unread_for_seller;
};

const getActivityStatus = (lastActive?: string | null) => {
  if (!lastActive) return "Статус неизвестен";

  const lastActivity = new Date(lastActive);
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
};

const formatRelativeTime = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
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

const formatName = (user?: IUser | null) => {
  if (!user) return "Неизвестный пользователь";
  return (
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Пользователь"
  );
};

const getInitials = (user?: IUser | null) => {
  if (!user) return "??";
  const first = user.first_name?.charAt(0) ?? "";
  const last = user.last_name?.charAt(0) ?? "";
  return (
    `${first}${last}`.trim() || user.email?.charAt(0)?.toUpperCase() || "П"
  );
};

const formatPrice = (price?: number, currency?: string) => {
  if (!price) return "";
  const formatted = new Intl.NumberFormat("ru-RU").format(price);
  return `${formatted} ${currency ?? ""}`.trim();
};
</script>

<template>
  <section class="account-chat">
    <div class="chat-card">
      <div class="chat-grid">
        <aside
          class="conversation-panel"
          :class="{ 'is-open': isMobilePanelOpen }"
        >
          <!-- Mobile overlay -->
          <div class="mobile-overlay" @click="isMobilePanelOpen = false" />

          <div class="panel-header">
            <div>
              <p class="panel-title">Переписки</p>
              <p class="panel-subtitle">Здесь собраны все ваши диалоги</p>
            </div>
            <button class="panel-close-btn" @click="isMobilePanelOpen = false">
              <el-icon><Close /></el-icon>
            </button>
          </div>

          <div class="panel-search">
            <div class="search-field">
              <el-icon>
                <Search />
              </el-icon>
              <input
                v-model="searchTerm"
                type="text"
                class="search-input"
                placeholder="Поиск по объявлению или имени"
              />
            </div>
          </div>

          <div class="conversation-body">
            <div v-if="conversationsLoading" class="conversation-skeleton">
              <div v-for="i in 4" :key="`skeleton-${i}`" class="skeleton-item">
                <el-skeleton :rows="2" animated :loading="true" />
              </div>
            </div>

            <div
              v-else-if="!filteredConversations.length"
              class="conversation-empty"
            >
              <p class="empty-title">Нет переписок</p>
              <p class="empty-text">
                Начните общение на странице объявления — переписка появится
                здесь автоматически
              </p>
            </div>

            <ul v-else class="conversation-list">
              <li
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                class="conversation-item"
                :class="{
                  'conversation-item--active':
                    selectedConversationId === conversation.id,
                }"
                @click="handleSelectConversation(conversation)"
              >
                <div class="conversation-avatar">
                  <el-avatar
                    v-if="getCounterpart(conversation)?.avatar"
                    :size="48"
                    :src="getCounterpart(conversation)?.avatar ?? undefined"
                  />
                  <el-avatar
                    v-else
                    :size="48"
                    class="conversation-avatar--fallback"
                  >
                    {{ getInitials(getCounterpart(conversation)) }}
                  </el-avatar>
                </div>

                <div class="conversation-data">
                  <div class="conversation-top">
                    <p class="conversation-name">
                      {{ formatName(getCounterpart(conversation)) }}
                    </p>
                    <span class="conversation-time">
                      {{ formatRelativeTime(conversation.last_message_at) }}
                    </span>
                  </div>
                  <p v-if="conversation.ad" class="conversation-listing">
                    {{ conversation.ad.title }}
                  </p>
                  <p class="conversation-preview">
                    {{ conversation.last_message || "Сообщений пока нет" }}
                  </p>
                </div>

                <div class="conversation-meta">
                  <span
                    v-if="getUnreadCount(conversation)"
                    class="unread-badge"
                  >
                    {{ getUnreadCount(conversation) }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </aside>

        <div class="chat-panel">
          <div v-if="selectedConversation" class="chat-window">
            <div class="chat-header">
              <!-- Mobile toggle button -->
              <button class="mobile-menu-btn" @click="toggleMobilePanel">
                <el-icon><ChatLineSquare /></el-icon>
              </button>

              <div class="chat-user">
                <el-avatar
                  v-if="counterpart?.avatar"
                  :size="44"
                  :src="counterpart.avatar"
                />
                <el-avatar v-else :size="44" class="chat-user__fallback">
                  {{ getInitials(counterpart) }}
                </el-avatar>
                <div class="chat-user__info">
                  <p class="chat-user__name">{{ formatName(counterpart) }}</p>
                  <p class="chat-user__status">{{ counterpartStatus }}</p>
                </div>
              </div>

              <NuxtLink
                v-if="selectedAd"
                :to="`/${selectedAd.alias}`"
                class="chat-listing"
              >
                <div class="chat-listing__info">
                  <p class="chat-listing__title">{{ selectedAd.title }}</p>
                  <p class="chat-listing__price">
                    {{ formatPrice(selectedAd.price, selectedAd.currency) }}
                  </p>
                </div>
              </NuxtLink>
            </div>

            <div ref="messagesContainer" class="messages-container">
              <template v-if="isMessagesLoading">
                <div
                  v-for="i in 3"
                  :key="`message-skeleton-${i}`"
                  class="message-row"
                >
                  <div class="message-bubble message-bubble--skeleton">
                    <el-skeleton :rows="2" animated />
                  </div>
                </div>
              </template>

              <div v-else-if="!messages.length" class="messages-empty">
                <p class="empty-title">Пока нет сообщений</p>
                <p class="empty-text">
                  Напишите что-нибудь, чтобы начать диалог
                </p>
              </div>

              <template v-else>
                <div
                  v-for="message in formattedMessages"
                  :key="message.id"
                  class="message-row"
                  :class="{ 'message-row--own': message.isOwn }"
                >
                  <div class="message-bubble">
                    <p class="message-text">{{ message.content }}</p>
                    <span class="message-time">{{ message.time }}</span>
                  </div>
                  <span
                    v-if="message.isOwn"
                    class="message-status"
                    :class="{ 'status-read': message.is_read }"
                  >
                    <el-icon>
                      <Check />
                    </el-icon>
                  </span>
                </div>
              </template>
            </div>

            <div class="chat-input">
              <div
                class="input-wrapper"
                :class="{ 'input-wrapper--focused': isInputFocused }"
              >
                <textarea
                  ref="textareaRef"
                  v-model="messageInput"
                  class="message-input"
                  placeholder="Напишите сообщение..."
                  rows="1"
                  :disabled="!selectedConversationId"
                  @input="autoResize"
                  @focus="isInputFocused = true"
                  @blur="isInputFocused = false"
                  @keydown="handleKeydown"
                />
                <button
                  class="send-btn"
                  :class="{
                    'send-btn--active': messageInput.trim() && !isSending,
                  }"
                  :disabled="!messageInput.trim() || isSending"
                  @click="handleSendMessage"
                >
                  <el-icon>
                    <Position />
                  </el-icon>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="chat-placeholder">
            <p class="placeholder-title">Выберите переписку</p>
            <p class="placeholder-text">
              Слева отображаются все ваши диалоги. Нажмите на любой, чтобы
              посмотреть подробности и продолжить общение.
            </p>
            <button class="placeholder-btn" @click="toggleMobilePanel">
              <el-icon><ChatLineSquare /></el-icon>
              Открыть переписки
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.account-chat {
  width: 100%;
}

.chat-card {
  background: var(--color-bg-primary);
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  overflow: hidden;
}

.chat-grid {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  min-height: 600px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.conversation-panel {
  border-right: 1px solid var(--color-border-light);
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  position: relative;

  .mobile-overlay {
    display: none;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 85%;
    max-width: 340px;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: none;

    &.is-open {
      transform: translateX(0);
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);

      .mobile-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        animation: fadeIn 0.3s ease;
      }
    }
  }
}

.panel-header {
  padding: 24px;
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
}

.panel-close-btn {
  display: none;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--color-text-primary);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border-light);
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f8fafc;
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--color-text-primary);
}

.panel-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.panel-search {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border-light);
}

.search-field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.3);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.15);
  }

  .el-icon {
    color: var(--color-text-secondary);
  }
}

.search-input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 15px;
  background: transparent;
  color: var(--color-text-primary);
}

.conversation-body {
  flex: 1;
  overflow: hidden;
}

.conversation-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 100%;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);

  &:hover {
    background: rgba(59, 130, 246, 0.07);
  }

  &--active {
    background: rgba(59, 130, 246, 0.12);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 12px;
      bottom: 12px;
      width: 3px;
      background: var(--color-primary);
      border-radius: 0 4px 4px 0;
    }
  }
}

.conversation-avatar {
  flex-shrink: 0;

  &--fallback {
    background: linear-gradient(135deg, var(--color-primary), #60a5fa);
    font-weight: 600;
  }
}

.conversation-data {
  flex: 1;
  min-width: 0;
}

.conversation-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.conversation-name {
  margin: 0;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.conversation-listing {
  margin: 4px 0;
  font-size: 13px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-preview {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-meta {
  display: flex;
  align-items: center;
}

.unread-badge {
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.conversation-empty {
  padding: 40px 32px;
  text-align: center;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px;
  color: var(--color-text-primary);
}

.empty-text {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.chat-panel {
  min-height: 600px;
  max-height: 600px;
  background: white;
  display: flex;
  overflow: hidden;
}

.chat-window {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border-light);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.chat-user {
  display: flex;
  align-items: center;
  gap: 12px;

  &__fallback {
    background: linear-gradient(135deg, var(--color-primary), #60a5fa);
    font-weight: 600;
    font-size: 16px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1.2;
  }

  &__status {
    margin: 0;
    font-size: 13px;
    color: var(--color-text-secondary);
    line-height: 1.2;
  }
}

.chat-listing {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid rgba(148, 163, 184, 0.15);

  &:hover {
    background: #f1f5f9;
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }

  &__cover {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--color-primary);
    font-size: 16px;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__placeholder {
    text-transform: uppercase;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__price {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--color-text-secondary);
  }
}

.messages-container {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(148, 163, 184, 0.5);
    }
  }
}

.message-row {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  animation: fadeIn 0.3s ease;

  &--own {
    justify-content: flex-end;
  }
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  position: relative;
  word-wrap: break-word;
  word-break: break-word;

  .message-row--own & {
    background: linear-gradient(135deg, var(--color-primary) 0%, #60a5fa 100%);
    color: white;
  }

  &--skeleton {
    padding: 16px;
    background: white;
    min-width: 120px;
    max-width: 200px;

    .el-skeleton {
      width: 100%;
    }
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
  color: var(--color-text-secondary);
  opacity: 0.5;
  transition: opacity 0.2s, color 0.2s;
  flex-shrink: 0;

  &.status-read {
    opacity: 1;
    color: var(--color-primary);
  }
}

.chat-input {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--color-border-light);
  background: white;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: #f8fafc;
  border-radius: 16px;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--focused {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.12);
  }
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
  max-height: 160px;
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
    background: rgba(148, 163, 184, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(148, 163, 184, 0.5);
    }
  }

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
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
    background: linear-gradient(135deg, var(--color-primary) 0%, #60a5fa 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  .el-icon {
    position: relative;
    z-index: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &--active {
    background: linear-gradient(135deg, var(--color-primary) 0%, #60a5fa 100%);
    color: white;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4),
      0 2px 4px rgba(59, 130, 246, 0.2);

    &::before {
      opacity: 1;
    }

    &:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 10px 20px rgba(59, 130, 246, 0.5),
        0 4px 8px rgba(59, 130, 246, 0.3);

      &::after {
        opacity: 1;
      }

      .el-icon {
        transform: rotate(-45deg) scale(1.1);
      }
    }

    &:active:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35),
        0 2px 4px rgba(59, 130, 246, 0.2);
    }
  }

  &:disabled {
    opacity: 1;
  }
}

.chat-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
}

.placeholder-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 10px;
  color: var(--color-text-primary);
}

.placeholder-text {
  margin: 0;
  max-width: 360px;
  color: var(--color-text-secondary);
  font-size: 15px;
}

.placeholder-btn {
  display: none;
  margin-top: 20px;
  padding: 12px 24px;
  background: var(--el-color-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  gap: 8px;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--el-color-primary-dark-2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 768px) {
    display: inline-flex;
  }
}

.messages-empty {
  text-align: center;
  padding: 40px 20px;
}

.skeleton-item {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .chat-header {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
  }

  .chat-user {
    flex: 1;
    min-width: 0;
    gap: 10px;

    &__name {
      font-size: 15px;
    }

    &__status {
      font-size: 12px;
    }
  }

  .chat-listing {
    width: 100%;
    order: 3;
  }

  .message-bubble {
    max-width: 85%;
  }
}
</style>
