import type { IRegion, ICity } from "./place";

export interface IAdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  telegram: string | null;
  avatar: string | null;
  role: string;
  is_ban: boolean;
  is_verified: boolean;
  last_entered_at: string | null;
  created_at: string;
  updated_at: string;
  region_id: number | null;
  city_id: number | null;
  region: IRegion | null;
  city: ICity | null;
  ads_count?: number;
}

export interface IAdminUserFilters {
  search: string;
  is_ban: boolean | null;
  is_verified: boolean | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface IAdminUserUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  telegram?: string;
  is_verified?: boolean;
}

export interface IGeneratePasswordResponse {
  success: boolean;
  message: string;
}

export interface IBanUserResponse {
  success: boolean;
  message: string;
  data: {
    archivedAds: number;
  };
}
