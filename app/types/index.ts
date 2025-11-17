export type ICurrency = "UZS" | "USD";

export interface IBaseResponse<T> {
  message?: string;
  status: boolean;
  data?: T;
  details?: any;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface IImage {
  id: number;
  url: string;
  entity_type: string;
  entity_id: number;
  folder: string;
  file_name: string;
  file_size: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}