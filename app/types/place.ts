
export interface IRegion {
  id: number;
  name_uz: string;
  name_ru: string;
  alias: string;
}

export interface ICity {
  id: number;
  name_uz: string;
  name_ru: string;
  longitude: string;
  latitude: string;
  region_id: number;
  alias: string;
}

export interface ICityResponse extends IRegion {
  cities: ICity[];
}