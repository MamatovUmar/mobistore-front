export interface IRate {
  id: number;
  cbu_id: number;
  code: string;
  ccy: string;
  name_ru: string;
  name_uz: string;
  name_uzc: string;
  name_en: string;
  nominal: string;
  rate: number;
  diff: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ICurrency {
  ccy: string;
  name_ru: string;
  name_en: string;
  name_uz: string;
}

export interface ISyncResult {
  message: string;
  fetched: number;
  saved: number;
}
