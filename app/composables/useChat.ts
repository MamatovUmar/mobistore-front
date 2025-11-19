import type { IBaseResponse } from "~/types";
import type { IConversation, IConversationMessage } from "~/types/chat";

export const useChat = () => {
  const { $api } = useNuxtApp();

  const conversationLoading = ref(false);
  const messagesLoading = ref(false);

  const createOrGetConversation = async (adId: number, sellerId: number) => {
    try {
      conversationLoading.value = true;
      const res = await $api<IBaseResponse<IConversation>>(`/conversations`, {
        method: "POST",
        body: {
          ad_id: adId,
          seller_id: sellerId
        },
      });
      conversationLoading.value = false;
      return res.data;
    } catch (error) {
      conversationLoading.value = false;
      console.error("Error creating/getting conversation:", error);
      throw error;
    }
  };

  const getConversationMessages = async (conversationId: number) => {
    try {
      messagesLoading.value = true;
      const res = await $api<IBaseResponse<IConversationMessage[]>>(`/conversations/${conversationId}/messages`);
      messagesLoading.value = false;
      return res.data;
    } catch (error) {
      messagesLoading.value = false;
      console.error("Error getting messages:", error);
      throw error;
    }
  };

  const setMessagesAsRead = async (conversationId: number) => {
    try {
      await $api(`/conversations/${conversationId}/read`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  };

  const sendConversationMessage = async (conversationId: number, message: string) => {
    try {
      const res = await $api<IBaseResponse<IConversationMessage>>(`/conversations/${conversationId}/messages`, {
        method: "POST",
        body: {
          content: message
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const getAllConversations = async () => {
    try {
      const res = await $api<IBaseResponse<IConversation[]>>(`/conversations`);
      return res.data;
    } catch (error) {
      console.error("Error getting conversations:", error);
      throw error;
    }
  }

  return {
    createOrGetConversation,
    getConversationMessages,
    conversationLoading,
    messagesLoading,
    setMessagesAsRead,
    sendConversationMessage,
    getAllConversations,
  };
};
