import type { IListing } from "./ads";
import type { IUser } from "./user";

export interface IConversation {
  id: number;
  ad_id: number;
  buyer_id: number;
  seller_id: number;
  last_message: string | null;
  last_message_at: string;
  unread_for_buyer: number;
  unread_for_seller: number;
  created_at: string;
  updated_at: string;
  ad?: IListing;
  buyer?: IUser;
  seller?: IUser;
}

export interface IConversationMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
}
