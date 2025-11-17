import type { IRegion, ICity } from "./place";
import type { IImage } from "./index";
export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  language_code: string | null;
  avatar: IImage | null;
  role: string;
  phone_number: string | null;
  telegram: string | null;
  last_entered_at: string;
  created_at: string;
  show_contacts: boolean;
  region_id: number | null;
  city_id: number | null;
  region?: IRegion;
  city?: ICity;
}

export interface IUpdateProfilePayload {
  first_name: string;
  last_name: string;
  phone_number: string | undefined;
  telegram: string | undefined;
  show_contacts: boolean;
  language_code: string;
  region_id: number | undefined;
  city_id: number | undefined;
}
