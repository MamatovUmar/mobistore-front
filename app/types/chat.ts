export interface IConversation {
  id: number;
  ad_id: number;
  buyer_id: number;
  seller_id: number;
  last_message: string;
  last_message_at: string;
  unread_for_buyer: number;
  unread_for_seller: number;
  created_at: string;
  updated_at: string;
}

export interface IConversationMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}
