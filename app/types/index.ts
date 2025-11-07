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
