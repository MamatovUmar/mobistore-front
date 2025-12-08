import type { IRegion, ICity } from "./place";

export type StaffRole = "admin" | "moderator";
export type UserRole = "user" | "moderator" | "admin";

export interface IStaffMember {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  telegram: string | null;
  avatar: string | null;
  role: StaffRole;
  is_ban: boolean;
  is_verified: boolean;
  last_entered_at: string | null;
  created_at: string;
  updated_at: string;
  region_id: number | null;
  city_id: number | null;
  region: IRegion | null;
  city: ICity | null;
}

export interface IStaffFilters {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface IStaffUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  telegram?: string;
}

export interface IChangeRolePayload {
  role: UserRole;
}
