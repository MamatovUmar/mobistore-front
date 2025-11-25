import type { IBrand } from "./brand";
import type { ICurrency, IPagination } from "./index";
import type { IModel } from "./model";
import type { ICity, IRegion } from "./place";
import type { IUser } from "./user";

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
  state: IState | undefined;
  allow_trade_in: boolean;
  color: string;
  storage: number | undefined;
  ram: number | undefined;
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
  alias: string;
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
  brand: IBrand;
  model: IModel;
  city: ICity;
  user: IUser;
  region: IRegion;
  images: IImage[];
}

export interface IImage {
  id: number;
  url: string;
  entity_type: EntityType;
  entity_id: number;
  folder: ImageFolder;
  file_name: string;
  file_size: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export enum ImageFolder {
  AD = "ad",
  USER = "user",
  BRAND = "brand",
  MODEL = "model",
  TEMP = "temp",
}

export enum EntityType {
  AD = "ad",
  USER = "user",
  BRAND = "brand",
  MODEL = "model",
  PLACE = "place",
}

export interface IAdsResponse {
  ads: IListing[];
  filters: {
    minPrice?: number;
    maxPrice?: number;
    brand?: IBrand;
    model?: IModel;
    region?: IRegion;
    city?: ICity;
  }
  pagination: IPagination;
}

export interface IResultFilterForm {
  page: number;
  limit: number;
  regionId: number | undefined;
  cityId: number | undefined;
  brandId: number | undefined;
  modelId: number | undefined;
  state: string | undefined;
  priceRange: number[];
  ram: number | undefined;
  storage: number | undefined;
  allowTradeIn: boolean;
  sortBy: "updated_at" | "favorites_count" | "views_count" | "price";
  sortOrder: "asc" | "desc";
}

export interface IListingContacts {
  phone_number: IListing['phone_number'];
  telegram_link: IListing['telegram_link'];
}