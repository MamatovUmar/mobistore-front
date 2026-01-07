export interface IBrand {
  id: number;
  name: string;
  is_popular: boolean;
  logo: string | null;
  alias: string;
  ads_count: number;
  devices_count: number;
}

export interface IBrandFilters {
  search?: string;
  sortBy: "name" | "id" | "is_popular";
  sortOrder: "asc" | "desc";
  is_popular?: boolean;
}

export interface IBrandCreatePayload {
  name: string;
  is_popular?: boolean;
  alias?: string;
}

export interface IBrandUpdatePayload {
  name?: string;
  is_popular?: boolean;
  alias?: string;
}
