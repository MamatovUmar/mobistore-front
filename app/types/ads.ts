import type { ICurrency } from "./index";

export type IState = "new" | "restored" | "used";

export interface IListingForm {
  title: string;
  description: string;
  region_id: number | undefined;
  city_id: number | undefined;
  brand_id: number | undefined;
  model_id: number | undefined;
  price: number | undefined;
  currency: ICurrency;
  state: IState;
  allow_trade_in: boolean;
  color: string;
  storage: number;
  ram: number;
  phone_number: string;
  telegram_link: string;
  show_phone: boolean;
  status: ListingStatus;
}

export enum ListingStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  SOLD = "sold",
  ARCHIVED = "archived",
  MODERATION = "moderation",
  REJECTED = "rejected",
}

export interface IListing {
  title: string;
  description: string;
  region_id: number;
  city_id: number;
  brand_id: number;
  model_id: number;
  price: number;
  currency: ICurrency;
  state: IState;
  status: ListingStatus;
  user_id: number;
  allow_trade_in: boolean;
  color: string;
  storage: number;
  ram: number;
  phone_number: string;
  show_phone: boolean;
  telegram_link: string | null;
  sold_at: string | null;
  published_at: string | null;
  id: number;
  views_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
}
